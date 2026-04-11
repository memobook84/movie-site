"use client";

import { useState } from "react";
import PosterGallery from "./PosterGallery";

interface GalleryImage {
  file_path: string;
  width: number;
  height: number;
}

interface Props {
  profilePath: string | null;
  name: string;
  imageBase: string;
  images: GalleryImage[];
}

export default function PersonProfileWithGallery({ profilePath, name, imageBase, images }: Props) {
  const [open, setOpen] = useState(false);
  const hasGallery = images.length > 0;

  return (
    <>
      <div
        className={`w-48 flex-shrink-0 rounded-sm bg-[#faf8f5] p-3 pb-12 sm:w-52 sm:p-3.5 sm:pb-14 ${hasGallery ? "cursor-pointer" : ""}`}
        style={{ boxShadow: '2px 3px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)' }}
        onClick={() => hasGallery && setOpen(true)}
      >
        {profilePath ? (
          <div className="relative">
            <img
              src={`${imageBase}/w342${profilePath}`}
              alt={name}
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]" />
          </div>
        ) : (
          <div className="relative">
            <div className="flex aspect-[3/4] w-full items-center justify-center bg-gray-100 text-3xl text-gray-300">
              ?
            </div>
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]" />
          </div>
        )}
      </div>
      {open && (
        <PosterGallery
          images={images}
          imageBase={imageBase}
          initialIndex={0}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
