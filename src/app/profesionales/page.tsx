"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Filter, 
  X, 
  ChevronDown,
  Award,
  Clock,
  Briefcase
} from "lucide-react";
import { MOCK_PROFESSIONALS, ZONES } from "@/data/mockData";
import { cn, formatPrice } from "@/lib/utils";

export default function ProfessionalsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 py-20 px-4 text-center">
         <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
               Directorio de Profesionales <br />
               <span className="text-purple-300">Verificados en MDP</span>
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto leading-relaxed">
               Encontrá expertos certificados con reputación real y reserva protegida. 
               La seguridad de contratar a los mejores de la ciudad.
            </p>
            <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
               <div className="flex-grow flex items-center px-4 gap-3 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="¿Qué profesional buscás?" className="w-full bg-transparent focus:outline-none text-gray-800" />
               </div>
               <button className="bg-purple-600 hover:bg-purple-700 text-white font-black py-3 px-10 rounded-xl transition-all shadow-lg active:scale-95">
                  Buscar
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
         <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className={cn(
              "fixed inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-0 lg:block w-full lg:w-72 shrink-0 transition-transform duration-300 transform",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
               <div className="h-full overflow-y-auto p-8 lg:p-0 space-y-10">
                  <div className="flex justify-between items-center lg:hidden mb-8">
                     <h2 className="text-2xl font-black">Filtros</h2>
                     <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
                  </div>

                  <div>
                     <h3 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Especialidad</h3>
                     <div className="space-y-3">
                        {["Hogar", "Legales", "Salud", "Tecnología", "Educación", "Estética"].map(esp => (
                          <label key={esp} className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                             <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors font-medium">{esp}</span>
                          </label>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h3 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Zonas</h3>
                     <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-2">
                        {ZONES.map(zone => (
                          <label key={zone} className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                             <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors font-medium">{zone}</span>
                          </label>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                     <div className="flex items-center gap-3 mb-4">
                        <Award className="w-6 h-6 text-purple-600" />
                        <span className="font-black text-purple-900 text-sm">Garantía Profesional</span>
                     </div>
                     <p className="text-[11px] text-purple-700 leading-relaxed font-medium">
                        Todos los profesionales con el sello verificado han validado su identidad y/o matrícula ante MDP Market.
                     </p>
                  </div>

                  <button className="w-full lg:hidden py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl" onClick={() => setIsSidebarOpen(false)}>
                     Aplicar Filtros
                  </button>
               </div>
            </aside>

            {/* Grid Area */}
            <div className="flex-grow space-y-8">
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                     Mostrando <span className="text-gray-900">{MOCK_PROFESSIONALS.length}</span> profesionales
                  </span>
                  <div className="flex items-center gap-4">
                     <button className="lg:hidden p-2 bg-gray-50 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                        <Filter className="w-5 h-5 text-gray-600" />
                     </button>
                     <select className="bg-white border-none text-sm font-black text-gray-900 focus:ring-0 cursor-pointer appearance-none pr-8">
                        <option>Mejor Calificados</option>
                        <option>Más Populares</option>
                        <option>Menor Precio</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                  {MOCK_PROFESSIONALS.map((prof) => (
                    <Link 
                      key={prof.id}
                      href={`/profesionales/${prof.slug}`}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-purple-400 transition-all duration-300 group overflow-hidden flex flex-col"
                    >
                       <div className="p-8 pb-4">
                          <div className="flex justify-between items-start mb-6">
                             <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-50 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover" />
                             </div>
                             {prof.verified && (
                               <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-100" title="Verificado">
                                  <CheckCircle2 className="w-5 h-5" />
                               </div>
                             )}
                          </div>
                          
                          <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{prof.name}</h3>
                          <p className="text-sm font-bold text-purple-600 mb-4">{prof.profession}</p>
                          
                           <div className="flex items-center gap-4 mb-6">
                             <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-black text-gray-900">{prof.rating.average}</span>
                             </div>
                             <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{prof.stats.completedJobs} Trabajos</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8">
                             {prof.zones.slice(0, 3).map(z => (
                               <span key={z} className="flex items-center gap-1 text-[10px] font-black text-gray-500 uppercase tracking-tighter bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                  <MapPin className="w-3 h-3" />
                                  {z}
                               </span>
                             ))}
                          </div>
                       </div>

                       <div className="mt-auto p-8 pt-0 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Desde</span>
                             <span className="text-2xl font-black text-gray-900">{formatPrice(prof.priceFrom)}</span>
                          </div>
                          <div className="bg-purple-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-purple-100 group-hover:bg-black transition-all">
                             Ver Perfil
                          </div>
                       </div>
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
