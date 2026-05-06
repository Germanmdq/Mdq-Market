"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, MapPin, Clock, Briefcase, ChevronRight } from "lucide-react";
import { Professional } from "@/types";
import { cn } from "@/lib/utils";

interface ProfessionalCardProps {
  professional: Professional;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const [imgError, setImgError] = useState(false);

  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`;

  return (
    <Link href={`/profesionales/${professional.slug}`} className="block h-full group">
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 h-full flex flex-col shadow-sm">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-500">
              <img 
                src={imgError ? fallbackAvatar : (professional.avatar || fallbackAvatar)} 
                alt={professional.name} 
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            {professional.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-xl border-4 border-white shadow-sm z-10">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                {professional.name}
              </h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              {professional.profession}
            </p>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="text-[11px] font-black text-amber-700">{professional.rating.average}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{professional.rating.totalReviews} reseñas</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 flex-grow">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span className="truncate">{professional.zones.join(", ")}</span>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <Clock className="w-3.5 h-3.5" />
                Llega en {professional.stats.responseTime}
             </div>
             <div className="text-right">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Consulta</span>
                <span className="text-base font-black text-slate-900 tracking-tighter">${professional.priceFrom.toLocaleString("es-AR")}</span>
             </div>
          </div>
        </div>

        <div className="mt-6 w-full py-4 bg-slate-950 text-white group-hover:bg-blue-600 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
          Ver Perfil <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
