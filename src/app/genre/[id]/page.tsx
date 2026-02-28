import { getMoviesByGenrePage, IMAGE_BASE_URL, BLUR_DATA_URL } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; page?: string }>;
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { name, page } = await searchParams;
  const genreName = name || "ジャンル";
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
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <div className="flex items-center gap-3">
        <Link
          href="/genres"
          className="text-sm text-gray-400 transition-colors hover:text-[#1d1d1f]"
        >
          ジャンル
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-[#1d1d1f]">{genreName}</h1>
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
              <div className="overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
                {movie.poster_path ? (
                  <Image
                    src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                    alt={title}
                    width={342}
                    height={513}
                    className="aspect-[2/3] w-full object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
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
      <div className="mt-10 flex items-center justify-center gap-4">
        {hasPrev ? (
          <Link
            href={`/genre/${id}?${baseQuery}&page=${currentPage - 1}`}
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
          >
            ← 前へ
          </Link>
        ) : (
          <span className="rounded-full border border-gray-100 px-6 py-2.5 text-sm font-medium text-gray-300">
            ← 前へ
          </span>
        )}

        <span className="text-sm font-semibold text-gray-800">{currentPage}</span>

        {hasNext ? (
          <Link
            href={`/genre/${id}?${baseQuery}&page=${currentPage + 1}`}
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
          >
            次へ →
          </Link>
        ) : (
          <span className="rounded-full border border-gray-100 px-6 py-2.5 text-sm font-medium text-gray-300">
            次へ →
          </span>
        )}
      </div>
    </main>
  );
}
