import Link from "next/link";

const GENRE_LIST = [
  { id: 28, name: "アクション" },
  { id: 12, name: "アドベンチャー" },
  { id: 16, name: "アニメーション" },
  { id: 35, name: "コメディ" },
  { id: 80, name: "犯罪" },
  { id: 99, name: "ドキュメンタリー" },
  { id: 18, name: "ドラマ" },
  { id: 10751, name: "ファミリー" },
  { id: 14, name: "ファンタジー" },
  { id: 36, name: "歴史" },
  { id: 27, name: "ホラー" },
  { id: 10402, name: "音楽" },
  { id: 9648, name: "ミステリー" },
  { id: 10749, name: "ロマンス" },
  { id: 878, name: "SF" },
  { id: 10770, name: "テレビ映画" },
  { id: 53, name: "スリラー" },
  { id: 10752, name: "戦争" },
  { id: 37, name: "西部劇" },
];

export default function GenresPage() {
  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <h1 className="text-2xl font-bold text-[#1d1d1f]">ジャンル</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        {GENRE_LIST.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#1d1d1f] transition-all hover:border-[#3d1018] hover:bg-[#3d1018] hover:text-white"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
