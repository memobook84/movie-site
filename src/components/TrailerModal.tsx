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
        className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gray-900 text-white transition-all hover:bg-gray-800 hover:shadow-lg xl:h-auto xl:w-auto xl:gap-2 xl:px-7 xl:py-3"
        aria-label="トレーラーを見る"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="hidden xl:inline text-sm font-semibold">トレーラー</span>
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
