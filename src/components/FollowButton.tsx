"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { PiEyeglassesFill } from "react-icons/pi";

interface FollowButtonProps {
  movieId: number;
  title: string;
  posterPath: string | null;
  mediaType?: string;
  year?: string;
  runtime?: number;
  providers?: { logo_path: string; provider_name: string }[];
}

export interface FollowedItem {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: string;
  followedAt: number;
  year?: string;
  runtime?: number;
  providers?: { logo_path: string; provider_name: string }[];
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

export function removeFollowed(id: number, mediaType: string) {
  const updated = getFollowed().filter((item) => !(item.id === id && item.mediaType === mediaType));
  setFollowed(updated);
}

export default function FollowButton({ movieId, title, posterPath, mediaType = "movie", year, runtime, providers }: FollowButtonProps) {
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
      list.push({ id: movieId, title, posterPath, mediaType, followedAt: Date.now(), year, runtime, providers });
      setFollowed(list);
      setFollowedState(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center justify-center h-10 w-10 rounded border-none cursor-pointer transition-all ${followed ? "bg-[#E6A723] text-gray-900" : "bg-gray-50 hover:bg-gray-100 text-gray-900"}`}
      aria-label={followed ? "ウォッチリストに追加済み" : "ウォッチリストに追加"}
    >
      {followed ? (
        <PiEyeglassesFill className="h-5 w-5 shrink-0" />
      ) : (
        <FiPlus className="h-5 w-5 shrink-0" />
      )}
    </button>
  );
}
