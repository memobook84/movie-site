"use client";

import { useEffect, useState } from "react";
import { TiStopwatch } from "react-icons/ti";

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
      className="group/btn relative inline-flex items-center justify-center h-9 w-9 rounded-[30em] bg-white border-none overflow-hidden shadow-[6px_6px_12px_#c5c5c5,_-6px_-6px_12px_#ffffff] cursor-pointer xl:h-9 xl:w-auto xl:gap-1.5 xl:px-6"
      aria-label={followed ? "ウォッチリストに追加済み" : "ウォッチリストに追加"}
    >
      <span className={`absolute left-0 top-0 h-full rounded-[30em] bg-gradient-to-r from-[#7b2ff7] to-[#ff2d87] z-0 transition-all duration-500 ease-in-out group-hover/btn:w-full ${followed ? "w-full" : "w-0"}`} />
      <TiStopwatch className={`relative z-10 h-3.5 w-3.5 ${followed ? "text-white" : ""}`} />
      <span className={`relative z-10 hidden xl:inline text-[13px] font-extrabold ${followed ? "text-white" : ""}`}>ウォッチリスト</span>
    </button>
  );
}
