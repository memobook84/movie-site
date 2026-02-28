"use client";

import { useEffect, useState } from "react";

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
      className={`inline-flex items-center justify-center h-11 w-11 rounded-full border transition-all md:h-auto md:w-auto md:gap-2 md:px-7 md:py-3 ${
        followed
          ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
      aria-label={followed ? "フォロー中" : "フォロー"}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill={followed ? "currentColor" : "none"} stroke={followed ? "currentColor" : "#9ca3af"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="hidden md:inline text-sm font-semibold">{followed ? "フォロー中" : "フォロー"}</span>
    </button>
  );
}
