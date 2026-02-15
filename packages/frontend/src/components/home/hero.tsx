"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
};

// Mock images until metaobject integration is done
const leftGalleryImages: GalleryImage[] = [
  { src: "/placeholder-1.jpg", alt: "Gallery left 1" },
  { src: "/placeholder-2.jpg", alt: "Gallery left 2" },
  { src: "/placeholder-3.jpg", alt: "Gallery left 3" },
];

const rightGalleryImages: GalleryImage[] = [
  { src: "/placeholder-4.jpg", alt: "Gallery right 1" },
  { src: "/placeholder-5.jpg", alt: "Gallery right 2" },
  { src: "/placeholder-6.jpg", alt: "Gallery right 3" },
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
          src={images[current].src}
          alt={images[current].alt}
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

export function Hero() {
  function scrollToContent() {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }

  return (
    <section className="relative h-screen w-full flex">
      <Gallery images={leftGalleryImages} />
      <Gallery images={rightGalleryImages} />

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
