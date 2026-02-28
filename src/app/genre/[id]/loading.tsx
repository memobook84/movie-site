export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <div className="flex items-center gap-3">
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
        <span className="text-gray-300">/</span>
        <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-4 w-20 mt-2 animate-pulse rounded bg-gray-100" />
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
