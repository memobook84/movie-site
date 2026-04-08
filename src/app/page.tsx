import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARD CINEMA — 映画・ドラマの最新情報・ランキング・レビュー",
  description: "ARD CINEMA（ardcinema）- 話題の映画やドラマの最新情報、トレンド、人気作品、おすすめセレクションをチェック。ジャンル別検索やランキングも充実。",
};

export const revalidate = 86400;

import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import PeopleRow from "@/components/PeopleRow";
import { getTrending, getPopular, getTopRated, getUpcoming, getMoviesByGenre, getMovieDetail, getNowPlayingJP, getUpcomingJP, getTrendingPeoplePage, GENRES, Movie } from "@/lib/tmdb";

function shuffle(arr: Movie[]): Movie[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  const [otherResults, animeMovies, trendingPeople, topRatedRaw] = await Promise.all([
    Promise.all([
      getTrending(),
      getPopular(),
      getTopRated(),
      getUpcoming(),
      getMoviesByGenre(GENRES.ACTION),
      getMoviesByGenre(GENRES.ADVENTURE),
      getMoviesByGenre(GENRES.COMEDY),
      getMoviesByGenre(GENRES.CRIME),
      getMoviesByGenre(GENRES.DOCUMENTARY),
      getMoviesByGenre(GENRES.DRAMA),
      getMoviesByGenre(GENRES.FAMILY),
      getMoviesByGenre(GENRES.FANTASY),
      getMoviesByGenre(GENRES.HISTORY),
      getMoviesByGenre(GENRES.HORROR),
      getMoviesByGenre(GENRES.MUSIC),
      getMoviesByGenre(GENRES.MYSTERY),
      getMoviesByGenre(GENRES.ROMANCE),
      getMoviesByGenre(GENRES.SCIENCE_FICTION),
      getMoviesByGenre(GENRES.THRILLER),
    ]),
    // 日本のアニメを複数ページ取得して多めに確保
    getMoviesByGenre(GENRES.ANIMATION, 3, "ja"),
    Promise.all([
      getTrendingPeoplePage(1),
      getTrendingPeoplePage(2),
      getTrendingPeoplePage(3),
    ]).then((pages) => {
      const seen = new Set<number>();
      const all = [];
      for (const { people } of pages) {
        for (const p of people) {
          if (!seen.has(p.id)) { seen.add(p.id); all.push(p); }
        }
      }
      return shuffle(all);
    }),
    getTopRated(),
  ]);

  // アニメ作品を重複除去・シャッフル
  const animeSeen = new Set<number>();
  const animeList: Movie[] = [];
  for (const m of animeMovies) {
    if (!animeSeen.has(m.id)) {
      animeSeen.add(m.id);
      animeList.push(m);
    }
  }
  const shuffledAnime = shuffle(animeList);

  // その他の作品を重複除去（アニメIDも除外）・シャッフル
  const seen = new Set<number>(animeSeen);
  const otherList: Movie[] = [];
  for (const list of otherResults) {
    for (const m of list) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        otherList.push(m);
      }
    }
  }
  const shuffledOther = shuffle(otherList);

  // 20:80 で混合（アニメ20%、その他80%）
  const totalCount = Math.min(shuffledAnime.length + shuffledOther.length, 400);
  const animeCount = Math.floor(totalCount * 0.2);
  const otherCount = totalCount - animeCount;
  const animePool = shuffledAnime.slice(0, animeCount);
  const otherPool = shuffledOther.slice(0, otherCount);

  // 交互にミックスしてからシャッフル
  const mixed: Movie[] = [];
  const maxLen = Math.max(animePool.length, otherPool.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < animePool.length) mixed.push(animePool[i]);
    if (i < otherPool.length) mixed.push(otherPool[i]);
  }
  const final = shuffle(mixed);

  // 20行に分割
  const rowCount = 20;
  const perRow = Math.ceil(final.length / rowCount);
  const rows: Movie[][] = [];
  for (let i = 0; i < rowCount; i++) {
    const chunk = final.slice(i * perRow, (i + 1) * perRow);
    if (chunk.length > 0) rows.push(chunk);
  }

  // 高評価の名作（専用行用にシャッフル）
  const topRatedMovies = shuffle(topRatedRaw);

  // ヒーロー用：上映中 + 近日公開（日本）
  const [nowPlaying, upcomingJP] = await Promise.all([
    getNowPlayingJP(1),
    getUpcomingJP(1),
  ]);
  const heroMovies = nowPlaying.filter((m: Movie) => m.backdrop_path);
  const nowPlayingIds = new Set(nowPlaying.map((m: Movie) => m.id));
  // 近日公開（上映中と重複しないもの、backdrop有り）
  const upcomingMovies = upcomingJP.filter(
    (m: Movie) => m.backdrop_path && !nowPlayingIds.has(m.id)
  );

  // ヒーロー作品のトレーラーキーを取得
  const heroDetails = await Promise.all(heroMovies.map((m: Movie) => getMovieDetail(m.id)));
  const heroTrailerKeys: Record<number, string> = {};
  const heroCasts: Record<number, string[]> = {};
  for (const detail of heroDetails) {
    const trailer = detail.videos?.results?.find(
      (v: { type: string; site: string }) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (trailer) heroTrailerKeys[detail.id] = trailer.key;
    if (detail.credits?.cast) {
      heroCasts[detail.id] = detail.credits.cast.slice(0, 3).map((c: { name: string }) => c.name);
    }
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ARD CINEMA",
    alternateName: ["ardcinema", "アードシネマ"],
    url: "https://ardcinema.com",
    description: "話題の映画やドラマの最新情報、ランキング、おすすめセレクション、ジャンル別検索が無料で楽しめる映画情報サイト。",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ardcinema.com/discover?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero movies={heroMovies} upcomingMovies={upcomingMovies} trailerKeys={heroTrailerKeys} casts={heroCasts} />
      <main className="space-y-6 pb-12">
        {rows.map((movies, i) => (
          <div key={i}>
            <MovieRow title="" movies={movies} />
            {i === 4 && trendingPeople.length > 0 && (
              <div className="mt-6 border-y border-gray-200 bg-gray-50 py-6">
                <PeopleRow title="注目の人物" subtitle="Trending People" people={trendingPeople} href="/people" />
              </div>
            )}
            {i === 9 && topRatedMovies.length > 0 && (
              <div className="mt-6 mb-10 border-y border-gray-200 bg-gray-50 pt-6 pb-10">
                <MovieRow
                  title="不朽の名作"
                  subtitle="Timeless Classics"
                  movies={topRatedMovies}
                  cardVariant="oscar"
                  href="/classics"
                />
              </div>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
