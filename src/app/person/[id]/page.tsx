import type { Metadata } from "next";
import { getPersonDetail, getExternalIds, IMAGE_BASE_URL } from "@/lib/tmdb";
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
    title: `${person.name} `,
    description,
    openGraph: {
      title: `${person.name} `,
      description,
      ...(image && { images: [{ url: image, width: 780, height: 1170 }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${person.name} `,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;
  const departmentMap: Record<string, string> = {
    Acting: "俳優",
    Directing: "監督",
    Writing: "脚本",
    Production: "プロデューサー",
    Camera: "撮影",
    Editing: "編集",
    Sound: "音響",
    Art: "美術",
    "Visual Effects": "VFX",
    Crew: "スタッフ",
    Costume: "衣装",
    "Costume & Make-Up": "衣装・メイク",
    Lighting: "照明",
  };

  const [person, externalIds] = await Promise.all([
    getPersonDetail(Number(id)),
    getExternalIds(Number(id), "person"),
  ]);

  const snsLinks = [
    { id: externalIds.instagram_id, label: "Instagram", url: (v: string) => `https://www.instagram.com/${v}`, color: "hover:text-pink-500" },
    { id: externalIds.twitter_id, label: "X", url: (v: string) => `https://x.com/${v}`, color: "hover:text-gray-800" },
    { id: externalIds.facebook_id, label: "Facebook", url: (v: string) => `https://www.facebook.com/${v}`, color: "hover:text-blue-600" },
    { id: externalIds.tiktok_id, label: "TikTok", url: (v: string) => `https://www.tiktok.com/@${v}`, color: "hover:text-gray-800" },
  ].filter((s) => s.id);

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
        <div className="w-[45%] max-w-[200px] flex-shrink-0 rounded-sm bg-[#111] p-3 pb-12 sm:w-52 sm:max-w-none sm:p-3.5 sm:pb-14" style={{ boxShadow: '0 0 8px rgba(0,200,255,0.6), 0 0 20px rgba(0,200,255,0.3), inset 0 0 8px rgba(0,200,255,0.1)' }}>
          {person.profile_path ? (
            <div className="relative">
              <img
                src={`${IMAGE_BASE_URL}/w342${person.profile_path}`}
                alt={person.name}
                className="aspect-[3/4] w-full object-cover"
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
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">{person.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {person.known_for_department && (
              <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
                {departmentMap[person.known_for_department] || person.known_for_department}
              </span>
            )}
            {person.birthday && (
              <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
                {person.birthday}
              </span>
            )}
            {person.place_of_birth && (
              <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
                {person.place_of_birth}
              </span>
            )}
          </div>
          {snsLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {snsLinks.map((sns) => (
                <a
                  key={sns.label}
                  href={sns.url(sns.id!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors ${sns.color}`}
                >
                  {sns.label === "Instagram" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  )}
                  {sns.label === "X" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  )}
                  {sns.label === "Facebook" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  )}
                  {sns.label === "TikTok" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  )}
                  {sns.label}
                </a>
              ))}
            </div>
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
