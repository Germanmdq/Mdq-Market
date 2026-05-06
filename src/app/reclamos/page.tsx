"use client";

import React from "react";
import Link from "next/link";
import { 
  AlertCircle, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck, 
  Search, 
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReclamosPage() {
  const reclamos = [
    { id: "REC-442", operation: "OP-982", title: "Producto dañado al recibir", date: "Hace 2 días", status: "En mediación", severity: "High" },
    { id: "REC-441", operation: "OP-971", title: "Profesional no asistió al turno", date: "Hace 1 semana", status: "Resuelto", severity: "Medium" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Centro de Reclamos</h1>
            <p className="text-gray-500 text-sm mt-1">Gestioná tus disputas y problemas de forma segura.</p>
         </div>
         <Link href="/reclamos/nuevo" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Abrir Nuevo Reclamo
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main List */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Historial de Reclamos</h2>
               </div>
               
               {reclamos.length > 0 ? (
                 <div className="divide-y divide-gray-50">
                    {reclamos.map((rec) => (
                      <div key={rec.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-6">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                              rec.status === "Resuelto" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}>
                               {rec.status === "Resuelto" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">#{rec.id}</span>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Op: {rec.operation}</span>
                               </div>
                               <h3 className="font-bold text-gray-900 mb-1">{rec.title}</h3>
                               <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.date}</span>
                                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                  <span className={cn(
                                    "font-black uppercase tracking-tighter",
                                    rec.status === "Resuelto" ? "text-green-600" : "text-orange-600"
                                  )}>{rec.status}</span>
                               </div>
                            </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-all" />
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle2 className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No tenés reclamos activos</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">Tus operaciones están protegidas. Si tenés un problema, acá aparecerán tus gestiones.</p>
                 </div>
               )}
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Mediación Segura</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                     MDP Market actúa como mediador imparcial. Si no hay acuerdo entre las partes, revisamos la evidencia y resolvemos en 48hs.
                  </p>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Garantía de Reembolso</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                     Si el reclamo es a tu favor, el dinero se reintegra automáticamente a tu cuenta o tarjeta utilizada.
                  </p>
               </div>
            </div>
         </div>

         {/* Sidebar / Help */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               <MessageSquare className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5" />
               <h3 className="text-xl font-black mb-4">¿Necesitás ayuda personalizada?</h3>
               <p className="text-blue-200 text-sm mb-8 leading-relaxed">
                  Nuestro equipo de soporte humano en Mar del Plata está disponible para ayudarte con cualquier problema en tus operaciones.
               </p>
               <button className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Hablar con Soporte
               </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <h3 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Preguntas Frecuentes</h3>
               <div className="space-y-4">
                  {[
                    "¿Cuánto tiempo tengo para reclamar?",
                    "¿Qué evidencia necesito subir?",
                    "¿Cómo funciona la devolución del dinero?",
                    "¿Qué pasa si el vendedor no responde?"
                  ].map((q, i) => (
                    <button key={i} className="w-full text-left p-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-between">
                       {q}
                       <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
