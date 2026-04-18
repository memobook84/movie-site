"use client";

import { useState } from "react";
import Link from "next/link";
import { AiFillVideoCamera } from "react-icons/ai";
import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";

const TABS = [
  { label: "人気", key: "jp" },
  { label: "トレンド", key: "trending" },
];

function RankBadge({ rank }: { rank: number }) {
  const colors =
    rank === 1 ? "from-yellow-400 to-amber-500 text-white shadow-amber-300/50"
    : rank === 2 ? "from-gray-300 to-gray-400 text-white shadow-gray-300/50"
    : rank === 3 ? "from-amber-600 to-amber-700 text-white shadow-amber-600/50"
    : "from-gray-100 to-gray-200 text-gray-500";

  return (
    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold shadow-sm ${colors} ${rank <= 3 ? "text-sm" : "text-xs"}`}>
      {rank}
    </div>
  );
}

function NowPlayingBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-red-500 font-bold text-[10px] tracking-wide">
      <AiFillVideoCamera className="w-3 h-3" />
      上映中
    </span>
  );
}

function NowPlayingIcon() {
  return <AiFillVideoCamera className="w-5 h-5 text-red-500 drop-shadow-md" />;
}

interface Props {
  popularJP: Movie[];
  trending: Movie[];
  nowPlayingIds: number[];
}

export default function RankingClient({ popularJP, trending, nowPlayingIds }: Props) {
  const [active, setActive] = useState(0);

  const movies = [popularJP, trending][active];
  const nowPlaying = new Set(nowPlayingIds);

  return (
    <>
      {/* タブ */}
      <div className="mt-8 flex gap-1 border-b border-gray-200">
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              active === i
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* スマホ: リスト */}
      <div className="mt-4 space-y-2 md:hidden">
        {movies.slice(0, 20).map((movie, i) => {
          const title = movie.title || movie.name || "";
          const year = (movie.release_date || movie.first_air_date)?.slice(0, 4);
          const isNowPlaying = nowPlaying.has(movie.id);
          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}?type=${movie.media_type === "tv" ? "tv" : "movie"}`}
              className="group flex items-center gap-4 bg-white p-3 transition-all hover:bg-gray-50 hover:shadow-md"
            >
              <RankBadge rank={i + 1} />
              <div className="h-16 w-11 flex-shrink-0 overflow-hidden rounded-[4px]">
                {movie.poster_path ? (
                  <img src={`${IMAGE_BASE_URL}/w185${movie.poster_path}`} alt={title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] text-gray-400">N/A</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                  {year && <span>{year}</span>}
                  {isNowPlaying && <NowPlayingBadge />}
                  {!isNowPlaying && movie.media_type && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">
                      {movie.media_type === "tv" ? "TV" : "映画"}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* PC: 1〜3位 */}
      {movies.length >= 3 && (() => {
        const podium = [
          { movie: movies[0], rank: 1 },
          { movie: movies[1], rank: 2 },
          { movie: movies[2], rank: 3 },
        ];
        return (
          <div className="hidden md:flex md:items-start md:justify-center md:gap-10 mt-8">
            {podium.map(({ movie, rank }) => {
              const title = movie.title || movie.name || "";
              const isNowPlaying = nowPlaying.has(movie.id);
              return (
                <Link key={movie.id} href={`/movie/${movie.id}?type=${movie.media_type === "tv" ? "tv" : "movie"}`} className="group w-[260px] flex-shrink-0">
                  <div className="relative ml-10">
                    <span
                      className="absolute bottom-0 -left-10 z-30 select-none leading-none font-[family-name:var(--font-bebas-neue)]"
                      style={{ fontSize: "clamp(5rem, 8vw, 10rem)", color: "#E6A723" }}
                    >
                      {rank}
                    </span>
                    <div className="relative z-20 w-full overflow-hidden rounded-[4px] shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      {movie.poster_path ? (
                        <img src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`} alt={title} className="aspect-[2/3] w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-200 text-xs text-gray-400">N/A</div>
                      )}
                      {isNowPlaying && (
                        <div className="absolute top-2 left-2 z-40">
                          <NowPlayingIcon />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-10 mt-2">
                    <p className="truncate text-sm font-medium text-gray-700 group-hover:text-black transition-colors">{title}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {(movie.release_date || movie.first_air_date) && (
                        <span className="text-[10px] text-gray-400">{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</span>
                      )}
                      {!isNowPlaying && movie.media_type && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{movie.media_type === "tv" ? "TV" : "映画"}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })()}

      {/* PC: 4〜20位（5列） */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-x-6 md:gap-y-16 mt-12">
        {movies.slice(3, 20).map((movie, i) => {
          const title = movie.title || movie.name || "";
          const isNowPlaying = nowPlaying.has(movie.id);
          return (
            <Link key={movie.id} href={`/movie/${movie.id}?type=${movie.media_type === "tv" ? "tv" : "movie"}`} className="group">
              <div className="relative ml-8">
                <span
                  className="absolute bottom-0 -left-8 z-30 select-none leading-none font-[family-name:var(--font-bebas-neue)]"
                  style={{ fontSize: "clamp(4rem, 6vw, 7rem)", color: "#E6A723" }}
                >
                  {i + 4}
                </span>
                <div className="relative z-20 w-full overflow-hidden rounded-[4px] shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  {movie.poster_path ? (
                    <img src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`} alt={title} className="aspect-[2/3] w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-200 text-xs text-gray-400">N/A</div>
                  )}
                  {isNowPlaying && (
                    <div className="absolute top-1.5 left-1.5 z-40">
                      <NowPlayingIcon />
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-8 mt-2">
                <p className="truncate text-xs font-medium text-gray-700 group-hover:text-black transition-colors">{title}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {(movie.release_date || movie.first_air_date) && (
                    <span className="text-[10px] text-gray-400">{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</span>
                  )}
                  {!isNowPlaying && movie.media_type && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{movie.media_type === "tv" ? "TV" : "映画"}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
