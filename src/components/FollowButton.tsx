"use client";

import { useEffect, useState } from "react";
import { Glasses } from "lucide-react";

interface FollowButtonProps {
  movieId: number;
  title: string;
  posterPath: string | null;
  mediaType?: string;
}

export interface FollowedItem {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: string;
  followedAt: number;
}

const STORAGE_KEY = "cinema_followed";

export function getFollowed(): FollowedItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setFollowed(items: FollowedItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function FollowButton({ movieId, title, posterPath, mediaType = "movie" }: FollowButtonProps) {
  const [followed, setFollowedState] = useState(false);

  useEffect(() => {
    const list = getFollowed();
    setFollowedState(list.some((item) => item.id === movieId && item.mediaType === mediaType));
  }, [movieId, mediaType]);

  const toggle = () => {
    const list = getFollowed();
    if (followed) {
      const updated = list.filter((item) => !(item.id === movieId && item.mediaType === mediaType));
      setFollowed(updated);
      setFollowedState(false);
    } else {
      list.push({ id: movieId, title, posterPath, mediaType, followedAt: Date.now() });
      setFollowed(list);
      setFollowedState(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center justify-center h-11 w-11 rounded-full border transition-all xl:h-auto xl:w-auto xl:gap-1.5 xl:px-4 xl:py-2 ${
        followed
          ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
      aria-label={followed ? "ウォッチリストに追加済み" : "ウォッチリストに追加"}
    >
      <Glasses className="h-4 w-4" strokeWidth={2} />
      <span className="hidden xl:inline text-sm font-semibold">ウォッチリスト</span>
    </button>
  );
}
