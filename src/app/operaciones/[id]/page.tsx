"use client";

import React from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Package, 
  ArrowLeft, 
  MessageSquare, 
  AlertCircle,
  HelpCircle,
  MoreVertical,
  MapPin,
  Calendar
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export default function OperationDetailPage({ params }: { params: { id: string } }) {
  const isService = params.id === "op-2"; // Simulation

  const timeline = [
    { status: "Pago aprobado", date: "Hoy, 10:45", desc: "El pago fue procesado correctamente.", completed: true, current: false },
    { status: "Pago protegido", date: "Hoy, 10:45", desc: "El dinero está retenido de forma segura por MDP Market.", completed: true, current: false },
    { status: isService ? "Profesional confirmado" : "Vendedor notificado", date: "Hoy, 11:00", desc: "Ya se le avisó al vendedor sobre tu compra.", completed: true, current: true },
    { status: isService ? "Turno agendado" : "En preparación", date: "Pendiente", desc: "Esperando confirmación de fecha y hora.", completed: false, current: false },
    { status: isService ? "Servicio realizado" : "Entregado", date: "Pendiente", desc: "El profesional debe marcar el servicio como finalizado.", completed: false, current: false },
    { status: "Pago liberado", date: "Pendiente", desc: "Se libera el dinero una vez que confirmás la recepción.", completed: false, current: false },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
           <div className="flex items-center gap-4">
              <Link href="/dashboard/usuario" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-gray-900 transition-all shadow-sm">
                 <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit">
                    Operación #{params.id}
                 </div>
                 <h1 className="text-2xl font-black text-gray-900 mt-1">Seguimiento de Compra</h1>
              </div>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <Link href="/chat?id=1" className="flex-grow md:flex-grow-0 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
                 <MessageSquare className="w-4 h-4" />
                 Chat con Vendedor
              </Link>
              <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
                 <MoreVertical className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Timeline Column */}
           <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                 <h2 className="text-xl font-black text-gray-900 mb-8">Estado del pedido</h2>
                 
                 <div className="relative space-y-12">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    
                    {timeline.map((step, i) => (
                      <div key={i} className="relative pl-12">
                         <div className={cn(
                           "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-all",
                           step.completed ? "bg-green-500 text-white scale-110" : step.current ? "bg-blue-600 text-white scale-110" : "bg-gray-200 text-gray-400"
                         )}>
                            {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.current ? <Clock className="w-4 h-4" /> : null}
                         </div>
                         <div>
                            <div className="flex justify-between items-center mb-1">
                               <h4 className={cn(
                                 "font-black uppercase text-xs tracking-wider",
                                 step.completed ? "text-green-600" : step.current ? "text-blue-600" : "text-gray-400"
                               )}>{step.status}</h4>
                               <span className="text-[10px] font-bold text-gray-400">{step.date}</span>
                            </div>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Security Banner */}
              <div className="bg-blue-900 rounded-3xl p-8 text-white flex items-center gap-6 shadow-xl relative overflow-hidden">
                 <ShieldCheck className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5" />
                 <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                 </div>
                 <div>
                    <h3 className="font-black text-lg mb-1">Tu dinero está protegido</h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                       Recién cuando confirmes que recibiste el producto o el servicio, liberaremos el pago al vendedor. 
                       Ante cualquier duda, podés abrir un reclamo.
                    </p>
                 </div>
              </div>
           </div>

           {/* Info Column */}
           <div className="lg:col-span-5 space-y-6">
              {/* Product Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Resumen del pedido</h3>
                 <div className="flex gap-4 mb-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0">
                       <Package className="text-gray-300" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h4 className="font-bold text-gray-900 leading-tight mb-1">iPhone 15 Pro Max 256GB</h4>
                       <span className="text-xl font-black text-blue-900">{formatPrice(1250000)}</span>
                    </div>
                 </div>
                 <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500">Vendedor</span>
                       <span className="font-bold text-gray-900">TechStore MDP</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500">Tipo de Entrega</span>
                       <span className="font-bold text-gray-900">Envío a domicilio</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500">Ubicación</span>
                       <div className="flex items-center gap-1 font-bold text-gray-900">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          Güemes
                       </div>
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-3">
                 <button className="w-full py-4 bg-gray-50 text-gray-400 font-black rounded-2xl cursor-not-allowed border border-gray-100">
                    Confirmar Entrega
                 </button>
                 <button className="w-full py-4 bg-white border-2 border-red-100 text-red-600 font-black rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Abrir Reclamo
                 </button>
                 <button className="w-full py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Ayuda con mi compra
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
