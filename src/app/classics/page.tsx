import type { Metadata } from "next";
import { getTopRatedPage, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  return {
    title: "不朽の名作一覧",
    description: "映画史に残る名作・高評価作品を一覧で紹介。",
    alternates: {
      canonical: `https://ardcinema.com/classics${currentPage > 1 ? `?page=${currentPage}` : ""}`,
    },
  };
}

export default async function ClassicsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { movies, totalPages } = await getTopRatedPage(currentPage);

  // 重複除去
  const seen = new Set<number>();
  const unique = movies.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <>
      {hasPrev && <link rel="prev" href={`/classics?page=${currentPage - 1}`} />}
      {hasNext && <link rel="next" href={`/classics?page=${currentPage + 1}`} />}
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 md:max-w-[1280px] md:mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-gray-400 transition-colors hover:text-[#1d1d1f]"
        >
          ホーム
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">不朽の名作</h1>
      </div>
      <p className="mt-2 text-sm text-gray-400">ページ {currentPage} / {totalPages}</p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {unique.map((movie) => {
          const title = movie.title || movie.name || "";
          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-[4px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                    alt={title}
                    className="aspect-[2/3] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <p className="mt-1.5 truncate text-xs font-medium text-[#1d1d1f]">{title}</p>
            </Link>
          );
        })}
      </div>

      {/* ページネーション */}
      <div className="mt-10">
        <div className="flex items-center justify-center gap-2">
          {hasPrev ? (
            <Link
              href={`/classics?page=${currentPage - 1}`}
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
                  href={`/classics?page=${p}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-400 transition-colors hover:text-gray-900"
                >
                  {p}
                </Link>
              )
            ))}

          {hasNext ? (
            <Link
              href={`/classics?page=${currentPage + 1}`}
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
    </>
  );
}
