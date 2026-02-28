export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <div className="flex flex-col items-start gap-6 sm:flex-row">
        <div className="w-32 sm:w-40 aspect-[2/3] animate-pulse rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-100 max-w-2xl" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100 max-w-2xl" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100 max-w-2xl" />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
