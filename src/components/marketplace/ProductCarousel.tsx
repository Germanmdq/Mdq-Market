"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  children: React.ReactNode;
}

export function ProductCarousel({ children }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Use a small buffer for precision issues
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    // Initial check after a short delay to ensure rendering is complete
    const timer = setTimeout(updateScrollState, 500);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      clearTimeout(timer);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.85;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full group/carousel">
      {/* Arrow Buttons (Desktop Only) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-2xl hover:bg-slate-50 lg:flex transition-all hover:scale-110 active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6 text-slate-900" strokeWidth={3} />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-2xl hover:bg-slate-50 lg:flex transition-all hover:scale-110 active:scale-95"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6 text-slate-900" strokeWidth={3} />
        </button>
      )}

      {/* Side Gradients for More Content Indication */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-24 bg-gradient-to-r from-slate-50 to-transparent lg:block" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-24 bg-gradient-to-l from-slate-50 to-transparent lg:block" />
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {children}
      </div>
    </div>
  );
}
