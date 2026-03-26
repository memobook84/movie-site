"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/lib/tmdb";

interface MovieData {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
}

interface GenreData {
  label: string;
  movies: { detail: MovieData; review: string }[];
}

export default function SelectionClient({ genres }: { genres: GenreData[] }) {
  const [active, setActive] = useState(-1);
  const isAll = active === -1;

  const shuffledAll = useMemo(() => {
    const all = genres.flatMap((g) => g.movies);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [genres]);

  const visibleMovies = isAll ? shuffledAll : genres[active].movies;

  return (
    <>
      {/* タブナビゲーション */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActive(-1)}
            className={`shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              isAll
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            ALL
          </button>
          {genres.map((genre, i) => (
            <button
              key={genre.label}
              onClick={() => setActive(i)}
              className={`shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                active === i
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      {/* カードグリッド */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleMovies.map(({ detail, review }) => {
          const title = detail.title || detail.name || "";
          const year = detail.release_date
            ? detail.release_date.slice(0, 4)
            : "";

          return (
            <Link
              key={detail.id}
              href={`/movie/${detail.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg">
                {detail.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}/w342${detail.poster_path}`}
                    alt={title}
                    className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                  {title}
                </h3>
                {year && (
                  <p className="mt-0.5 text-xs text-gray-400">{year}</p>
                )}
                <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-5">
                  {review}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
