"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCarouselProps {
  children: ReactNode;
  showGradients?: boolean;
  className?: string;
  scrollAmount?: number;
}

export function ContentCarousel({ 
  children, 
  showGradients = true, 
  className = "",
  scrollAmount
}: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

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

    const amount = scrollAmount ?? Math.min(el.clientWidth * 0.85, 980);

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative w-full group/carousel", className)}>
      {/* Arrow Buttons (Desktop Only) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xl hover:bg-slate-50 lg:flex transition-all hover:scale-110 active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5 text-slate-900" strokeWidth={3} />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xl hover:bg-slate-50 lg:flex transition-all hover:scale-110 active:scale-95"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5 text-slate-900" strokeWidth={3} />
        </button>
      )}

      {/* Side Gradients */}
      {showGradients && canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-24 bg-gradient-to-r from-slate-50 to-transparent lg:block" />
      )}
      {showGradients && canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-24 bg-gradient-to-l from-slate-50 to-transparent lg:block" />
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {children}
      </div>
    </div>
  );
}
