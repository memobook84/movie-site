"use client";

import { useRef } from "react";
import Link from "next/link";
import { Person } from "@/lib/tmdb";
import PersonCard from "./PersonCard";

interface PeopleRowProps {
  title: string;
  subtitle?: string;
  people: Person[];
  href?: string;
}

export default function PeopleRow({ title, subtitle, people, href }: PeopleRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -700 : 700;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3 px-6 md:px-16">
      {title && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide text-[#1d1d1f] md:text-xl">
              {title}
            </h2>
            {href && (
              <Link href={href} className="text-xs font-medium text-gray-400 transition-colors hover:text-[#1d1d1f] md:text-sm">
                一覧を見る →
              </Link>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 md:text-xs">{subtitle}</p>
          )}
        </div>
      )}
      <div className="group/row relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/3 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-lg backdrop-blur-sm transition-all hover:bg-black/10 group-hover/row:flex"
          aria-label="左にスクロール"
        >
          ‹
        </button>
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide md:gap-6"
          style={{ scrollbarWidth: "none" }}
        >
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/3 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-lg backdrop-blur-sm transition-all hover:bg-black/10 group-hover/row:flex"
          aria-label="右にスクロール"
        >
          ›
        </button>
      </div>
    </div>
  );
}
