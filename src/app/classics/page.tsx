import type { Metadata } from "next";
import { getTopRatedPage } from "@/lib/tmdb";
import Link from "next/link";
import ClassicsClient from "@/components/ClassicsClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "不朽の名作一覧",
  description: "映画史に残る名作・高評価作品を一覧で紹介。",
  alternates: {
    canonical: "https://ardcinema.com/classics",
  },
};

export default async function ClassicsPage() {
  const pages = await Promise.all(
    Array.from({ length: 15 }, (_, i) => getTopRatedPage(i + 1))
  );

  const seen = new Set<number>();
  const allMovies = pages.flatMap((p) => p.movies).filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 md:max-w-[1280px] md:mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-gray-400 transition-colors hover:text-[#1d1d1f]">
          ホーム
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl">不朽の名作</h1>
      </div>
      <ClassicsClient movies={allMovies} />
    </main>
  );
}
