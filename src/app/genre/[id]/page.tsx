import type { Metadata } from "next";
import { getMoviesByGenrePage, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

const GENRE_NAMES: Record<number, string> = {
  28: "アクション", 12: "アドベンチャー", 16: "アニメーション", 35: "コメディ",
  80: "犯罪", 99: "ドキュメンタリー", 18: "ドラマ", 10751: "ファミリー",
  14: "ファンタジー", 36: "歴史", 27: "ホラー", 10402: "音楽",
  9648: "ミステリー", 10749: "ロマンス", 878: "SF", 10770: "テレビ映画",
  53: "スリラー", 10752: "戦争", 37: "西部劇",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; page?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { page } = await searchParams;
  const genreName = GENRE_NAMES[Number(id)] || "ジャンル";
  const currentPage = Math.max(1, Number(page) || 1);
  return {
    title: `${genreName}の映画一覧`,
    description: `${genreName}ジャンルの人気映画・新作映画を一覧で紹介。`,
    alternates: {
      canonical: `https://ardcinema.com/genre/${id}${currentPage > 1 ? `?page=${currentPage}` : ""}`,
    },
  };
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { name, page } = await searchParams;
  const genreName = GENRE_NAMES[Number(id)] || name || "ジャンル";
  const currentPage = Math.max(1, Number(page) || 1);

  const { movies, totalPages } = await getMoviesByGenrePage(Number(id), currentPage);

  // 重複除去
  const seen = new Set<number>();
  const unique = movies.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;
  const baseQuery = `name=${encodeURIComponent(genreName)}`;

  return (
    <>
      {hasPrev && <link rel="prev" href={`/genre/${id}?${baseQuery}&page=${currentPage - 1}`} />}
      {hasNext && <link rel="next" href={`/genre/${id}?${baseQuery}&page=${currentPage + 1}`} />}
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 md:max-w-[1280px] md:mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/genres"
          className="text-sm text-gray-400 transition-colors hover:text-[#1d1d1f]"
        >
          ジャンル
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl">{genreName}</h1>
      </div>
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
              href={`/genre/${id}?${baseQuery}&page=${currentPage - 1}`}
              className="px-3 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
            >
              &lt; PREV
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm font-semibold text-gray-300">
              &lt; PREV
            </span>
          )}

          {/* ページ番号（現在ページの前後2ページ） */}
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
                  href={`/genre/${id}?${baseQuery}&page=${p}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-400 transition-colors hover:text-gray-900"
                >
                  {p}
                </Link>
              )
            ))}

          {hasNext ? (
            <Link
              href={`/genre/${id}?${baseQuery}&page=${currentPage + 1}`}
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
