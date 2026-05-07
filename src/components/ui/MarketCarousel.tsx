"use client";

import React, { useCallback, useEffect, useState, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MarketCarouselProps = {
  children: ReactNode;
  className?: string;
};

export function MarketCarousel({ children, className = "" }: MarketCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
  }, [emblaApi, update]);

  return (
    <div className={`relative w-full ${className}`}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 sm:gap-5">{children}</div>
      </div>

      {canPrev && (
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/70 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition hover:shadow-md lg:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4 text-slate-700" />
        </button>
      )}

      {canNext && (
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/70 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition hover:shadow-md lg:flex"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-4 w-4 text-slate-700" />
        </button>
      )}
    </div>
  );
}
