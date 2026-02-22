"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import type { GalleryImage } from "@/lib/shopify/types";

// Fallback mock images used when the metaobject has not been populated yet
const fallbackLeftImages: GalleryImage[] = [
  { url: "/placeholder-1.jpg", altText: "Gallery left 1", width: 1200, height: 800 },
  { url: "/placeholder-2.jpg", altText: "Gallery left 2", width: 1200, height: 800 },
  { url: "/placeholder-3.jpg", altText: "Gallery left 3", width: 1200, height: 800 },
];

const fallbackRightImages: GalleryImage[] = [
  { url: "/placeholder-4.jpg", altText: "Gallery right 1", width: 1200, height: 800 },
  { url: "/placeholder-5.jpg", altText: "Gallery right 2", width: 1200, height: 800 },
  { url: "/placeholder-6.jpg", altText: "Gallery right 3", width: 1200, height: 800 },
];

function Gallery({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <div className="relative h-full w-1/2 overflow-hidden bg-neutral-100">
      <div className="relative h-full w-full">
        <Image
          src={images[current].url}
          alt={images[current].altText ?? ""}
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
      </div>

      {/* Click zones for prev/next */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-0 top-0 h-full w-1/3 cursor-w-resize"
        aria-label="Previous image"
      />
      <button
        type="button"
        onClick={next}
        className="absolute right-0 top-0 h-full w-2/3 cursor-e-resize"
        aria-label="Next image"
      />

      {/* Image counter in bottom corner */}
      <div className="absolute bottom-4 right-4 text-sm text-white mix-blend-difference">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

export function Hero({
  leftImages,
  rightImages,
}: {
  leftImages?: GalleryImage[];
  rightImages?: GalleryImage[];
}) {
  const left = leftImages?.length ? leftImages : fallbackLeftImages;
  const right = rightImages?.length ? rightImages : fallbackRightImages;

  function scrollToContent() {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }

  return (
    <section className="relative h-screen w-full flex">
      <Gallery images={left} />
      <Gallery images={right} />

      {/* Scroll down arrow centered at bottom between both galleries */}
      <button
        type="button"
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-5 w-5 text-black" />
      </button>
    </section>
  );
}
