"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

export default function ScrollableRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    check();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="relative group/scroll">
      <div
        ref={ref}
        className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {children}
      </div>

      {canLeft && (
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-black hover:shadow-xl transition-all opacity-0 group-hover/scroll:opacity-100 z-10"
          aria-label="左へスクロール"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {canRight && (
        <button
          onClick={() => scroll(1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-black hover:shadow-xl transition-all opacity-0 group-hover/scroll:opacity-100 z-10"
          aria-label="右へスクロール"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
