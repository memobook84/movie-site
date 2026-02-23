"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GENRE_LIST = [
  { id: 28, name: "アクション" },
  { id: 12, name: "アドベンチャー" },
  { id: 16, name: "アニメーション" },
  { id: 35, name: "コメディ" },
  { id: 80, name: "犯罪" },
  { id: 99, name: "ドキュメンタリー" },
  { id: 18, name: "ドラマ" },
  { id: 10751, name: "ファミリー" },
  { id: 14, name: "ファンタジー" },
  { id: 36, name: "歴史" },
  { id: 27, name: "ホラー" },
  { id: 10402, name: "音楽" },
  { id: 9648, name: "ミステリー" },
  { id: 10749, name: "ロマンス" },
  { id: 878, name: "SF" },
  { id: 10770, name: "テレビ映画" },
  { id: 53, name: "スリラー" },
  { id: 10752, name: "戦争" },
  { id: 37, name: "西部劇" },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface PlacedGenre {
  id: number;
  name: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
}

export default function GenresPage() {
  const [items, setItems] = useState<PlacedGenre[]>([]);

  useEffect(() => {
    const seed = Date.now();
    const placed: PlacedGenre[] = GENRE_LIST.map((genre, i) => {
      const r = (n: number) => seededRandom(seed + i * 100 + n);
      return {
        ...genre,
        x: 5 + r(1) * 70,
        y: 2 + (i / GENRE_LIST.length) * 80 + (r(2) - 0.5) * 15,
        size: 24 + r(3) * 28,
        rotate: (r(4) - 0.5) * 12,
      };
    });
    setItems(placed);
  }, []);

  if (items.length === 0) return <main className="min-h-screen" />;

  return (
    <main className="relative min-h-screen pt-20 pb-28">
      <div className="relative w-full" style={{ height: "85vh" }}>
        {items.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="absolute font-bold text-[#1d1d1f] transition-all duration-300 hover:text-[#3d1018] hover:scale-110"
            style={{
              left: `${genre.x}%`,
              top: `${genre.y}%`,
              fontSize: `${genre.size}px`,
              transform: `rotate(${genre.rotate}deg)`,
            }}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
