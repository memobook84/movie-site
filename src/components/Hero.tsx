"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { AiFillVideoCamera } from "react-icons/ai";
import { IoPlayCircle } from "react-icons/io5";

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
  const mainRef = useRef<HTMLDivElement>(null);

  // スムーズスワイプ用
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const isDraggingRef = useRef(false);
  const didSwipe = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);
  const velocity = useRef(0);

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

  // --- スムーズスワイプハンドラ (メインビジュアル) ---
  const animatingRef = useRef(false);

  const setTrackTransform = (px: number, animate: boolean) => {
    if (!trackRef.current) return;
    if (animate) {
      trackRef.current.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
    } else {
      trackRef.current.style.transition = "none";
    }
    trackRef.current.style.transform = `translateX(${px}px)`;
  };

  const startDrag = (clientX: number) => {
    if (animatingRef.current) return;
    dragStartX.current = clientX;
    dragOffset.current = 0;
    didSwipe.current = false;
    isDraggingRef.current = true;
    velocity.current = 0;
    lastMoveTime.current = Date.now();
    setTrackTransform(0, false);
  };

  const moveDrag = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const now = Date.now();
    const dx = clientX - dragStartX.current;
    const dt = now - lastMoveTime.current;
    if (dt > 0) velocity.current = (dx - dragOffset.current) / dt;
    lastMoveTime.current = now;
    dragOffset.current = dx;
    if (Math.abs(dx) > 5) didSwipe.current = true;
    setTrackTransform(dx, false);
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const containerW = mainRef.current?.offsetWidth ?? 400;
    const ratio = dragOffset.current / containerW;
    const v = velocity.current; // px/ms

    const onTransitionDone = (dir: "next" | "prev") => {
      animatingRef.current = true;
      const target = dir === "next" ? -containerW : containerW;
      setTrackTransform(target, true);

      const handler = () => {
        trackRef.current?.removeEventListener("transitionend", handler);
        if (dir === "next") next(); else prev();
        // 2重rAFでReact再描画完了後にリセット
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTrackTransform(0, false);
            animatingRef.current = false;
          });
        });
      };
      trackRef.current?.addEventListener("transitionend", handler);
    };

    // 速度 or 距離で判定（軽いフリックでもスライド）
    if (ratio < -0.1 || v < -0.3) {
      onTransitionDone("next");
    } else if (ratio > 0.1 || v > 0.3) {
      onTransitionDone("prev");
    } else {
      setTrackTransform(0, true);
    }
  };

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => moveDrag(e.touches[0].clientX);
  const handleTouchEnd = () => endDrag();

  // マウスイベント（F12デバッグ用にも対応）
  const handleMouseDown = (e: React.MouseEvent) => { e.preventDefault(); startDrag(e.clientX); };
  const handleMouseMove = (e: React.MouseEvent) => moveDrag(e.clientX);
  const handleMouseUp = () => endDrag();
  const handleMouseLeave = () => { if (isDraggingRef.current) endDrag(); };

  const handleClick = () => {
    if (!didSwipe.current) {
      router.push(`/movie/${movie.id}`);
    }
  };

  // 前・現在・次の画像を計算
  const prevIdx = (current - 1 + movies.length) % movies.length;
  const nextIdx = (current + 1) % movies.length;
  const slides = [
    { idx: prevIdx, movie: movies[prevIdx], pos: -1 },
    { idx: current, movie: movies[current], pos: 0 },
    { idx: nextIdx, movie: movies[nextIdx], pos: 1 },
  ];

  return (
    <>
      <div className="relative pt-10 md:pt-24 md:bg-gray-50 overflow-hidden">

        {/* メインビジュアル */}
        <div className="relative">
          <div
            ref={mainRef}
            className="relative w-full cursor-pointer overflow-hidden md:rounded"
            style={{ aspectRatio: "16/9", maxWidth: "900px", margin: "0 auto" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            {/* 3枚スライドトラック（DOM直接操作で60fps） */}
            <div
              ref={trackRef}
              className="absolute inset-0 w-full h-full"
              style={{ willChange: "transform" }}
            >
              {slides.map((slide) => {
                const bg = slide.movie.backdrop_path
                  ? `${IMAGE_BASE_URL}/w1280${slide.movie.backdrop_path}`
                  : null;
                return (
                  <div
                    key={slide.movie.id + "-" + slide.pos}
                    className="absolute inset-0 w-full h-full"
                    style={{ transform: `translateX(${slide.pos * 100}%)` }}
                  >
                    {bg ? (
                      <img
                        src={bg}
                        alt={slide.movie.title || slide.movie.name || ""}
                        className="w-full h-full object-cover object-center"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 左上 雷アイコン */}
            <AiFillVideoCamera className="absolute top-3 left-3 md:top-4 md:left-4 w-7 h-7 md:w-9 md:h-9 text-red-500 drop-shadow-lg z-10" />

            {/* 下部グラデーション */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[5]" />

            {/* タイトル + Trailer（アニメーション付き） */}
            <div className="absolute bottom-3 left-3 md:bottom-6 md:left-8 z-10 max-w-[80%]">
              <div
                className={`flex flex-col gap-1.5 transition-all duration-500 ease-out ${
                  textVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-white text-sm md:text-2xl font-normal leading-tight line-clamp-2 drop-shadow-lg">
                  {title}
                </h2>
                {displayMovie.overview && (
                  <p className="hidden md:line-clamp-2 text-white/80 text-xs md:text-sm leading-relaxed max-w-lg drop-shadow">
                    {displayMovie.overview}
                  </p>
                )}
                {casts[displayMovie.id] && (
                  <p className="text-white/60 text-[10px] md:text-sm drop-shadow">
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
                <IoPlayCircle className="w-7 h-7 md:w-14 md:h-14 text-yellow-400/90 drop-shadow-lg" />
              </button>
            )}

            {/* 左右矢印（PC時のみ） */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center border border-white/30 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all text-xl"
              aria-label="前へ"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center border border-white/30 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all text-xl"
              aria-label="次へ"
            >
              ›
            </button>
          </div>
        </div>

        {/* 下部カルーセル */}
        <div className="relative bg-gray-50">
          <div className="relative pt-3 pb-14">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="flex items-center gap-1 text-red-500 font-bold text-xs tracking-wide">
                <AiFillVideoCamera className="w-4 h-4" />
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
              className="flex gap-3 overflow-hidden px-2 scrollbar-hide"
            >
              {allItems.map((item) => {
                const m = item.movie;
                const thumb = m.backdrop_path
                  ? `${IMAGE_BASE_URL}/w300${m.backdrop_path}`
                  : null;
                const mTitle = m.title || m.name || "";
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
                    <AiFillVideoCamera className="absolute top-1 left-1 w-4 h-4 text-red-500 drop-shadow-md" />
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
