"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Shield, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Service } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop";

  return (
    <Link href={`/servicios/${service.slug}`} className="block h-full group">
      <article className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative shadow-sm">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 group-hover:shadow-inner transition-all">
          <Image
            src={imgError ? fallbackImage : service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Floating Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {service.availability === "Hoy" && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Disponible Hoy
              </span>
            )}
            {service.featured && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                Destacado
              </span>
            )}
          </div>

          {/* Verification Badge */}
          {service.verified && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-sm z-10">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" strokeWidth={3} />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Verificado</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.professionalName}`} 
                  alt={service.professionalName} 
                />
             </div>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{service.professionalName}</span>
          </div>

          <h3 className="text-lg text-slate-900 font-black mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors tracking-tight min-h-[56px]">
            {service.title}
          </h3>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mb-6">
             <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{service.responseTime}</span>
             </div>
             <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span className="truncate max-w-[100px]">{service.zones[0]}</span>
             </div>
          </div>

          {/* Footer Meta */}
          <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presupuesto</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">
                  {formatPrice(service.priceFrom)}
                </span>
             </div>
             <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-600 border border-amber-100 mb-1">
                   <Star className="w-3 h-3 fill-amber-600" />
                   <span className="text-xs font-black">{service.rating}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{service.reviews} opiniones</span>
             </div>
          </div>

          {/* Action */}
          <div className="mt-6 w-full bg-slate-900 group-hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center">
             Reservar
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ServiceCard;
