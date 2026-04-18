"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFollowed, removeFollowed, FollowedItem } from "@/components/FollowButton";

type Tab = "all" | "movie" | "tv";

const ALLOWED_PROVIDERS = ["Netflix", "U-NEXT", "Hulu", "Disney Plus", "Amazon Prime Video"];

export default function FollowsPage() {
  const [items, setItems] = useState<FollowedItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    setItems(getFollowed().sort((a, b) => b.followedAt - a.followedAt));
  }, []);

  const handleRemove = (id: number, mediaType: string) => {
    removeFollowed(id, mediaType);
    setItems((prev) => prev.filter((item) => !(item.id === id && item.mediaType === mediaType)));
    setSwipedId(null);
  };

  const handleTouchStart = (e: React.TouchEvent, key: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent, key: string) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy > 30) return; // 縦スクロール中は無視
    if (dx < -50) {
      setSwipedId(key);
    } else if (dx > 20) {
      setSwipedId(null);
    }
  };

  const handleContentClick = (key: string, href: string) => {
    if (swipedId === key) {
      setSwipedId(null);
    } else {
      router.push(href);
    }
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
        <div className="mt-8 flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
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
              {filtered.map((item) => {
                const key = `${item.mediaType}-${item.id}`;
                const href = `/movie/${item.id}?type=${item.mediaType}`;
                const isSwiped = swipedId === key;
                return (
                  <div
                    key={key}
                    className="relative overflow-hidden border-b border-gray-100"
                    onTouchStart={(e) => handleTouchStart(e, key)}
                    onTouchEnd={(e) => handleTouchEnd(e, key)}
                  >
                    {/* 削除ボタン（背面） */}
                    <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500">
                      <button
                        onClick={() => handleRemove(item.id, item.mediaType)}
                        className="text-white text-sm font-medium"
                        aria-label="削除"
                      >
                        削除
                      </button>
                    </div>

                    {/* コンテンツ行（前面） */}
                    <div
                      className="flex items-stretch gap-4 py-4 bg-white transition-transform duration-200 ease-out cursor-pointer"
                      style={{ transform: isSwiped ? "translateX(-80px)" : "translateX(0)" }}
                      onClick={() => handleContentClick(key, href)}
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
                        {item.providers && item.providers.filter((p) => ALLOWED_PROVIDERS.includes(p.provider_name)).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.providers.filter((p) => ALLOWED_PROVIDERS.includes(p.provider_name)).map((p) => (
                              <span key={p.provider_name} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{p.provider_name}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    {item.providers && item.providers.filter((p) => ALLOWED_PROVIDERS.includes(p.provider_name)).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.providers.filter((p) => ALLOWED_PROVIDERS.includes(p.provider_name)).map((p) => (
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
