import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";
import Link from "next/link";

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const title = movie.title || movie.name || "";

  return (
    <div className="relative h-[85vh] w-full">
      {movie.backdrop_path && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`,
          }}
        />
      )}
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-x-0 bottom-[12%] z-10 flex flex-col items-center space-y-5 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl">
          {title}
        </h1>
        <p className="line-clamp-2 max-w-2xl text-sm font-light text-gray-200 drop-shadow md:text-base">
          {movie.overview || "説明はありません。"}
        </p>
        <div className="flex gap-4">
          <Link
            href={`/movie/${movie.id}`}
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg"
          >
            詳細を見る
          </Link>
          <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-6 py-3 text-sm font-medium backdrop-blur-sm">
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
