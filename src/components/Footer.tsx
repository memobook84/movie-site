import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200/60 px-6 py-10 text-center text-xs text-gray-400 md:px-16">
      <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDb" className="mx-auto h-3 opacity-40 grayscale" />
      <p className="mt-1">© 2026 CINEMA. Powered by TMDb API.</p>
      <p className="mt-0.5 text-[10px]">
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
