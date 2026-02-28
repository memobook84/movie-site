import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-extrabold text-gray-200">404</p>
      <h1 className="mt-4 text-xl font-bold text-gray-800">ページが見つかりません</h1>
      <p className="mt-2 text-sm text-gray-500">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800"
        >
          ホームに戻る
        </Link>
        <Link
          href="/genres"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          ジャンルを見る
        </Link>
      </div>
    </main>
  );
}
