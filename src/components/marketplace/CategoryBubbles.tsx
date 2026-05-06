"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function CategoryBubbles() {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
      {CATEGORIES.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/categorias/${cat.slug}`}
          className="flex flex-col items-center gap-4 group"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:scale-110 group-hover:border-blue-200 transition-all duration-500 overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-3xl md:text-4xl group-hover:rotate-12 transition-transform duration-500 relative z-10">
                {cat.slug === 'tecnologia' && '📱'}
                {cat.slug === 'hogar-y-electro' && '🛋️'}
                {cat.slug === 'servicios-urgencia' && '🚨'}
                {cat.slug === 'productos-mdp' && '🌊'}
                {cat.slug === 'construccion' && '🏗️'}
             </span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-black text-gray-800 uppercase tracking-tighter leading-none mb-1">{cat.name}</span>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Explorar</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
