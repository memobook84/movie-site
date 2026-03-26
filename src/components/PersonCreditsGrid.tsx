"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/lib/tmdb";

type SortMode = "rating" | "newest" | "oldest";

interface Credit {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
}

interface Props {
  castCredits: Credit[];
  directorCredits: Credit[];
}

type Tab = "cast" | "director";

export default function PersonCreditsGrid({ castCredits, directorCredits }: Props) {
  const hasCast = castCredits.length > 0;
  const hasDirector = directorCredits.length > 0;

  const [activeTab, setActiveTab] = useState<Tab>(hasCast ? "cast" : "director");
  const [sort, setSort] = useState<SortMode>("rating");

  const credits = activeTab === "cast" ? castCredits : directorCredits;

  const sorted = [...credits].sort((a, b) => {
    if (sort === "rating") return b.vote_average - a.vote_average;
    const dateA = a.release_date || a.first_air_date || "";
    const dateB = b.release_date || b.first_air_date || "";
    if (sort === "newest") return dateB.localeCompare(dateA);
    return dateA.localeCompare(dateB);
  });

  const showYear = sort === "newest" || sort === "oldest";

  const sortLabels: Record<SortMode, string> = {
    rating: "評価順",
    newest: "新しい順",
    oldest: "古い順",
  };

  const sortOptions: SortMode[] = ["rating", "newest", "oldest"];

  if (!hasCast && !hasDirector) return null;

  const tabs: { key: Tab; label: string; count: number }[] = [];
  if (hasCast) tabs.push({ key: "cast", label: "出演作品", count: castCredits.length });
  if (hasDirector) tabs.push({ key: "director", label: "監督作品", count: directorCredits.length });

  return (
    <div className="mt-12">
      {/* タブ */}
      {tabs.length > 1 ? (
        <div className="flex gap-0 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSort("rating"); }}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-[#1d1d1f] text-[#1d1d1f]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}（{tab.count}）
            </button>
          ))}
        </div>
      ) : (
        <div className="border-b border-gray-200">
          <span className="inline-block px-4 py-2.5 text-sm font-medium border-b-2 border-[#1d1d1f] text-[#1d1d1f]">
            {tabs[0].label}（{tabs[0].count}）
          </span>
        </div>
      )}

      {/* ソート */}
      <div className="mt-4 flex justify-end">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {sortOptions.map((mode) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                sort === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {sortLabels[mode]}
            </button>
          ))}
        </div>
      </div>

      {/* グリッド */}
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {sorted.map((movie) => {
          const title = movie.title || movie.name || "";
          const type = movie.media_type === "tv" ? "tv" : "movie";
          const year = (movie.release_date || movie.first_air_date || "").slice(2, 4);

          return (
            <Link
              key={`${type}-${movie.id}`}
              href={`/movie/${movie.id}?type=${type}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-[4px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
                <img
                  src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                  alt={title}
                  className="aspect-[2/3] w-full object-cover"
                  loading="lazy"
                />
                {showYear && year && (
                  <div className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm md:h-8 md:w-8">
                    <span className="text-[10px] font-bold text-white md:text-[11px]">
                      {year}
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-1.5 truncate text-xs font-medium text-[#1d1d1f]">{title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
