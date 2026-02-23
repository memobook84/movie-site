const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  videos?: {
    results: { key: string; site: string; type: string }[];
  };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
}

interface TMDbResponse {
  results: Movie[];
}

async function fetchTMDb<T>(endpoint: string, fallback: T): Promise<T> {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") return fallback;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=ja-JP`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
    return res.json();
  } catch (e) {
    console.error("TMDb fetch error:", e);
    return fallback;
  }
}

const emptyResponse: TMDbResponse = { results: [] };

export async function getTrending(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/trending/movie/week", emptyResponse);
  return data.results;
}

export async function getPopular(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/popular", emptyResponse);
  return data.results;
}

export async function getTopRated(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/top_rated", emptyResponse);
  return data.results;
}

export async function getUpcoming(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/upcoming", emptyResponse);
  return data.results;
}

export async function getMoviesByGenre(genreId: number, pages = 1, language?: string): Promise<Movie[]> {
  const langParam = language ? `&with_original_language=${language}` : "";
  const requests = Array.from({ length: pages }, (_, i) =>
    fetchTMDb<TMDbResponse>(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc${langParam}&page=${i + 1}`, emptyResponse)
  );
  const results = await Promise.all(requests);
  return results.flatMap((d) => d.results);
}

const emptyDetail: MovieDetail = {
  id: 0, title: "", overview: "映画が見つかりません", poster_path: null,
  backdrop_path: null, vote_average: 0, vote_count: 0, genre_ids: [], runtime: 0,
  genres: [], tagline: "", status: "", budget: 0, revenue: 0,
  production_companies: [],
};

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const movie = await fetchTMDb<MovieDetail>(`/movie/${id}?append_to_response=videos,credits`, emptyDetail);
  // 日本語の説明がない場合、英語版をフォールバック取得
  if (movie.id !== 0 && !movie.overview) {
    const enMovie = await fetchTMDbEn<MovieDetail>(`/movie/${id}`, emptyDetail);
    if (enMovie.overview) movie.overview = enMovie.overview;
  }
  return movie;
}

async function fetchTMDbEn<T>(endpoint: string, fallback: T): Promise<T> {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") return fallback;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=en-US`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
    return res.json();
  } catch (e) {
    console.error("TMDb fetch error:", e);
    return fallback;
  }
}

export async function getTvDetail(id: number): Promise<MovieDetail> {
  const tv = await fetchTMDb<MovieDetail>(`/tv/${id}?append_to_response=videos,credits`, emptyDetail);
  // TVはtitleではなくnameを使うので統一
  if (!tv.title && tv.name) tv.title = tv.name;
  if (tv.id !== 0 && !tv.overview) {
    const enTv = await fetchTMDbEn<MovieDetail>(`/tv/${id}`, emptyDetail);
    if (enTv.overview) tv.overview = enTv.overview;
  }
  return tv;
}

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  combined_credits?: {
    cast: Movie[];
  };
}

const emptyPerson: PersonDetail = {
  id: 0, name: "", biography: "", profile_path: null,
  birthday: null, place_of_birth: null, known_for_department: "",
};

export async function getPersonDetail(id: number): Promise<PersonDetail> {
  const person = await fetchTMDb<PersonDetail>(
    `/person/${id}?append_to_response=combined_credits`, emptyPerson
  );
  if (person.id !== 0 && !person.biography) {
    const enPerson = await fetchTMDbEn<PersonDetail>(`/person/${id}`, emptyPerson);
    if (enPerson.biography) person.biography = enPerson.biography;
  }
  return person;
}

// ジャンルID
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;
