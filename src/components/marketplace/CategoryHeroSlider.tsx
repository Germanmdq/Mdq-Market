"use client";

import { useEffect, useState } from "react";

type CategoryHeroSliderProps = {
  images: string[];
  title: string;
  captions?: {
    eyebrow: string;
    title: string;
    description: string;
  }[];
};

export default function CategoryHeroSlider({ images, title, captions }: CategoryHeroSliderProps) {
  const safeImages = images.length > 0 ? images.slice(0, 3) : [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
  ];
  const safeCaptions = captions?.length ? captions : [
    {
      eyebrow: "Selección local",
      title,
      description: "Encontrá opciones reales en Mar del Plata con compra protegida.",
    },
    {
      eyebrow: "Entrega MDP",
      title: "Coordinación simple",
      description: "Comprá, reservá o consultá sin salir del flujo de MDP Market.",
    },
    {
      eyebrow: "Cerca tuyo",
      title: "Más confianza para elegir",
      description: "Filtrá por zona, reputación y disponibilidad antes de avanzar.",
    },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % safeImages.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [safeImages.length]);

  return (
    <div className="relative h-full min-h-[380px] overflow-hidden rounded-[2.25rem] bg-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
      {safeImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${active === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/22 to-slate-950/5" />
      <div className="absolute bottom-8 left-8 right-8 max-w-lg text-white">
        <p className="text-sm font-semibold text-blue-100">{safeCaptions[active]?.eyebrow}</p>
        <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {safeCaptions[active]?.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
          {safeCaptions[active]?.description}
        </p>
      </div>
      <div className="absolute bottom-6 right-7 flex gap-2">
        {safeImages.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`Ver imagen ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${active === index ? "w-8 bg-white" : "w-2 bg-white/45"}`}
          />
        ))}
      </div>
    </div>
  );
}
