"use client";

import { useState, useCallback, useEffect } from "react";

export default function TrailerModal({ videoKey }: { videoKey: string }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group/btn relative inline-flex items-center justify-center h-9 w-9 rounded-[30em] bg-white border-none overflow-hidden shadow-[6px_6px_12px_#c5c5c5,_-6px_-6px_12px_#ffffff] cursor-pointer xl:h-9 xl:w-auto xl:gap-1.5 xl:px-6"
        aria-label="トレーラーを見る"
      >
        <span className="absolute left-0 top-0 h-full w-0 rounded-[30em] bg-gradient-to-r from-[#7b2ff7] to-[#ff2d87] z-0 transition-all duration-500 ease-in-out group-hover/btn:w-full" />
        <svg className="relative z-10 h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="relative z-10 hidden xl:inline text-[13px] font-extrabold">トレーラー</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-[92vw] max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute -top-10 right-0 text-white text-3xl font-light hover:text-gray-300 transition-colors"
              aria-label="閉じる"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
