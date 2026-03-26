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
        {/* スマホ: オスカー風縦型 */}
        <div className="flex w-[129px] overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-lg md:hidden">
          <div className="w-[10px] flex-shrink-0 bg-[#111]" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="h-[10px] flex-shrink-0 bg-[#111]" />
            <div className="relative overflow-hidden">
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
            <div className="flex-shrink-0 bg-[#111] px-2 py-1.5">
              <p className="truncate text-[9px] font-semibold text-[#d4af37] transition-colors group-hover:text-[#e5c54a]">
                {title}
              </p>
            </div>
          </div>
          <div className="w-[10px] flex-shrink-0 bg-[#111]" />
        </div>
        {/* PC: オスカー風横型 */}
        <div className="hidden w-[280px] overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-lg md:flex">
          <div className="w-[12px] flex-shrink-0 bg-[#111] md:w-[14px]" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="h-[12px] flex-shrink-0 bg-[#111] md:h-[14px]" />
            <div className="relative overflow-hidden">
              {movie.backdrop_path ? (
                <img
                  src={`${IMAGE_BASE_URL}/w780${movie.backdrop_path}`}
                  alt={title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              ) : movie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                  alt={title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gray-200 text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-shrink-0 bg-[#111] px-2 py-1.5">
              <p className="truncate text-sm font-semibold text-[#d4af37] transition-colors group-hover:text-[#e5c54a]">
                {title}
              </p>
            </div>
          </div>
          <div className="w-[12px] flex-shrink-0 bg-[#111] md:w-[14px]" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.id}`} className="group flex-shrink-0">
      {/* スマホ: 縦型ポスター */}
      <div className="w-[105px] overflow-hidden rounded-md bg-black shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-xl md:hidden">
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
          <p className="truncate text-[9px] font-medium text-white transition-colors group-hover:text-gray-300">
            {title}
          </p>
        </div>
      </div>
      {/* PC: 横型backdrop */}
      <div className="hidden w-[260px] overflow-hidden rounded-md bg-black shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-xl md:block">
        {movie.backdrop_path ? (
          <img
            src={`${IMAGE_BASE_URL}/w780${movie.backdrop_path}`}
            alt={title}
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        ) : movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
            alt={title}
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gray-200 text-xs text-gray-400">
            No Image
          </div>
        )}
        <div className="px-2 py-2">
          <p className="truncate text-sm font-medium text-white transition-colors group-hover:text-gray-300">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}
