import { getMovieDetail, getTvDetail, IMAGE_BASE_URL } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "レビュー | CINEMA",
  description: "スペシャルレビュー付きの作品一覧",
};

// レビューがある作品のリスト
const REVIEWED_ITEMS: { id: number; type: "movie" | "tv" }[] = [
  { id: 280, type: "movie" },
  { id: 1396, type: "tv" },
  { id: 129, type: "movie" },
];

export default async function ReviewsPage() {
  const movies = await Promise.all(
    REVIEWED_ITEMS.map((item) =>
      item.type === "tv" ? getTvDetail(item.id) : getMovieDetail(item.id)
    )
  );

  return (
    <main className="min-h-screen bg-white pt-24 pb-28 px-6 md:px-16">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
        レビュー
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        スペシャルレビュー付きの作品
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie, i) => {
          const title = movie.title || movie.name || "";
          const item = REVIEWED_ITEMS[i];
          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}?type=${item.type}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/15">
                {movie.poster_path ? (
                  <Image
                    src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                    alt={title}
                    width={342}
                    height={513}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-xs text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <div className="rounded-full bg-yellow-400 px-2.5 py-1">
                    <span className="text-[10px] font-bold tracking-wider text-gray-900">SPECIAL REVIEW</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 group-hover:text-black">
                {title}
              </p>
              <p className="text-xs text-gray-500">
                {(movie.release_date || movie.first_air_date)?.slice(0, 4)}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
