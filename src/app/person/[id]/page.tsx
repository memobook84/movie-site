import type { Metadata } from "next";
import { getPersonDetail, getExternalIds, getPersonImages, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import PersonCreditsGrid from "@/components/PersonCreditsGrid";
import PersonProfileWithGallery from "@/components/PersonGalleryButton";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonDetail(Number(id));
  const description = person.biography?.slice(0, 150) || `${person.name}の出演作品・プロフィール`;
  const image = person.profile_path ? `${IMAGE_BASE_URL}/w780${person.profile_path}` : undefined;

  const canonicalUrl = `https://ardcinema.com/person/${id}`;

  return {
    title: `${person.name} `,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${person.name} `,
      description,
      url: canonicalUrl,
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

  const [person, externalIds, personImages] = await Promise.all([
    getPersonDetail(Number(id)),
    getExternalIds(Number(id), "person"),
    getPersonImages(Number(id)),
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


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.biography && { description: person.biography.slice(0, 300) }),
    ...(person.profile_path && { image: `${IMAGE_BASE_URL}/w780${person.profile_path}` }),
    ...(person.birthday && { birthDate: person.birthday }),
    ...(person.place_of_birth && { birthPlace: person.place_of_birth }),
    ...(person.known_for_department && { jobTitle: departmentMap[person.known_for_department] || person.known_for_department }),
    url: `https://ardcinema.com/person/${id}`,
  };

  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* プロフィール */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
        <div className="flex-shrink-0 relative">
          <PersonProfileWithGallery
            profilePath={person.profile_path}
            name={person.name}
            imageBase={IMAGE_BASE_URL}
            images={personImages}
          />
          {/* スマホ版SNSアイコン（写真の右下に重ねる） */}
          {snsLinks.length > 0 && (
            <div className="absolute bottom-0 right-0 flex flex-row gap-1.5 p-1.5 sm:hidden">
              {snsLinks.map((sns) => (
                <a
                  key={sns.label}
                  href={sns.url(sns.id!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={sns.label}
                >
                  {sns.label === "Instagram" && <FaInstagram className="h-5 w-5" />}
                  {sns.label === "X" && <FaXTwitter className="h-5 w-5" />}
                  {sns.label === "Facebook" && <FaFacebookF className="h-5 w-5" />}
                  {sns.label === "TikTok" && <FaTiktok className="h-5 w-5" />}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2 mt-4 sm:mt-0 text-center sm:text-left">
          <h1 className="text-sm font-normal tracking-tight text-gray-900 md:text-3xl">{person.name}</h1>
          {/* PC版: タグ + SNS */}
          <div className="hidden sm:block space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 -ml-0.5">
              {person.known_for_department && (
                <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
                  {departmentMap[person.known_for_department] || person.known_for_department}
                </span>
              )}
              {person.birthday && (() => {
                const birth = new Date(person.birthday!);
                const end = person.deathday ? new Date(person.deathday) : new Date();
                let age = end.getFullYear() - birth.getFullYear();
                if (end.getMonth() < birth.getMonth() || (end.getMonth() === birth.getMonth() && end.getDate() < birth.getDate())) age--;
                const ageText = person.deathday ? `${age}歳没` : `${age}歳`;
                return (
                  <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
                    {person.birthday}（{ageText}）
                  </span>
                );
              })()}
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
                    {sns.label === "Instagram" && <FaInstagram className="h-3.5 w-3.5" />}
                    {sns.label === "X" && <FaXTwitter className="h-3.5 w-3.5" />}
                    {sns.label === "Facebook" && <FaFacebookF className="h-3.5 w-3.5" />}
                    {sns.label === "TikTok" && <FaTiktok className="h-3.5 w-3.5" />}
                    {sns.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* スマホ版: 俳優・年齢・出身地（写真の下） */}
      <div className="sm:hidden mt-3 flex flex-wrap justify-center items-center gap-1.5">
        {person.known_for_department && (
          <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
            {departmentMap[person.known_for_department] || person.known_for_department}
          </span>
        )}
        {person.birthday && (() => {
          const birth = new Date(person.birthday!);
          const end = person.deathday ? new Date(person.deathday) : new Date();
          let age = end.getFullYear() - birth.getFullYear();
          if (end.getMonth() < birth.getMonth() || (end.getMonth() === birth.getMonth() && end.getDate() < birth.getDate())) age--;
          const ageText = person.deathday ? `${age}歳没` : `${age}歳`;
          return (
            <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
              {person.birthday}（{ageText}）
            </span>
          );
        })()}
        {person.place_of_birth && (
          <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#6b7280]">
            {person.place_of_birth}
          </span>
        )}
      </div>

      {/* 出演作品・監督作品（タブ切り替え） */}
      <PersonCreditsGrid
        castCredits={castCredits}
        directorCredits={directorCredits}
      />
    </main>
  );
}
