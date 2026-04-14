import type { Metadata } from "next";
import { getUpcomingJP, getNowPlayingJP } from "@/lib/tmdb";
import ScheduleTabs from "@/components/ScheduleTabs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "日本公開スケジュール",
  description: "日本で現在上映中・公開予定の映画一覧。話題の最新作をチェック。",
};

export default async function SchedulePage() {
  const [nowPlaying, upcoming] = await Promise.all([
    getNowPlayingJP(),
    getUpcomingJP(),
  ]);

  return (
    <main className="min-h-screen bg-white pt-14 md:pt-24 pb-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <h1 className="text-lg font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl">
          日本公開スケジュール
        </h1>
        <p className="mt-1 text-xs text-gray-400 md:text-sm">
          日本で上映中・近日公開予定の映画
        </p>

        <ScheduleTabs nowPlaying={nowPlaying} upcoming={upcoming} />
      </div>
    </main>
  );
}
