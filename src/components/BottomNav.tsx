"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Film, Glasses, Tent } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGenres = pathname.startsWith("/genre");
  const isSelection = pathname === "/selection";
  const isFollows = pathname === "/follows";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-[#DCDCDC] pb-[env(safe-area-inset-bottom)] xl:hidden">
      <div className="flex items-center justify-around py-2">
        {/* 戻る */}
        <button
          onClick={() => router.back()}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400 transition-colors hover:text-gray-800"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px]">戻る</span>
        </button>

        {/* ホーム */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
            isHome ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={isHome ? "2" : "1.5"} viewBox="0 0 24 24">
            <path d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-[10px] ${isHome ? "font-semibold" : ""}`}>ホーム</span>
        </Link>

        {/* ジャンル */}
        <Link
          href="/genres"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
            isGenres ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Tent className="h-6 w-6" strokeWidth={isGenres ? 2 : 1.5} />
          <span className={`text-[10px] ${isGenres ? "font-semibold" : ""}`}>ジャンル</span>
        </Link>

        {/* セレクション */}
        <Link
          href="/selection"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
            isSelection ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Film className="h-6 w-6" strokeWidth={isSelection ? 2 : 1.5} />
          <span className={`text-[10px] ${isSelection ? "font-semibold" : ""}`}>セレクション</span>
        </Link>

        {/* ウォッチリスト */}
        <Link
          href="/follows"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
            isFollows ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Glasses className="h-6 w-6" strokeWidth={isFollows ? 2 : 1.5} />
          <span className={`text-[10px] ${isFollows ? "font-semibold" : ""}`}>リスト</span>
        </Link>
      </div>
    </div>
  );
}
