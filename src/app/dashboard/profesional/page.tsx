"use client";

import React from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Plus, 
  MapPin, 
  TrendingUp,
  Settings,
  Bell,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export default function ProfessionalDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
         <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-widest mb-1">
               <UserCheck className="w-4 h-4" />
               Profesional Verificado
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Servicios</h1>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <Link href="/publicar/servicio" className="flex-grow md:flex-grow-0 bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-2 active:scale-95">
               <Plus className="w-5 h-5" />
               Nuevo Servicio
            </Link>
            <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
               <Settings className="w-6 h-6" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Stats Row */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4 block">Ingresos del mes</span>
               <div className="text-3xl font-black text-gray-900 mb-2">{formatPrice(82500)}</div>
               <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2%
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4 block">Próximo Turno</span>
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="block font-bold text-gray-900">Mañana 10:00</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase">Constitución</span>
                  </div>
               </div>
               <Link href="/dashboard/profesional/agenda" className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-100 transition-all text-center block">
                  Ver Agenda
               </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-3xl text-white shadow-xl">
               <h3 className="text-xl font-black mb-4">Validá tu Matrícula</h3>
               <p className="text-purple-200 text-xs mb-6 leading-relaxed">
                  Subí tu documentación para obtener el sello de "Profesional Verificado Plus" y aumentá tu visibilidad.
               </p>
               <button className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-xs uppercase tracking-widest">
                  Subir Documentos
               </button>
            </div>
         </div>

         {/* Main Content */}
         <div className="lg:col-span-3 space-y-8">
            {/* Active Bookings */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div className="flex items-center gap-3">
                     <Calendar className="w-6 h-6 text-gray-400" />
                     <h2 className="text-xl font-black text-gray-900">Reservas Activas</h2>
                  </div>
                  <div className="flex gap-2">
                     <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">3 Pendientes</span>
                  </div>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                    { id: "r1", client: "Germán González", service: "Instalación de Termotanque", date: "Mañana 10:00", zone: "Constitución", status: "Confirmado", price: 25000 },
                    { id: "r2", client: "María Luz", service: "Reparación de Cocina", date: "Jueves 15:30", zone: "Güemes", status: "Pendiente", price: 18000 }
                  ].map((res) => (
                    <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${res.client}`} alt="" />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 mb-1">{res.client}</h4>
                             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>{res.service}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {res.zone}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="text-right">
                             <div className="font-black text-gray-900">{res.date}</div>
                             <span className={cn(
                               "text-[10px] font-black uppercase tracking-tighter",
                               res.status === "Confirmado" ? "text-green-500" : "text-orange-500"
                             )}>{res.status}</span>
                          </div>
                          <div className="flex gap-2">
                             <Link href={`/chat?id=${res.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <MessageSquare className="w-5 h-5" />
                             </Link>
                             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-black hover:bg-gray-100 transition-all">
                                Detalles
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* My Services */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-gray-900">Mis Servicios Publicados</h3>
                  <Link href="/publicar/servicio" className="text-purple-600 font-bold text-sm hover:underline">Gestionar todos</Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-purple-300 transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Plomería Integral</h4>
                        <span className="text-[10px] font-black text-green-500 uppercase">Activo</span>
                     </div>
                     <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                           <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                           <span className="font-bold text-gray-700">4.9</span>
                        </div>
                        <span>42 opiniones</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-xl font-black text-gray-900">{formatPrice(25000)} <span className="text-[10px] font-normal text-gray-400">/desde</span></span>
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Settings className="w-5 h-5" /></button>
                     </div>
                  </div>

                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-purple-200 transition-all cursor-pointer">
                     <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                        <Plus className="w-6 h-6 text-gray-300 group-hover:text-purple-500" />
                     </div>
                     <span className="text-sm font-bold text-gray-400 group-hover:text-purple-600">Agregar otro servicio</span>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
