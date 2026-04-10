"use client";

import { useState } from "react";
import Link from "next/link";
import type { Movie } from "@/lib/tmdb";
import { IMAGE_BASE_URL } from "@/lib/tmdb";

type Decade = "all" | "pre1960" | "1970" | "1980" | "1990" | "2000" | "2010" | "2020";

const DECADES: { key: Decade; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "pre1960", label: "1960年代以前" },
  { key: "1970", label: "1970年代" },
  { key: "1980", label: "1980年代" },
  { key: "1990", label: "1990年代" },
  { key: "2000", label: "2000年代" },
  { key: "2010", label: "2010年代" },
  { key: "2020", label: "2020年代" },
];

function filterByDecade(movies: Movie[], decade: Decade): Movie[] {
  if (decade === "all") return movies;
  return movies.filter((m) => {
    const year = Number((m.release_date || "").slice(0, 4));
    if (!year) return false;
    if (decade === "pre1960") return year < 1970;
    if (decade === "1970") return year >= 1970 && year < 1980;
    if (decade === "1980") return year >= 1980 && year < 1990;
    if (decade === "1990") return year >= 1990 && year < 2000;
    if (decade === "2000") return year >= 2000 && year < 2010;
    if (decade === "2010") return year >= 2010 && year < 2020;
    if (decade === "2020") return year >= 2020;
    return true;
  });
}

export default function ClassicsClient({ movies }: { movies: Movie[] }) {
  const [decade, setDecade] = useState<Decade>("all");
  const filtered = filterByDecade(movies, decade);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {DECADES.map((d) => (
          <button
            key={d.key}
            onClick={() => setDecade(d.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              decade === d.key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-400">該当する作品がありません</p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filtered.map((movie) => {
            const title = movie.title || movie.name || "";
            return (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                <div className="overflow-hidden rounded-[4px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                      alt={title}
                      className="aspect-[2/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <p className="mt-1.5 truncate text-xs font-medium text-[#1d1d1f]">{title}</p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
