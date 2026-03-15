import type { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";

export const metadata: Metadata = {
  title: "ディスカバー | ARD CINEMA",
  description: "興行収入とジャンルで映画を探そう",
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}
