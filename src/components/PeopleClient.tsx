"use client";

import Link from "next/link";
import { IMAGE_BASE_URL, Person } from "@/lib/tmdb";

export default function PeopleClient({ people }: { people: Person[] }) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {people.map((person) => (
        <Link key={person.id} href={`/person/${person.id}`} className="group">
          <div className="relative overflow-hidden rounded-[4px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10">
            {person.profile_path ? (
              <img
                src={`${IMAGE_BASE_URL}/w342${person.profile_path}`}
                alt={person.name}
                className="aspect-[2/3] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-xs text-gray-400">
                No Image
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-12">
              <p className="truncate text-sm font-bold text-white drop-shadow-md">{person.name}</p>
              <p className="truncate text-[10px] text-white/70">
                {person.known_for_department === "Acting" ? "俳優" : person.known_for_department === "Directing" ? "監督" : person.known_for_department}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
