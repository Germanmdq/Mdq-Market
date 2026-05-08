"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Clock, MapPin } from "lucide-react";
import { Service } from "@/types";
import { formatPrice } from "@/lib/utils";

const FALLBACK = "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop";

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const [imgSrc, setImgSrc] = useState(service.image_url || service.image || FALLBACK);
  const href = service.slug ? `/servicios/${service.slug}` : "/servicios";
  const priceFrom = Number((service as any).priceFrom ?? (service as any).price_from ?? 0);
  const zones = Array.isArray(service.zones) ? service.zones : ((service as any).zone ? [(service as any).zone] : []);
  const responseTime = service.responseTime || (service as any).response_time || "A coordinar";

  return (
    <Link href={href} className="block h-full group">
      <article className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.18)] flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[inherit] bg-slate-50">
          <img
            src={imgSrc}
            alt={service.title}
            className="h-full w-full rounded-t-[inherit] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              if (!e.currentTarget.src.includes(FALLBACK)) {
                e.currentTarget.src = FALLBACK;
              }
            }}
          />

          {service.availability === "Hoy" && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Disponible hoy
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.professionalName}`} alt="" className="w-full h-full" />
            </div>
            <span className="text-[11px] font-medium text-slate-400 truncate">{service.professionalName}</span>
          </div>

          <h3 className="text-sm font-semibold text-slate-700 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>

          <div className="flex gap-3 text-[10px] font-medium text-slate-400 mb-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{responseTime}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{zones[0] || "MDP"}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-medium text-slate-400">Desde</span>
              <p className="text-lg font-bold text-slate-950 tracking-tight">{priceFrom > 0 ? formatPrice(priceFrom) : "A presupuestar"}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              <Star className="w-3 h-3 fill-current" />{service.rating || 0}
            </span>
          </div>

          <div className="mt-4 flex h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800">
            Reservar
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ServiceCard;
