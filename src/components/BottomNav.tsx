"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-[#f0f0f0] pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around py-2">
        {/* 戻る */}
        <button
          onClick={() => router.back()}
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-400 transition-colors hover:text-gray-800"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px]">戻る</span>
        </button>

        {/* ホーム */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors hover:text-gray-800 ${
            isHome ? "text-gray-800" : "text-gray-400"
          }`}
        >
          <svg className="h-6 w-6" fill={isHome ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px]">ホーム</span>
        </Link>

        {/* フォロー */}
        <Link
          href="/follows"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors hover:text-gray-800 ${
            pathname === "/follows" ? "text-gray-800" : "text-gray-400"
          }`}
        >
          <svg className="h-6 w-6" fill={pathname === "/follows" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px]">フォロー</span>
        </Link>
      </div>
    </div>
  );
}
