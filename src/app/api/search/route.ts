import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ results: [] });

  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ja-JP&query=${encodeURIComponent(query)}`,
  );
  const data = await res.json();

  // 映画とTV（アニメ含む）のみ返す、人物などは除外
  const filtered = (data.results || []).filter(
    (item: { media_type: string }) => item.media_type === "movie" || item.media_type === "tv"
  );

  return NextResponse.json({ results: filtered });
}
