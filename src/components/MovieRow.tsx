"use client";

import { useRef } from "react";
import Link from "next/link";
import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  titleClassName?: string;
  subtitle?: string;
  cardVariant?: "default" | "oscar";
  showUnderline?: boolean;
  href?: string;
  accent?: boolean;
}

export default function MovieRow({ title, movies, titleClassName, subtitle, cardVariant = "default", showUnderline = false, href, accent }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -700 : 700;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3 px-6 md:px-16 md:max-w-[1280px] md:mx-auto">
      {title && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className={titleClassName || "text-lg font-semibold tracking-wide text-[#1d1d1f] md:text-xl"}>
              {accent ? (
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>
                  {title}
                </span>
              ) : title}
            </h2>
            {href && (
              <Link href={href} className="text-xs font-medium text-gray-400 transition-colors hover:text-[#1d1d1f] md:text-sm">
                一覧を見る →
              </Link>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 md:text-xs">{subtitle}</p>
          )}
          {showUnderline && <hr className="mt-2 border-t border-gray-300" />}
        </div>
      )}
      <div className="group/row relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/3 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-lg backdrop-blur-sm transition-all hover:bg-black/10 group-hover/row:flex"
          aria-label="左にスクロール"
        >
          ‹
        </button>
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide md:gap-6"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant={cardVariant} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/3 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-lg backdrop-blur-sm transition-all hover:bg-black/10 group-hover/row:flex"
          aria-label="右にスクロール"
        >
          ›
        </button>
      </div>
    </div>
  );
}
