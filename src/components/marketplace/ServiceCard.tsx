"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Shield, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Service } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/servicios/${service.slug}`} className="block h-full group">
        <article className="bg-white rounded-[2rem] p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col h-full">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-50">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImgError(true)}
            />
            
            {/* Status Floating */}
            {service.availability === "Hoy" && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Hoy
              </div>
            )}

            {service.verified && (
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Verificado</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.professionalName}`} 
                    alt={service.professionalName} 
                  />
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.professionalName}</span>
            </div>

            <h3 className="text-[13px] font-semibold text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
              {service.title}
            </h3>

            <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400 mb-5">
               <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{service.responseTime}</span>
               </div>
               <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{service.zones[0]}</span>
               </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Desde</span>
                  <span className="text-lg font-bold text-slate-950 tracking-tight">
                    {formatPrice(service.priceFrom)}
                  </span>
               </div>
               <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-amber-600 border border-amber-100">
                  <Star className="w-3 h-3 fill-amber-600" />
                  <span className="text-[10px] font-black">{service.rating}</span>
               </div>
            </div>

            <div className="mt-5 w-full h-11 rounded-full bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center transition-all group-hover:bg-blue-600">
               Reservar
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
