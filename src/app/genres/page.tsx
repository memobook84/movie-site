import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ジャンル一覧",
  description: "アクション、SF、ホラー、ロマンスなど全19ジャンルから映画を探そう。",
};
import {
  Zap, Compass, Sparkles, Laugh, SearchCheck,
  Film, Drama, Home, Wand2, Landmark,
  Moon, Music, Eye, Heart, Rocket,
  Tv, Flame, Swords, Sun,
} from "lucide-react";
import { ComponentType } from "react";

interface Genre {
  id: number;
  name: string;
  icon: ComponentType<{ className?: string }>;
}

const GENRE_LIST: Genre[] = [
  { id: 28, name: "アクション", icon: Zap },
  { id: 12, name: "アドベンチャー", icon: Compass },
  { id: 16, name: "アニメーション", icon: Sparkles },
  { id: 35, name: "コメディ", icon: Laugh },
  { id: 80, name: "犯罪", icon: SearchCheck },
  { id: 99, name: "ドキュメンタリー", icon: Film },
  { id: 18, name: "ドラマ", icon: Drama },
  { id: 10751, name: "ファミリー", icon: Home },
  { id: 14, name: "ファンタジー", icon: Wand2 },
  { id: 36, name: "歴史", icon: Landmark },
  { id: 27, name: "ホラー", icon: Moon },
  { id: 10402, name: "音楽", icon: Music },
  { id: 9648, name: "ミステリー", icon: Eye },
  { id: 10749, name: "ロマンス", icon: Heart },
  { id: 878, name: "SF", icon: Rocket },
  { id: 10770, name: "テレビ映画", icon: Tv },
  { id: 53, name: "スリラー", icon: Flame },
  { id: 10752, name: "戦争", icon: Swords },
  { id: 37, name: "西部劇", icon: Sun },
];

export default function GenresPage() {
  return (
    <main className="min-h-screen pt-24 pb-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
      <h1 className="text-2xl font-bold text-[#1d1d1f]">ジャンル</h1>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 max-w-4xl mx-auto">
        {GENRE_LIST.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="group relative flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-[17px] border border-white px-2 text-center font-extrabold text-black select-none cursor-pointer transition-all duration-500 hover:border-black hover:scale-105 active:scale-95 active:rotate-[1.7deg] md:gap-3 md:px-4"
              style={{ background: 'rgba(217, 217, 217, 0.58)', boxShadow: '12px 17px 51px rgba(0, 0, 0, 0.22)', backdropFilter: 'blur(6px)' }}
            >
              <Icon className="h-7 w-7 text-[#3d1018]/70 transition-all duration-300 group-hover:text-[#3d1018] group-hover:scale-110 md:h-8 md:w-8" />
              <span className="text-[11px] font-semibold text-[#1d1d1f] md:text-sm">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
      </div>
    </main>
  );
}
