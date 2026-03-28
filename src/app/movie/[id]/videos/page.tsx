import { getMovieDetail, getTvDetail, getVideosEn, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import TrailerModal from "@/components/TrailerModal";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function VideosPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { type } = await searchParams;
  const movie = type === "tv"
    ? await getTvDetail(Number(id))
    : await getMovieDetail(Number(id));
  const title = movie.title || movie.name || "";

  // 日本語 + 英語の動画を統合、重複排除
  const jaVideos = (movie.videos?.results || []).filter((v) => v.site === "YouTube");
  const enVideos = (await getVideosEn(Number(id), type || "movie")).filter((v) => v.site === "YouTube");
  const seenKeys = new Set(jaVideos.map((v) => v.key));
  const typeOrder: Record<string, number> = { Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3, "Behind the Scenes": 4 };
  const allVideos = [...jaVideos, ...enVideos.filter((v) => !seenKeys.has(v.key))]
    .sort((a, b) => (typeOrder[a.type] ?? 5) - (typeOrder[b.type] ?? 5));

  // タイプ別にグループ化
  const typeLabels: Record<string, string> = {
    Trailer: "トレーラー",
    Teaser: "ティーザー",
    Clip: "クリップ",
    Featurette: "特別映像",
    "Behind the Scenes": "メイキング",
  };
  const grouped: Record<string, typeof allVideos> = {};
  for (const v of allVideos) {
    const label = typeLabels[v.type] || v.type;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(v);
  }

  return (
    <main className="min-h-screen bg-white pt-20 pb-24 px-6 md:px-16">
      {/* ヘッダー */}
      <div className="mb-8">
        <Link
          href={`/movie/${id}?type=${type || "movie"}`}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          作品ページに戻る
        </Link>
        <h1 className="text-lg font-normal tracking-tight text-gray-900 md:text-3xl">
          {title}（{allVideos.length}）
        </h1>
      </div>

      {/* タイプ別セクション */}
      {Object.entries(grouped).map(([label, videos]) => (
        <div key={label} className="mb-10">
          <div className="flex items-center gap-2 border-b border-gray-300 pb-2 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              {label}
            </h2>
            <span className="text-xs text-gray-400">{videos.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((v) => (
              <TrailerModal
                key={v.key}
                videoKey={v.key}
                variant="card"
                label={v.name || v.type}
                publishedAt={v.published_at}
                grid
              />
            ))}
          </div>
        </div>
      ))}

      {allVideos.length === 0 && (
        <p className="text-sm text-gray-500">この作品の動画はまだ登録されていません。</p>
      )}
    </main>
  );
}
