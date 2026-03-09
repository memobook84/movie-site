import { getTrending, getTopRated, getPopularByDecade } from "@/lib/tmdb";
import SelectionClient from "./SelectionClient";

export const revalidate = 3600;

export const metadata = {
  title: "セレクション | CINEMA",
  description: "トレンド・高評価・年代別の映画をピックアップ",
};

export default async function SelectionPage() {
  const [trending, topRated, d1980, d1990, d2000, d2010, d2020] =
    await Promise.all([
      getTrending(),
      getTopRated(),
      getPopularByDecade(1980, 1989),
      getPopularByDecade(1990, 1999),
      getPopularByDecade(2000, 2009),
      getPopularByDecade(2010, 2019),
      getPopularByDecade(2020, 2029),
    ]);

  return (
    <SelectionClient
      trending={trending}
      topRated={topRated}
      decades={{ "1980": d1980, "1990": d1990, "2000": d2000, "2010": d2010, "2020": d2020 }}
    />
  );
}
