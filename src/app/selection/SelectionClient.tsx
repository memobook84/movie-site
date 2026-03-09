"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";

const TABS = [
  { key: "trending", label: "トレンド" },
  { key: "topRated", label: "高評価" },
  { key: "1980", label: "1980年代" },
  { key: "1990", label: "1990年代" },
  { key: "2000", label: "2000年代" },
  { key: "2010", label: "2010年代" },
  { key: "2020", label: "2020年代" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type DecadeKey = "1980" | "1990" | "2000" | "2010" | "2020";

export default function SelectionClient({
  trending,
  topRated,
  decades,
}: {
  trending: Movie[];
  topRated: Movie[];
  decades: Record<DecadeKey, Movie[]>;
}) {
  const [tab, setTab] = useState<TabKey>("trending");

  const movies =
    tab === "trending"
      ? trending
      : tab === "topRated"
      ? topRated
      : decades[tab as DecadeKey];

  const top3 = movies.slice(0, 3);
  const rest = movies.slice(3, 20);

  return (
    <main className="min-h-screen bg-white pt-24 pb-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        {/* ヘッダー */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          セレクション
        </h1>
        <p className="mt-1 text-sm text-gray-400">厳選された映画をチェック</p>

        {/* タブ */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TOP3 大きいカード */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {top3.map((movie, i) => {
            const title = movie.title || movie.name || "";
            return (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group overflow-hidden rounded-2xl bg-[#f5f5f7] transition-all hover:shadow-lg"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                  {/* ランクバッジ */}
                  <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                    {i + 1}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 md:text-base">
                    {title}
                  </h3>
                  {movie.overview && (
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-gray-400">
                      {movie.overview}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* 4位以降 小さいカードグリッド */}
        {rest.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {rest.map((movie) => {
              const title = movie.title || movie.name || "";
              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-xl">
                    {movie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                        alt={title}
                        className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-100 text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-xs font-medium text-gray-700">
                    {title}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
