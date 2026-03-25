"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { AiFillThunderbolt } from "react-icons/ai";
import { PiPlayCircle } from "react-icons/pi";

interface CarouselItem {
  movie: Movie;
  badge: "上映中" | "近日公開";
}

interface HeroProps {
  movies: Movie[];
  upcomingMovies?: Movie[];
  trailerKeys?: Record<number, string>;
  casts?: Record<number, string[]>;
}

export default function Hero({ movies, upcomingMovies = [], trailerKeys = {}, casts = {} }: HeroProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const [displayCurrent, setDisplayCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const closeTrailer = useCallback(() => setTrailerOpen(false), []);

  useEffect(() => {
    if (!trailerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTrailer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [trailerOpen, closeTrailer]);

  // テキストアニメーション
  useEffect(() => {
    if (current === displayCurrent) return;
    setTextVisible(false);
    const timer = setTimeout(() => {
      setDisplayCurrent(current);
      setTextVisible(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [current, displayCurrent]);

  // 下カルーセル：上映中のみ
  const allItems = useMemo<CarouselItem[]>(() => {
    return movies.map((m) => ({ movie: m, badge: "上映中" as const }));
  }, [movies]);

  // 下カルーセルのスクロール位置
  const [scrollPos, setScrollPos] = useState(0);

  const scrollCarousel = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const itemW = scrollRef.current.querySelector("button")?.offsetWidth ?? 150;
    const gap = 12;
    const step = itemW + gap;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    setScrollPos((prev) => {
      const next = dir === "right" ? prev + step : prev - step;
      return Math.max(0, Math.min(next, maxScroll));
    });
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
  }, [scrollPos]);

  if (movies.length === 0) return null;

  const movie = movies[current];
  const displayMovie = movies[displayCurrent];
  const title = displayMovie.title || displayMovie.name || "";
  const trailerKey = trailerKeys[movie.id];

  const prev = () => setCurrent((c) => (c === 0 ? movies.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === movies.length - 1 ? 0 : c + 1));

  const backdrop = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
    : null;

  return (
    <>
      <div className="relative pt-20 md:pt-24 bg-black overflow-hidden">

        {/* メインビジュアル */}
        <div className="relative">
          <div
            className="relative w-full cursor-pointer"
            style={{ aspectRatio: "16/9", maxWidth: "900px", margin: "0 auto" }}
            onClick={() => router.push(`/movie/${movie.id}`)}
          >
            {backdrop ? (
              <img
                key={movie.id}
                src={backdrop}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            {/* 左上 雷アイコン */}
            <AiFillThunderbolt className="absolute top-3 left-3 md:top-4 md:left-4 w-7 h-7 md:w-9 md:h-9 text-red-500 drop-shadow-lg z-10" />

            {/* 下部グラデーション */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* タイトル + Trailer（アニメーション付き） */}
            <div className="absolute bottom-3 left-3 md:bottom-6 md:left-8 z-10 max-w-[80%]">
              <div
                className={`flex flex-col gap-1.5 transition-all duration-500 ease-out ${
                  textVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-white text-base md:text-2xl font-normal leading-tight line-clamp-2 drop-shadow-lg">
                  {title}
                </h2>
                {displayMovie.overview && (
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed line-clamp-3 max-w-lg drop-shadow">
                    {displayMovie.overview}
                  </p>
                )}
                {casts[displayMovie.id] && (
                  <p className="text-white/60 text-xs md:text-sm drop-shadow">
                    {casts[displayMovie.id].join(" / ")}
                  </p>
                )}
              </div>
            </div>

            {/* 右下 再生ボタン */}
            {trailerKeys[movie.id] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTrailerOpen(true);
                }}
                className="absolute bottom-3 right-3 md:bottom-6 md:right-8 z-10 hover:scale-110 transition-transform"
                aria-label="トレーラー再生"
              >
                <PiPlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white/50 drop-shadow-lg" />
              </button>
            )}

            {/* 左右矢印 */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border border-white/30 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all text-xl"
              aria-label="前へ"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border border-white/30 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all text-xl"
              aria-label="次へ"
            >
              ›
            </button>
          </div>
        </div>

        {/* 下部カルーセル */}
        <div className="relative bg-black/80">
          <div className="relative py-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="flex items-center gap-1 text-red-500 font-bold text-xs tracking-wide">
                <AiFillThunderbolt className="w-4 h-4" />
                上映中
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="flex h-7 w-7 items-center justify-center border border-white/30 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all text-sm"
                  aria-label="左へ"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="flex h-7 w-7 items-center justify-center border border-white/30 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all text-sm"
                  aria-label="右へ"
                >
                  ›
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-hidden px-2"
            >
              {allItems.map((item) => {
                const m = item.movie;
                const thumb = m.backdrop_path
                  ? `${IMAGE_BASE_URL}/w300${m.backdrop_path}`
                  : null;
                const mTitle = m.title || m.name || "";
                const isNowPlaying = item.badge === "上映中";
                const isActive = m.id === movie.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      const idx = movies.findIndex((mv) => mv.id === m.id);
                      if (idx >= 0) {
                        setCurrent(idx);
                      } else {
                        router.push(`/movie/${m.id}`);
                      }
                    }}
                    className={`relative flex-shrink-0 group transition-all duration-300 rounded overflow-hidden ${
                      isActive ? "ring-2 ring-yellow-400" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={mTitle}
                        className="w-28 h-16 md:w-32 md:h-[72px] object-cover"
                      />
                    ) : (
                      <div className="w-28 h-16 md:w-32 md:h-[72px] bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                    <AiFillThunderbolt className="absolute top-1 left-1 w-4 h-4 text-red-500 drop-shadow-md" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] leading-tight line-clamp-1">{mTitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 黒→ライトグレーのグラデーション */}
      <div className="h-24 bg-gradient-to-b from-black to-[#f5f5f7]" />

      {/* トレーラーモーダル */}
      {trailerOpen && trailerKey && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeTrailer}
        >
          <div
            className="relative w-[92vw] max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeTrailer}
              className="absolute -top-10 right-0 text-white text-3xl font-light hover:text-gray-300 transition-colors"
              aria-label="閉じる"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
