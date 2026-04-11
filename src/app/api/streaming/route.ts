import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") || "213";
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const page = searchParams.get("page") || "1";

  if (!API_KEY) return NextResponse.json({ results: [], total_pages: 0 });

  try {
    const res = await fetch(
      `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=ja-JP` +
        `&with_watch_providers=${provider}&watch_region=JP` +
        `&with_watch_monetization_types=flatrate&sort_by=popularity.desc&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ results: [], total_pages: 0 });
    const data = await res.json();
    return NextResponse.json({
      results: data.results || [],
      total_pages: Math.min(data.total_pages || 1, 20),
      page: data.page || 1,
    });
  } catch {
    return NextResponse.json({ results: [], total_pages: 0 });
  }
}
