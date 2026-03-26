"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [minRevenue, setMinRevenue] = useState(5);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [movies, setMovies] = useState<DiscoverMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // スワイプ用
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const hasMoved = useRef(false);

  const THRESHOLD = 50;

  const revenueInOku = minRevenue * 100;
  const revenueInUSD = (revenueInOku * 1_0000_0000) / USD_TO_JPY;

  // カード幅を計測（movies変更後にコンテナが出現するので依存に含める）
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setCardWidth(containerRef.current.offsetWidth);
      }
    };
    // コンテナ出現を待つ
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [movies]);

  const fetchMovies = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setCurrent(0);
      setOffsetX(0);
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

  const goTo = useCallback((index: number) => {
    setTransitioning(true);
    setCurrent(index);
    setOffsetX(0);
    setTimeout(() => setTransitioning(false), 300);
  }, []);

  // タッチハンドラ（PosterGalleryと同じパターン）
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (transitioning) return;
    isDragging.current = true;
    isHorizontalSwipe.current = null;
    hasMoved.current = false;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setOffsetX(0);
  }, [transitioning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // 水平/垂直の判定（最初の動きで決定）
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
      }
      return;
    }

    // 垂直スワイプなら何もしない（通常スクロール）
    if (!isHorizontalSwipe.current) return;
    hasMoved.current = true;

    // 端でのラバーバンド効果
    if ((current === 0 && dx > 0) || (current === movies.length - 1 && dx < 0)) {
      setOffsetX(dx * 0.3);
    } else {
      setOffsetX(dx);
    }
  }, [current, movies.length]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (isHorizontalSwipe.current && Math.abs(offsetX) > THRESHOLD) {
      if (offsetX < 0 && current < movies.length - 1) {
        goTo(current + 1);
      } else if (offsetX > 0 && current > 0) {
        goTo(current - 1);
      } else {
        setTransitioning(true);
        setOffsetX(0);
        setTimeout(() => setTransitioning(false), 300);
      }
    } else {
      setTransitioning(true);
      setOffsetX(0);
      setTimeout(() => setTransitioning(false), 300);
    }
  }, [offsetX, current, movies.length, goTo]);

  // カードタップで遷移（スワイプ中は無視）
  const handleCardClick = useCallback((movieId: number) => {
    if (hasMoved.current) return;
    router.push(`/movie/${movieId}`);
  }, [router]);

  return (
    <main className="fixed inset-0 z-10 flex flex-col bg-white pt-16 pb-16 px-4 md:relative md:inset-auto md:z-auto md:min-h-screen md:pb-28 md:pt-24 md:px-16 xl:pb-12">
      {/* タイトル */}
      <div className="flex items-baseline gap-3 pt-2">
        <h1 className="font-[family-name:var(--font-noto-sans-jp)] text-lg font-bold tracking-wide text-gray-900 md:text-2xl">
          ディスカバー
        </h1>
        <p className="text-[10px] text-gray-400 md:text-xs">興行収入とジャンルで映画を探す</p>
      </div>

      {/* 興行収入スライダー */}
      <div className="mt-3 md:mt-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-semibold text-gray-500 md:text-xs">興行収入</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={minRevenue}
            onChange={(e) => setMinRevenue(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-gray-700 md:h-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-700 md:[&::-webkit-slider-thumb]:h-5 md:[&::-webkit-slider-thumb]:w-5"
          />
          <span className="min-w-[70px] whitespace-nowrap text-right text-[10px] font-bold text-gray-800 md:text-sm">
            {revenueInOku.toLocaleString()}億円以上
          </span>
        </div>
      </div>

      {/* ジャンル選択 */}
      <div className="mt-2 md:mt-5">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide md:gap-2 md:pb-2">
          {GENRE_LIST.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors md:px-4 md:py-1.5 md:text-xs ${
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

      {/* カード表示エリア（残りの高さを使い切る） */}
      <div className="mt-3 flex-1 min-h-0 md:mt-8">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <svg className="h-12 w-12 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm">条件に合う映画が見つかりません</p>
            <p className="mt-1 text-xs">スライダーを下げてみてください</p>
          </div>
        ) : (
          <div className="relative flex h-full flex-col">
            {/* PC左矢印 */}
            {current > 0 && (
              <button
                onClick={() => goTo(current - 1)}
                className="absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-opacity hover:bg-gray-50 md:flex"
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* スワイプ可能エリア */}
            <div
              ref={containerRef}
              className="overflow-hidden mx-auto w-full max-w-sm flex-1 min-h-0"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              <div
                className="flex"
                style={{
                  transform: cardWidth
                    ? `translateX(${-current * cardWidth + offsetX}px)`
                    : undefined,
                  transition: transitioning
                    ? "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)"
                    : "none",
                  width: cardWidth ? `${movies.length * cardWidth}px` : undefined,
                }}
              >
                {movies.map((m) => (
                  <div
                    key={m.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: cardWidth || "100%" }}
                    onClick={() => handleCardClick(m.id)}
                  >
                    <div className="overflow-hidden rounded-lg bg-white shadow-xl cursor-pointer">
                      {m.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w342${m.poster_path}`}
                          alt={m.title}
                          className="aspect-[27/32] w-full object-cover select-none md:aspect-[2/3]"
                          draggable={false}
                        />
                      ) : (
                        <div className="flex aspect-[27/32] w-full items-center justify-center bg-gray-100 text-gray-400 text-sm md:aspect-[2/3]">
                          No Image
                        </div>
                      )}
                      <div className="p-3 md:p-4">
                        <h2 className="font-[family-name:var(--font-noto-sans-jp)] text-sm font-bold text-gray-900 leading-snug line-clamp-1 md:text-base md:line-clamp-2">
                          {m.title}
                        </h2>
                        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-gray-500 md:mt-2 md:text-xs">
                          <span>{m.release_date?.slice(0, 4) || "—"}</span>
                          <span className="font-semibold text-gray-700">
                            {formatRevenue(m.revenue)}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <svg className="h-3 w-3 text-yellow-500 md:h-3.5 md:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                            </svg>
                            {m.vote_average.toFixed(1)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1 md:mt-3 md:gap-1.5">
                          {m.genres.slice(0, 3).map((g) => (
                            <span
                              key={g.id}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-500 md:px-2.5 md:text-[10px]"
                            >
                              {g.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PC右矢印 */}
            {current < movies.length - 1 && (
              <button
                onClick={() => goTo(current + 1)}
                className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-opacity hover:bg-gray-50 md:flex"
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* カウンター + ドット */}
            <div className="mt-2 flex flex-col items-center gap-1 md:mt-4">
              <span className="text-[10px] text-gray-400 md:text-xs">
                {current + 1} / {movies.length}
              </span>
              {movies.length > 1 && movies.length <= 20 && (
                <div className="flex justify-center gap-1">
                  {movies.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === current ? "w-3 bg-gray-700" : "w-1 bg-gray-300"
                      } md:h-1.5 ${i === current ? "md:w-4" : "md:w-1.5"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
