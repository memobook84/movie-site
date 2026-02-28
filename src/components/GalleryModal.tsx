"use client";

import { useState } from "react";

interface GalleryImage {
  file_path: string;
  width: number;
  height: number;
}

interface GalleryModalProps {
  images: GalleryImage[];
  imageBase: string;
}

export default function GalleryModal({ images, imageBase }: GalleryModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      {/* ギャラリーボタン */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 md:h-auto md:w-auto md:gap-2 md:px-7 md:py-3"
        aria-label="ピクチャー"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="hidden md:inline text-sm font-semibold">ピクチャー</span>
      </button>

      {/* ポップアップ */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => { setOpen(false); setSelected(null); }}
        >
          <div
            className="relative mx-4 max-h-[85vh] w-full max-w-4xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                ギャラリー
                <span className="ml-2 text-sm font-normal text-gray-400">{images.length}枚</span>
              </h3>
              <button
                onClick={() => { setOpen(false); setSelected(null); }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* コンテンツ */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(85vh - 65px)" }}>
              {selected !== null ? (
                /* 拡大表示 */
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => setSelected(null)}
                    className="self-start rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-800"
                  >
                    ← 一覧に戻る
                  </button>
                  <img
                    src={`${imageBase}/original${images[selected].file_path}`}
                    alt=""
                    className="max-h-[70vh] w-auto rounded-lg object-contain"
                  />
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelected(Math.max(0, selected - 1))}
                      disabled={selected === 0}
                      className="rounded-full bg-gray-800 p-2 text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-30"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <span className="text-sm text-gray-400">{selected + 1} / {images.length}</span>
                    <button
                      onClick={() => setSelected(Math.min(images.length - 1, selected + 1))}
                      disabled={selected === images.length - 1}
                      className="rounded-full bg-gray-800 p-2 text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-30"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* グリッド表示 */
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((img, i) => (
                    <button
                      key={img.file_path}
                      onClick={() => setSelected(i)}
                      className="group relative overflow-hidden rounded-lg bg-gray-900"
                      style={{ aspectRatio: img.width > img.height ? "16/10" : "2/3" }}
                    >
                      <img
                        src={`${imageBase}/w500${img.file_path}`}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
