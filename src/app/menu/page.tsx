import Link from "next/link";
import { Home, CalendarDays, Film, ShieldCheck, Star, Search } from "lucide-react";
import { LuBlocks } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { PiEyeglassesFill } from "react-icons/pi";

const mainItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/genres", label: "ジャンル", icon: LuBlocks },
  { href: "/selection", label: "セレクション", icon: Film },
];

const featureItems = [
  { href: "/ranking", label: "ランキング", icon: GiImperialCrown },
  { href: "/follows", label: "ウォッチリスト", icon: PiEyeglassesFill },
  { href: "/discover", label: "さがす", icon: Search },
];

const otherItems = [
  { href: "/privacy", label: "プライバシーポリシー", icon: ShieldCheck },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-white pt-20 pb-32 px-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl mb-6">メニュー</h1>

      {/* メイン */}
      <div className="space-y-1">
        {mainItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-lg px-3 py-3.5 transition-colors hover:bg-gray-50"
          >
            <item.icon className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
            <span className="text-sm font-medium text-gray-900">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="my-3 border-t border-gray-100" />

      {/* 機能 */}
      <div className="space-y-1">
        {featureItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-lg px-3 py-3.5 transition-colors hover:bg-gray-50"
          >
            <item.icon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="my-3 border-t border-gray-100" />

      {/* その他 */}
      <div className="space-y-1">
        {otherItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-lg px-3 py-3.5 transition-colors hover:bg-gray-50"
          >
            <item.icon className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
            <span className="text-sm font-medium text-gray-900">{item.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
