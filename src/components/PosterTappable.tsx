"use client";

import { useState } from "react";
import PosterGallery from "./PosterGallery";

interface GalleryImage {
  file_path: string;
  width: number;
  height: number;
}

interface PosterTappableProps {
  posterPath: string;
  title: string;
  imageBase: string;
  images: GalleryImage[];
}

export default function PosterTappable({ posterPath, title, imageBase, images }: PosterTappableProps) {
  const [open, setOpen] = useState(false);

  // Build gallery: poster first, then remaining images (excluding duplicate poster)
  const posterImage: GalleryImage = { file_path: posterPath, width: 2, height: 3 };
  const otherImages = images.filter((img) => img.file_path !== posterPath);
  const allImages = [posterImage, ...otherImages];

  return (
    <>
      <div className="flex-shrink-0 cursor-pointer" onClick={() => setOpen(true)}>
        <img
          src={`${imageBase}/w342${posterPath}`}
          alt={title}
          className="w-44 rounded-[4px] md:w-[360px] transition-transform active:scale-95"
        />
      </div>

      {open && (
        <PosterGallery
          images={allImages}
          imageBase={imageBase}
          initialIndex={0}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
