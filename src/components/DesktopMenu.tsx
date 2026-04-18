"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const mainItems = [
  { href: "/", label: "Home", ja: "ホーム" },
  { href: "/schedule", label: "Schedule", ja: "スケジュール" },
  { href: "/streaming", label: "Streaming", ja: "ストリーミング" },
  { href: "/genres", label: "Genres", ja: "ジャンル" },
  { href: "/selection", label: "Selection", ja: "セレクション" },
  { href: "/ranking", label: "Ranking", ja: "ランキング" },
  { href: "/follows", label: "Watchlist", ja: "ウォッチリスト" },
  { href: "/people", label: "People", ja: "注目の人物" },
  { href: "/classics", label: "Classics", ja: "不朽の名作" },
];

const qrImages = ["/qr-illustration.png", "/qr-illustration2.png"];

export default function DesktopMenu({ onClose }: { onClose: () => void }) {
  const [showQR, setShowQR] = useState(false);
  const [qrSrc, setQrSrc] = useState("");

  useEffect(() => {
    setQrSrc(qrImages[Math.floor(Math.random() * qrImages.length)]);
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-[#E6A723] flex flex-col px-16 py-12"
        onClick={onClose}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-8 right-10 p-2 text-[#B01E14]"
        >
          <X className="h-6 w-6" />
        </button>

        {/* メインメニュー（左・大） */}
        <div
          className="flex flex-col items-start justify-between flex-1 min-h-0"
          onClick={(e) => e.stopPropagation()}
        >
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-center gap-6 text-white hover:text-[#B01E14] font-black tracking-widest transition-colors duration-200 leading-none py-0.5"
              style={{ fontSize: "clamp(2.5rem, 6.5vh, 6.5rem)" }}
            >
              {item.label}
              <span className="text-2xl font-bold tracking-normal opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#B01E14]">
                {item.ja}
              </span>
            </Link>
          ))}
        </div>

        {/* サブメニュー（右下・小） */}
        <div
          className="flex items-center justify-end gap-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowQR(true)}
            className="text-white/70 hover:text-[#B01E14] text-sm font-bold tracking-widest transition-colors duration-200"
          >
            QR Code
          </button>
          <Link
            href="/privacy"
            onClick={onClose}
            className="text-white/70 hover:text-[#B01E14] text-sm font-bold tracking-widest transition-colors duration-200"
          >
            Privacy
          </Link>
        </div>
      </div>

      {/* QRポップアップ */}
      {showQR && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="QR Code" className="w-[500px] h-auto" />
          </div>
        </div>
      )}
    </>
  );
}
