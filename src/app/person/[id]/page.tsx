import type { Metadata } from "next";
import { getPersonDetail, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import PersonCreditsGrid from "@/components/PersonCreditsGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonDetail(Number(id));
  const description = person.biography?.slice(0, 150) || `${person.name}の出演作品・プロフィール`;
  const image = person.profile_path ? `${IMAGE_BASE_URL}/w780${person.profile_path}` : undefined;

  return {
    title: `${person.name} | CINEMA`,
    description,
    openGraph: {
      title: `${person.name} | CINEMA`,
      description,
      ...(image && { images: [{ url: image, width: 780, height: 1170 }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${person.name} | CINEMA`,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;
  const person = await getPersonDetail(Number(id));

  // 出演作品（cast）
  const castSeen = new Set<number>();
  const castCredits = (person.combined_credits?.cast || [])
    .filter((m) => {
      if (castSeen.has(m.id)) return false;
      castSeen.add(m.id);
      return m.poster_path;
    })
    .sort((a, b) => b.vote_average - a.vote_average);

  // 監督作品（crew: Director）
  const directorSeen = new Set<number>();
  const directorCredits = (person.combined_credits?.crew || [])
    .filter((m) => {
      if (m.job !== "Director") return false;
      if (directorSeen.has(m.id)) return false;
      directorSeen.add(m.id);
      return m.poster_path;
    })
    .sort((a, b) => b.vote_average - a.vote_average);

  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 max-w-7xl mx-auto">
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

      {/* 監督作品 */}
      {directorCredits.length > 0 && (
        <PersonCreditsGrid label="監督作品" credits={directorCredits} />
      )}

      {/* 出演作品 */}
      {castCredits.length > 0 && (
        <PersonCreditsGrid label="出演作品" credits={castCredits} />
      )}
    </main>
  );
}
