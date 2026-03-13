"use client";

import { useState } from "react";
import { GitFork } from "lucide-react";
import RelationDiagram from "./RelationDiagram";
import type { RelationCharacter, Relationship } from "@/lib/relations-data";

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
}

interface Props {
  title: string;
  characters: RelationCharacter[];
  relationships: Relationship[];
  imageBase: string;
  cast: CastMember[];
}

export default function RelationButton({ title, characters, relationships, imageBase, cast }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 md:h-auto md:w-auto md:gap-2 md:px-7 md:py-3"
        aria-label="相関図"
      >
        <GitFork className="h-4 w-4" />
        <span className="hidden md:inline text-sm font-semibold">相関図</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm pt-8 pb-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative mx-3 w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  CHARACTER RELATIONS
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{title}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Diagram */}
            <div className="p-3 pb-4 bg-white">
              <p className="text-center text-[11px] text-gray-400 mb-1">キャラクターをタップで関係をハイライト</p>
              <RelationDiagram
                characters={characters}
                relationships={relationships}
                imageBase={imageBase}
                cast={cast}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
