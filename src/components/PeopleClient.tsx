"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGE_BASE_URL, Person } from "@/lib/tmdb";

export interface PersonWithBirthday extends Person {
  birthday: string | null;
}

type AgeGroup = "all" | "10" | "20" | "30" | "40" | "50" | "60+";

const AGE_GROUPS: { key: AgeGroup; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "10", label: "10代" },
  { key: "20", label: "20代" },
  { key: "30", label: "30代" },
  { key: "40", label: "40代" },
  { key: "50", label: "50代" },
  { key: "60+", label: "60代以上" },
];

function getAge(birthday: string | null): number | null {
  if (!birthday) return null;
  const born = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const m = today.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
  return age;
}

function filterByAge(people: PersonWithBirthday[], group: AgeGroup): PersonWithBirthday[] {
  if (group === "all") return people;
  return people.filter((p) => {
    const age = getAge(p.birthday);
    if (age === null) return false;
    if (group === "10") return age >= 10 && age < 20;
    if (group === "20") return age >= 20 && age < 30;
    if (group === "30") return age >= 30 && age < 40;
    if (group === "40") return age >= 40 && age < 50;
    if (group === "50") return age >= 50 && age < 60;
    if (group === "60+") return age >= 60;
    return true;
  });
}

export default function PeopleClient({ people }: { people: PersonWithBirthday[] }) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("all");
  const filtered = filterByAge(people, ageGroup);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.key}
            onClick={() => setAgeGroup(g.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              ageGroup === g.key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-400">該当する人物がいません</p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filtered.map((person) => (
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
      )}
    </>
  );
}
