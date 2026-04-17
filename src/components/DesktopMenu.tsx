"use client";

import Link from "next/link";
import { X } from "lucide-react";

const menuItems = [
  { href: "/", label: "Home", ja: "ホーム" },
  { href: "/schedule", label: "Schedule", ja: "スケジュール" },
  { href: "/streaming", label: "Streaming", ja: "ストリーミング" },
  { href: "/genres", label: "Genres", ja: "ジャンル" },
  { href: "/selection", label: "Selection", ja: "セレクション" },
  { href: "/ranking", label: "Ranking", ja: "ランキング" },
  { href: "/follows", label: "Watchlist", ja: "ウォッチリスト" },
  { href: "/people", label: "People", ja: "注目の人物" },
  { href: "/classics", label: "Classics", ja: "不朽の名作" },
  { href: "/qr", label: "QR Code", ja: "QRコード" },
  { href: "/privacy", label: "Privacy", ja: "プライバシー" },
];

export default function DesktopMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-1 py-12 px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="group flex items-center gap-6 text-white hover:text-[#E6A723] text-3xl font-bold tracking-widest transition-colors duration-200 py-1"
          >
            {item.label}
            <span className="text-sm font-bold tracking-normal opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#E6A723]">
              {item.ja}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
