import type { Metadata } from "next";
import { getTrending, getPopular, getPopularJP, getTopRated } from "@/lib/tmdb";
import RankingClient from "./RankingClient";

export const metadata: Metadata = {
  title: "映画ランキング",
  description: "今話題のトレンド映画、人気映画、高評価映画のランキングをチェック。",
  alternates: { canonical: "https://ardcinema.com/ranking" },
};

export default async function RankingPage() {
  const [popularJP, trending, popular, topRated] = await Promise.all([
    getPopularJP(),
    getTrending(),
    getPopular(),
    getTopRated(),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-14 md:pt-24 pb-28 px-6 md:px-16 md:max-w-[1280px] md:mx-auto">
      <h1 className="text-lg font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl">
        ランキング
      </h1>
      <p className="mt-1 text-xs text-gray-400 md:text-sm">
        カテゴリ別の映画・ドラマランキング
      </p>
      <RankingClient
        popularJP={popularJP}
        trending={trending}
        popular={popular}
        topRated={topRated}
      />
    </main>
  );
}
