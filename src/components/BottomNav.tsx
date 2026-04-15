"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, SquareMenu, ChevronLeft } from "lucide-react";
import { PiBinocularsFill } from "react-icons/pi";
import { AiOutlineVideoCamera } from "react-icons/ai";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isSchedule = pathname === "/schedule";
  const isFollows = pathname === "/follows";
  const isMenu = pathname === "/menu";

  const navItems = [
    { href: "/", icon: Home, active: isHome },
    { href: "/schedule", icon: AiOutlineVideoCamera, active: isSchedule },
    { href: "/follows", icon: PiBinocularsFill, active: isFollows },
    { href: "/menu", icon: SquareMenu, active: isMenu },
  ];

  const activeIndex = navItems.findIndex((item) => item.active);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) {
      setPillStyle(null);
      return;
    }
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    });
  }, [activeIndex, pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 xl:hidden">
      <div className="mx-auto max-w-md rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] px-4 py-2.5">
        <div ref={containerRef} className="relative flex items-center justify-around">
          {/* スライドするカプセル背景 */}
          {pillStyle && (
            <div
              className="absolute top-0 h-10 rounded-full bg-gray-100 transition-all duration-400 ease-in-out"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
              }}
            />
          )}

          {/* 戻る */}
          <button
            onClick={() => router.back()}
            className="relative z-10 flex items-center justify-center h-10 w-10 rounded-full transition-transform duration-200 active:scale-75"
          >
            <ChevronLeft className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
          </button>

          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative z-10 flex items-center justify-center h-10 px-5 rounded-full transition-transform duration-200 active:scale-75"
              >
                <Icon
                  className={`h-6 w-6 transition-colors duration-300 ${item.active ? "text-gray-900" : "text-gray-400"}`}
                  strokeWidth={item.active ? 2 : 1.5}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
