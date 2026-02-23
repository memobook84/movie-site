import { getMovieDetail, getTvDetail, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

function RatingRing({ score }: { score: number }) {
  const pct = score * 10;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color =
    pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle
          cx="44" cy="44" r={radius}
          fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="5"
        />
        <circle
          cx="44" cy="44" r={radius}
          fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white">{score.toFixed(1)}</span>
        <span className="text-[10px] text-gray-400">/ 10</span>
      </div>
    </div>
  );
}

export default async function MovieDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { type } = await searchParams;
  const movie = type === "tv"
    ? await getTvDetail(Number(id))
    : await getMovieDetail(Number(id));
  const title = movie.title || movie.name || "";
  const trailer = movie.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  const cast = movie.credits?.cast.slice(0, 10) || [];
  const year = movie.release_date?.slice(0, 4);
  const director = movie.credits?.cast
    ? undefined
    : undefined;

  return (
    <main className="min-h-screen bg-black">
      {/* 背景画像 */}
      <div className="relative h-[55vh] w-full md:h-[65vh]">
        {movie.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute left-6 top-6 z-10 md:left-16">
          <Link
            href="/"
            className="rounded-full bg-white/10 px-5 py-2.5 text-sm backdrop-blur-md transition-all hover:bg-white/20"
          >
            ← 戻る
          </Link>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="-mt-36 relative z-10 px-6 md:px-16">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* ポスター */}
          {movie.poster_path && (
            <div className="flex-shrink-0">
              <img
                src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                alt={title}
                className="w-48 rounded-2xl shadow-2xl md:w-64"
              />
            </div>
          )}

          {/* 詳細情報 */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {title}
              </h1>
              {movie.tagline && (
                <p className="mt-2 text-base font-light italic text-gray-400">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* メタ情報バッジ */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              {year && (
                <span className="rounded-md bg-white/5 px-2.5 py-1">{year}</span>
              )}
              {movie.runtime > 0 && (
                <span className="rounded-md bg-white/5 px-2.5 py-1">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-md bg-white/5 px-2.5 py-1"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* レーティング */}
            <div className="flex items-center gap-6">
              <RatingRing score={movie.vote_average} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">ユーザー評価</p>
                <p className="text-xs text-gray-500">
                  {movie.vote_count.toLocaleString()} 件のレビュー
                </p>
              </div>
            </div>

            {/* あらすじ */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                あらすじ
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-gray-300">
                {movie.overview || "この作品の説明はまだ登録されていません。"}
              </p>
            </div>

            {/* ボタン */}
            <div className="flex flex-wrap gap-3 pt-2">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  トレーラーを見る
                </a>
              )}
            </div>
          </div>
        </div>

        {/* キャスト */}
        {cast.length > 0 && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              キャスト
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 text-center">
                  {person.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w185${person.profile_path}`}
                      alt={person.name}
                      className="h-20 w-20 rounded-none object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-none bg-white/5 text-lg text-gray-600">
                      ?
                    </div>
                  )}
                  <p className="mt-2 w-20 truncate text-xs font-medium text-white">
                    {person.name}
                  </p>
                  <p className="w-20 truncate text-xs text-gray-500">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 作品情報 */}
        {(movie.budget > 0 || movie.revenue > 0 || movie.production_companies.length > 0) && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              作品情報
            </h2>
            <div className="grid max-w-2xl grid-cols-2 gap-4 text-sm">
              {movie.status && (
                <div>
                  <p className="text-xs text-gray-500">ステータス</p>
                  <p className="text-gray-300">{movie.status}</p>
                </div>
              )}
              {movie.release_date && (
                <div>
                  <p className="text-xs text-gray-500">公開日</p>
                  <p className="text-gray-300">{movie.release_date}</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-xs text-gray-500">予算</p>
                  <p className="text-gray-300">${movie.budget.toLocaleString()}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-xs text-gray-500">興行収入</p>
                  <p className="text-gray-300">${movie.revenue.toLocaleString()}</p>
                </div>
              )}
              {movie.production_companies.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">制作会社</p>
                  <p className="text-gray-300">
                    {movie.production_companies.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-20" />
    </main>
  );
}
