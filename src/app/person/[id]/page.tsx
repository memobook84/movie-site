import { getPersonDetail, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;
  const person = await getPersonDetail(Number(id));

  // 出演作品を人気順でソート、重複除去
  const seen = new Set<number>();
  const credits = (person.combined_credits?.cast || [])
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return m.poster_path;
    })
    .sort((a, b) => b.vote_average - a.vote_average);

  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      {/* プロフィール */}
      <div className="flex flex-col items-start gap-6 sm:flex-row">
        {person.profile_path ? (
          <img
            src={`${IMAGE_BASE_URL}/w342${person.profile_path}`}
            alt={person.name}
            className="w-32 rounded-xl shadow-lg sm:w-40"
          />
        ) : (
          <div className="flex h-48 w-32 items-center justify-center rounded-xl bg-gray-200 text-2xl text-gray-400 sm:w-40">
            ?
          </div>
        )}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">{person.name}</h1>
          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
            {person.known_for_department && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1">{person.known_for_department}</span>
            )}
            {person.birthday && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1">{person.birthday}</span>
            )}
            {person.place_of_birth && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1">{person.place_of_birth}</span>
            )}
          </div>
          {person.biography && (
            <p className="max-w-2xl text-sm leading-7 text-gray-500 line-clamp-6">
              {person.biography}
            </p>
          )}
        </div>
      </div>

      {/* 出演作品 */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">
          出演作品（{credits.length}）
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {credits.map((movie) => {
            const title = movie.title || movie.name || "";
            const type = movie.media_type === "tv" ? "tv" : "movie";
            return (
              <Link
                key={`${type}-${movie.id}`}
                href={`/movie/${movie.id}?type=${type}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
                  <img
                    src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                    alt={title}
                    className="aspect-[2/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-1.5 truncate text-xs font-medium text-[#1d1d1f]">{title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
