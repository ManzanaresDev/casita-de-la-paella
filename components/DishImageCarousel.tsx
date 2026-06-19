// components/DishImageCarousel.tsx
"use client";

import { useRef, useState } from "react";

interface DishImage {
  url: string;
  publicId: string;
}

interface Props {
  images: DishImage[];
  alt: string;
}

/**
 * Affiche les images d'un plat dans le modal :
 * - 0 image  -> ne rend rien (le modal garde son layout texte actuel)
 * - 1 image  -> image simple, pas de carrousel
 * - 2+ images -> défilement horizontal au scroll/swipe avec dots
 */
export default function DishImageCarousel({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-stone-900">
        <img
          src={images[0].url}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  }

  function scrollToIndex(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="mb-6">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex w-full aspect-[4/3] rounded-xl overflow-x-auto snap-x snap-mandatory scroll-smooth bg-stone-900"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <div
            key={img.publicId}
            className="w-full h-full shrink-0 snap-center"
          >
            <img
              src={img.url}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {images.map((img, i) => (
          <button
            key={img.publicId}
            onClick={() => scrollToIndex(i)}
            aria-label={`Voir l'image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex
                ? "w-5 bg-amber-500"
                : "w-1.5 bg-stone-600 hover:bg-stone-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
