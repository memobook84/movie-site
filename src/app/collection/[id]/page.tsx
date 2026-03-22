import type { Metadata } from "next";
import { getCollectionDetail, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await getCollectionDetail(Number(id));
  const title = collection.name || "コレクション";
  return {
    title: `${title} | CINEMA`,
    description: collection.overview || `${title}のシリーズ作品一覧`,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  const collection = await getCollectionDetail(Number(id));

  if (collection.id === 0) {
    return (
      <main className="min-h-screen bg-white pt-24 px-6 text-center">
        <p className="text-gray-500">コレクションが見つかりませんでした。</p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ホームに戻る
        </Link>
      </main>
    );
  }

  // 年ごとにグループ化
  const yearGroups: Record<string, typeof collection.parts> = {};
  for (const part of collection.parts) {
    const year = (part.release_date || part.first_air_date || "").slice(0, 4) || "不明";
    if (!yearGroups[year]) yearGroups[year] = [];
    yearGroups[year].push(part);
  }
  const sortedYears = Object.keys(yearGroups).sort();

  return (
    <main className="min-h-screen bg-white">
      {/* ヒーロー画像 */}
      <div className="relative mt-16 h-[40vw] max-h-[350px] w-full">
        {collection.backdrop_path ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}/original${collection.backdrop_path})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />

        {/* タイトル */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:px-16 md:pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {collection.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {collection.parts.length}作品
          </p>
        </div>
      </div>

      {/* 概要 */}
      {collection.overview && (
        <div className="px-6 pt-6 md:px-16">
          <p className="max-w-2xl text-sm leading-7 text-gray-600">
            {collection.overview}
          </p>
        </div>
      )}

      {/* タイムライン */}
      <div className="px-6 py-10 md:px-16">
        <div className="relative">
          {/* 縦線 */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gray-200 md:left-[22px]" />

          {sortedYears.map((year) => (
            <div key={year} className="mb-8">
              {/* 年ラベル */}
              <div className="relative flex items-center mb-4">
                <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white md:h-11 md:w-11 md:text-sm">
                  {year.slice(-2)}&apos;
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-400">{year}</span>
              </div>

              {/* 作品カード */}
              {yearGroups[year].map((part) => {
                return (
                  <Link
                    key={part.id}
                    href={`/movie/${part.id}`}
                    className="relative ml-[18px] md:ml-[22px] pl-6 md:pl-8 pb-6 block group"
                  >
                    {/* ドット */}
                    <div className="absolute left-0 top-3 h-2.5 w-2.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors -translate-x-[5px]" />

                    <div className="flex gap-4 rounded-2xl bg-gray-50 p-3 transition-all group-hover:bg-gray-100 group-hover:shadow-md md:p-4">
                      {/* ポスター */}
                      {part.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w342${part.poster_path}`}
                          alt={part.title || part.name || ""}
                          className="h-[150px] w-[100px] flex-shrink-0 rounded-lg object-cover md:h-[180px] md:w-[120px]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-[150px] w-[100px] flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400 md:h-[180px] md:w-[120px]">
                          N/A
                        </div>
                      )}

                      {/* 情報 */}
                      <div className="min-w-0 flex-1 py-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 md:text-base">
                          {part.title || part.name || ""}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {(part.release_date || part.first_air_date || "").slice(0, 10)}
                        </p>
                        {part.overview && (
                          <p className="mt-2 text-xs leading-5 text-gray-500 line-clamp-2">
                            {part.overview}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
