"use client";

import { useState } from "react";
import Link from "next/link";
import type { Movie } from "@/lib/tmdb";
import { IMAGE_BASE_URL } from "@/lib/tmdb";

interface Props {
  nowPlaying: Movie[];
  upcoming: Movie[];
}

function formatDate(dateStr: string) {
  if (dateStr === "未定") return "公開日未定";
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}

function groupByDate(movies: Movie[]) {
  const grouped: Record<string, Movie[]> = {};
  for (const movie of movies) {
    const date = movie.release_date || "未定";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(movie);
  }
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === "未定") return 1;
    if (b === "未定") return -1;
    return a.localeCompare(b);
  });
  return { grouped, sortedDates };
}

function formatShortDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

type NowCategory = "all" | "foreign" | "japanese" | "anime";

function filterByCategory(movies: Movie[], category: NowCategory): Movie[] {
  if (category === "all") return movies;
  if (category === "anime") return movies.filter((m) => m.genre_ids.includes(16));
  if (category === "japanese") return movies.filter((m) => m.original_language === "ja" && !m.genre_ids.includes(16));
  // foreign: not Japanese
  return movies.filter((m) => m.original_language !== "ja");
}

function MovieGrid({ movies, showReleaseBadge }: { movies: Movie[]; showReleaseBadge?: boolean }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
          <div className="relative overflow-hidden rounded-[4px] bg-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.03]">
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                alt={movie.title}
                className="aspect-[2/3] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                No Image
              </div>
            )}
            {showReleaseBadge && movie.release_date && (
              <span className="absolute bottom-2 right-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-medium text-white">
                {formatShortDate(movie.release_date)}〜
              </span>
            )}
          </div>
          <p className="mt-2 text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-gray-600">
            {movie.title}
          </p>
        </Link>
      ))}
    </div>
  );
}

const NOW_CATEGORIES: { key: NowCategory; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "foreign", label: "洋画" },
  { key: "japanese", label: "邦画" },
  { key: "anime", label: "アニメ" },
];

export default function ScheduleTabs({ nowPlaying, upcoming }: Props) {
  const [tab, setTab] = useState<"now" | "upcoming">("now");
  const [nowCategory, setNowCategory] = useState<NowCategory>("all");

  // 今日以降の作品のみ表示
  const today = new Date().toISOString().slice(0, 10);
  const filteredUpcoming = upcoming.filter((m) => !m.release_date || m.release_date >= today);
  const { grouped: upcomingGrouped, sortedDates: upcomingSorted } = groupByDate(filteredUpcoming);

  const filteredNowPlaying = filterByCategory(nowPlaying, nowCategory);

  return (
    <>
      {/* タブ */}
      <div className="mt-8 flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setTab("now")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "now"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          上映中
        </button>
        <button
          onClick={() => setTab("upcoming")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "upcoming"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          公開予定
        </button>
      </div>

      {/* コンテンツ */}
      <div className="mt-6">
        {tab === "now" ? (
          <>
            {/* カテゴリフィルター */}
            <div className="flex gap-2">
              {NOW_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setNowCategory(cat.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    nowCategory === cat.key
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {filteredNowPlaying.length > 0 ? (
              <MovieGrid movies={filteredNowPlaying} showReleaseBadge />
            ) : (
              <p className="mt-8 text-center text-sm text-gray-400">該当する作品がありません</p>
            )}
          </>
        ) : (
          <div className="space-y-10">
            {upcomingSorted.map((date) => (
              <section key={date}>
                <h2 className="py-2 text-sm font-bold text-gray-800 border-b border-gray-200">
                  {formatDate(date)}
                </h2>
                <MovieGrid movies={upcomingGrouped[date]} />
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
