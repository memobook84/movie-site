import type { Metadata } from "next";
import { getTrending, getPopular, getPopularJP, getTopRated, IMAGE_BASE_URL, Movie } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "映画ランキング",
  description: "今話題のトレンド映画、人気映画、高評価映画のランキングをチェック。",
  alternates: { canonical: "https://ardcinema.com/ranking" },
};
import Link from "next/link";

function RankBadge({ rank }: { rank: number }) {
  const colors =
    rank === 1
      ? "from-yellow-400 to-amber-500 text-white shadow-amber-300/50"
      : rank === 2
      ? "from-gray-300 to-gray-400 text-white shadow-gray-300/50"
      : rank === 3
      ? "from-amber-600 to-amber-700 text-white shadow-amber-600/50"
      : "from-gray-100 to-gray-200 text-gray-500";

  return (
    <div
      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold shadow-sm ${colors} ${
        rank <= 3 ? "text-sm" : "text-xs"
      }`}
    >
      {rank}
    </div>
  );
}

function RankingSection({
  title,
  subtitle,
  movies,
}: {
  title: string;
  subtitle: string;
  movies: Movie[];
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      </div>
      <div className="space-y-2">
        {movies.slice(0, 20).map((movie, i) => {
          const title = movie.title || movie.name || "";
          const year = (movie.release_date || movie.first_air_date)?.slice(0, 4);

          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group flex items-center gap-4 bg-white p-3 transition-all hover:bg-gray-50 hover:shadow-md md:p-4"
            >
              <RankBadge rank={i + 1} />
              {/* ポスター */}
              <div className="h-16 w-11 flex-shrink-0 overflow-hidden rounded-[4px] md:h-20 md:w-14">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}/w185${movie.poster_path}`}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] text-gray-400">
                    N/A
                  </div>
                )}
              </div>
              {/* 情報 */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-black md:text-base">
                  {title}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                  {year && <span>{year}</span>}
                  {movie.genre_ids && movie.media_type && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">
                      {movie.media_type === "tv" ? "TV" : "映画"}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default async function RankingPage() {
  const [popularJP, trending, popular, topRated] = await Promise.all([
    getPopularJP(),
    getTrending(),
    getPopular(),
    getTopRated(),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-24 pb-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="space-y-14">
          <RankingSection
            title="日本で人気"
            subtitle="日本で今人気の作品"
            movies={popularJP}
          />
          <RankingSection
            title="トレンド"
            subtitle="今週最も注目されている作品"
            movies={trending}
          />
          <RankingSection
            title="人気"
            subtitle="世界中で人気の作品"
            movies={popular}
          />
          <RankingSection
            title="高評価"
            subtitle="評価の高い名作"
            movies={topRated}
          />
        </div>
      </div>
    </main>
  );
}
