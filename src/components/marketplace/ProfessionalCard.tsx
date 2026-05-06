"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, MapPin, Clock, ChevronRight, Award } from "lucide-react";
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
      <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-500">
              <img 
                src={imgError ? fallbackAvatar : (professional.avatar || fallbackAvatar)} 
                alt={professional.name} 
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            {professional.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-sm z-10">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-grow min-w-0">
            <h3 className="text-base font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors tracking-tight">
              {professional.name}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 truncate">
              {professional.profession}
            </p>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 w-fit">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-[11px] font-black text-amber-700">{professional.rating.average}</span>
            </div>
          </div>
        </div>

        {/* Info Row Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
           <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-tighter">
              <Clock className="w-3 h-3" />
              {professional.stats.responseTime}
           </div>
           {professional.verified && (
             <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-tighter">
                <Award className="w-3 h-3" />
                Matrícula Validada
             </div>
           )}
        </div>

        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Consulta</span>
            <span className="text-xl font-black text-slate-950 tracking-tighter">${professional.priceFrom.toLocaleString("es-AR")}</span>
          </div>
          <div className="text-right">
             <span className="block text-[10px] font-bold text-slate-400 truncate max-w-[100px]">
               {professional.zones[0]}
             </span>
          </div>
        </div>

        <div className="mt-5 w-full h-11 rounded-full bg-slate-950 group-hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center transition-all shadow-xl active:scale-95">
          Ver Perfil <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </div>
      </div>
    </Link>
  );
}
