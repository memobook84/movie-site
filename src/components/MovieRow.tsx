"use client";

import { useRef } from "react";
import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -700 : 700;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3 px-6 md:px-16">
      {title && (
        <h2 className="text-lg font-semibold tracking-wide text-[#1d1d1f] md:text-xl">
          {title}
        </h2>
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
          className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide md:gap-6"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
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
