import type { Metadata } from "next";
import { getTrendingPeoplePage, getPersonBirthday } from "@/lib/tmdb";
import Link from "next/link";
import PeopleClient from "@/components/PeopleClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "注目の人物一覧",
  description: "今注目の俳優・監督・クリエイターをチェック。",
  alternates: {
    canonical: "https://ardcinema.com/people",
  },
};

export default async function PeoplePage() {
  const pages = await Promise.all([
    getTrendingPeoplePage(1),
    getTrendingPeoplePage(2),
    getTrendingPeoplePage(3),
  ]);

  const seen = new Set<number>();
  const allPeople = pages.flatMap((p) => p.people).filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const birthdays = await Promise.all(allPeople.map((p) => getPersonBirthday(p.id)));
  const peopleWithBirthday = allPeople.map((p, i) => ({ ...p, birthday: birthdays[i] }));

  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 md:max-w-[1280px] md:mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-gray-400 transition-colors hover:text-[#1d1d1f]">
          ホーム
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">注目の人物</h1>
      </div>
      <PeopleClient people={peopleWithBirthday} />
    </main>
  );
}
