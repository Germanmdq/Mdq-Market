"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Service } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const fallback = "https://placehold.co/400x300/f1f5f9/94a3b8?text=Servicio";
  const [imgSrc, setImgSrc] = useState(service.image || fallback);

  return (
    <Link href={`/servicios/${service.slug}`} className="block h-full group">
      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={imgSrc}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgSrc(fallback)}
          />

          {service.availability === "Hoy" && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Disponible hoy
            </span>
          )}

          {service.verified && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              Verificado
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.professionalName}`}
                alt={service.professionalName}
                className="w-full h-full"
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 truncate">
              {service.professionalName}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>

          <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              {service.responseTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-500" />
              {service.zones[0]}
            </span>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Desde</span>
              <span className="text-lg font-bold text-slate-950 tracking-tight">
                {formatPrice(service.priceFrom)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              {service.rating}
            </span>
          </div>

          <div className="mt-4 w-full h-10 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center transition hover:bg-blue-700">
            Reservar
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ServiceCard;
