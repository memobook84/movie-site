import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import ServiceWorker from "@/components/ServiceWorker";

const inter = Inter({ subsets: ["latin"] });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "CINEMA — 映画・ドラマ情報",
  description: "映画・ドラマ閲覧サイト。TMDb APIで最新の映画情報を表示。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CINEMA",
  },
  icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "CINEMA — 映画・ドラマ情報",
    description: "映画・ドラマ閲覧サイト。TMDb APIで最新の映画情報を表示。",
    siteName: "CINEMA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CINEMA — 映画・ドラマ情報",
    description: "映画・ドラマ閲覧サイト。TMDb APIで最新の映画情報を表示。",
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
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <BottomNav />
      </body>
    </html>
  );
}
