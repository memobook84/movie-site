import type { MetadataRoute } from "next";

const BASE_URL = "https://movie-site-delta-lilac.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/genres`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/ranking`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${BASE_URL}/follows`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // ジャンルページ
  const genreIds = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
  const genrePages = genreIds.map((id) => ({
    url: `${BASE_URL}/genre/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...genrePages];
}
