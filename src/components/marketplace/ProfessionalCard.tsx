"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Professional } from "@/types";
import { cn } from "@/lib/utils";

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const description = professional.bio || professional.headline || "Profesional verificado en MDP Market.";

  return (
    <Link href={`/profesionales/${professional.slug}`} className="block h-full group">
      <article className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={professional.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`}
                alt={professional.name}
                className="w-full h-full object-cover"
              />
            </div>
            {professional.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white">
                <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {professional.name}
            </h3>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">
              {professional.profession}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                <Star className="h-3 w-3 fill-current" />
                {professional.rating.average}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                ({professional.rating.totalReviews})
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-100">
            <MapPin className="w-3 h-3 text-blue-500" />
            {professional.zones[0]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-100">
            <Clock className="w-3 h-3 text-blue-500" />
            {professional.stats.responseTime}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            {professional.stats.completedJobs} trabajos
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
            Ver perfil <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ProfessionalCard;
