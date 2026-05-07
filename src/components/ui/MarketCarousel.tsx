"use client";

import React, { useCallback, useEffect, useState, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketCarouselProps = {
  children: ReactNode;
  className?: string;
  options?: any;
};

export function MarketCarousel({ children, className = "", options = { align: "start", dragFree: true, containScroll: "trimSnaps" } }: MarketCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
  }, [emblaApi, updateButtons]);

  return (
    <div className={cn("relative w-full group/carousel", className)}>
      <div ref={emblaRef} className="overflow-hidden px-1">
        <div className="flex gap-4 sm:gap-6">
          {children}
        </div>
      </div>

      {canPrev && (
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xl transition-all hover:bg-slate-50 hover:scale-110 active:scale-95 lg:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" strokeWidth={3} />
        </button>
      )}

      {canNext && (
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xl transition-all hover:bg-slate-50 hover:scale-110 active:scale-95 lg:flex"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" strokeWidth={3} />
        </button>
      )}

      {/* Side Gradients for visual rhythm */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-12 bg-gradient-to-r from-[#f8fafc] to-transparent lg:block" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-12 bg-gradient-to-l from-[#f8fafc] to-transparent lg:block" />
    </div>
  );
}
