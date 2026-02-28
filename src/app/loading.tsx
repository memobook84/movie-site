export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16 space-y-8">
      {Array.from({ length: 10 }).map((_, row) => (
        <div key={row}>
          <div className="mt-3 flex gap-3 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 space-y-2">
                <div className="w-[105px] md:w-[260px] aspect-[2/3] md:aspect-video animate-pulse rounded-xl bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
