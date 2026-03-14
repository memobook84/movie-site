"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface GalleryImage {
  file_path: string;
  width: number;
  height: number;
}

interface PosterGalleryProps {
  images: GalleryImage[];
  imageBase: string;
  initialIndex: number;
  onClose: () => void;
}

export default function PosterGallery({ images, imageBase, initialIndex, onClose }: PosterGalleryProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [offsetX, setOffsetX] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const hasMoved = useRef(false);

  const THRESHOLD = 50;

  const goTo = useCallback((index: number) => {
    setTransitioning(true);
    setCurrent(index);
    setOffsetX(0);
    setTimeout(() => setTransitioning(false), 300);
  }, []);

  // Touch swipe handlers (mobile only)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (transitioning) return;
    isDragging.current = true;
    isHorizontalSwipe.current = null;
    hasMoved.current = false;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setOffsetX(0);
  }, [transitioning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
      }
      return;
    }

    if (!isHorizontalSwipe.current) return;
    hasMoved.current = true;

    if ((current === 0 && dx > 0) || (current === images.length - 1 && dx < 0)) {
      setOffsetX(dx * 0.3);
    } else {
      setOffsetX(dx);
    }
  }, [current, images.length]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (isHorizontalSwipe.current && Math.abs(offsetX) > THRESHOLD) {
      if (offsetX < 0 && current < images.length - 1) {
        goTo(current + 1);
      } else if (offsetX > 0 && current > 0) {
        goTo(current - 1);
      } else {
        setTransitioning(true);
        setOffsetX(0);
        setTimeout(() => setTransitioning(false), 300);
      }
    } else {
      setTransitioning(true);
      setOffsetX(0);
      setTimeout(() => setTransitioning(false), 300);
    }
  }, [offsetX, current, images.length, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && current > 0) goTo(current - 1);
      if (e.key === "ArrowRight" && current < images.length - 1) goTo(current + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, images.length, goTo, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 400;

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
        <span className="text-sm text-white/70">
          {current + 1} / {images.length}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* PC arrow buttons */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:flex"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      {current < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:flex"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Images */}
      <div
        className="h-full w-full"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex h-full items-center"
          style={{
            transform: `translateX(${-current * viewportWidth + offsetX}px)`,
            transition: transitioning ? "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
            width: `${images.length * viewportWidth}px`,
          }}
        >
          {images.map((img) => (
            <div
              key={img.file_path}
              className="flex h-full flex-shrink-0 items-center justify-center"
              style={{ width: viewportWidth }}
              onClick={onClose}
            >
              <img
                src={`${imageBase}/original${img.file_path}`}
                alt=""
                className="max-h-[85vh] max-w-[90vw] object-contain select-none"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {images.length <= 20 && (
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
