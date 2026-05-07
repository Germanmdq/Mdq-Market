"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Shield, MapPin, CheckCircle2, Trophy, Clock, ArrowRight } from "lucide-react";
import { Professional } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/profesionales/${professional.slug}`} className="block h-full group">
        <article className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col h-full">
          {/* Header with Avatar and Badge */}
          <div className="flex items-start justify-between mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`} 
                  alt={professional.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {professional.verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1.5 border-4 border-white shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-1.5">
               <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full text-amber-600 border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-600" />
                  <span className="text-xs font-black">{professional.rating.average}</span>
               </div>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{professional.rating.totalReviews} reseñas</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow space-y-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                {professional.name}
              </h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                {professional.category}
              </p>
            </div>

            <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed italic">
              "{professional.description}"
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-bold text-slate-500 border border-slate-100 uppercase tracking-tight">
                <MapPin className="w-3 h-3 text-blue-500" />
                {professional.zones[0]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-bold text-slate-500 border border-slate-100 uppercase tracking-tight">
                <Clock className="w-3 h-3 text-blue-500" />
                {professional.stats.responseTime}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Nivel Experto</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
               <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default ProfessionalCard;
