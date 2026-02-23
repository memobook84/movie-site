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
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
        followed
          ? "bg-white text-black hover:bg-white/90"
          : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
      }`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill={followed ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {followed ? "フォロー中" : "フォロー"}
    </button>
  );
}
