import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import ServiceWorker from "@/components/ServiceWorker";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin"] });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: {
    default: "ARD CINEMA — 映画・ドラマの最新情報・ランキング・レビュー",
    template: "%s | ARD CINEMA",
  },
  description: "話題の映画やドラマの最新情報、ランキング、おすすめセレクション、ジャンル別検索が無料で楽しめる映画情報サイト。",
  verification: {
    google: "fbXdvFUaeGgZ9QkL_gSdnmSXmXx6KK-xAFPzf78xT9s",
  },
  metadataBase: new URL("https://ardcinema.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ARD CINEMA",
  },
  icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ARD CINEMA — 映画・ドラマの最新情報・ランキング・レビュー",
    description: "話題の映画やドラマの最新情報、ランキング、おすすめセレクション、ジャンル別検索が無料で楽しめる映画情報サイト。",
    siteName: "ARD CINEMA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARD CINEMA — 映画・ドラマの最新情報・ランキング・レビュー",
    description: "話題の映画やドラマの最新情報、ランキング、おすすめセレクション、ジャンル別検索が無料で楽しめる映画情報サイト。",
  },
};

export const viewport: Viewport = {
  themeColor: "#DCDCDC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${notoSansJP.variable}`}>
        <ServiceWorker />
        <SplashScreen />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <BottomNav />
      </body>
    </html>
  );
}
