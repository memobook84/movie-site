import Link from "next/link";

const GENRE_LIST = [
  { id: 28, name: "アクション", icon: "⚡" },
  { id: 12, name: "アドベンチャー", icon: "🧭" },
  { id: 16, name: "アニメーション", icon: "✨" },
  { id: 35, name: "コメディ", icon: "😄" },
  { id: 80, name: "犯罪", icon: "🔍" },
  { id: 99, name: "ドキュメンタリー", icon: "🎥" },
  { id: 18, name: "ドラマ", icon: "🎭" },
  { id: 10751, name: "ファミリー", icon: "🏠" },
  { id: 14, name: "ファンタジー", icon: "🔮" },
  { id: 36, name: "歴史", icon: "📜" },
  { id: 27, name: "ホラー", icon: "🌙" },
  { id: 10402, name: "音楽", icon: "🎵" },
  { id: 9648, name: "ミステリー", icon: "🕵️" },
  { id: 10749, name: "ロマンス", icon: "💕" },
  { id: 878, name: "SF", icon: "🚀" },
  { id: 10770, name: "テレビ映画", icon: "📺" },
  { id: 53, name: "スリラー", icon: "🔥" },
  { id: 10752, name: "戦争", icon: "⚔️" },
  { id: 37, name: "西部劇", icon: "🤠" },
];

export default function GenresPage() {
  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <h1 className="text-2xl font-bold text-[#1d1d1f]">ジャンル</h1>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {GENRE_LIST.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="group relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-white px-4 py-8 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-[#3d1018]/20"
          >
            <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
              {genre.icon}
            </span>
            <span className="text-sm font-semibold text-[#1d1d1f]">
              {genre.name}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
