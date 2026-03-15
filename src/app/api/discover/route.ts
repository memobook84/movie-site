import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface DiscoverMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  genre_ids: number[];
}

interface MovieDetailResult {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  revenue: number;
  genres: { id: number; name: string }[];
}

async function fetchTMDb<T>(endpoint: string): Promise<T | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=ja-JP`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") || "";
  const minRevenue = Number(searchParams.get("minRevenue")) || 0;

  // 3ページ分取得（60件）
  const genreFilter = genre ? `&with_genres=${genre}` : "";
  const pagePromises = [1, 2, 3].map((page) =>
    fetchTMDb<{ results: DiscoverMovie[] }>(
      `/discover/movie?sort_by=revenue.desc${genreFilter}&page=${page}`
    )
  );
  const pages = await Promise.all(pagePromises);
  const allMovies = pages.flatMap((p) => p?.results || []);

  // 上位30件の詳細を並列取得
  const top30 = allMovies.slice(0, 30);
  const detailPromises = top30.map((m) =>
    fetchTMDb<MovieDetailResult>(`/movie/${m.id}`)
  );
  const details = await Promise.all(detailPromises);

  // フィルタリング（minRevenue以上）
  const filtered = details.filter(
    (d): d is MovieDetailResult => d !== null && d.revenue >= minRevenue
  );

  // シャッフルして返却
  const results = shuffle(filtered).map((d) => ({
    id: d.id,
    title: d.title,
    poster_path: d.poster_path,
    backdrop_path: d.backdrop_path,
    revenue: d.revenue,
    genres: d.genres,
    overview: d.overview,
    vote_average: d.vote_average,
    release_date: d.release_date,
  }));

  return NextResponse.json({ results });
}
