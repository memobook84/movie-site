"use client";

import { useState } from "react";
import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";
import Link from "next/link";

interface HeroProps {
  movies: Movie[];
}

export default function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState(0);

  if (movies.length === 0) return null;

  const movie = movies[current];
  const title = movie.title || movie.name || "";

  const prev = () => setCurrent((c) => (c === 0 ? movies.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === movies.length - 1 ? 0 : c + 1));

  return (
    <div className="relative h-[25vh] md:h-[50vh] w-full overflow-hidden">
      {/* スライド */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {m.backdrop_path && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${IMAGE_BASE_URL}/original${m.backdrop_path})`,
              }}
            />
          )}
        </div>
      ))}

      {/* オーバーレイ（詳細ページと同じスタイル） */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-black/20" />

      {/* ボタン右下 */}
      <div className="absolute bottom-[12%] right-6 z-10 md:right-16">
        <Link
          href={`/movie/${movie.id}`}
          className="rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
        >
          詳細を見る
        </Link>
      </div>

      {/* 左矢印 */}
      <button
        onClick={prev}
        className="absolute left-3 top-[55%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-lg text-gray-700 backdrop-blur-sm transition-all hover:bg-black/10"
        aria-label="前へ"
      >
        ‹
      </button>

      {/* 右矢印 */}
      <button
        onClick={next}
        className="absolute right-3 top-[55%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-lg text-gray-700 backdrop-blur-sm transition-all hover:bg-black/10"
        aria-label="次へ"
      >
        ›
      </button>
    </div>
  );
}
