"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

type CategoryAnimationProps = {
  src: string;
  className?: string;
  loop?: boolean;
};

export function CategoryAnimation({
  src,
  className = "",
  loop = true,
}: CategoryAnimationProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const handleChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  if (!mounted) {
    // Evita saltos de layout durante el SSR
    return <div className={`pointer-events-none overflow-hidden ${className}`} />;
  }

  if (reducedMotion) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 ${className}`}>
        <span className="text-xs font-medium text-slate-400">Animación pausada</span>
      </div>
    );
  }

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`}>
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}