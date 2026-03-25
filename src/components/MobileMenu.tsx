"use client";

import Link from "next/link";
import { X, Home, CalendarDays, LayoutGrid, Film, Glasses, ShieldCheck } from "lucide-react";
import { GiImperialCrown } from "react-icons/gi";

const menuItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/genres", label: "ジャンル", icon: LayoutGrid },
  { href: "/selection", label: "セレクション", icon: Film },
  { href: "/ranking", label: "ランキング", icon: GiImperialCrown },
  { href: "/follows", label: "ウォッチリスト", icon: Glasses },
  { href: "/privacy", label: "プライバシー", icon: ShieldCheck },
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
              className="menu-card flex flex-col items-center gap-2 p-2.5 text-center w-full"
            >
              <div className="menu-card__shine" />
              <div className="menu-card__glow" />
              <div className="relative z-[2] flex flex-col items-center gap-2 w-full">
                <div className="w-full h-12 rounded-lg bg-white flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-gray-700" />
                </div>
                <span className="text-[11px] font-medium text-gray-800">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
