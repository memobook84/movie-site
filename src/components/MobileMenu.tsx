"use client";

import Link from "next/link";
import { X, Home, CalendarDays, LayoutGrid, Film, ShieldCheck } from "lucide-react";
import { GiImperialCrown } from "react-icons/gi";
import { TiStopwatch } from "react-icons/ti";

const menuItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/genres", label: "ジャンル", icon: LayoutGrid },
  { href: "/selection", label: "セレクション", icon: Film },
  { href: "/ranking", label: "ランキング", icon: GiImperialCrown },
  { href: "/follows", label: "ウォッチリスト", icon: TiStopwatch },
  { href: "/privacy", label: "プライバシー", icon: ShieldCheck },
];


export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[90%] max-w-sm mx-auto px-[15px]" onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-white">メニュー</span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* メニューグリッド */}
        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex flex-col items-center justify-center gap-2"
              style={{
                background: "#ffffff",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(7px)",
                WebkitBackdropFilter: "blur(7px)",
                borderRadius: "10px",
                padding: "1.5rem 0.5rem",
              }}
            >
              <item.icon className="h-6 w-6 text-gray-700" />
              <span className="text-[11px] font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis text-center w-full">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
