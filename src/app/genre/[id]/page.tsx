import { getMoviesByGenre, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { name } = await searchParams;
  const genreName = name || "ジャンル";

  // 3ページ分取得して多めに表示
  const movies = await getMoviesByGenre(Number(id), 3);

  // 重複除去
  const seen = new Set<number>();
  const unique = movies.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

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
      <p className="mt-2 text-sm text-gray-400">{unique.length} 作品</p>

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
    </main>
  );
}
