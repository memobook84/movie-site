import Link from "next/link";
import Image from "next/image";
import { IMAGE_BASE_URL, BLUR_DATA_URL, Movie } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const title = movie.title || movie.name || "No Title";

  return (
    <Link href={`/movie/${movie.id}`} className="group flex-shrink-0">
      {/* スマホ: 縦型ポスター */}
      <div className="w-[105px] overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/15 md:hidden">
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
      {/* PC: 横型backdrop */}
      <div className="hidden w-[260px] overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/15 md:block">
        {movie.backdrop_path ? (
          <Image
            src={`${IMAGE_BASE_URL}/w780${movie.backdrop_path}`}
            alt={title}
            width={780}
            height={439}
            className="aspect-video w-full object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : movie.poster_path ? (
          <Image
            src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
            alt={title}
            width={342}
            height={192}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gray-200 text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="mt-1.5 w-[105px] md:w-[260px]">
        <p className="truncate text-sm font-medium text-[#1d1d1f] transition-colors group-hover:text-black">
          {title}
        </p>
      </div>
    </Link>
  );
}
