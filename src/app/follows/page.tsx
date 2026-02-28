"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFollowed, FollowedItem } from "@/components/FollowButton";

export default function FollowsPage() {
  const [items, setItems] = useState<FollowedItem[]>([]);

  useEffect(() => {
    setItems(getFollowed().sort((a, b) => b.followedAt - a.followedAt));
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-24 px-6 md:px-16">
      <h1 className="text-2xl font-bold text-[#1d1d1f]">フォロー中</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-center text-gray-400">
          フォローした作品はまだありません
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <Link
              key={`${item.mediaType}-${item.id}`}
              href={`/movie/${item.id}?type=${item.mediaType}`}
              className="group"
            >
              <div className="overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/15">
                {item.posterPath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                    alt={item.title}
                    width={342}
                    height={513}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <p className="mt-2 truncate text-sm font-medium text-[#1d1d1f]">
                {item.title}
              </p>
              <p className="text-xs text-gray-400">
                {item.mediaType === "tv" ? "TV" : "映画"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
