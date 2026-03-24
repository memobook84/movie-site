"use client";

import Link from "next/link";
import { X, Home, CalendarDays, Tent, Film, Trophy, Glasses, ShieldCheck } from "lucide-react";

const menuItems = [
  { href: "/", label: "ホーム", icon: Home, description: "トップページ" },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays, description: "公開予定の映画" },
  { href: "/genres", label: "ジャンル", icon: Tent, description: "ジャンルから探す" },
  { href: "/selection", label: "セレクション", icon: Film, description: "おすすめコレクション" },
  { href: "/ranking", label: "ランキング", icon: Trophy, description: "人気ランキング" },
  { href: "/follows", label: "ウォッチリスト", icon: Glasses, description: "お気に入りリスト" },
  { href: "/privacy", label: "プライバシーポリシー", icon: ShieldCheck, description: "個人情報の取り扱い" },
];

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      {/* ポップアップ */}
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">メニュー</span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* メニューカード */}
        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex flex-col items-center gap-2 rounded-[5px] border-2 border-[#323232] bg-white p-3 text-center transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95"
              style={{ boxShadow: '4px 4px #323232' }}
            >
              <item.icon className="h-7 w-7 text-[#323232]" />
              <span className="text-[11px] font-medium text-[#323232]">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
