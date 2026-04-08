import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "フォロー中の作品",
  robots: { index: false, follow: false },
};

export default function FollowsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
