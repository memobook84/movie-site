import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovieDetail, getTvDetail, getMovieImages, getRecommendations, getWatchProviders, getReleaseDates, getJPReleaseDate, getCertification, getExternalIds, getCollectionDetail, getVideosEn, getNowPlayingJP, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import GalleryModal from "@/components/GalleryModal";
import ShareButton from "@/components/ShareButton";
import RelationButton from "@/components/RelationButton";
import PosterTappable from "@/components/PosterTappable";
import { getRelationData } from "@/lib/relations-data";
import ReleaseCountryMap from "@/components/ReleaseCountryMap";
import TrailerModal from "@/components/TrailerModal";
import ScrollableRow from "@/components/ScrollableRow";
import {
  Zap, Compass, Sparkles, Laugh, SearchCheck,
  Film, Drama, Home, Wand2, Landmark,
  Moon, Music, Eye, Heart, Rocket,
  Tv, Flame, Swords, Sun,
} from "lucide-react";
import { AiFillVideoCamera } from "react-icons/ai";
import { ComponentType } from "react";

function jaOverview(text: string | undefined): string {
  if (!text) return "";
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text) ? text : "";
}

const GENRE_ICONS: Record<number, ComponentType<{ className?: string }>> = {
  28: Zap, 12: Compass, 16: Sparkles, 35: Laugh, 80: SearchCheck,
  99: Film, 18: Drama, 10751: Home, 14: Wand2, 36: Landmark,
  27: Moon, 10402: Music, 9648: Eye, 10749: Heart, 878: Rocket,
  10770: Tv, 53: Flame, 10752: Swords, 37: Sun,
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "アメリカ合衆国", GB: "イギリス", JP: "日本", FR: "フランス", DE: "ドイツ",
  IT: "イタリア", ES: "スペイン", CA: "カナダ", AU: "オーストラリア", KR: "韓国",
  CN: "中国", IN: "インド", BR: "ブラジル", MX: "メキシコ", RU: "ロシア",
  NZ: "ニュージーランド", SE: "スウェーデン", NO: "ノルウェー", DK: "デンマーク",
  FI: "フィンランド", NL: "オランダ", BE: "ベルギー", AT: "オーストリア",
  CH: "スイス", IE: "アイルランド", PT: "ポルトガル", PL: "ポーランド",
  CZ: "チェコ", HU: "ハンガリー", GR: "ギリシャ", TR: "トルコ", ZA: "南アフリカ",
  AR: "アルゼンチン", CL: "チリ", CO: "コロンビア", TH: "タイ", PH: "フィリピン",
  ID: "インドネシア", MY: "マレーシア", SG: "シンガポール", VN: "ベトナム",
  TW: "台湾", HK: "香港", IL: "イスラエル", AE: "アラブ首長国連邦",
  EG: "エジプト", NG: "ナイジェリア", KE: "ケニア", UA: "ウクライナ",
  RO: "ルーマニア", BG: "ブルガリア", HR: "クロアチア", RS: "セルビア",
  LU: "ルクセンブルク", IS: "アイスランド", EE: "エストニア", LT: "リトアニア",
  LV: "ラトビア", SK: "スロバキア", SI: "スロベニア", MT: "マルタ",
  CY: "キプロス", PE: "ペルー", VE: "ベネズエラ", EC: "エクアドル",
  UY: "ウルグアイ", PK: "パキスタン", BD: "バングラデシュ", LK: "スリランカ",
  MM: "ミャンマー", KH: "カンボジア", NP: "ネパール", SA: "サウジアラビア",
  QA: "カタール", KW: "クウェート", JO: "ヨルダン", LB: "レバノン",
  IR: "イラン", IQ: "イラク", MA: "モロッコ", TN: "チュニジア", GH: "ガーナ",
};

function getCountryName(code: string, fallback: string): string {
  return COUNTRY_NAMES[code] || fallback;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "英語", ja: "日本語", ko: "韓国語", zh: "中国語", fr: "フランス語",
  de: "ドイツ語", es: "スペイン語", it: "イタリア語", pt: "ポルトガル語",
  ru: "ロシア語", hi: "ヒンディー語", ar: "アラビア語", th: "タイ語",
  sv: "スウェーデン語", da: "デンマーク語", no: "ノルウェー語", fi: "フィンランド語",
  nl: "オランダ語", pl: "ポーランド語", tr: "トルコ語", id: "インドネシア語",
  vi: "ベトナム語", ms: "マレー語", tl: "タガログ語", uk: "ウクライナ語",
  cs: "チェコ語", hu: "ハンガリー語", ro: "ルーマニア語", el: "ギリシャ語",
  he: "ヘブライ語", fa: "ペルシア語", bn: "ベンガル語", ta: "タミル語",
  te: "テルグ語", cn: "広東語",
};

function formatUSD(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

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

  const mediaType = type === "tv" ? "tv" : "movie";
  const canonicalUrl = `https://ardcinema.com/movie/${id}?type=${mediaType}`;

  return {
    title: `${title} `,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} `,
      description,
      url: canonicalUrl,
      ...(image && { images: [{ url: image, width: 1280, height: 720 }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} `,
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
  if (movie.id === 0) notFound();
  const title = movie.title || movie.name || "";
  const findVideos = (videos: { key: string; site: string; type: string; name?: string; published_at?: string }[]) =>
    videos.filter((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
  const findAllVideos = (videos: { key: string; site: string; type: string; name?: string; published_at?: string }[]) =>
    videos.filter((v) => v.site === "YouTube");
  let trailers = findVideos(movie.videos?.results || []);
  const enVideos = await getVideosEn(Number(id), type || "movie");
  if (trailers.length === 0) {
    trailers = findVideos(enVideos);
  }
  // 全動画: 日本語 + 英語を統合、重複排除（Trailer/Teaserを先頭に）
  const allJaVideos = findAllVideos(movie.videos?.results || []);
  const allEnVideos = findAllVideos(enVideos);
  const seenKeys = new Set(allJaVideos.map((v) => v.key));
  const typeOrder: Record<string, number> = { Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3, "Behind the Scenes": 4 };
  const allVideos = [...allJaVideos, ...allEnVideos.filter((v) => !seenKeys.has(v.key))]
    .sort((a, b) => (typeOrder[a.type] ?? 5) - (typeOrder[b.type] ?? 5));
  const cast = movie.credits?.cast.slice(0, 10) || [];
  const images = await getMovieImages(Number(id), type || "movie");
  const recommendations = await getRecommendations(Number(id), type || "movie");
  const watchProviders = await getWatchProviders(Number(id), type || "movie");
  const releaseCountries = type !== "tv" ? await getReleaseDates(Number(id)) : [];
  const jpReleaseDate = type !== "tv" ? await getJPReleaseDate(Number(id)) : null;
  const certification = type !== "tv" ? await getCertification(Number(id)) : null;
  const isNowPlayingJP = type !== "tv"
    ? (await getNowPlayingJP()).some((m) => m.id === Number(id))
    : false;
  const externalIds = await getExternalIds(Number(id), type || "movie");
  const year = movie.release_date?.slice(0, 4);
  const directors = movie.credits?.crew?.filter((c) => c.job === "Director") || [];
  const screenwriters = movie.credits?.crew?.filter((c) => c.job === "Screenplay" || c.job === "Writer") || [];
  const composers = movie.credits?.crew?.filter((c) => c.job === "Original Music Composer") || [];

  // コレクション（シリーズ）詳細
  const collection = movie.belongs_to_collection
    ? await getCollectionDetail(movie.belongs_to_collection.id)
    : null;

  // 人物相関図データ
  const relationData = getRelationData(movie.id);
  const allCast = movie.credits?.cast || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === "tv" ? "TVSeries" : "Movie",
    name: title,
    ...(movie.overview && { description: movie.overview }),
    ...(movie.poster_path && { image: `${IMAGE_BASE_URL}/w780${movie.poster_path}` }),
    ...(movie.release_date && { datePublished: movie.release_date }),
    ...(movie.first_air_date && { datePublished: movie.first_air_date }),
    ...(directors.length > 0 && { director: directors.map((d) => ({ "@type": "Person", name: d.name })) }),
    ...(movie.genres?.length > 0 && { genre: movie.genres.map((g) => g.name) }),
    ...(movie.vote_average > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: movie.vote_average.toFixed(1),
        bestRating: "10",
        ratingCount: movie.vote_count,
      },
    }),
    ...(cast.length > 0 && { actor: cast.map((c) => ({ "@type": "Person", name: c.name })) }),
    url: `https://ardcinema.com/movie/${id}?type=${type === "tv" ? "tv" : "movie"}`,
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* スマホ用ナビバー高さスペーサー（透明） */}
      <div className="h-10 md:hidden" />
      {/* ヒーロー画像 */}
      <div className="relative w-full overflow-hidden h-[60vw] max-h-[400px] md:h-[45vw] md:max-h-[560px] lg:h-[30vw] lg:max-h-[500px]">
        <div className="absolute top-0 left-0 right-0 hidden md:block h-16 bg-[#424242] z-10" />
        {movie.backdrop_path && (
          <img
            src={`${IMAGE_BASE_URL}/original${movie.backdrop_path}`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}
        {/* 下部を白へフェード */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{ background: "linear-gradient(to top, white 0%, rgba(255,255,255,0.7) 40%, transparent 100%)" }} />
      </div>

      {/* ポスター + テキスト情報（白背景） */}
      <div className="relative z-10 -mt-8 px-6 md:-mt-12 md:px-16 md:max-w-[1280px] md:mx-auto">
        <div className="flex flex-row gap-3 md:gap-0">
          {/* ポスター */}
          {movie.poster_path && (
            <div className="flex-shrink-0 self-start">
              <div style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
                <PosterTappable
                  posterPath={movie.poster_path}
                  title={title}
                  imageBase={IMAGE_BASE_URL}
                  images={images}
                />
              </div>
            </div>
          )}

          {/* テキスト情報 */}
          <div className="flex-1 flex flex-col gap-3 md:gap-5 pt-0 md:pl-4">
            <div>
              <h1 className="text-sm font-normal tracking-tight text-gray-900 md:text-4xl">
                {title}
              </h1>
              {movie.tagline && (
                <p className="mt-1 text-[10px] leading-4 text-gray-600 md:mt-2 md:text-sm md:leading-7">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* 年代タグ（スマホ）+ 年代+ジャンルタグ（PC） */}
            {year && (
              <div className="md:hidden text-[10px] text-gray-500">
                <span className="rounded-md bg-gray-100 px-2 py-0.5">{year}</span>
              </div>
            )}
            {(year || movie.genres.length > 0 || isNowPlayingJP) && (
              <div className="hidden md:flex flex-wrap items-center gap-2 text-xs text-gray-500">
                {isNowPlayingJP && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-red-500 font-bold">
                    <AiFillVideoCamera className="h-3.5 w-3.5" />
                    上映中
                  </span>
                )}
                {year && (
                  <span className="rounded-md bg-gray-100 px-2.5 py-1">{year}</span>
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
            )}

            {/* スマホ版ウォッチリストボタン（ポスター下端に揃える） */}
            <div className="mt-auto md:hidden">
              <FollowButton movieId={movie.id} title={title} posterPath={movie.poster_path} mediaType={type || "movie"} year={(movie.release_date || movie.first_air_date)?.slice(0, 4)} runtime={movie.runtime ?? undefined} providers={watchProviders?.flatrate?.map((p) => ({ logo_path: p.logo_path, provider_name: p.provider_name }))} small />
            </div>

            {/* あらすじ（PC版のみここに表示） */}
            <div className="hidden md:block space-y-2">
              <div className="border-b border-gray-300">
                <h2 className="inline-block text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                  <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>あらすじ</span>                </h2>
              </div>
              <p className="text-sm leading-7 text-gray-600">
                {jaOverview(movie.overview) || "この作品の説明はまだ登録されていません。"}
              </p>
            </div>

            {/* ウォッチリストボタン（PC版） */}
            <div className="mt-auto hidden md:block">
              <FollowButton movieId={movie.id} title={title} posterPath={movie.poster_path} mediaType={type || "movie"} year={(movie.release_date || movie.first_air_date)?.slice(0, 4)} runtime={movie.runtime ?? undefined} providers={watchProviders?.flatrate?.map((p) => ({ logo_path: p.logo_path, provider_name: p.provider_name }))} />
            </div>

          </div>
        </div>

        {/* ジャンルタグ（スマホ版） */}
        {(movie.genres.length > 0 || isNowPlayingJP) && (
          <div className="mt-6 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 md:hidden">
            {isNowPlayingJP && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-red-500 font-bold">
                <AiFillVideoCamera className="h-3 w-3" />
                上映中
              </span>
            )}
            {movie.genres.map((genre) => {
              const Icon = GENRE_ICONS[genre.id];
              return (
                <span
                  key={genre.id}
                  className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5"
                >
                  {genre.name}
                  {Icon && <Icon className="h-3 w-3" />}
                </span>
              );
            })}
          </div>
        )}

        {/* あらすじ（スマホ版） */}
        <div className="mt-4 space-y-2 md:hidden">
          <div className="border-b border-gray-300">
            <h2 className="inline-block text-sm font-normal uppercase tracking-widest text-gray-600">
              <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>あらすじ</span>            </h2>
          </div>
          <p className="text-sm leading-7 text-gray-600">
            {movie.overview || "この作品の説明はまだ登録されていません。"}
          </p>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="px-6 md:px-16 md:max-w-[1280px] md:mx-auto">

        {/* レビュー（一時非表示） */}
        {false && movie.id === 280 && (
          <div className="mt-8 md:mt-16 space-y-5">
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
        {false && movie.id === 1396 && (
          <div className="mt-8 md:mt-16 space-y-5">
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

        {/* レビュー: トップガン マーヴェリック */}
        {false && movie.id === 361743 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。正直、続編って聞いた時点で「ああ、またか」と思った。36年越しの続編なんて、ノスタルジーで客を釣るだけの企画だろう、と。でも開始10分で全部撤回した。</p>
              <p>トム・クルーズが本当に戦闘機に乗っている。これがとにかくデカい。CGじゃないと分かると、画面から伝わる重力が全然違う。Gで顔が歪む、呼吸が荒くなる——あれは演技ではなく、身体が勝手にそうなっている。そこに嘘がないから、観ているこちらの身体も強張る。</p>
              <p>マーヴェリックは、歳を取っても変わらない男として描かれているようで、実はかなり変わっている。グースの息子ルースターとの関係が物語の軸だが、あの距離感がいい。過保護とも取れるし、贖罪とも取れる。でもマーヴェリック本人も多分、自分の気持ちを整理できていない。そのままの状態で話が進んでいくのが、変にきれいにまとめていなくて好きだった。</p>
              <p>訓練パートは実質スポ根もので、若手パイロットたちとのやり取りがちゃんと面白い。ハングマンのいけ好かない感じとか、フェニックスの肝の据わり方とか、短い尺でもキャラが立っている。この辺のテンポ感はさすがだなと。</p>
              <p>クライマックスのミッション、あれはもう映画館で観た人間の勝ちだ。IMAXで観たのだが、峡谷の低空飛行シーンは本当に座席ごと持っていかれる感覚で、手に汗どころか息を止めていた。目標到達までのカウントダウン、あの緊張感は家のテレビでは再現できない。</p>
              <p>ペニーとの恋愛パートは正直ちょっと薄い。前作のチャーリーとの関係を知っていると「そこ変えるのか」という気持ちもある。ただジェニファー・コネリーの佇まいが良くて、マーヴェリックが帰る場所として機能しているから、まあこれはこれでいいのかもしれない。</p>
              <p>アイスマンとの再会シーン。ここで泣いた人間は多いだろう。ヴァル・キルマーの実際の病状を知った上で観ると、あのシーンはフィクションと現実の境目がなくなる。短いが、映画全体で一番重い場面だった。</p>
              <p>ハロルド・フォルターマイヤーのあのテーマ曲が流れた瞬間の高揚感——これはずるい。でもずるくていいのだ。ちゃんと物語が追いついているから、ノスタルジーが安売りになっていない。</p>
              <p>続編としてほぼ理想形。前作を超えたとまでは言わないが、前作がなければ成立しない物語を、きちんと2022年の映画としてやり切った。トム・クルーズがまだ自分の身体を張って映画を作っているうちに、これが生まれてよかった。</p>
            </div>
          </div>
        )}

        {/* レビュー: 千と千尋の神隠し */}
        {false && movie.id === 129 && (
          <div className="mt-8 md:mt-16 space-y-5">
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

        {/* レビュー: ジュラシック・ワールド／炎の王国 */}
        {false && movie.id === 351286 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。前半と後半で完全に別の映画になっている。前半は火山噴火から恐竜を救出する話で、後半は屋敷の中でホラー映画が始まる。この構成、好き嫌いが分かれるだろうが、個人的には嫌いじゃなかった。</p>
              <p>島からの脱出シーンは文句なしに良い。溶岩が迫る中、ブラキオサウルスが港に取り残されて、霧の中に消えていくあの画。あれは反則だろう。1作目で初めて恐竜を見た時の感動と、こういう形で繋がるとは思わなかった。あのシーンだけで、この映画を観た価値がある。</p>
              <p>後半のロックウッド邸でのインドラプトルとの攻防は、ほとんどゴシックホラーだった。暗い廊下、窓から差し込む月明かり、爪がカチカチと床を叩く音。J・A・バヨナの出自がホラー畑というのが存分に出ている。ジュラシックシリーズでこの空気を作れるのか、と少し驚いた。</p>
              <p>ただ、悪役が薄い。武器商人たちのくだりは既視感しかなくて、恐竜をオークションにかけるという展開も値段が安すぎて笑ってしまった。あの恐竜たちの値段、都内のマンションより安いのはどうなのか。</p>
              <p>クリス・プラットは相変わらずいい。ブルーとの関係性がこのシリーズの感情的な軸になっているのは間違いない。人間と恐竜の信頼というテーマを、大げさにせず、でもしっかり描いている。</p>
              <p>ラスト、恐竜たちが世界に解き放たれる。あの判断の是非はともかく、シリーズとしてついにここまで来たかという感慨はあった。「恐竜と共存する世界」という次章への布石として、このエンディングは正しかったと思う。完璧な映画ではないが、記憶に残る場面をいくつも持っている。それで十分だった。</p>
            </div>
          </div>
        )}

        {/* レビュー: となりのトトロ */}
        {false && movie.id === 8392 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>テレビで観た。何回目かも覚えていない。金曜ロードショーでやるたびに、なんとなくチャンネルを合わせてしまう。別に「観よう」と意気込むわけでもなく、気づいたら観ている。そういう映画だ。</p>
              <p>子供の頃は、ただトトロが出てくるのを待っていた。バス停でトトロが隣に立つ場面、猫バスが走る場面、それだけで満足だった。話の内容なんて正直どうでもよかった。トトロがかわいい、猫バスがかっこいい、それで十分だった。</p>
              <p>大人になって観返すと、全然違うものが見える。あの映画、母親が入院しているのだ。引っ越してきた理由も、父親がどこか無理して明るく振る舞っているのも、全部そこに繋がっている。サツキが台所に立って弁当を作っている場面。小学生の女の子が、妹の世話をしながら家事をしている。あれを「しっかり者のお姉ちゃん」と見るのは子供の目線で、大人が観ると胸が苦しくなる。あの子は頑張りすぎている。</p>
              <p>メイが迷子になった時、サツキが走り回って泣くシーン。あそこで初めて、サツキの中に溜まっていたものが全部溢れ出る。「お母さんが死んじゃったらどうしよう」という本音が出る。あの一言で、それまでの明るい冒険映画の下に流れていた不安が、一気に表に出てくる。子供の頃はあのシーンの意味が分からなかった。今は分かりすぎて辛い。</p>
              <p>でもこの映画が凄いのは、その重さを重さのまま放り出さないところだ。猫バスが来て、メイが見つかって、トウモロコシが病室の窓辺に置かれる。それだけ。大げさな解決はない。でもあれでいいのだ。あの一本のトウモロコシが、「大丈夫だよ」という子供たちの精一杯の言葉になっている。</p>
              <p>何回観ても飽きない理由が、最近やっと分かった気がする。この映画は、観るたびにこっちが変わっている。子供の時は冒険映画で、親になったら親の映画になる。同じ映画なのに、毎回違うものが刺さる。そういう作品は、本当に数えるほどしかない。</p>
            </div>
          </div>
        )}

        {/* レビュー: グリーンマイル */}
        {false && movie.id === 497 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>配信で観た。3時間を超える映画だと知って、少し身構えていた。でも再生ボタンを押してからエンドロールまで、一度も止めなかった。止められなかった。</p>
              <p>死刑囚棟の看守と、そこに送られてきた大男の話。ジョン・コーフィーという名前の、あまりにも穏やかな巨人。人を殺したとされているのに、暗闇を怖がり、涙をこぼす。マイケル・クラーク・ダンカンの芝居が凄い。あの大きな身体から滲み出る優しさと悲しみが、画面越しにこちらの胸まで届いてくる。</p>
              <p>グリーンマイル——死刑囚が電気椅子まで歩く緑色の床。あの廊下を歩く人間たちの物語が、一人ひとり丁寧に描かれる。デル・ムーアとネズミのミスター・ジングルズ。あの小さな命のやり取りが、死刑という巨大なテーマの中にそっと置かれている。こういう細部の積み重ねが、この映画を長尺でも飽きさせない理由だろう。</p>
              <p>パーシーという男が本当に不快だ。権力を笠に着た小さな人間。でもああいう人間がいるからこそ、ポールやブルータスの誠実さが際立つ。善悪の対比が露骨なはずなのに、嫌味にならないのはスティーブン・キングの原作の力だと思う。</p>
              <p>ジョン・コーフィーの処刑シーン。あれは本当にきつかった。罪を犯していない人間が、自分から死を選ぶ。「この世の残酷さに疲れた」と。あの言葉が重すぎて、しばらく画面がぼやけて見えなかった。涙が止まらなかったのは、悲しいからだけじゃない。こんな理不尽がまかり通る世界への怒りもあった。</p>
              <p>ポールが語り部として老人ホームで過去を振り返る構成。最後に明かされる彼の「罰」。奇跡を受け取った代償として、愛する人たちを全員見送り続ける人生。ジョン・コーフィーが残した光が、ポールにとっては終わらない夜になっている。観終わった後、しばらくソファから動けなかった。</p>
            </div>
          </div>
        )}

        {/* レビュー: アバター */}
        {false && movie.id === 19995 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。3D上映。メガネをかけてスクリーンを見た瞬間、パンドラの森が目の前に広がった。あの衝撃は、映画体験として生涯忘れないと思う。</p>
              <p>ストーリーだけを取り出せば、植民地支配と先住民の抵抗という、何度も語られてきた話だ。「ダンス・ウィズ・ウルブズ」や「ポカホンタス」と構造が同じだという指摘は正しい。でもこの映画の本質はそこじゃない。ジェームズ・キャメロンが12年かけて作り上げた「あの世界に行ける」という体験。それが全てだった。</p>
              <p>パンドラの夜。生物発光で森全体が青白く輝く。足を踏み出すたびに地面が光り、胞子が宙を舞う。あの映像を3Dの大画面で浴びた時、本当に別の惑星に立っている感覚があった。映画を「観る」のではなく「体験する」とはこういうことかと、初めて理解した。</p>
              <p>ジェイクがイクランと初めて空を飛ぶシーン。あれは映画史に残る浮遊感だった。風を切る音、翼の振動、眼下に広がる浮遊する山々。手に汗を握るとかそういうレベルではなくて、本当に高所にいる感覚で足がすくんだ。椅子に座っているのに。</p>
              <p>ネイティリが好きだった。最初はジェイクを敵視していたのが、少しずつ心を開いていく。「I see you」という言葉の意味が、単なる「見る」ではなく「理解する」「受け入れる」に変わっていく過程。ゾーイ・サルダナのモーションキャプチャーの芝居が、CGのキャラクターにちゃんと魂を宿していた。</p>
              <p>最終決戦は映画館が揺れているかと思った。ナヴィと人間の戦争。あの物量と迫力。でもどれだけ派手な戦闘があっても、この映画で一番心に残っているのはパンドラの夜の森だ。静かで、美しくて、生きている世界。あの場所にもう一度行きたい。映画館を出た後、現実の街がやけに色褪せて見えた。キャメロンの狙い通りだったんだろう。</p>
            </div>
          </div>
        )}

        {/* レビュー: ユージュアル・サスペクツ */}
        {false && movie.id === 629 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>配信で観た。何も知らない状態で再生した。それが正解だった。この映画について事前に何か知っている人間は、それだけで損をしている。</p>
              <p>5人の犯罪者が警察の面通しで集められる。そこから始まる犯罪劇。誰が嘘をついていて、誰が本当のことを言っているのか。観ている間ずっと、地面がぐらぐらしているような感覚があった。</p>
              <p>カイザー・ソゼという名前。映画の中で何度も囁かれるその名前が、都市伝説のように物語全体に影を落としている。実在するのか、しないのか。一人の人間なのか、概念なのか。あの不確かさが、画面に独特の緊張感を生んでいた。</p>
              <p>ケヴィン・スペイシーのヴァーバル・キント。足を引きずる小柄な詐欺師。弱々しくて、饒舌で、どこか憎めない。彼が語る物語に、刑事も観客も引き込まれていく。あの語り口の巧さ。聞いているうちに、何が事実で何が作り話なのか、境界が溶けていく。</p>
              <p>ラスト5分。あの展開を初見で食らった衝撃は、今でも鮮明だ。コーヒーカップが落ちる。掲示板の文字。足取りが変わる。全てのピースが一瞬で組み変わって、観ていた映画が丸ごと別の意味を持ち始める。あの瞬間、声が出た。思わず巻き戻して最初から見直した。二度目は完全に違う映画に見えた。</p>
              <p>「このトリック、一回しか効かないだろう」と言う人もいるだろう。でも違う。騙された後にもう一度観ると、至るところに伏線が仕込まれていて、また別の発見がある。何度でも観られる。何度でも感心する。脚本の力だけで映画史に名を残した、稀有な一本だった。</p>
            </div>
          </div>
        )}

        {/* レビュー: ノマドランド */}
        {false && movie.id === 581734 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>配信で観た。静かな映画だった。派手な事件も起きないし、大きな音楽も鳴らない。でも観終わった後、しばらく何も観る気になれなかった。あの余韻の深さは何だったのか。</p>
              <p>ファーンという女性が、バンに乗ってアメリカ各地を転々とする。夫を亡くし、町が消え、家を失った。でもこの映画は彼女を「かわいそうな人」として描かない。ファーンは自分で選んでいる。少なくとも、自分ではそう思っている。その曖昧さが、この映画の核にある。</p>
              <p>フランシス・マクドーマンドの芝居が凄まじい。芝居に見えない。ノマドたちのコミュニティに実際に入り込んで、本物のノマドと一緒に生活している。リンダ・メイやスワンキーは実際のノマドで、彼らの言葉には台本にはない重みがあった。フィクションとドキュメンタリーの境目が消えている。</p>
              <p>アメリカの荒野の映像が美しい。でもその美しさは「絵になる風景」というよりも、そこに実際に立った時の肌寒さや孤独を含んでいる。朝焼けの中で一人コーヒーを入れるファーンの姿。あの自由さと寂しさが同居した画を観て、自分が何を感じているのか分からなくなった。羨ましいのか、切ないのか。</p>
              <p>デイブとの関係が印象に残った。温かい家に迎え入れてくれる人がいる。定住する選択肢がある。でもファーンは出ていく。なぜ出ていくのか。映画は答えを言わない。でも分かる気がした。一度手放したものを、もう一度手に入れることへの怖さ。あるいは、もう戻れないと気づいている静かな覚悟。</p>
              <p>「ノマドはさよならを言わない。また会おうと言う」。この言葉が、映画全体の温度を表していた。別れではなく、ただ続いていく旅。エンドロールの後、窓の外の景色がいつもと違って見えた。自分はどこに向かっているのか。そんなことを、久しぶりに考えた。</p>
            </div>
          </div>
        )}

        {/* レビュー: ジョーカー */}
        {false && movie.id === 475557 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>配信で観た。夜中に一人で観たのは失敗だったかもしれない。観終わった後、部屋の空気がおかしくなっていた。重いとか暗いとかいう次元ではなく、何か有害なものを吸い込んでしまったような気分だった。</p>
              <p>アーサー・フレック。笑いの発作を持つ、誰からも見えない男。母親の介護をしながらピエロの仕事をして、コメディアンを夢見ている。その全てが、一つずつ剥がされていく。社会福祉は打ち切られ、母の秘密が暴かれ、憧れの人間に裏切られる。転がり落ちていく過程を、カメラが至近距離で追いかける。逃げ場がない。観ている側にも。</p>
              <p>ホアキン・フェニックスの身体。あの痩せ方は異常だった。肩甲骨が浮き出て、肋骨が数えられる。鏡の前で踊るシーン、あの身体の動きに目が離せなかった。美しいとも醜いとも言えない、ただ異様な存在感。人間の身体がここまで多くのことを語れるのかと思った。</p>
              <p>階段のシーン。あの長い階段を、アーサーは映画の前半では重い足取りで登っていく。そしてジョーカーになった後、同じ階段を踊りながら降りてくる。ロック・ステディのリズムに乗って、煙草をくゆらせながら。あの対比がこの映画の全てを語っている。上ることが苦痛だった世界を、下ることで解放される男。</p>
              <p>マレー・フランクリンのトーク番組のシーン。あの緊張感は尋常じゃなかった。何が起きるか分かっているのに、画面から目を逸らせない。アーサーの声が震えている。でもあの震えが、恐怖なのか興奮なのか分からない。その境界の崩壊を、ホアキンは完璧に演じ切った。</p>
              <p>これはヒーロー映画ではない。悪役の誕生譚でもない。社会に存在しないことにされた人間が、暴力によって初めて「見えた」存在になる話だ。そのことの恐ろしさが、フィクションの枠を超えてこちらに迫ってくる。観終わった後、しばらく電気をつけたまま座っていた。</p>
            </div>
          </div>
        )}

        {/* レビュー: ハリー・ポッターと賢者の石 */}
        {false && movie.id === 671 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>配信で久しぶりに観直した。何度目か分からない。でも毎回、ハグリッドが「おまえは魔法使いだ、ハリー」と言う場面で同じ気持ちになる。ここから全てが始まるのだという、あのワクワク。</p>
              <p>ホグワーツに初めて到着するシーン。湖の上をボートで渡って、城が見えた瞬間。あの画だけで涙が出そうになるのは、きっとその後のシリーズ全部の記憶が重なっているからだ。初めて観た時はただ「すごい」と思っただけだった。でも今観ると、あの城にはもっと多くのものが詰まっている。</p>
              <p>ダニエル・ラドクリフが小さい。本当に子供だ。階段の下の物置で暮らしている男の子が、自分が特別な存在だと知る。あの設定のシンプルな強さ。どんな子供でも——いや、大人だって——「実は自分には隠された力がある」という物語には抗えない。</p>
              <p>組分け帽子、動く階段、蛙チョコレート、クィディッチ。魔法世界のディテールが次から次へと出てくる。一つひとつが楽しくて、画面の端まで目が忙しい。J・K・ローリングの原作の想像力を、クリス・コロンバスが丁寧に、愛を持って映像にしている。派手さよりも温かさを優先した演出が、この第1作には合っていた。</p>
              <p>アラン・リックマンのスネイプ。初登場から不穏で、怪しくて、嫌な奴。でもシリーズ全体を知った上で観ると、あの冷たい目の奥にあるものが透けて見えてしまう。リックマンは最初から全て知った上で演じていた。その事実が、今となっては切ない。</p>
              <p>ジョン・ウィリアムズのテーマ曲。あのメロディが流れた瞬間に、もう魔法にかかっている。何度聴いても色褪せない。この映画は完璧な映画ではないかもしれない。でも完璧な「始まり」だ。ここから7年分の旅が始まる。その最初の一歩として、これ以上のものはない。</p>
            </div>
          </div>
        )}

        {/* レビュー: 劇場版 鬼滅の刃 無限列車編 */}
        {false && movie.id === 635302 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。公開からだいぶ経っていたけど、まだ席はほとんど埋まっていた。隣に座っていた小学生くらいの女の子が、終盤ずっと泣いていたのを覚えている。</p>
              <p>テレビアニメの続きがそのまま映画になった作品で、列車の中で鬼と戦う話だ。正直、最初は「テレビの延長を映画館で観る必要あるのか」と思っていた。でも観終わった後は、映画館で観てよかったと素直に思った。</p>
              <p>前半は夢の中の話が続く。鬼の術にかかって、登場人物たちがそれぞれ自分にとって一番幸せな夢を見せられる。炭治郎の夢は、死んだ家族と一緒にいる日常。もう戻れないはずの場所。そこから自分の意志で抜け出す場面があるのだが、あの選択の重さは大人のほうが刺さると思う。捨てたくないものを自分で手放す痛み。</p>
              <p>この映画の主役は、途中から合流する煉獄杏寿郎だ。声がでかくて、飯をうまそうに食う、やたらと明るい男。最初は暑苦しいなと思う。でもこの男が、後半になって全部持っていく。</p>
              <p>終盤、上弦の参・猗窩座が現れる。鬼の中でも最上位クラスの存在で、純粋な武闘家。煉獄との一対一の戦いになるのだが、アニメーションの質が明らかにテレビとは違っていて、炎の呼吸と猗窩座の拳がぶつかる場面は映画館の大きなスクリーンと音響で観る価値があった。</p>
              <p>でもこの映画が本当に効いてくるのは、戦いの後だ。煉獄は勝ったわけでもなく、負けたわけでもない。ただ、乗客全員と仲間を守り切った。その結果として何が残るか。あの場面を観た時、ああこれは子供向けのアニメの枠を超えているな、と思った。</p>
              <p>隣の女の子がボロボロ泣いていて、反対側のおじさんも目を押さえていた。自分も目頭が熱くなった。400億円という数字がどうこうではなく、あの映画館の空気そのものが、この映画の評価だったと思う。</p>
            </div>
          </div>
        )}

        {/* レビュー: 名探偵コナン ゼロの執行人 */}
        {false && movie.id === 493006 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。公開初日、周りはほぼ安室透目当ての客で埋まっていた。自分もその一人だった。</p>
              <p>コナン映画にしては異質な作品だ。爆発もカーチェイスもあるけど、物語の核にあるのは公安警察とサイバーテロ。IoTテロで東京を人質に取るという設定が、アニメ映画にしてはやけに生々しい。正直、途中の法廷シーンや捜査パートは子供には難しいだろう。でもそこが良かった。コナン映画がここまで大人向けに振り切れるのかと。</p>
              <p>安室透——降谷零。この男の底が見えない。公安として動いているのか、個人の信念で動いているのか、最後まで読めない。味方なのか敵なのか分からないまま話が進む緊張感。あの曖昧さが、この映画を単なるヒーローものから引き離している。「僕の恋人は、この国さ」というセリフ、普通なら寒くなるはずなのに、安室が言うと成立してしまう。あのキャラクターの説得力は異常だった。</p>
              <p>クライマックスの無人探査機が落ちてくるシーン。コナンがスケボーで爆走して、安室がRX-7で並走する。物理法則？ 知らない。でもあの場面、映画館で身体が前のめりになっていた。リアリティなんてどうでもいい、このまま突っ走ってくれという気持ちだけがあった。コナン映画のクライマックスは毎回めちゃくちゃだが、このめちゃくちゃさは格別だった。</p>
              <p>小五郎が逮捕されて、蘭が泣いて、コナンが一人で巨大な組織に立ち向かう。この構図は定番だけど、今回は相手が「国家」だ。悪い奴を捕まえればいいという話じゃない。正義と正義がぶつかっている。子供向けアニメでそれをやるのか、と少し震えた。</p>
              <p>映画館を出た後、夜の街を歩きながら、安室透のことばかり考えていた。あの男は本当に正しかったのか。答えは出ない。出ないまま、もう一回観たいと思っている自分がいた。</p>
            </div>
          </div>
        )}

        {/* レビュー: 名探偵コナン 純黒の悪夢 */}
        {false && movie.id === 374856 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。冒頭のカーチェイスで完全に持っていかれた。開始5秒でアクセル全開。首都高を赤井と安室と謎の女がぶっ飛ばす。コナン映画史上、最も暴力的なオープニングだったと思う。</p>
              <p>赤井秀一と安室透が同じ画面にいる。それだけでもう、ファンとしてはチケット代の元が取れている。この二人の因縁、原作を追いかけてきた人間にはたまらない。観覧車の上で拳をぶつけ合うシーン、あれは少年漫画のぶつかり合いそのもので、理屈じゃなくて血が沸いた。</p>
              <p>キュラソーという女性キャラクターが、この映画だけで完結する存在なのが切ない。黒の組織のメンバーでありながら、記憶を失って少年探偵団と過ごすうちに、人間らしさを取り戻していく。ベタだ。ベタなんだけど、あの観覧車のシーンを見せられたら何も言えなくなる。彼女が最後に選んだ行動、あれは記憶が戻ったからじゃない。子供たちと過ごした時間が、身体に刻まれていたからだ。</p>
              <p>観覧車が暴走して街に転がり落ちるクライマックス。もうめちゃくちゃだ。でもコナン映画のクライマックスはめちゃくちゃでいい。赤井がライフルで狙撃して、安室がヘリで突っ込んで、コナンがサッカーボールを蹴る。全員が全力で、全員がかっこいい。こういう映画を観に来たんだ、という満足感がある。</p>
              <p>黒の組織が本格的に動く劇場版は久しぶりで、あのピリピリした空気が全編に張り詰めていた。ジンの冷徹さ、ベルモットの不気味な微笑み、組織が画面に映るだけで空気が変わる。日常回のコナンとは別物の緊張感。</p>
              <p>映画館を出た時、まだ心臓がバクバクしていた。冒頭からラストまでずっとアクセルを踏みっぱなしの映画。息をつく暇がなかった。でもその中にキュラソーの物語がちゃんとあって、ただ派手なだけでは終わらせない。コナン映画として、最高の一本だった。</p>
            </div>
          </div>
        )}

        {/* レビュー: ファンタスティック・ビーストと魔法使いの旅 */}
        {false && movie.id === 259316 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>金曜のレイトショーで観た。仕事終わりで頭がぼんやりしていたのに、スクリーンにニューヨークの街並みが映った瞬間、一気に引き込まれた。ハリー・ポッターの世界に戻ってきた——いや、違う。ここは知らない場所だ。同じ魔法の匂いがするのに、空気がまるで違う。</p>
              <p>ニュート・スキャマンダーという男が、トランク一つで1920年代のニューヨークに降り立つ。魔法動物がトランクから逃げ出して、それを追いかけ回す話。筋だけ言えばそれだけだ。でもその「それだけ」の中に、とんでもない量の豊かさが詰まっている。</p>
              <p>ニュートが好きだ。ヒーローらしくない。目を合わせるのが苦手で、人間より動物といるほうが落ち着く。杖を構えて戦う姿よりも、ポケットからエサを取り出して魔法動物をなだめている時のほうがずっと生き生きしている。エディ・レッドメインのあの伏し目がちな芝居が、このキャラクターに体温を与えていた。人付き合いが下手で、でも生き物への愛情だけは誰よりも深い。ああいう不器用さに、どうしても惹かれてしまう。</p>
              <p>トランクの中に広がる魔法動物の保護区。あそこに入った瞬間の、あの色彩。砂漠があって、雪原があって、熱帯の森がある。一つのトランクの中に世界がまるごと入っている。サンダーバードが羽を広げた時の光の粒子、ニフラーが金貨を腹に詰め込む時のあの顔。画面の隅々まで「この世界が好きだ」という作り手の感情が滲んでいて、観ているだけで幸福だった。</p>
              <p>ジェイコブがいい。ノー・マジの、ただのパン屋志望の男。魔法なんて何も持っていない。でも彼がこの物語の中にいることで、魔法の世界が急に手触りのあるものになる。初めてトランクの中を見た時の、あの顔。驚きと喜びが混ざった、子供みたいな表情。自分も多分、同じ顔をしていたと思う。</p>
              <p>雨の中でのラストシーン。ジェイコブの記憶が雨に溶けて消えていく。あの切なさはずるかった。冒険を共にした仲間が、全部忘れてしまう。でもパン屋を開いた彼の店に並ぶパンが、魔法動物の形をしている。覚えていないのに、身体のどこかが覚えている。あの着地に、映画館を出た後の夜風が妙に沁みた。一人で歩く帰り道、まだあのトランクの中の景色が頭に残っていた。</p>
            </div>
          </div>
        )}

        {/* レビュー: グレイテスト・ショーマン */}
        {false && movie.id === 316029 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。冷静に考えると、話の筋はかなり雑だ。伝記映画としては史実をほとんど無視しているし、バーナムの暗い部分はきれいに省かれている。でもそんなことはどうでもよくなる。音楽が鳴った瞬間に、全部持っていかれる。</p>
              <p>「The Greatest Show」が始まった時の高揚感がすごかった。座席に座っているのに身体が動きそうになる。この映画は理屈じゃなくて、身体で受け取るタイプの作品だ。頭で考えるとツッコミどころだらけなのに、心と身体が完全に映画の側についてしまう。</p>
              <p>「This Is Me」は劇中で聴いた時より、映画館を出た後にじわじわ効いてきた。キアラ・セトルの声量と、あの歌詞の組み合わせ。社会から弾かれた人間たちが「これが私だ」と歌い上げる。ミュージカル映画のナンバーとして、近年これを超えるものはなかなか出てこないだろう。</p>
              <p>ザック・エフロンとゼンデイヤの空中ブランコのシーン。「Rewrite The Stars」が流れる中、二人が宙を舞う。あの場面の美しさは異常だった。重力を忘れたような浮遊感と、届きそうで届かない二人の距離。映像と音楽の幸福な融合というのは、まさにこういうことだろう。</p>
              <p>ヒュー・ジャックマンの存在感が、この映画を成立させている。歌える、踊れる、芝居もできる。バーナムという山師を演じるのに、これ以上の人間はいない。野心と愛嬌が同居している顔。あの笑顔を見ていると、詐欺師でも許してしまいそうになる。</p>
              <p>完璧な映画かと聞かれたら、全然違う。でも映画館を出た時、足取りが軽かった。帰り道にサントラを買って、何度も何度も聴いた。映画の力というのは、こういうことなのかもしれない。理屈を超えて、人の気分を変えてしまう力。この映画にはそれがあった。</p>
            </div>
          </div>
        )}

        {/* レビュー: アベンジャーズ／インフィニティ・ウォー */}
        {false && movie.id === 299536 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。エンドクレジットが始まった時、館内が静まり返っていた。誰も立ち上がらない。誰も喋らない。あんな空気は初めてだった。</p>
              <p>これはサノスの映画だ。10年かけて積み上げてきたMCUのヒーローたち全員が、たった一人のヴィランに負ける話。その構成がまず凄い。普通、こんな企画は通らない。でもマーベルはやった。そしてそれが正解だった。</p>
              <p>サノスに説得力がある。ただの悪党ではなく、自分なりの論理と、奇妙な悲しみを持っている。ガモーラを崖から突き落とすシーンで流した涙。あれが本物だったというのが、このキャラクターの恐ろしさだ。愛しながら殺せる。信念のためなら何でも差し出せる。そういう敵に、ヒーローたちはどう勝てばいいのか。</p>
              <p>タイタンでの戦い。ドクター・ストレンジ、アイアンマン、スパイダーマン、ガーディアンズが集結してサノスに挑む。あそこのチームワークは観ていて気持ちが良かった。それでも勝てない。スター・ロードが感情的になってガントレットを外し損ねる場面、あれを「馬鹿だ」と責める気にはなれなかった。ああいう人間臭さが、このシリーズの良さだろう。</p>
              <p>ソーの新しい斧ストームブレイカーを手にしてワカンダに降り立つ場面。あれは10年分のカタルシスだった。アラン・シルヴェストリのアベンジャーズのテーマが鳴って、雷が落ちて、ソーが叫ぶ。映画館で鳥肌が立った。</p>
              <p>そして指パッチン。バッキー、ブラックパンサー、グルート、スパイダーマン——次々と消えていく。スパイダーマンがトニーにしがみついて「行きたくない」と言うあの場面。あれは本当にきつかった。子供が怖がって泣いているようにしか見えなくて、胸が詰まった。</p>
              <p>ヒーロー映画でここまで絶望的な終わり方をした作品があっただろうか。でもだからこそ、次を観なければならないと思わせる。最悪の終わり方が、最高の引きになっている。構造として完璧だった。</p>
            </div>
          </div>
        )}

        {/* レビュー: ミッション：インポッシブル／フォールアウト */}
        {false && movie.id === 353081 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。シリーズ6作目にして、明らかに最高傑作だった。普通、シリーズものは回を重ねるごとに勢いが落ちる。この映画は逆だ。前作までの全てを踏み台にして、さらに上に跳んでいる。</p>
              <p>トム・クルーズが本当にHALOジャンプをしている。本当にヘリコプターを操縦している。本当にビルからビルへ走って飛んでいる。そして本当に足首を骨折して、そのテイクがそのまま使われている。この人は一体何なのか。56歳の人間がやることではない。でもやっている。その事実が、画面の説得力を異次元のものにしている。</p>
              <p>パリでのバイクチェイス。凱旋門のロータリーを逆走するシーンは、観ていて手が冷たくなった。カースタントとバイクスタントが入り混じって、カメラがそのど真ん中にいる。CGで作れる映像とは根本的に違う何かがある。物理的に危険だという情報が、映像を通じてそのまま伝わってくる。</p>
              <p>ヘンリー・カヴィルのオーガスト・ウォーカーがいい敵だった。トイレでの格闘シーン、あの拳の装填モーションは一度見たら忘れられない。肉体のぶつかり合いに説得力があるのは、カヴィルの体格あってこそだ。イーサン・ハントが初めて物理的に敵わないかもしれないと思わせる相手。そのプレッシャーが映画全体のテンションを引き上げている。</p>
              <p>カシミールでのヘリコプターチェイス。あれはもう映画のアクションシーンとして歴史に残るレベルだった。崖の上でヘリ同士がぶつかり、トム・クルーズが荷物用のロープにぶら下がって宙を舞う。あの状況を本当にやっている人間がいるという事実に、頭がついていかない。</p>
              <p>クリストファー・マッカリーの脚本と演出が、アクションとドラマを完全に一体化させている。走りながら考え、戦いながら選択する。イーサン・ハントという男の「一人も見捨てない」という信念が、そのまま映画の推進力になっている。アクション映画の一つの到達点だと思う。</p>
            </div>
          </div>
        )}

        {/* レビュー: レディ・プレイヤー1 */}
        {false && movie.id === 333339 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。スピルバーグが撮るポップカルチャーの万博。画面の情報量が多すぎて、一回では絶対に全部拾えない。でもそれでいい。この映画自体が、何度でも遊びに行きたくなるゲームのようなものだ。</p>
              <p>オアシスに入った瞬間の興奮は凄まじかった。ガンダムが出てきて、メカゴジラが暴れて、アイアン・ジャイアントが拳を振るう。普通なら権利関係だけで企画が潰れそうなキャラクターたちが、一つの画面にいる。スピルバーグだから実現できた、としか言いようがない。</p>
              <p>最初のレース。あのシーンだけで映画一本分の密度がある。キングコングが道を塞ぎ、T-REXが追いかけてきて、デロリアンが走り抜ける。VR空間だからこそ可能な、物理法則を無視したカーチェイス。観ている側の脳が処理落ちする快感があった。</p>
              <p>シャイニングのステージは完全に予想外だった。スピルバーグがキューブリックの映画の中に観客を放り込む。あのオーバールック・ホテルの廊下を歩く恐怖と興奮が入り混じった感覚。ホラーとアドベンチャーがこんな形で融合するとは。</p>
              <p>現実世界パートが少し弱いのは否めない。IOI側の描写は紋切り型だし、ソレントはヴィランとしてもう一段深みが欲しかった。でもこの映画の本質はそこではない。「好きなものを好きだと言える場所」としてのオアシスの価値。それを70代のスピルバーグが全力で肯定しているという事実に、胸が熱くなった。</p>
              <p>ラスト、ハリデーの告白。ゲームの創造主が本当に欲しかったのは、現実世界での繋がりだったという着地。ベタだが、スピルバーグが言うと重みが違う。映画もゲームも、結局は人と人を繋ぐためのものだ。エンドロールが終わっても、あのオアシスにもう一度入りたいと思っている自分がいた。</p>
            </div>
          </div>
        )}

        {/* レビュー: スター・ウォーズ／最後のジェダイ */}
        {false && movie.id === 181808 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5">
              <span className="text-xs font-bold tracking-widest text-gray-900">SPECIAL REVIEW</span>
            </div>
            <div className="space-y-4 text-sm leading-7 text-gray-600">
              <p>映画館で観た。エンドクレジットが流れた瞬間、頭の中がぐちゃぐちゃだった。面白かったのか、怒っているのか、自分でもよく分からない。ただ、とんでもないものを見せられたという感覚だけがあった。</p>
              <p>ルーク・スカイウォーカーが、あんなことになっているとは思わなかった。銀河の希望だった男が、孤島で隠遁して、ジェダイを終わらせると言っている。最初は正直「嘘だろ」と思った。でも観ていくうちに、これはこれで筋が通っているのかもしれないと思い始めた。弟子を闇に落としてしまった人間が、もう一度教える側に立つことへの恐怖。あれは分かる気がした。</p>
              <p>ライアン・ジョンソンは明らかに、観客の予想を片っ端からひっくり返しにきている。スノークの正体は？ ぶった切られて終わり。レイの両親は？ 誰でもない。ルークがライトセーバーを受け取る？ 後ろにポイ。ここまで全部裏切られると、もう笑うしかなかった。賛否あるのは当然だろう。でも少なくとも退屈はしなかった。</p>
              <p>カイロ・レンが、この映画で一番生きていたキャラクターだと思う。ダース・ベイダーの模倣者という立場から、マスクを叩き壊して自分の道を行こうとする。スノークの玉座の間での共闘シーンは、赤い背景にライトセーバーの光が交錯して、画としても凄まじかった。あの瞬間だけは、レイとカイロ・レンの間に本当に何かが生まれかけていた。</p>
              <p>カント・バイトのカジノのくだりは、正直長い。フィンとローズのパートは映画全体のテンポを落としている。テーマとして「戦争で儲ける人間がいる」というのは分かるが、あそこに尺を使う必要があったのかと言われると苦しい。</p>
              <p>逆に、ホルド提督のハイパースペース特攻。あの瞬間、映画館が完全に無音になった。音が消えて、スクリーンが白く裂けて、誰一人動かなかった。映画体験として、あれを超える瞬間にはそうそう出会えない。</p>
              <p>ラストのルーク。塩の惑星クレイトに現れて、カイロ・レンと対峙する。あの足運び、あの余裕、あのたたずまい。そしてそれがフォースの投影だったと分かった時——やられた、と思った。最後に二つの太陽を見上げるルーク。エピソード4の夕日のシーンと繋がるあの画。マーク・ハミルはこの一場面だけで、全部持っていった。</p>
              <p>賛否は今でも割れているし、自分の中でも完全には決着がついていない。でも何年経っても忘れられない映画というのは、それだけで価値がある。好きか嫌いかではなく、あの体験をしたという事実が残っている。そういう映画だった。</p>
            </div>
          </div>
        )}

        {/* 作品情報 */}
        {(directors.length > 0 || screenwriters.length > 0 || composers.length > 0 || movie.runtime > 0 || movie.budget > 0 || movie.revenue > 0 || movie.production_companies.length > 0) && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 border-b border-gray-300">
                <h2 className="inline-block text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                  <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>作品情報</span>                </h2>
              </div>
              <div className="flex flex-wrap gap-[10px] pb-2 pl-4">
                <GalleryModal images={images} imageBase={IMAGE_BASE_URL} />
                {relationData && (
                  <RelationButton
                    title={title}
                    characters={relationData.characters}
                    relationships={relationData.relationships}
                    imageBase={IMAGE_BASE_URL}
                    cast={allCast}
                  />
                )}
                <ShareButton title={`${title} `} url={`https://ardcinema.com/movie/${id}?type=${type === "tv" ? "tv" : "movie"}`} />
              </div>
            </div>
            {/* スマホ: IMDb風 */}
            <div className="text-sm md:hidden">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {directors.length > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">監督</p>
                    <p className="mt-0.5 text-xs text-gray-800">
                      {directors.map((d, i) => (
                        <span key={d.id}>
                          {i > 0 && ", "}
                          <Link href={`/person/${d.id}`} className="text-blue-600 hover:underline">{d.name}</Link>
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {screenwriters.length > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">脚本</p>
                    <p className="mt-0.5 text-xs text-gray-800">{screenwriters.map((w) => w.name).join(", ")}</p>
                  </div>
                )}
                {composers.length > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">音楽</p>
                    <p className="mt-0.5 text-xs text-gray-800">{composers.map((c) => c.name).join(", ")}</p>
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">上映時間</p>
                    <p className="mt-0.5 text-xs text-gray-800">{Math.floor(movie.runtime / 60)}時間{movie.runtime % 60}分</p>
                  </div>
                )}
                {movie.production_countries && movie.production_countries.length > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">製作国</p>
                    <p className="mt-0.5 text-xs text-gray-800">{movie.production_countries.map((c) => getCountryName(c.iso_3166_1, c.name)).join(", ")}</p>
                  </div>
                )}
                {movie.original_language && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">原語</p>
                    <p className="mt-0.5 text-xs text-gray-800">{LANGUAGE_NAMES[movie.original_language] || movie.original_language}</p>
                  </div>
                )}
                {movie.release_date && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">公開日</p>
                    <p className="mt-0.5 text-xs text-gray-800">{movie.release_date}</p>
                  </div>
                )}
                {jpReleaseDate && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">公開日（日本）</p>
                    <p className="mt-0.5 text-xs text-gray-800">{jpReleaseDate}</p>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">予算</p>
                    <p className="mt-0.5 text-xs text-gray-800">約{(movie.budget * 150 / 100000000).toFixed(1)}億円</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">興行収入</p>
                    <p className="mt-0.5 text-xs text-gray-800">約{(movie.revenue * 150 / 100000000).toFixed(1)}億円</p>
                  </div>
                )}
                {certification && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">年齢制限</p>
                    <p className="mt-0.5 text-xs text-gray-800">{certification}</p>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <p className="text-[10px] font-normal uppercase text-gray-400">ステータス</p>
                    <p className="mt-0.5 text-xs text-gray-800">{{ Released: "公開済み", "Post Production": "ポストプロダクション", "In Production": "製作中", Planned: "企画段階", Rumored: "噂", Canceled: "中止" }[movie.status] || movie.status}</p>
                  </div>
                )}
                {movie.production_companies.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-normal uppercase text-gray-400">制作会社</p>
                    <p className="mt-0.5 text-xs text-gray-800">{movie.production_companies.map((c) => c.name).join(", ")}</p>
                  </div>
                )}
                {movie.homepage && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-normal uppercase text-gray-400">公式サイト</p>
                    <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      公式サイトを開く →
                    </a>
                  </div>
                )}
              </div>
            </div>
            {/* PC: グリッドレイアウト（従来通り） */}
            <div className="hidden md:grid grid-cols-3 gap-4 text-sm">
              {directors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400">監督</p>
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
              {screenwriters.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400">脚本</p>
                  <p className="text-gray-700">{screenwriters.map((w) => w.name).join(", ")}</p>
                </div>
              )}
              {composers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400">音楽</p>
                  <p className="text-gray-700">{composers.map((c) => c.name).join(", ")}</p>
                </div>
              )}
              {movie.runtime > 0 && (
                <div>
                  <p className="text-sm text-gray-400">上映時間</p>
                  <p className="text-gray-700">{Math.floor(movie.runtime / 60)}時間{movie.runtime % 60}分</p>
                </div>
              )}
              {movie.production_countries && movie.production_countries.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400">製作国</p>
                  <p className="text-gray-700">{movie.production_countries.map((c) => getCountryName(c.iso_3166_1, c.name)).join(", ")}</p>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <p className="text-sm text-gray-400">原語</p>
                  <p className="text-gray-700">{LANGUAGE_NAMES[movie.original_language] || movie.original_language}</p>
                </div>
              )}
              {movie.release_date && (
                <div>
                  <p className="text-sm text-gray-400">公開日</p>
                  <p className="text-gray-700">{movie.release_date}</p>
                </div>
              )}
              {jpReleaseDate && (
                <div>
                  <p className="text-sm text-gray-400">公開日（日本）</p>
                  <p className="text-gray-700">{jpReleaseDate}</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-sm text-gray-400">予算</p>
                  <p className="text-gray-700">約{(movie.budget * 150 / 100000000).toFixed(1)}億円</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-sm text-gray-400">興行収入</p>
                  <p className="text-gray-700">約{(movie.revenue * 150 / 100000000).toFixed(1)}億円</p>
                </div>
              )}
              {certification && (
                <div>
                  <p className="text-sm text-gray-400">年齢制限</p>
                  <p className="text-gray-700">{certification}</p>
                </div>
              )}
              {movie.status && (
                <div>
                  <p className="text-sm text-gray-400">ステータス</p>
                  <p className="text-gray-700">{{ Released: "公開済み", "Post Production": "ポストプロダクション", "In Production": "製作中", Planned: "企画段階", Rumored: "噂", Canceled: "中止" }[movie.status] || movie.status}</p>
                </div>
              )}
              {movie.production_companies.length > 0 && (
                <div className="col-span-3">
                  <p className="text-sm text-gray-400">制作会社</p>
                  <p className="text-gray-700">{movie.production_companies.map((c) => c.name).join(", ")}</p>
                </div>
              )}
              {movie.homepage && (
                <div className="col-span-3">
                  <p className="text-sm text-gray-400">公式サイト</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="break-all">{movie.homepage}</span>
                    <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-blue-500 hover:text-blue-600 transition-colors" aria-label="公式サイトを開く">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* キャスト（ポラロイド風） */}
        {cast.length > 0 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-300">
              <h2 className="text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>キャスト</span>              </h2>
              <Link
                href={`/movie/${id}/cast?type=${type === "tv" ? "tv" : "movie"}`}
                className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-700"
              >
                出演者一覧
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-8 scrollbar-hide md:gap-4">
              {cast.map((person, i) => {
                const rotations = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2.5, -1, 3.5];
                const rot = rotations[i % rotations.length];
                return (
                  <Link
                    key={person.id}
                    href={`/person/${person.id}`}
                    className="flex-shrink-0 group transition-all duration-300 hover:scale-110 hover:z-10"
                  >
                    <div className="w-[110px] rounded-sm bg-[#faf8f5] p-2 pb-8 shadow-md transition-shadow duration-300 group-hover:shadow-xl md:w-[130px] md:p-2.5 md:pb-10" style={{ boxShadow: '2px 3px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)' }}>
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
                );
              })}
            </div>
          </div>
        )}

        {/* ビデオ */}
        {allVideos.length > 0 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-300">
              <h2 className="text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>ビデオ</span>              </h2>
              <Link
                href={`/movie/${id}/videos?type=${type === "tv" ? "tv" : "movie"}`}
                className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-700"
              >
                すべて見る
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ScrollableRow>
              {allVideos.map((v) => (
                <TrailerModal key={v.key} videoKey={v.key} variant="card" label={v.name || v.type} publishedAt={v.published_at} />
              ))}
            </ScrollableRow>
          </div>
        )}

        {/* シリーズ */}
        {collection && collection.parts.length > 1 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-300">
              <h2 className="text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>シリーズ</span>              </h2>
              <Link
                href={`/collection/${collection.id}`}
                className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-700"
              >
                すべて見る
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[...collection.parts].sort((a, b) => (b.release_date || b.first_air_date || "").localeCompare(a.release_date || a.first_air_date || "")).map((part) => {
                const isCurrent = part.id === movie.id;
                return (
                  <Link
                    key={part.id}
                    href={`/movie/${part.id}?type=movie`}
                    className={`flex-shrink-0 w-[130px] md:w-[150px] group ${isCurrent ? "pointer-events-none" : ""}`}
                  >
                    <div className={`relative rounded-[6px] overflow-hidden ${isCurrent ? "ring-2 ring-black" : ""}`}>
                      {part.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w342${part.poster_path}`}
                          alt={part.title || part.name || ""}
                          className={`w-[130px] h-[195px] md:w-[150px] md:h-[225px] object-cover transition-opacity ${isCurrent ? "" : "group-hover:opacity-80"}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex w-[130px] h-[195px] md:w-[150px] md:h-[225px] items-center justify-center bg-gray-200 text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                      {isCurrent && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 text-center">
                          <span className="text-[10px] font-bold text-white tracking-wider">NOW</span>
                        </div>
                      )}
                    </div>
                    <p className={`mt-2 text-xs leading-4 line-clamp-2 ${isCurrent ? "font-semibold text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>
                      {part.title || part.name || ""}
                    </p>
                    {(part.release_date || part.first_air_date) && (
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {(part.release_date || part.first_air_date || "").slice(0, 4)}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* シーズン情報（TV番組のみ） */}
        {type === "tv" && movie.seasons && movie.seasons.length > 0 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="border-b border-gray-300">
              <h2 className="inline-block text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>シーズン（{movie.number_of_seasons}シーズン・{movie.number_of_episodes}エピソード）</span>              </h2>
            </div>
            <div className="space-y-3">
              {movie.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                <div
                  key={season.id}
                  className="flex gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-gray-100"
                >
                  {season.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w185${season.poster_path}`}
                      alt={season.name}
                      className="h-[90px] w-[60px] flex-shrink-0 rounded-[4px] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-[90px] w-[60px] flex-shrink-0 items-center justify-center rounded-[4px] bg-gray-200 text-xs text-gray-400">
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

        {/* 配信情報 */}
        {watchProviders && (watchProviders.flatrate || watchProviders.rent || watchProviders.buy) && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="border-b border-gray-300">
              <h2 className="inline-block text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>配信情報</span>              </h2>
            </div>
            <div className="space-y-4">
              {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">定額配信</p>
                  <div className="flex flex-wrap gap-2">
                    {watchProviders.flatrate.map((p) => (
                      <div key={p.provider_id} className="flex items-center gap-1.5">
                        <img
                          src={`${IMAGE_BASE_URL}/w92${p.logo_path}`}
                          alt={p.provider_name}
                          className="h-8 w-8 rounded-full"
                          loading="lazy"
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
                        <img
                          src={`${IMAGE_BASE_URL}/w92${p.logo_path}`}
                          alt={p.provider_name}
                          className="h-8 w-8 rounded-full"
                          loading="lazy"
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
                        <img
                          src={`${IMAGE_BASE_URL}/w92${p.logo_path}`}
                          alt={p.provider_name}
                          className="h-8 w-8 rounded-full"
                          loading="lazy"
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

        {/* 公式SNS */}
        {(externalIds.instagram_id || externalIds.twitter_id || externalIds.facebook_id || externalIds.tiktok_id) && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="border-b border-gray-300">
              <h2 className="inline-block text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>公式SNS</span>              </h2>
            </div>
            <div className="flex gap-3">
              {externalIds.instagram_id && (
                <a href={`https://www.instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded bg-gray-50 transition-all hover:bg-gray-100" aria-label="Instagram">
                  <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {externalIds.twitter_id && (
                <a href={`https://x.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded bg-gray-50 transition-all hover:bg-gray-100" aria-label="X">
                  <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {externalIds.facebook_id && (
                <a href={`https://www.facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded bg-gray-50 transition-all hover:bg-gray-100" aria-label="Facebook">
                  <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {externalIds.tiktok_id && (
                <a href={`https://www.tiktok.com/@${externalIds.tiktok_id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded bg-gray-50 transition-all hover:bg-gray-100" aria-label="TikTok">
                  <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 公開国マップ */}
        {releaseCountries.length > 0 && (
          <ReleaseCountryMap releaseCountries={releaseCountries} productionCountries={movie.production_countries?.map(c => c.iso_3166_1) || []} />
        )}

        {/* 関連作品 */}
        {recommendations.length > 0 && (
          <div className="mt-8 md:mt-16 space-y-5">
            <div className="border-b border-gray-300">
              <h2 className="inline-block text-sm md:text-base font-normal uppercase tracking-widest text-gray-600">
                <span style={{ background: "linear-gradient(to top, #E6A72399 40%, transparent 40%)" }}>関連作品</span>              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recommendations.slice(0, 20).map((rec) => (
                <Link
                  key={rec.id}
                  href={`/movie/${rec.id}?type=${rec.media_type || type || "movie"}`}
                  className="flex-shrink-0 w-[130px] group"
                >
                  {rec.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}/w185${rec.poster_path}`}
                      alt={rec.title || rec.name || ""}
                      className="w-full rounded-[4px] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] rounded-[4px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
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
