import Link from "next/link";
import { IMAGE_BASE_URL, Person } from "@/lib/tmdb";

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  return (
    <Link href={`/person/${person.id}`} className="group flex-shrink-0">
      <div className="flex h-[200px] w-[129px] overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-lg md:h-[280px] md:w-[178px]">
        {/* 左の黒帯 */}
        <div className="w-[12px] flex-shrink-0 bg-[#111] md:w-[14px]" />
        {/* メインコンテンツ */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 上の黒帯 */}
          <div className="h-[12px] flex-shrink-0 bg-[#111] md:h-[14px]" />
          <div className="relative flex-1 overflow-hidden">
            {person.profile_path ? (
              <img
                src={`${IMAGE_BASE_URL}/w342${person.profile_path}`}
                alt={person.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200 text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex-shrink-0 bg-[#111] px-2 py-1.5">
            <p className="truncate text-[9px] font-semibold text-white md:text-sm">
              {person.name}
            </p>
            <p className="truncate text-[8px] text-gray-400 md:text-xs">
              {person.known_for_department === "Acting" ? "俳優" : person.known_for_department === "Directing" ? "監督" : person.known_for_department}
            </p>
          </div>
        </div>
        {/* 右の黒帯 */}
        <div className="w-[12px] flex-shrink-0 bg-[#111] md:w-[14px]" />
      </div>
    </Link>
  );
}
