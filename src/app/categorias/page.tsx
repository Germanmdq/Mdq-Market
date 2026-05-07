"use client";

import React from "react";
import Link from "next/link";
import { 
  Smartphone, 
  Tv, 
  Home, 
  Wrench, 
  Shirt, 
  Baby, 
  Bike, 
  Store,
  Droplets,
  Zap,
  Flower,
  HardHat,
  Scale,
  HeartPulse,
  BookOpen,
  Camera,
  PawPrint,
  ChevronRight,
  Search
} from "lucide-react";
import { CATEGORIES } from "@/data/mockData";
import { cn } from "@/lib/utils";

// Icon mapping helper
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Smartphone": return <Smartphone className="w-8 h-8" />;
    case "Tv": return <Tv className="w-8 h-8" />;
    case "Droplets": return <Droplets className="w-8 h-8" />;
    default: return <Zap className="w-8 h-8" />;
  }
};

export default function CategoriesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Todas las Categorías</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
            Explorá el marketplace más completo de Mar del Plata por categoría. 
            Productos, servicios y profesionales a tu alcance.
          </p>
          <div className="max-w-xl mx-auto relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
              type="text" 
              placeholder="¿Qué categoría buscás?" 
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
             />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 group flex flex-col h-full"
              >
                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    {getIcon(cat.icon)}
                 </div>
                 <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                 <p className="text-gray-500 text-xs mb-8 leading-relaxed line-clamp-2">
                    {cat.description}
                 </p>
                 
                 <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-2">
                       {(cat.subcategories ?? []).slice(0, 3).map((sub) => (
                         <span key={sub.id} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                            {sub.name}
                         </span>
                       ))}
                       {(cat.subcategories ?? []).length > 3 && (
                         <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 py-1">
                            +{(cat.subcategories ?? []).length - 3} más
                         </span>
                       )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                         cat.type === "producto" ? "bg-blue-100 text-blue-700" : 
                         cat.type === "servicio" ? "bg-orange-100 text-orange-700" : 
                         "bg-purple-100 text-purple-700"
                       )}>
                          {cat.type}
                       </span>
                       <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-all" />
                    </div>
                 </div>
              </Link>
            ))}
         </div>
      </div>

      {/* Popular Categories Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
         <div className="bg-gradient-to-r from-blue-600 to-blue-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
            <Zap className="absolute -bottom-12 -right-12 w-64 h-64 text-white/5" />
            <div className="relative z-10">
               <h2 className="text-3xl font-black mb-6">¿Buscás algo específico?</h2>
               <div className="flex flex-wrap gap-4">
                  {["Tecnología", "Plomería", "Hogar", "Indumentaria", "Gasistas", "Muebles"].map(tag => (
                    <button key={tag} className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold hover:bg-white hover:text-blue-900 transition-all">
                       {tag}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
