import Link from "next/link";
import { IMAGE_BASE_URL, Movie } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  variant?: "default" | "oscar";
}

export default function MovieCard({ movie, variant = "default" }: MovieCardProps) {
  const title = movie.title || movie.name || "No Title";
  const isOscar = variant === "oscar";

  if (isOscar) {
    return (
      <Link href={`/movie/${movie.id}`} className="group flex-shrink-0">
        {/* スマホ: 縦型ポスター */}
        <div className="w-[105px] overflow-hidden rounded-[3px] bg-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-xl md:hidden">
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
          <div className="px-2 py-2">
            <p className="truncate text-xs font-medium text-gray-900">
              {title}
            </p>
          </div>
        </div>
        {/* PC: 縦型ポスター */}
        <div className="hidden w-[170px] overflow-hidden rounded-[3px] bg-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-xl md:block">
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
          <div className="px-2 py-2">
            <p className="truncate text-xs font-medium text-gray-900">
              {title}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.id}`} className="group flex-shrink-0">
      {/* スマホ: 縦型ポスター */}
      <div className="w-[105px] overflow-hidden rounded-[3px] bg-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-xl md:hidden">
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
        <div className="px-2 py-2">
          <p className="line-clamp-2 min-h-[2lh] text-xs font-medium text-gray-900">
            {title}
          </p>
        </div>
      </div>
      {/* PC: 縦型ポスター */}
      <div className="hidden w-[170px] overflow-hidden rounded-[3px] bg-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-xl md:block">
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
        <div className="px-2 py-2">
          <p className="line-clamp-2 min-h-[2lh] text-xs font-medium text-gray-900">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}
