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
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto" onClick={onClose}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-lg font-bold text-gray-900">メニュー</span>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* メニューカード */}
      <div className="grid grid-cols-2 gap-3 p-4" onClick={(e) => e.stopPropagation()}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex flex-col items-center gap-2 rounded-xl bg-gray-100 p-4 text-center transition-colors hover:bg-gray-200 active:bg-gray-300"
          >
            <item.icon className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{item.label}</span>
            <span className="text-[11px] text-gray-500">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
