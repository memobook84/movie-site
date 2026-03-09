"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGenres = pathname.startsWith("/genre");
  const isSelection = pathname === "/selection";
  const isFollows = pathname === "/follows";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-[#DCDCDC] pb-[env(safe-area-inset-bottom)] lg:hidden">
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
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={isGenres ? "2" : "1.5"} viewBox="0 0 24 24">
            <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-[10px] ${isGenres ? "font-semibold" : ""}`}>ジャンル</span>
        </Link>

        {/* セレクション */}
        <Link
          href="/selection"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
            isSelection ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={isSelection ? "2" : "1.5"} viewBox="0 0 24 24">
            <path d="M6 3h12l4 7-10 11L2 10l4-7z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 10h20M12 21L8 10l4-7 4 7-4 11z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-[10px] ${isSelection ? "font-semibold" : ""}`}>セレクション</span>
        </Link>

        {/* ウォッチリスト */}
        <Link
          href="/follows"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
            isFollows ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={isFollows ? "2" : "1.5"} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-[10px] ${isFollows ? "font-semibold" : ""}`}>リスト</span>
        </Link>
      </div>
    </div>
  );
}
