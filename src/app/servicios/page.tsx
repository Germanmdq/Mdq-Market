"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2,
  Filter,
  X,
  ChevronDown,
  Clock,
  Briefcase
} from "lucide-react";
import { CATEGORIES, ZONES } from "@/data/mockData";
import ServiceCard from "@/components/marketplace/ServiceCard";
import { cn } from "@/lib/utils";
import { getPublishedServices } from "@/lib/services";
import { Service } from "@/types";

export default function ServiciosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const data = await getPublishedServices();
      setServices(data);
      setLoading(false);
    };
    loadServices();
  }, []);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.professionalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Premium Header Section */}
      <section className="bg-white border-b border-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
           <nav className="flex justify-center text-[10px] font-black text-gray-400 mb-8 gap-2 uppercase tracking-[0.2em]">
             <Link href="/" className="hover:text-blue-600">Home</Link>
             <span>/</span>
             <span className="text-gray-900">Servicios y Profesionales</span>
           </nav>
           
           <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
             Lo resolvemos hoy.
           </h1>
           <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
             Encontrá profesionales matriculados y servicios con reserva protegida en toda la ciudad.
           </p>

           <div className="max-w-3xl mx-auto bg-gray-50 p-2 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
              <div className="flex-grow flex items-center px-6 gap-3 border-b md:border-b-0 md:border-r border-gray-100 py-4 group">
                 <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="¿Qué servicio necesitás?" 
                   className="w-full bg-transparent focus:outline-none text-gray-900 font-bold placeholder-gray-400"
                 />
              </div>
              <div className="flex-grow flex items-center px-6 gap-3 py-4">
                 <MapPin className="w-5 h-5 text-gray-400" />
                 <select className="w-full bg-transparent focus:outline-none text-gray-900 font-bold appearance-none cursor-pointer">
                   <option>Toda Mar del Plata</option>
                   {ZONES.map(z => <option key={z}>{z}</option>)}
                 </select>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95">
                Buscar
              </button>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className={cn(
            "fixed inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-0 lg:block w-full lg:w-72 shrink-0 transition-transform duration-500 transform",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
            <div className="h-full overflow-y-auto p-8 lg:p-0 space-y-12">
              <div className="flex justify-between items-center lg:hidden mb-8">
                <h2 className="text-2xl font-black tracking-tight">Filtros</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 rounded-xl"><X className="w-6 h-6" /></button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] opacity-50">Especialidades</h3>
                <div className="space-y-4">
                  {CATEGORIES.filter(c => c.type === "servicio" || c.type === "mixto").map(cat => (
                    <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{cat.name}</span>
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-gray-200 text-blue-600 focus:ring-blue-500" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Urgencies Card */}
              <div className="bg-red-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-red-100">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-black tracking-tight leading-none">Urgencias <br/> 24 Horas</h4>
                 <p className="text-xs font-medium text-red-100 leading-relaxed">Profesionales con disponibilidad inmediata para emergencias en el hogar.</p>
                 <button className="w-full py-4 bg-white text-red-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Ver Disponibles</button>
              </div>

              {/* Trust & Verification */}
              <div>
                <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] opacity-50">Confianza</h3>
                <div className="space-y-4">
                   <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-3">
                         <CheckCircle2 className="w-5 h-5 text-blue-600" />
                         <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Matriculados</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 group-hover:border-blue-600" />
                   </div>
                   <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-green-200 transition-all">
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-green-600" />
                         <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Reserva Protegida</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 group-hover:border-green-600" />
                   </div>
                </div>
              </div>
            </div>
          </aside>

          {/* List Area */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 mb-12 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{filteredServices.length} Profesionales</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Encontrados en MDP</span>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <button 
                  className="lg:hidden flex-grow flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                  onClick={() => setIsSidebarOpen(true)}
                 >
                    <Filter className="w-4 h-4" /> Filtros
                 </button>
                 <div className="relative flex-grow sm:flex-grow-0">
                    <select className="appearance-none w-full bg-gray-50 border-none rounded-2xl px-8 py-4 pr-12 text-[10px] font-black uppercase tracking-widest text-gray-900 cursor-pointer">
                      <option>Mejor calificados</option>
                      <option>Menor tiempo respuesta</option>
                      <option>Más recientes</option>
                      <option>Más trabajos</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="py-32 text-center">
                 <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-gray-200" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2">No encontramos profesionales</h3>
                 <p className="text-gray-500 font-medium">Probá ajustando los términos de búsqueda o el barrio.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
         <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="relative z-10 max-w-xl text-center md:text-left">
               <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-none tracking-tighter">¿Sos profesional o tenés una empresa de servicios?</h2>
               <p className="text-xl text-blue-100 font-medium mb-10">Unite a la red de servicios más confiable de Mar del Plata y empezá a recibir pedidos hoy.</p>
               <Link href="/alta-profesional" className="inline-flex bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                  Quiero Sumarme
               </Link>
            </div>
            <div className="relative z-10 w-full max-w-xs aspect-square bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/20 flex flex-col items-center justify-center p-8 text-center gap-4">
               <ShieldCheck className="w-16 h-16 text-white mb-2" />
               <h4 className="text-white font-black uppercase tracking-widest text-xs">Reserva Protegida Activa</h4>
               <p className="text-blue-100 text-[10px] font-bold">Garantizamos el cobro de tus servicios y la seguridad de tus clientes.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
