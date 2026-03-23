import type { Metadata } from "next";
import { getMovieDetail, getTvDetail, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { type } = await searchParams;
  const movie = type === "tv"
    ? await getTvDetail(Number(id))
    : await getMovieDetail(Number(id));
  const title = movie.title || movie.name || "";
  return {
    title: `${title} - 出演者一覧`,
  };
}

export default async function CastPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { type } = await searchParams;
  const movie = type === "tv"
    ? await getTvDetail(Number(id))
    : await getMovieDetail(Number(id));
  const title = movie.title || movie.name || "";
  const allCast = movie.credits?.cast || [];

  return (
    <main className="min-h-screen bg-white pt-24 pb-28 px-6 md:px-16 max-w-5xl mx-auto">
      {/* 戻るリンク + タイトル */}
      <Link
        href={`/movie/${id}?type=${type || "movie"}`}
        className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {title}
      </Link>

      <h1 className="mt-4 text-xl font-bold text-gray-900 md:text-2xl">
        出演者一覧（{allCast.length}名）
      </h1>

      {/* キャスト一覧（ポラロイド風） */}
      <div className="mt-8 grid grid-cols-3 gap-3 md:flex md:flex-wrap md:gap-5">
        {allCast.map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group transition-all duration-300 hover:scale-110 hover:z-10"
          >
            <div className="w-full rounded-sm bg-[#faf8f5] p-1.5 pb-6 shadow-md transition-shadow duration-300 group-hover:shadow-xl md:w-[130px] md:p-2.5 md:pb-10" style={{ boxShadow: '2px 3px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)' }}>
              {person.profile_path ? (
                <div className="relative">
                  <img
                    src={`${IMAGE_BASE_URL}/w185${person.profile_path}`}
                    alt={person.name}
                    className="aspect-[3/4] w-full object-cover grayscale contrast-[1.2] transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]" />
                </div>
              ) : (
                <div className="relative">
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-gray-100 text-3xl text-gray-300">
                    ?
                  </div>
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]" />
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="truncate text-[11px] font-semibold text-gray-800">
                  {person.name}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-gray-400">
                  {person.character}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
