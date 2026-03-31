"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFollowed, FollowedItem } from "@/components/FollowButton";

type Tab = "all" | "movie" | "tv";

export default function FollowsPage() {
  const [items, setItems] = useState<FollowedItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    setItems(getFollowed().sort((a, b) => b.followedAt - a.followedAt));
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "movie", label: "映画" },
    { key: "tv", label: "TV" },
  ];

  const filtered = activeTab === "all"
    ? items
    : items.filter((item) => item.mediaType === activeTab);

  return (
    <main className="min-h-screen bg-white pt-24 pb-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          ウォッチリスト
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          気になる作品をまとめてチェック
        </p>

        {/* タブナビゲーション */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {items.length > 0 && (
                  <span className="ml-1.5 text-xs text-gray-400">
                    {tab.key === "all"
                      ? items.length
                      : items.filter((i) => i.mediaType === tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* コンテンツ */}
        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-gray-400">
            {items.length === 0
              ? "ウォッチリストに追加された作品はまだありません"
              : "該当する作品はありません"}
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((item) => (
              <Link
                key={`${item.mediaType}-${item.id}`}
                href={`/movie/${item.id}?type=${item.mediaType}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-[4px] border-[5px] border-transparent transition-all duration-300 group-hover:border-yellow-400">
                  {item.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                      alt={item.title}
                      className="aspect-[2/3] w-full rounded-[4px] object-cover transition-transform duration-300"
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
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {item.mediaType === "tv" ? "TV" : "映画"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
