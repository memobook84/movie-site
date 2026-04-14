"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineDoNotTouch } from "react-icons/md";
import { getFollowed, removeFollowed, FollowedItem } from "@/components/FollowButton";

type Tab = "all" | "movie" | "tv";

export default function FollowsPage() {
  const [items, setItems] = useState<FollowedItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    setItems(getFollowed().sort((a, b) => b.followedAt - a.followedAt));
  }, []);

  const handleRemove = (id: number, mediaType: string) => {
    removeFollowed(id, mediaType);
    setItems((prev) => prev.filter((item) => !(item.id === id && item.mediaType === mediaType)));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "movie", label: "映画" },
    { key: "tv", label: "TV" },
  ];

  const filtered = activeTab === "all"
    ? items
    : items.filter((item) => item.mediaType === activeTab);

  return (
    <main className="min-h-screen bg-white pt-14 md:pt-24 pb-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <h1 className="text-lg font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl">
          あなたのウォッチリスト
        </h1>
        <p className="mt-1 text-xs text-gray-400 md:text-sm">
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
          <>
            {/* スマホ: 縦リスト */}
            <div className="mt-4 flex flex-col max-w-2xl md:hidden">
              {filtered.map((item) => (
                <Link
                  key={`${item.mediaType}-${item.id}`}
                  href={`/movie/${item.id}?type=${item.mediaType}`}
                  className="flex items-stretch gap-4 border-b border-gray-100 py-4"
                >
                  <div className="w-20 shrink-0 overflow-hidden rounded-[4px]">
                    {item.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w154${item.posterPath}`}
                        alt={item.title}
                        className="aspect-[2/3] w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-100 text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col">
                    <h3 className="text-sm font-normal text-gray-900 leading-tight line-clamp-2">{item.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">{item.mediaType === "tv" ? "TV" : "映画"}</span>
                      {item.year && <span>{item.year}年</span>}
                      {item.runtime && <span>{item.runtime >= 60 ? `${Math.floor(item.runtime / 60)}時間${item.runtime % 60 > 0 ? `${item.runtime % 60}分` : ""}` : `${item.runtime}分`}</span>}
                    </div>
                    {item.providers && item.providers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.providers.map((p) => (
                          <span key={p.provider_name} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{p.provider_name}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end mt-auto pt-2">
                      <button onClick={(e) => { e.preventDefault(); handleRemove(item.id, item.mediaType); }} className="p-1 text-gray-300 hover:text-red-400 transition-colors" aria-label="削除">
                        <MdOutlineDoNotTouch className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PC: グリッド */}
            <div className="mt-6 hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filtered.map((item) => (
                <div key={`${item.mediaType}-${item.id}`} className="flex flex-col">
                  <Link href={`/movie/${item.id}?type=${item.mediaType}`} className="block overflow-hidden rounded-[4px]">
                    {item.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                        alt={item.title}
                        className="aspect-[2/3] w-full object-cover hover:opacity-90 transition-opacity"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">No Image</div>
                    )}
                  </Link>
                  <div className="mt-2 flex flex-col flex-1">
                    <Link href={`/movie/${item.id}?type=${item.mediaType}`}>
                      <h3 className="text-sm font-normal text-gray-900 leading-tight line-clamp-2">{item.title}</h3>
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">{item.mediaType === "tv" ? "TV" : "映画"}</span>
                      {item.year && <span>{item.year}年</span>}
                      {item.runtime && <span>{item.runtime >= 60 ? `${Math.floor(item.runtime / 60)}時間${item.runtime % 60 > 0 ? `${item.runtime % 60}分` : ""}` : `${item.runtime}分`}</span>}
                    </div>
                    {item.providers && item.providers.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.providers.map((p) => (
                          <span key={p.provider_name} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{p.provider_name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
