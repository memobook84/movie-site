import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200/60 px-6 py-10 text-center text-xs text-gray-400 md:px-16">
      <p>© 2026 CINEMA. Powered by TMDb API.</p>
      <p className="mt-1">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p className="mt-3">
        <Link href="/privacy" className="underline transition-colors hover:text-gray-600">
          プライバシーポリシー
        </Link>
      </p>
    </footer>
  );
}
