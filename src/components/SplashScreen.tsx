"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"film" | "logo" | "fadeout" | "done">("film");

  useEffect(() => {
    // 初回訪問 or PWA起動時のみ表示
    const shown = sessionStorage.getItem("splash_shown");
    if (shown) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("splash_shown", "1");

    const t1 = setTimeout(() => setPhase("logo"), 1000);
    const t2 = setTimeout(() => setPhase("fadeout"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* フィルムリール演出 */}
      {phase === "film" && (
        <div className="flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
          {/* 左フィルムストリップ */}
          <div className="flex flex-col gap-1.5 mr-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-5 rounded-sm bg-gray-600 animate-[filmScroll_0.8s_linear_infinite]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* 中央フレーム */}
          <div className="relative flex h-32 w-44 items-center justify-center rounded border-2 border-gray-500">
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-sm bg-gray-400 animate-[flicker_0.4s_ease-in-out_infinite_alternate]"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div className="mt-2 h-[1px] w-16 bg-gray-500" />
              <div className="mt-1 h-[1px] w-12 bg-gray-600" />
            </div>
            {/* プロジェクター光線 */}
            <div className="absolute -top-8 left-1/2 h-6 w-1 -translate-x-1/2 bg-gradient-to-b from-yellow-400/60 to-transparent" />
          </div>

          {/* 右フィルムストリップ */}
          <div className="flex flex-col gap-1.5 ml-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-5 rounded-sm bg-gray-600 animate-[filmScroll_0.8s_linear_infinite]"
                style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ロゴ登場 */}
      {(phase === "logo" || phase === "fadeout") && (
        <div className="flex flex-col items-center gap-4 animate-[zoomIn_0.6s_cubic-bezier(0.16,1,0.3,1)]">
          <img
            src="/apple-touch-icon.png"
            alt="ARD CINEMA"
            className="h-20 w-20 rounded-2xl"
          />
          <div className="text-center">
            <p className="text-xl font-semibold tracking-[0.25em] text-white">
              ARD CINEMA
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
