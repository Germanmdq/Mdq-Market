"use client";

import React from "react";
import Link from "next/link";
import { 
  Package, 
  Calendar, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Settings,
  Bell
} from "lucide-react";
import { CURRENT_USER } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

export default function UserDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
         <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-lg">
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-full h-full object-cover" />
         </div>
         <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
               <h1 className="text-3xl font-black text-gray-900">{CURRENT_USER.name}</h1>
               <div className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest inline-block w-fit mx-auto md:mx-0">
                  Comprador Verificado
               </div>
            </div>
            <p className="text-gray-500 text-sm">Miembro desde {CURRENT_USER.memberSince}</p>
         </div>
         <div className="flex gap-3">
            <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 text-gray-600">
               <Bell className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 text-gray-600">
               <Settings className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Nav */}
         <aside className="lg:col-span-1 space-y-2">
            <nav className="flex flex-col gap-1">
               <Link href="/dashboard/usuario" className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all">
                  <div className="flex items-center gap-3">
                     <TrendingUp className="w-5 h-5" />
                     Resumen
                  </div>
                  <ChevronRight className="w-4 h-4" />
               </Link>
               <Link href="/operaciones" className="flex items-center justify-between p-4 text-gray-600 hover:bg-white rounded-2xl font-medium transition-all">
                  <div className="flex items-center gap-3">
                     <Package className="w-5 h-5" />
                     Mis Compras
                  </div>
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full font-black">12</span>
               </Link>
               <Link href="/reservas" className="flex items-center justify-between p-4 text-gray-600 hover:bg-white rounded-2xl font-medium transition-all">
                  <div className="flex items-center gap-3">
                     <Calendar className="w-5 h-5" />
                     Mis Reservas
                  </div>
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full font-black">2</span>
               </Link>
               <Link href="/favoritos" className="flex items-center justify-between p-4 text-gray-600 hover:bg-white rounded-2xl font-medium transition-all">
                  <div className="flex items-center gap-3">
                     <Heart className="w-5 h-5" />
                     Favoritos
                  </div>
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full font-black">45</span>
               </Link>
               <Link href="/chat" className="flex items-center justify-between p-4 text-gray-600 hover:bg-white rounded-2xl font-medium transition-all">
                  <div className="flex items-center gap-3">
                     <MessageSquare className="w-5 h-5" />
                     Mensajes
                  </div>
                  <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-black">3</span>
               </Link>
               <Link href="/reclamos" className="flex items-center justify-between p-4 text-gray-600 hover:bg-white rounded-2xl font-medium transition-all">
                  <div className="flex items-center gap-3">
                     <AlertCircle className="w-5 h-5" />
                     Reclamos
                  </div>
               </Link>
            </nav>
         </aside>

         {/* Main Content */}
         <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="text-2xl font-black text-gray-900">$125.000</span>
                     <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pagos Protegidos</span>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="text-2xl font-black text-gray-900">2</span>
                     <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">En preparación</span>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                     <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="text-2xl font-black text-gray-900">Mañana</span>
                     <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Próxima Reserva</span>
                  </div>
               </div>
            </div>

            {/* Recent Operations */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">Operaciones en curso</h2>
                  <Link href="/operaciones" className="text-blue-600 font-bold text-sm hover:underline">Ver todas</Link>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                    { id: "op-1", title: "iPhone 15 Pro Max", status: "Pago Protegido", date: "Hoy", price: 1250000, type: "Producto" },
                    { id: "op-2", title: "Servicio de Plomería", status: "Turno Agendado", date: "Mañana 10:00", price: 25000, type: "Servicio" }
                  ].map((op) => (
                    <div key={op.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                             {op.type === "Producto" ? <Package className="text-gray-400" /> : <Calendar className="text-gray-400" />}
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 mb-1">{op.title}</h4>
                             <div className="flex items-center gap-3 text-xs">
                                <span className="text-blue-600 font-black uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">{op.status}</span>
                                <span className="text-gray-400">{op.date}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="font-black text-gray-900">{formatPrice(op.price)}</span>
                          <Link href={`/operaciones/${op.id}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-black hover:bg-gray-100 transition-all shadow-sm">
                             Seguimiento
                          </Link>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Recommendations */}
            <section>
               <h2 className="text-xl font-black text-gray-900 mb-6">Basado en tus favoritos</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-900 to-black rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                     <h3 className="text-xl font-black mb-2 relative z-10">Descuentos en Tecnología</h3>
                     <p className="text-blue-200 text-sm mb-6 relative z-10">Vendedores verificados en Mar del Plata tienen nuevas ofertas.</p>
                     <Link href="/productos" className="inline-flex items-center gap-2 bg-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all">
                        Explorar ahora
                        <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-300 transition-all">
                     <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                        <CheckCircle2 className="w-6 h-6 text-gray-300 group-hover:text-blue-500" />
                     </div>
                     <h3 className="font-bold text-gray-900 mb-1">Completá tu perfil</h3>
                     <p className="text-xs text-gray-400">Verificá tu identidad para operar con mayor seguridad.</p>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
