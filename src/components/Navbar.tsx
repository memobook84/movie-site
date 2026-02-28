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
  const [hidden, setHidden] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > 50 && currentY > lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 検索履歴を読み込み
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cinema_search_history") || "[]");
      setHistory(saved);
    } catch { setHistory([]); }
  }, []);

  const saveHistory = (term: string) => {
    const updated = [term, ...history.filter((h) => h !== term)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("cinema_search_history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cinema_search_history");
  };

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
    const term = movie.title || movie.name || "";
    if (term) saveHistory(term);
    setShowSearch(false);
    setQuery("");
    setResults([]);
    router.push(`/movie/${movie.id}?type=${movie.media_type}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-500 md:px-16 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-[#424242]/95 backdrop-blur-xl shadow-sm"
            : "bg-[#424242]"
        }`}
      >
        <div className="relative flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-semibold tracking-[0.2em] text-white md:text-2xl"
          >
            <img src="/logo.png?v=2" alt="Logo" className="h-10 w-10 object-contain md:h-11 md:w-11" />
            <span className="hidden lg:inline">ARD CINEMA</span>
          </Link>
          {/* スマホ: 中央タイトル */}
          <span className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-noto-sans-jp)] text-sm font-bold tracking-widest text-white lg:hidden">
            ARD CINEMA
          </span>
          <div className="flex items-center gap-6 font-[family-name:var(--font-noto-sans-jp)] text-sm font-medium text-white">
            <Link href="/reviews" className="hidden transition-opacity hover:opacity-60 lg:inline">
              レビュー
            </Link>
            <Link href="/genres" className="hidden transition-opacity hover:opacity-60 lg:inline">
              ジャンル
            </Link>
            <Link href="/ranking" className="hidden transition-opacity hover:opacity-60 lg:inline">
              トレンド
            </Link>
            <Link href="/follows" className="hidden transition-opacity hover:opacity-60 lg:inline">
              フォロー
            </Link>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-white transition-opacity hover:opacity-60"
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

            {/* 検索履歴・人気ワード（クエリ未入力時） */}
            {!query && !loading && results.length === 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                {history.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">検索履歴</p>
                      <button onClick={clearHistory} className="text-[10px] text-gray-400 hover:text-gray-600">クリア</button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {history.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-200"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">人気ワード</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["ジブリ", "ワンピース", "マーベル", "ハリーポッター", "新海誠"].map((word) => (
                      <button
                        key={word}
                        onClick={() => setQuery(word)}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
