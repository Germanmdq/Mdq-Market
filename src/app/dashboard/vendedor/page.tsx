"use client";

import React from "react";
import Link from "next/link";
import { 
  Plus, 
  Package, 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Star, 
  Settings, 
  ArrowUpRight,
  MoreVertical,
  Zap,
  BarChart3,
  Users
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export default function SellerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
         <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
               <TrendingUp className="w-4 h-4" />
               Vendedor Particular
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Ventas</h1>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <Link href="/publicar" className="flex-grow md:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95">
               <Plus className="w-5 h-5" />
               Nuevo Producto
            </Link>
            <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
               <Settings className="w-6 h-6" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Stats Row */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <DollarSign className="w-24 h-24 text-gray-900" />
               </div>
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4 block">Ventas del mes</span>
               <div className="text-3xl font-black text-gray-900 mb-2">{formatPrice(142500)}</div>
               <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12.5%
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4 block">Reputación</span>
               <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-black text-gray-900">4.8</div>
                  <div className="flex text-yellow-400">
                     <Star className="w-5 h-5 fill-yellow-400" />
                  </div>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
               </div>
               <span className="text-[10px] text-gray-400 font-bold mt-2 block">Vendedor Nivel Verde</span>
            </div>

            <div className="bg-blue-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
               <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
               <h3 className="text-xl font-black mb-4">¿Querés vender más?</h3>
               <p className="text-blue-200 text-xs mb-6 leading-relaxed">
                  Destacá tus publicaciones y aparecé en los primeros resultados de búsqueda de Mar del Plata.
               </p>
               <button className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-all text-xs uppercase tracking-widest">
                  Ver Planes
               </button>
            </div>
         </div>

         {/* Main Content */}
         <div className="lg:col-span-3 space-y-8">
            {/* Products List */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div className="flex items-center gap-3">
                     <Package className="w-6 h-6 text-gray-400" />
                     <h2 className="text-xl font-black text-gray-900">Mis Publicaciones</h2>
                  </div>
                  <div className="flex gap-2">
                     <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">8 Activas</span>
                     <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">2 Pausadas</span>
                  </div>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                    { id: "p1", title: "iPhone 15 Pro Max 256GB", stock: 1, price: 1250000, visits: 1240, sales: 0, status: "Activa" },
                    { id: "p2", title: "Smart TV LG 55' 4K OLED", stock: 1, price: 850000, visits: 850, sales: 1, status: "Vendida" },
                    { id: "p3", title: "Auriculares Sony XM5", stock: 2, price: 350000, visits: 420, sales: 0, status: "Pausada" }
                  ].map((prod) => (
                    <div key={prod.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                             <Package className="text-gray-300" />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 mb-1">{prod.title}</h4>
                             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Stock: {prod.stock}</span>
                                <span>{prod.visits} Visitas</span>
                                <span>{prod.sales} Ventas</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="text-right">
                             <div className="font-black text-gray-900">{formatPrice(prod.price)}</div>
                             <span className={cn(
                               "text-[10px] font-black uppercase tracking-tighter",
                               prod.status === "Activa" ? "text-green-500" : prod.status === "Vendida" ? "text-blue-500" : "text-gray-400"
                             )}>{prod.status}</span>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                             <MoreVertical className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-6 bg-gray-50/50 text-center">
                  <Link href="/dashboard/vendedor/productos" className="text-blue-600 font-bold text-sm hover:underline">Gestionar todas las publicaciones</Link>
               </div>
            </section>

            {/* Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                     <BarChart3 className="w-6 h-6 text-blue-600" />
                     <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Rendimiento</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Visitas Totales</span>
                        <span className="text-xl font-black text-gray-900">4,280</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tasa de Conversión</span>
                        <span className="text-xl font-black text-gray-900">1.2%</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Preguntas sin responder</span>
                        <span className="text-xl font-black text-blue-600">3</span>
                     </div>
                  </div>
               </section>

               <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                     <Users className="w-6 h-6 text-purple-600" />
                     <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Mensajes Recientes</h3>
                  </div>
                  <div className="space-y-6">
                     {[1, 2].map(i => (
                       <div key={i} className="flex items-center gap-4 group cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"></div>
                          <div className="flex-grow min-w-0">
                             <h4 className="text-sm font-bold text-gray-900 truncate">Comprador_{i*123}</h4>
                             <p className="text-xs text-gray-400 truncate">Hola, hacés envíos a Punta Mogotes?</p>
                          </div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                       </div>
                     ))}
                  </div>
                  <Link href="/chat" className="block text-center mt-8 text-blue-600 font-bold text-sm hover:underline">Ir a mensajería</Link>
               </section>
            </div>
         </div>
      </div>
    </div>
  );
}
