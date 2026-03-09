import { getTrending, getTopRated, Movie } from "@/lib/tmdb";
import SelectionClient from "./SelectionClient";

export const revalidate = 3600;

export const metadata = {
  title: "セレクション | CINEMA",
  description: "トレンド・高評価の映画をピックアップ",
};

export default async function SelectionPage() {
  const [trending, topRated] = await Promise.all([
    getTrending(),
    getTopRated(),
  ]);

  return <SelectionClient trending={trending} topRated={topRated} />;
}
