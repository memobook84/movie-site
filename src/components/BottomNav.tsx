"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, CalendarDays, LayoutGrid, SquareMenu } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isSchedule = pathname === "/schedule";
  const isGenres = pathname.startsWith("/genre");

  return (
    <>
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
            <Home className="h-6 w-6" strokeWidth={isHome ? 2 : 1.5} />
            <span className={`text-[10px] ${isHome ? "font-semibold" : ""}`}>ホーム</span>
          </Link>

          {/* スケジュール */}
          <Link
            href="/schedule"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
              isSchedule ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <CalendarDays className="h-6 w-6" strokeWidth={isSchedule ? 2 : 1.5} />
            <span className={`text-[10px] ${isSchedule ? "font-semibold" : ""}`}>スケジュール</span>
          </Link>

          {/* ジャンル */}
          <Link
            href="/genres"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors hover:text-gray-800 ${
              isGenres ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <LayoutGrid className="h-6 w-6" strokeWidth={isGenres ? 2 : 1.5} />
            <span className={`text-[10px] ${isGenres ? "font-semibold" : ""}`}>ジャンル</span>
          </Link>

          {/* メニュー */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400 transition-colors hover:text-gray-800"
          >
            <SquareMenu className="h-6 w-6" strokeWidth={1.5} />
            <span className="text-[10px]">メニュー</span>
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
