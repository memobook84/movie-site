const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjUxMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+";

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
  original_language?: string;
  media_type?: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
  overview: string;
}

export interface CollectionInfo {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface CollectionDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage?: string;
  belongs_to_collection?: CollectionInfo | null;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  videos?: {
    results: { key: string; site: string; type: string }[];
  };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; profile_path: string | null }[];
  };
  seasons?: Season[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface TMDbResponse {
  results: Movie[];
}

async function fetchTMDb<T>(endpoint: string, fallback: T): Promise<T> {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") return fallback;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=ja-JP`, {
        next: { revalidate: 86400 },
      });
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
      return res.json();
    } catch (e) {
      console.error("TMDb fetch error:", e);
      if (attempt === 2) return fallback;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return fallback;
}

const emptyResponse: TMDbResponse = { results: [] };

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

interface PersonResponse {
  results: Person[];
}

const emptyPersonResponse: PersonResponse = { results: [] };

export async function getTrendingPeople(): Promise<Person[]> {
  const data = await fetchTMDb<PersonResponse>("/person/popular", emptyPersonResponse);
  return data.results;
}

export async function getTrending(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/trending/movie/week", emptyResponse);
  return data.results;
}

export async function getPopular(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/popular", emptyResponse);
  return data.results;
}

export async function getPopularJP(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/popular?region=JP", emptyResponse);
  return data.results;
}

export async function getTopRated(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/top_rated", emptyResponse);
  return data.results;
}

export async function getPopularByDecade(startYear: number, endYear: number): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>(
    `/discover/movie?sort_by=popularity.desc&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&vote_count.gte=100`,
    emptyResponse
  );
  return data.results;
}

export async function getUpcoming(): Promise<Movie[]> {
  const data = await fetchTMDb<TMDbResponse>("/movie/upcoming", emptyResponse);
  return data.results;
}

export async function getNowPlayingJP(pages = 3): Promise<Movie[]> {
  const requests = Array.from({ length: pages }, (_, i) =>
    fetchTMDb<TMDbResponse>(`/movie/now_playing?region=JP&page=${i + 1}`, emptyResponse)
  );
  const results = await Promise.all(requests);
  const seen = new Set<number>();
  return results.flatMap((r) => r.results).filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function getUpcomingJP(pages = 3): Promise<Movie[]> {
  const requests = Array.from({ length: pages }, (_, i) =>
    fetchTMDb<TMDbResponse>(`/movie/upcoming?region=JP&page=${i + 1}`, emptyResponse)
  );
  const results = await Promise.all(requests);
  const seen = new Set<number>();
  return results.flatMap((r) => r.results).filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function getMoviesByGenre(genreId: number, pages = 1, language?: string): Promise<Movie[]> {
  const langParam = language ? `&with_original_language=${language}` : "";
  const requests = Array.from({ length: pages }, (_, i) =>
    fetchTMDb<TMDbResponse>(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc${langParam}&page=${i + 1}`, emptyResponse)
  );
  const results = await Promise.all(requests);
  return results.flatMap((d) => d.results);
}

interface PaginatedResponse {
  results: Movie[];
  total_pages: number;
}

export async function getMoviesByGenrePage(genreId: number, page = 1): Promise<{ movies: Movie[]; totalPages: number }> {
  const data = await fetchTMDb<PaginatedResponse>(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
    { results: [], total_pages: 1 }
  );
  return { movies: data.results, totalPages: Math.min(data.total_pages, 500) };
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
      next: { revalidate: 86400 },
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
    crew: (Movie & { job?: string })[];
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

// 画像
export interface TMDbImage {
  file_path: string;
  width: number;
  height: number;
}

interface ImagesResponse {
  backdrops: TMDbImage[];
  posters: TMDbImage[];
  logos: TMDbImage[];
}

const emptyImages: ImagesResponse = { backdrops: [], posters: [], logos: [] };

export async function getMovieImages(id: number, mediaType: string = "movie"): Promise<TMDbImage[]> {
  const endpoint = mediaType === "tv" ? `/tv/${id}/images` : `/movie/${id}/images`;
  // include_image_language で日本語+英語+言語なし画像を取得
  const data = await fetchTMDb<ImagesResponse>(
    `${endpoint}?include_image_language=ja,en,null`,
    emptyImages
  );
  return [...data.backdrops, ...data.posters].slice(0, 16);
}

// 関連作品
export async function getRecommendations(id: number, mediaType: string = "movie"): Promise<Movie[]> {
  const endpoint = mediaType === "tv" ? `/tv/${id}/recommendations` : `/movie/${id}/recommendations`;
  const data = await fetchTMDb<TMDbResponse>(endpoint, emptyResponse);
  return data.results;
}

// 配信先情報
export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviders {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  link?: string;
}

export async function getWatchProviders(id: number, mediaType: string = "movie"): Promise<WatchProviders | null> {
  const endpoint = mediaType === "tv" ? `/tv/${id}/watch/providers` : `/movie/${id}/watch/providers`;
  const data = await fetchTMDb<{ results: Record<string, WatchProviders> }>(endpoint, { results: {} });
  return data.results?.JP || null;
}

// 上映国情報
interface ReleaseDateEntry {
  iso_3166_1: string;
  release_dates: { release_date: string; type: number; certification?: string }[];
}

interface ReleaseDatesResponse {
  results: ReleaseDateEntry[];
}

export async function getReleaseDates(id: number): Promise<string[]> {
  const data = await fetchTMDb<ReleaseDatesResponse>(
    `/movie/${id}/release_dates`,
    { results: [] }
  );
  return data.results.map((r) => r.iso_3166_1);
}

export async function getJPReleaseDate(id: number): Promise<string | null> {
  const data = await fetchTMDb<ReleaseDatesResponse>(
    `/movie/${id}/release_dates`,
    { results: [] }
  );
  const jp = data.results.find((r) => r.iso_3166_1 === "JP");
  if (!jp || jp.release_dates.length === 0) return null;
  // type 3 = Theatrical が優先、なければ最初のエントリ
  const theatrical = jp.release_dates.find((d) => d.type === 3);
  const date = theatrical || jp.release_dates[0];
  return date.release_date?.slice(0, 10) || null;
}

export async function getCertification(id: number): Promise<string | null> {
  const data = await fetchTMDb<ReleaseDatesResponse>(
    `/movie/${id}/release_dates`,
    { results: [] }
  );
  // 日本の年齢制限を優先、なければアメリカ
  const jp = data.results.find((r) => r.iso_3166_1 === "JP");
  const jpCert = jp?.release_dates.find((d) => d.certification)?.certification;
  if (jpCert) return jpCert;
  const us = data.results.find((r) => r.iso_3166_1 === "US");
  const usCert = us?.release_dates.find((d) => d.certification)?.certification;
  return usCert || null;
}

// 外部ID（SNS）
export interface ExternalIds {
  instagram_id: string | null;
  twitter_id: string | null;
  facebook_id: string | null;
  tiktok_id?: string | null;
}

const emptyExternalIds: ExternalIds = {
  instagram_id: null, twitter_id: null, facebook_id: null, tiktok_id: null,
};

export async function getExternalIds(id: number, mediaType: string = "movie"): Promise<ExternalIds> {
  const endpointMap: Record<string, string> = {
    tv: `/tv/${id}/external_ids`,
    person: `/person/${id}/external_ids`,
  };
  const endpoint = endpointMap[mediaType] || `/movie/${id}/external_ids`;
  return fetchTMDb<ExternalIds>(endpoint, emptyExternalIds);
}

// コレクション詳細
const emptyCollection: CollectionDetail = {
  id: 0, name: "", overview: "", poster_path: null, backdrop_path: null, parts: [],
};

export async function getCollectionDetail(id: number): Promise<CollectionDetail> {
  const collection = await fetchTMDb<CollectionDetail>(`/collection/${id}`, emptyCollection);
  // 日本語の概要がない場合、英語版をフォールバック
  if (collection.id !== 0 && !collection.overview) {
    const enCollection = await fetchTMDbEn<CollectionDetail>(`/collection/${id}`, emptyCollection);
    if (enCollection.overview) collection.overview = enCollection.overview;
  }
  // 公開日順にソート
  collection.parts.sort((a, b) => {
    const dateA = a.release_date || a.first_air_date || "";
    const dateB = b.release_date || b.first_air_date || "";
    return dateA.localeCompare(dateB);
  });
  return collection;
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
