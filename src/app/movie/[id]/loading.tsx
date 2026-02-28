export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      {/* 背景画像スケルトン */}
      <div className="relative mt-16 h-[55vh] w-full md:h-[65vh] animate-pulse bg-gray-200" />

      {/* コンテンツ */}
      <div className="-mt-36 relative z-10 px-6 md:px-16">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* ポスター */}
          <div className="w-48 md:w-64 aspect-[2/3] animate-pulse rounded-2xl bg-gray-200" />

          {/* 詳細情報 */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200" />
              <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded-full bg-gray-200 max-w-xs" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100 max-w-2xl" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100 max-w-2xl" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100 max-w-2xl" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
