export const dynamic = "force-dynamic";

import MovieRow from "@/components/MovieRow";
import { getTrending, getPopular, getTopRated, getUpcoming, getMoviesByGenre, GENRES, Movie } from "@/lib/tmdb";

function shuffle(arr: Movie[]): Movie[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  const [otherResults, animeMovies] = await Promise.all([
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
    getMoviesByGenre(GENRES.ANIMATION, 10, "ja"),
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

  // 50:50 で混合（アニメとその他を交互に配置）
  const totalCount = Math.min(shuffledAnime.length + shuffledOther.length, 400);
  const halfCount = Math.floor(totalCount / 2);
  const animePool = shuffledAnime.slice(0, halfCount);
  const otherPool = shuffledOther.slice(0, halfCount);

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

  return (
    <main className="space-y-6 pb-12">
      <div className="h-16 md:h-24" />
      {rows.map((movies, i) => (
        <MovieRow key={i} title="" movies={movies} />
      ))}
    </main>
  );
}
