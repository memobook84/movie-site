"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, CalendarDays, LayoutGrid, SquareMenu, ChevronLeft } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isSchedule = pathname === "/schedule";
  const isGenres = pathname.startsWith("/genre");
  const isMenu = pathname === "/menu";

  const navItems = [
    { href: "/", icon: Home, active: isHome },
    { href: "/schedule", icon: CalendarDays, active: isSchedule },
    { href: "/genres", icon: LayoutGrid, active: isGenres },
    { href: "/menu", icon: SquareMenu, active: isMenu },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 xl:hidden">
      <div className="mx-auto max-w-md rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] px-4 py-2.5">
        <div className="flex items-center justify-around">
          {/* 戻る */}
          <button
            onClick={() => router.back()}
            className="flex flex-col items-center gap-1.5 px-3 py-1 h-10 justify-center"
          >
            <ChevronLeft className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
            <div className="h-0.5 w-5 rounded-full bg-transparent" />
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1.5 px-3 py-1 h-10 justify-center"
              >
                <Icon
                  className={`h-6 w-6 ${item.active ? "text-gray-900" : "text-gray-400"}`}
                  strokeWidth={item.active ? 2 : 1.5}
                />
                <div className={`h-0.5 w-5 rounded-full ${item.active ? "bg-gray-900" : "bg-transparent"}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
