"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  known_for_department?: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
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

  const handleSelect = (item: SearchResult) => {
    const term = item.title || item.name || "";
    if (term) saveHistory(term);
    setShowSearch(false);
    setQuery("");
    setResults([]);
    if (item.media_type === "person") {
      router.push(`/person/${item.id}`);
    } else {
      router.push(`/movie/${item.id}?type=${item.media_type}`);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 py-2 transition-all duration-500 md:px-16 md:py-4 bg-white md:bg-[#424242] ${
          scrolled ? "shadow-sm" : ""
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="relative flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-semibold tracking-[0.2em] text-[#1d1d1f] md:text-white md:text-2xl"
          >
            <img src="/logo-mobile.png" alt="Logo" className="h-7 w-7 object-contain md:hidden" />
            <img src="/logo.png?v=2" alt="Logo" className="hidden h-11 w-11 object-contain md:block" />
            <span className="hidden xl:inline">ARD CINEMA</span>
          </Link>
          {/* スマホ: 中央タイトル */}
          <span className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-noto-sans-jp)] text-sm font-bold tracking-widest text-[#1d1d1f] md:text-white xl:hidden">
            ARD CINEMA
          </span>
          <div className="flex items-center gap-4 font-[family-name:var(--font-noto-sans-jp)] text-sm font-medium text-[#1d1d1f] md:text-white">
            <Link href="/schedule" className={`hidden xl:inline-flex flex-col items-center gap-1 px-3 py-1.5 text-white/70 transition-all duration-300 hover:text-white ${pathname === "/schedule" ? "text-white" : ""}`}>
              Schedule
              <span className={`h-1 w-1 rounded-full bg-white transition-all duration-300 ${pathname === "/schedule" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
            </Link>
            <Link href="/genres" className={`hidden xl:inline-flex flex-col items-center gap-1 px-3 py-1.5 text-white/70 transition-all duration-300 hover:text-white ${pathname.startsWith("/genre") ? "text-white" : ""}`}>
              Genre
              <span className={`h-1 w-1 rounded-full bg-white transition-all duration-300 ${pathname.startsWith("/genre") ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
            </Link>
            <Link href="/selection" className={`hidden xl:inline-flex flex-col items-center gap-1 px-3 py-1.5 text-white/70 transition-all duration-300 hover:text-white ${pathname === "/selection" ? "text-white" : ""}`}>
              Selection
              <span className={`h-1 w-1 rounded-full bg-white transition-all duration-300 ${pathname === "/selection" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
            </Link>
            <Link href="/follows" className={`hidden xl:inline-flex flex-col items-center gap-1 px-3 py-1.5 text-white/70 transition-all duration-300 hover:text-white ${pathname === "/follows" ? "text-white" : ""}`}>
              Watchlist
              <span className={`h-1 w-1 rounded-full bg-white transition-all duration-300 ${pathname === "/follows" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
            </Link>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-[#1d1d1f] md:text-white transition-opacity hover:opacity-60"
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
                placeholder="映画・人物を検索..."
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
                {results.map((item) => {
                  const imagePath = item.media_type === "person" ? item.profile_path : item.poster_path;
                  return (
                    <button
                      key={`${item.media_type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      {imagePath ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${imagePath}`}
                          alt={item.title || item.name}
                          className={`h-14 flex-shrink-0 object-cover ${item.media_type === "person" ? "w-10 rounded-full" : "w-10 rounded"}`}
                        />
                      ) : (
                        <div className={`flex h-14 w-10 flex-shrink-0 items-center justify-center bg-gray-100 text-[10px] text-gray-400 ${item.media_type === "person" ? "rounded-full" : "rounded"}`}>
                          N/A
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.title || item.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {item.media_type === "person" ? (
                            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600">
                              {item.known_for_department === "Acting" ? "俳優" : item.known_for_department === "Directing" ? "監督" : item.known_for_department || "人物"}
                            </span>
                          ) : (
                            <>
                              <span>{(item.release_date || item.first_air_date)?.slice(0, 4) || "—"}</span>
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">
                                {item.media_type === "tv" ? "TV" : "映画"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {query && !loading && results.length === 0 && (
              <div className="border-t border-gray-100 px-5 py-4 text-center text-xs text-gray-400">
                該当する結果が見つかりません
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
