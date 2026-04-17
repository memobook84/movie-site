"use client";

import { useState, useEffect } from "react";

const images = ["/qr-illustration.png", "/qr-illustration2.png"];

export default function QRPage() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(images[Math.floor(Math.random() * images.length)]);
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 pt-16 pb-20">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="QR Code" className="w-full max-w-sm md:max-w-md" />
      )}
    </main>
  );
}
