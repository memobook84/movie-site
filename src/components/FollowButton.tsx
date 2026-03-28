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
      className={`inline-flex items-center justify-center h-[50px] w-[50px] rounded-[2px] border-none cursor-pointer transition-colors duration-300 ${followed ? "bg-[#2753a7]" : "bg-[#313638] hover:bg-[#2753a7]"}`}
      aria-label={followed ? "ウォッチリストに追加済み" : "ウォッチリストに追加"}
    >
      <TiStopwatch className="h-[26px] w-[26px] text-white" />
    </button>
  );
}
