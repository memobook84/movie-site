"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";

const IMG_SM = `${IMAGE_BASE_URL}/w185`;

const PLATFORMS = [
  { id: "8",   name: "Netflix",     logo: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg" },
  { id: "9",   name: "Prime Video", logo: "/pvske1MyAoymrs5bguRfVqYiM9a.jpg" },
  { id: "84",  name: "U-NEXT",      logo: "/a5T7vNaGvoeckYO6rQkHolvyYf4.jpg" },
  { id: "15",  name: "Hulu",        logo: "/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg" },
  { id: "337", name: "Disney+",     logo: "/97yvRBw1GzX7fXprcF80er19ot.jpg" },
] as const;

type MediaType = "movie" | "tv" | "anime";

export default function StreamingPage() {
  const [activeProvider, setActiveProvider] = useState<typeof PLATFORMS[number]>(PLATFORMS[0]);
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMovies = useCallback(
    async (provider: string, type: MediaType, p: number, append: boolean) => {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const res = await fetch(
          `/api/streaming?provider=${provider}&type=${type}&page=${p}`
        );
        const data = await res.json();
        if (append) {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        } else {
          setMovies(data.results || []);
        }
        setTotalPages(data.total_pages || 1);
      } catch {
        if (!append) setMovies([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(activeProvider.id, mediaType, 1, false);
  }, [activeProvider, mediaType, fetchMovies]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMovies(activeProvider.id, mediaType, next, true);
  };

  return (
    <main className="min-h-screen pt-14 md:pt-24 pb-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <h1 className="text-lg font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl">
          定額配信
        </h1>
        <p className="mt-1 text-xs text-gray-500 md:text-sm">
          日本で配信中の映画・ドラマ・アニメをアプリ別に探す
        </p>

        {/* プラットフォームタブ */}
        <div className="mt-6 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {PLATFORMS.map((platform) => {
            const isActive = activeProvider.id === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setActiveProvider(platform)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${platform.logo}`}
                  alt={platform.name}
                  className="h-9 w-9 rounded-full object-cover md:h-12 md:w-12"
                />
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                    isActive ? "bg-[#E6A723]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* 映画 / ドラマ切替 */}
        <div className="mt-4 flex gap-2">
          {(["movie", "tv", "anime"] as MediaType[]).map((type) => (
            <button
              key={type}
              onClick={() => setMediaType(type)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                mediaType === type
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "movie" ? "映画" : type === "tv" ? "ドラマ・TV" : "アニメ"}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {movies.map((movie) => {
                const title = movie.title || movie.name || "";
                return (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}?type=${mediaType === "anime" ? "tv" : mediaType}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded bg-gray-100 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                      {movie.poster_path ? (
                        <img
                          src={`${IMG_SM}${movie.poster_path}`}
                          alt={title}
                          className="aspect-[2/3] w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex aspect-[2/3] items-center justify-center text-[10px] text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="px-1.5 py-1.5">
                        <p className="truncate text-[9px] font-medium text-gray-900 md:text-[11px]">
                          {title}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {movies.length === 0 && !loading && (
              <p className="mt-16 text-center text-sm text-gray-400">
                作品が見つかりませんでした
              </p>
            )}

            {page < totalPages && movies.length > 0 && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-full bg-gray-900 px-10 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  {loadingMore ? "読み込み中..." : "もっと見る"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
