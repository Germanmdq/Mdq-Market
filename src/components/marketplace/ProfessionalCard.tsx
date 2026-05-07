"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Professional } from "@/types";

type ProfessionalCardData = Professional & {
  completedJobs?: number;
  completed_jobs?: number;
  rating?: Professional["rating"] | number;
};

const ProfessionalCard: React.FC<{ professional: ProfessionalCardData }> = ({ professional }) => {
  const description = professional.bio || professional.headline || "Profesional verificado en MDP Market.";
  const rating =
    typeof professional.rating === "number"
      ? professional.rating
      : professional.rating?.average ?? 0;
  const completedJobs = professional.stats?.completedJobs ?? professional.completedJobs ?? professional.completed_jobs ?? 0;
  const zones = Array.isArray(professional.zones) ? professional.zones : [];

  return (
    <article className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_76px_rgba(15,23,42,0.18)] flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={professional.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`}
            alt={professional.name}
            className="h-16 w-16 rounded-2xl object-cover shadow-md bg-slate-50"
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-950 truncate max-w-[140px] sm:max-w-[180px]">
              {professional.name}
            </h3>
            <p className="text-sm font-medium text-blue-600 line-clamp-1">
              {professional.profession || professional.category || "Profesional local"}
            </p>
          </div>
        </div>

        {professional.verified && (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 tracking-wider uppercase shrink-0">
            Verificado
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900 flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {rating.toFixed(1)}
        </span>
        <span className="text-slate-400">•</span>
        <span className="font-medium">{completedJobs} trabajos</span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {zones.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {zones.slice(0, 3).map(z => (
            <span key={z} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50">
              {z}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Desde
          </p>
          <p className="text-xl font-semibold text-slate-950">
            ${(professional.priceFrom || 15000).toLocaleString("es-AR")}
          </p>
        </div>

        <Link 
          href={`/profesionales/${professional.slug}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 shrink-0"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
};

export default ProfessionalCard;
