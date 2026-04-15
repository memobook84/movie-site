"use client";

import { useState } from "react";
import { IoMdPhotos } from "react-icons/io";
import PosterGallery from "./PosterGallery";

interface GalleryImage {
  file_path: string;
  width: number;
  height: number;
}

interface GalleryModalProps {
  images: GalleryImage[];
  imageBase: string;
}

export default function GalleryModal({ images, imageBase }: GalleryModalProps) {
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center justify-center h-10 w-10 rounded border-none cursor-pointer transition-all hover:bg-gray-100"
        aria-label="ギャラリー"
      >
        <IoMdPhotos className="h-5 w-5 text-gray-700" />
      </button>

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
