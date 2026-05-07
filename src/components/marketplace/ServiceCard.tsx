"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Service } from "@/types";
import { formatPrice } from "@/lib/utils";

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const fallback = "https://placehold.co/400x300/f1f5f9/94a3b8?text=Servicio";
  const [imgSrc, setImgSrc] = useState(service.image || fallback);

  return (
    <Link href={`/servicios/${service.slug}`} className="block h-full group">
      <article className="h-full overflow-hidden rounded-[24px] border border-slate-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)] flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={imgSrc}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            onError={() => setImgSrc(fallback)}
          />
          {service.availability === "Hoy" && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Disponible hoy
            </span>
          )}
          {service.verified && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-700 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              Verificado
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.professionalName}`} alt="" className="w-full h-full" />
            </div>
            <span className="text-[11px] font-medium text-slate-400 truncate">{service.professionalName}</span>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>

          <div className="flex gap-3 text-[10px] font-medium text-slate-400 mb-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.responseTime}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{service.zones[0]}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-medium text-slate-400">Desde</span>
              <p className="text-lg font-bold text-slate-950 tracking-tight">{formatPrice(service.priceFrom)}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              <Star className="w-3 h-3 fill-current" />{service.rating}
            </span>
          </div>

          <div className="mt-4 flex h-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700">
            Reservar
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ServiceCard;
