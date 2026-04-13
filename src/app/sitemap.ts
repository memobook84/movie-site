import type { MetadataRoute } from "next";
import { getTrending, getPopular, getTopRated, getTrendingPeople } from "@/lib/tmdb";

const BASE_URL = "https://ardcinema.com";

export const revalidate = 86400; // 24時間キャッシュ

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/genres`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/ranking`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/selection`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/schedule`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/people`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/classics`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // ジャンルページ
  const genreIds = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
  const genrePages: MetadataRoute.Sitemap = genreIds.map((id) => ({
    url: `${BASE_URL}/genre/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // 動的ページ（人気作品・人物）をサイトマップに含める
  const [trending, popular, topRated, people] = await Promise.all([
    getTrending().catch(() => []),
    getPopular().catch(() => []),
    getTopRated().catch(() => []),
    getTrendingPeople().catch(() => []),
  ]);

  const movieIds = new Set<number>();
  const moviePages: MetadataRoute.Sitemap = [];
  for (const movie of [...trending, ...popular, ...topRated]) {
    if (movieIds.has(movie.id)) continue;
    movieIds.add(movie.id);
    moviePages.push({
      url: `${BASE_URL}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  const personPages: MetadataRoute.Sitemap = people.map((person) => ({
    url: `${BASE_URL}/person/${person.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...genrePages, ...moviePages, ...personPages];
}
