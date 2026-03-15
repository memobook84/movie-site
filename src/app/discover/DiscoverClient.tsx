"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/lib/tmdb";

interface DiscoverMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  revenue: number;
  genres: { id: number; name: string }[];
  overview: string;
  vote_average: number;
  release_date?: string;
}

const GENRE_LIST = [
  { id: 0, name: "全て" },
  { id: 28, name: "アクション" },
  { id: 12, name: "アドベンチャー" },
  { id: 16, name: "アニメーション" },
  { id: 35, name: "コメディ" },
  { id: 80, name: "犯罪" },
  { id: 99, name: "ドキュメンタリー" },
  { id: 18, name: "ドラマ" },
  { id: 10751, name: "ファミリー" },
  { id: 14, name: "ファンタジー" },
  { id: 36, name: "歴史" },
  { id: 27, name: "ホラー" },
  { id: 10402, name: "音楽" },
  { id: 9648, name: "ミステリー" },
  { id: 10749, name: "ロマンス" },
  { id: 878, name: "SF" },
  { id: 53, name: "スリラー" },
  { id: 10752, name: "戦争" },
  { id: 37, name: "西部劇" },
];

const USD_TO_JPY = 150;

function formatRevenue(usd: number): string {
  const oku = Math.round((usd * USD_TO_JPY) / 1_0000_0000);
  return `${oku.toLocaleString()}億円`;
}

export default function DiscoverClient() {
  const [minRevenue, setMinRevenue] = useState(5); // 100億円単位のインデックス (5 = 500億円)
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [movies, setMovies] = useState<DiscoverMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const genreScrollRef = useRef<HTMLDivElement>(null);

  // スワイプ用
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);

  const revenueInOku = minRevenue * 100; // 億円表示
  const revenueInUSD = (revenueInOku * 1_0000_0000) / USD_TO_JPY; // USD換算

  const fetchMovies = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setCurrentIndex(0);
      try {
        const params = new URLSearchParams();
        if (selectedGenre > 0) params.set("genre", String(selectedGenre));
        params.set("minRevenue", String(Math.round(revenueInUSD)));
        const res = await fetch(`/api/discover?${params}`);
        const data = await res.json();
        setMovies(data.results || []);
      } catch {
        setMovies([]);
      }
      setLoading(false);
    }, 500);
  }, [selectedGenre, revenueInUSD]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // カード切り替え
  const goNext = () => {
    if (currentIndex < movies.length - 1) setCurrentIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // スワイプハンドラ
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
      cardRef.current.style.transform = `translateX(${touchDeltaX.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    isSwiping.current = false;
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.3s ease";
      cardRef.current.style.transform = "translateX(0)";
    }
    const threshold = 80;
    if (touchDeltaX.current < -threshold) goNext();
    else if (touchDeltaX.current > threshold) goPrev();
  };

  const movie = movies[currentIndex];

  return (
    <main className="min-h-screen pb-28 pt-24 px-4 md:px-16">
      {/* タイトル */}
      <h1 className="font-[family-name:var(--font-noto-sans-jp)] text-xl font-bold tracking-wide text-gray-900 md:text-2xl">
        ディスカバー
      </h1>
      <p className="mt-1 text-xs text-gray-400">興行収入とジャンルで映画を探す</p>

      {/* 興行収入スライダー */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-gray-500">
          興行収入
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={minRevenue}
            onChange={(e) => setMinRevenue(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-gray-700 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-700"
          />
          <span className="min-w-[80px] whitespace-nowrap text-right text-sm font-bold text-gray-800">
            {revenueInOku.toLocaleString()}億円〜
          </span>
        </div>
      </div>

      {/* ジャンル選択 */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-gray-500">ジャンル</label>
        <div
          ref={genreScrollRef}
          className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {GENRE_LIST.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedGenre === g.id
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* カード表示エリア */}
      <div className="mt-8">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center text-gray-400">
            <svg className="h-12 w-12 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm">条件に合う映画が見つかりません</p>
            <p className="mt-1 text-xs">スライダーを下げてみてください</p>
          </div>
        ) : movie ? (
          <div className="relative flex items-center justify-center">
            {/* PC左矢印 */}
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="absolute -left-2 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-opacity hover:bg-gray-50 disabled:opacity-20 md:flex"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* カード */}
            <div
              ref={cardRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full max-w-sm mx-auto"
            >
              <Link href={`/movie/${movie.id}`} className="block">
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* ポスター */}
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-100 text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  {/* 情報 */}
                  <div className="p-4">
                    <h2 className="font-[family-name:var(--font-noto-sans-jp)] text-base font-bold text-gray-900 leading-snug line-clamp-2">
                      {movie.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>{movie.release_date?.slice(0, 4) || "—"}</span>
                      <span className="font-semibold text-gray-700">
                        {formatRevenue(movie.revenue)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <svg className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                        </svg>
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    {/* ジャンルタグ */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {movie.genres.slice(0, 3).map((g) => (
                        <span
                          key={g.id}
                          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* PC右矢印 */}
            <button
              onClick={goNext}
              disabled={currentIndex === movies.length - 1}
              className="absolute -right-2 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-opacity hover:bg-gray-50 disabled:opacity-20 md:flex"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : null}

        {/* カウンター */}
        {!loading && movies.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="text-xs text-gray-400">
              {currentIndex + 1} / {movies.length}
            </span>
          </div>
        )}

        {/* ドットインジケーター */}
        {!loading && movies.length > 1 && movies.length <= 20 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? "w-4 bg-gray-700" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
