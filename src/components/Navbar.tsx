"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 検索バーを開いたらフォーカス
  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // デバウンス検索
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results?.slice(0, 8) || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, [query]);

  const handleSelect = (movie: SearchResult) => {
    setShowSearch(false);
    setQuery("");
    setResults([]);
    router.push(`/movie/${movie.id}?type=${movie.media_type}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-500 md:px-16 ${
          scrolled
            ? "bg-[#3d1018]/95 backdrop-blur-xl shadow-sm"
            : "bg-[#3d1018]"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-semibold tracking-[0.2em] text-white md:text-2xl"
          >
            <img src="/logo.png" alt="Logo" className="h-9 w-9 rounded object-contain md:h-10 md:w-10" />
            CINEMA
          </Link>
          <div className="flex items-center gap-6 text-sm font-light text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              ホーム
            </Link>
            <Link href="/follows" className="transition-colors hover:text-white">
              フォロー
            </Link>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="transition-colors hover:text-white"
              aria-label="検索"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* 検索バー */}
      {showSearch && (
        <div ref={searchRef} className="fixed left-0 right-0 top-[60px] z-50 px-6 md:px-16">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 px-5 py-4">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="映画を検索..."
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setResults([]); }}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* 検索結果 */}
            {(loading || results.length > 0) && (
              <div className="border-t border-gray-100">
                {loading && results.length === 0 && (
                  <p className="px-5 py-4 text-center text-xs text-gray-400">検索中...</p>
                )}
                {results.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="h-14 w-10 flex-shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">
                        N/A
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {movie.title || movie.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{(movie.release_date || movie.first_air_date)?.slice(0, 4) || "—"}</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">
                          {movie.media_type === "tv" ? "TV" : "映画"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query && !loading && results.length === 0 && (
              <div className="border-t border-gray-100 px-5 py-4 text-center text-xs text-gray-400">
                該当する作品が見つかりません
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
