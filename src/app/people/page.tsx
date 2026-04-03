import type { Metadata } from "next";
import { getTrendingPeoplePage, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "注目の人物一覧",
  description: "今注目の俳優・監督・クリエイターをチェック。",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PeoplePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { people, totalPages } = await getTrendingPeoplePage(currentPage);

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-gray-400 transition-colors hover:text-[#1d1d1f]"
        >
          ホーム
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">注目の人物</h1>
      </div>
      <p className="mt-2 text-sm text-gray-400">ページ {currentPage} / {totalPages}</p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {people.map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group"
          >
            <div className="overflow-hidden rounded-[4px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
              {person.profile_path ? (
                <img
                  src={`${IMAGE_BASE_URL}/w342${person.profile_path}`}
                  alt={person.name}
                  className="aspect-[2/3] w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <p className="mt-1.5 truncate text-xs font-medium text-[#1d1d1f]">{person.name}</p>
            <p className="truncate text-[10px] text-gray-400">
              {person.known_for_department === "Acting" ? "俳優" : person.known_for_department === "Directing" ? "監督" : person.known_for_department}
            </p>
          </Link>
        ))}
      </div>

      {/* ページネーション */}
      <div className="mt-10">
        <div className="flex items-center justify-center gap-2">
          {hasPrev ? (
            <Link
              href={`/people?page=${currentPage - 1}`}
              className="px-3 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
            >
              &lt; PREV
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm font-semibold text-gray-300">
              &lt; PREV
            </span>
          )}

          {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
            .filter((p) => p >= 1 && p <= totalPages)
            .map((p) => (
              p === currentPage ? (
                <span
                  key={p}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-white"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={`/people?page=${p}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-400 transition-colors hover:text-gray-900"
                >
                  {p}
                </Link>
              )
            ))}

          {hasNext ? (
            <Link
              href={`/people?page=${currentPage + 1}`}
              className="px-3 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
            >
              NEXT &gt;
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm font-semibold text-gray-300">
              NEXT &gt;
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
