"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-extrabold text-gray-200">500</p>
      <h1 className="mt-4 text-xl font-bold text-gray-800">一時的な障害が発生しました</h1>
      <p className="mt-2 text-sm text-gray-500">
        しばらく経ってから再度お試しください。
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800"
        >
          再読み込み
        </button>
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
