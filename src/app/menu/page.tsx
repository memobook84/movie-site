import Link from "next/link";
import { Home, CalendarDays, Film, ShieldCheck, Star, Compass, Users, Award, Tv, QrCode } from "lucide-react";
import { LuBlocks } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { PiBinocularsFill } from "react-icons/pi";

const mainItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/streaming", label: "ストリーミング", icon: Tv },
  { href: "/genres", label: "ジャンル", icon: LuBlocks },
  { href: "/selection", label: "セレクション", icon: Film },
];

const featureItems = [
  { href: "/ranking", label: "ランキング", icon: GiImperialCrown },
  { href: "/follows", label: "ウォッチリスト", icon: PiBinocularsFill },
  { href: "/people", label: "注目の人物", icon: Users },
  { href: "/classics", label: "不朽の名作", icon: Award },
  // { href: "/discover", label: "ディスカバー", icon: Compass },
];

const otherItems = [
  { href: "/qr", label: "QRコード", icon: QrCode },
  { href: "/privacy", label: "プライバシーポリシー", icon: ShieldCheck },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-white pt-12 md:pt-20 pb-32 px-6">
      <h1 className="text-lg font-normal tracking-tight text-gray-900 font-[family-name:var(--font-noto-sans-jp)] md:text-3xl mb-6">メニュー</h1>

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
