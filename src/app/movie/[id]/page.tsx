import type { Metadata } from "next";
import { getMovieDetail, getTvDetail, getMovieImages, getRecommendations, getWatchProviders, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/FollowButton";
import GalleryModal from "@/components/GalleryModal";
import ShareButton from "@/components/ShareButton";
import {
  Zap, Compass, Sparkles, Laugh, SearchCheck,
  Film, Drama, Home, Wand2, Landmark,
  Moon, Music, Eye, Heart, Rocket,
  Tv, Flame, Swords, Sun,
} from "lucide-react";
import { ComponentType } from "react";

const GENRE_ICONS: Record<number, ComponentType<{ className?: string }>> = {
  28: Zap, 12: Compass, 16: Sparkles, 35: Laugh, 80: SearchCheck,
  99: Film, 18: Drama, 10751: Home, 14: Wand2, 36: Landmark,
  27: Moon, 10402: Music, 9648: Eye, 10749: Heart, 878: Rocket,
  10770: Tv, 53: Flame, 10752: Swords, 37: Sun,
};

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
  const title = movie.title || movie.name || "CINEMA";
  const description = movie.overview?.slice(0, 150) || "映画・ドラマ情報サイト";
  const image = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
    : movie.poster_path
      ? `${IMAGE_BASE_URL}/w780${movie.poster_path}`
      : undefined;

  return {
    title: `${title} | CINEMA`,
    description,
    openGraph: {
      title: `${title} | CINEMA`,
      description,
      ...(image && { images: [{ url: image, width: 1280, height: 720 }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CINEMA`,
      description,
      ...(image && { images: [image] }),
    },
  };
}

function RatingBar({ score }: { score: number }) {
  const pct = score * 10;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-black">
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-gray-400">/ 10</span>
      </div>
      <div className="relative h-3 w-full rounded-sm bg-gray-200">
        <div
          className="absolute left-0 top-0 h-full rounded-sm transition-all duration-700 bg-black"
          style={{ width: `${pct}%` }}
        />
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
  const images = await getMovieImages(Number(id), type || "movie");
  const recommendations = await getRecommendations(Number(id), type || "movie");
  const watchProviders = await getWatchProviders(Number(id), type || "movie");
  const year = movie.release_date?.slice(0, 4);
  const directors = movie.credits?.crew?.filter((c) => c.job === "Director") || [];

  return (
    <main className="min-h-screen bg-white">
      {/* 背景画像 */}
      <div className="relative mt-16 h-[55vh] w-full md:h-[65vh]">
        {movie.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-black/20" />
      </div>

      {/* コンテンツ */}
      <div className="-mt-36 relative z-10 px-6 md:px-16">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* ポスター */}
          {movie.poster_path && (
            <div className="flex-shrink-0">
              <Image
                src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                alt={title}
                width={342}
                height={513}
                className="w-48 rounded-2xl shadow-2xl md:w-64"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjUxMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
              />
            </div>
          )}

          {/* 詳細情報 */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
                {title}
              </h1>
              {movie.tagline && (
                <p className="mt-2 text-sm font-light text-gray-500">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* メタ情報バッジ */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {year && (
                <span className="rounded-md bg-gray-100 px-2.5 py-1">{year}</span>
              )}
              {movie.runtime > 0 && (
                <span className="rounded-md bg-gray-100 px-2.5 py-1">
                  {Math.floor(movie.runtime / 60)}時間{movie.runtime % 60}分
                </span>
              )}
              {movie.genres.map((genre) => {
                const Icon = GENRE_ICONS[genre.id];
                return (
                  <span
                    key={genre.id}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1"
                  >
                    {genre.name}
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                  </span>
                );
              })}
            </div>

            {/* レーティング */}
            <div className="max-w-xs">
              <RatingBar score={movie.vote_average} />
            </div>

            {/* あらすじ */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                ストーリー
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-gray-600">
                {movie.overview || "この作品の説明はまだ登録されていません。"}
              </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-2 md:gap-3">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gray-900 text-white transition-all hover:bg-gray-800 hover:shadow-lg md:h-auto md:w-auto md:gap-2 md:px-7 md:py-3"
                  aria-label="トレーラーを見る"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="hidden md:inline text-sm font-semibold">トレーラー</span>
                </a>
              )}
              <FollowButton
                movieId={movie.id}
                title={title}
                posterPath={movie.poster_path}
                mediaType={type || "movie"}
              />
              <GalleryModal images={images} imageBase={IMAGE_BASE_URL} />
              <ShareButton title={`${title} | CINEMA`} />
            </div>
          </div>
        </div>

        {/* レビュー: ターミネーター2 */}
        {movie.id === 280 && (
          <div className="mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>小学生の頃、家族で地元の健康ランドに行った時のことを、今でもはっきり覚えている。土曜ロードショーで流れていたこの映画を、家族と一緒に椅子に座って何気なく見始めた。それが、自分にとって「映画」というものとの出会いだった。</p>
              <p>衝撃だった。こんなにすごい娯楽が、この世に存在するのかと。</p>
              <p>まず、映像が圧倒的だった。当時の最先端の技術で作られた映像は、子供の目には魔法のように映った。液体金属のT-1000が自在に姿を変え、どんなダメージを受けても再生していく。その視覚的な自由さ、無限の想像力で作り上げられた映像に、画面から目が離せなかった。</p>
              <p>そして、主人公たちがとにかくカッコいい。革ジャンにサングラスのT-800、バイクを乗り回すジョン、そして強く戦い続けるサラ・コナー。全員が魅力的で、全員に引き込まれた。</p>
              <p>ストーリーも見事だった。圧倒的な性能を持つ敵に対して、味方のT-800は決して無敵ではない。だからこそハラハラするし、だからこそ応援したくなる。その対比が絶妙だった。そして物語が進むにつれて、機械であるはずのT-800が、ジョンやサラとの交流を通じて少しずつ信頼を勝ち取っていく。戦いの中で生まれる絆が、この映画をただのアクション映画では終わらせない、特別な作品にしている。</p>
              <p>アクションのひとつひとつが迫力に満ちていて、映像は美しく、ストーリーは最後まで全くダレることがない。ただただ面白くて、ただただワクワクした。</p>
              <p>生まれて初めてちゃんと見た映画が、この作品で本当に良かったと思う。「映画ってこんなにすごいものなんだ」という、あの日の衝撃は、何十年経っても色褪せることがない。</p>
            </div>
          </div>
        )}

        {/* レビュー: ブレイキング・バッド */}
        {movie.id === 1396 && (
          <div className="mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>見始めたら最後、もう止まらなかった。気づけば全シーズンを一気に駆け抜けていた。こんな体験は、なかなかできるものではない。</p>
              <p>冴えない高校の化学教師が、余命宣告をきっかけにメスの製造に手を染めていく。この設定が恐ろしいほどリアルだ。誰だって、もし明日死ぬと知ったら、今まで飲み込んできた本音や、押し殺してきた野心が溢れ出すかもしれない。ウォルター・ホワイトの変貌は、どこか他人事とは思えない生々しさがある。</p>
              <p>平凡な中年男が、家族のために、そしていつしか自分自身のために、裏社会の帝王へと変わっていく。それはまるで、日々の生活に埋もれたすべての夢を爆発させるかのようだ。最初は同情し、やがて応援し、そしていつの間にか恐ろしくなる。その感情の変化こそが、このドラマの真骨頂だった。</p>
              <p>純粋なエンターテインメントとして、これほどのドラマは他に見たことがない。ウォルター、ジェシー、ハンク、ガス、マイク。登場人物の一人ひとりがあまりにも強烈で、全員がスクリーンに焼きつくアイコンになっている。こんなことは、普通のドラマではまず起きない。</p>
              <p>そして何より、この物語には「もしも」のリアリティがある。もし自分が余命を宣告されたら。もし自分に隠れた才能があったら。もし一線を越えてしまったら。その「もしも」が絵空事ではなく、本当に起こり得ることとして迫ってくるから、画面から目が離せなくなる。</p>
              <p>間違いなく名作だ。一話目を見たら最後、全部見届けるまで止められない。そういう作品だった。</p>
            </div>
          </div>
        )}

        {/* レビュー: 千と千尋の神隠し */}
        {movie.id === 129 && (
          <div className="mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で見た。宮崎駿の映画は、始まる前からもうワクワクする。あの独特の空気感、「これから何かすごいものが始まる」という予感。そして宮崎駿は、その期待を必ず超えてくる。</p>
              <p>物語は、ごく普通の日常から始まる。引っ越しの途中、家族で迷い込んだ不思議な場所。最初に感じるのは、好奇心と、どこか不気味な違和感だ。見慣れた世界が少しずつ歪んでいき、気づけばもう戻れない場所に立っている。その導入の巧みさに、最初の数分で完全に心を掴まれた。</p>
              <p>美しい色彩、息をのむような背景、そして次から次へと現れる想像を超えた世界の広がり。湯屋の壮大さ、不思議な生き物たち、どこまでも続く水の上の線路。一つひとつの場面が、無限の想像力から生み出された芸術のようで、その世界の中にいるだけで心が満たされていく。</p>
              <p>千尋、ハク、カオナシ、湯婆婆、リン。それぞれのキャラクターが驚くほど生き生きしていて、彼らの感情や葛藤が自然に伝わってくる。だからこそ、この世界にただ身を置いているだけで、心地よく、楽しい。</p>
              <p>宮崎ワールドに入り浸るあの時間は、本当に幸せな時間だった。日本のアニメーションの、これ以上ない最高傑作だと思う。</p>
            </div>
          </div>
        )}

        {/* 配信先情報 */}
        {watchProviders && (watchProviders.flatrate || watchProviders.rent || watchProviders.buy) && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              配信情報
            </h2>
            <div className="space-y-4">
              {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">定額配信</p>
                  <div className="flex flex-wrap gap-2">
                    {watchProviders.flatrate.map((p) => (
                      <div key={p.provider_id} className="flex items-center gap-1.5">
                        <Image
                          src={`${IMAGE_BASE_URL}/w92${p.logo_path}`}
                          alt={p.provider_name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-xs text-gray-700">{p.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {watchProviders.rent && watchProviders.rent.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">レンタル</p>
                  <div className="flex flex-wrap gap-2">
                    {watchProviders.rent.map((p) => (
                      <div key={p.provider_id} className="flex items-center gap-1.5">
                        <Image
                          src={`${IMAGE_BASE_URL}/w92${p.logo_path}`}
                          alt={p.provider_name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-xs text-gray-700">{p.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {watchProviders.buy && watchProviders.buy.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">購入</p>
                  <div className="flex flex-wrap gap-2">
                    {watchProviders.buy.map((p) => (
                      <div key={p.provider_id} className="flex items-center gap-1.5">
                        <Image
                          src={`${IMAGE_BASE_URL}/w92${p.logo_path}`}
                          alt={p.provider_name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-xs text-gray-700">{p.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* キャスト */}
        {cast.length > 0 && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              キャスト
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((person) => (
                <Link
                  key={person.id}
                  href={`/person/${person.id}`}
                  className="flex-shrink-0 group w-[120px] rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:border-gray-300 hover:shadow-md"
                >
                  <div className="relative flex items-center justify-center pt-3">
                    {person.profile_path ? (
                      <>
                        <Image
                          src={`${IMAGE_BASE_URL}/w185${person.profile_path}`}
                          alt={person.name}
                          width={80}
                          height={80}
                          className="h-[80px] w-[80px] rounded-md object-cover contrast-[1.2] grayscale transition-all duration-500 group-hover:contrast-100 group-hover:grayscale-0"
                        />
                        {/* ビネット */}
                        <div className="pointer-events-none absolute inset-x-[20px] top-3 h-[80px] rounded-md shadow-[inset_0_0_15px_rgba(0,0,0,0.4)] transition-opacity duration-500 group-hover:opacity-0" />
                      </>
                    ) : (
                      <div className="flex h-[80px] w-[80px] items-center justify-center rounded-md bg-gray-100 text-2xl text-gray-400">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="px-2.5 py-2.5">
                    <p className="truncate text-xs font-semibold text-gray-900">
                      {person.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-gray-500">
                      {person.character}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* シーズン情報（TV番組のみ） */}
        {type === "tv" && movie.seasons && movie.seasons.length > 0 && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              シーズン（{movie.number_of_seasons}シーズン・{movie.number_of_episodes}エピソード）
            </h2>
            <div className="space-y-3">
              {movie.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                <div
                  key={season.id}
                  className="flex gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-gray-100"
                >
                  {season.poster_path ? (
                    <Image
                      src={`${IMAGE_BASE_URL}/w185${season.poster_path}`}
                      alt={season.name}
                      width={60}
                      height={90}
                      className="h-[90px] w-[60px] flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[90px] w-[60px] flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{season.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{season.episode_count}エピソード</span>
                      {season.air_date && <span>{season.air_date.slice(0, 4)}年</span>}
                    </div>
                    {season.overview && (
                      <p className="mt-1.5 text-xs leading-5 text-gray-500 line-clamp-2">{season.overview}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 作品情報 */}
        {(directors.length > 0 || movie.budget > 0 || movie.revenue > 0 || movie.production_companies.length > 0) && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              作品情報
            </h2>
            <div className="grid max-w-2xl grid-cols-2 gap-4 text-sm">
              {directors.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400">監督</p>
                  <p className="text-gray-700">
                    {directors.map((d, i) => (
                      <span key={d.id}>
                        {i > 0 && ", "}
                        <Link href={`/person/${d.id}`} className="text-blue-600 hover:underline">{d.name}</Link>
                      </span>
                    ))}
                  </p>
                </div>
              )}
              {movie.status && (
                <div>
                  <p className="text-xs text-gray-400">ステータス</p>
                  <p className="text-gray-700">{movie.status}</p>
                </div>
              )}
              {movie.release_date && (
                <div>
                  <p className="text-xs text-gray-400">公開日</p>
                  <p className="text-gray-700">{movie.release_date}</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-xs text-gray-400">予算</p>
                  <p className="text-gray-700">${movie.budget.toLocaleString()}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-xs text-gray-400">興行収入</p>
                  <p className="text-gray-700">${movie.revenue.toLocaleString()}</p>
                </div>
              )}
              {movie.production_companies.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">制作会社</p>
                  <p className="text-gray-700">
                    {movie.production_companies.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* 関連作品 */}
        {recommendations.length > 0 && (
          <div className="mt-16 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              関連作品
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recommendations.slice(0, 20).map((rec) => (
                <Link
                  key={rec.id}
                  href={`/movie/${rec.id}?type=${rec.media_type || type || "movie"}`}
                  className="flex-shrink-0 w-[130px] group"
                >
                  {rec.poster_path ? (
                    <Image
                      src={`${IMAGE_BASE_URL}/w185${rec.poster_path}`}
                      alt={rec.title || rec.name || ""}
                      width={185}
                      height={278}
                      className="w-full rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <p className="mt-2 text-xs font-medium text-gray-800 line-clamp-2">
                    {rec.title || rec.name || ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-28" />
    </main>
  );
}
