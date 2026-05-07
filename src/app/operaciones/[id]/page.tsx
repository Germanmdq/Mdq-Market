"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock, Package, MapPin, MessageSquare, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { status: "Pago protegido", date: "Hoy, 10:15", description: "El dinero está resguardado por MDP Market.", done: true },
  { status: "Vendedor notificado", date: "Hoy, 10:20", description: "El vendedor confirmó la disponibilidad.", done: true },
  { status: "Preparando producto", date: "Hoy, 11:30", description: "El vendedor está armando el paquete.", done: true },
  { status: "Retiro coordinado", date: "Hoy, 14:00", description: "Entrega coordinada para hoy de 16:00 a 19:00 hs.", done: false, active: true },
  { status: "En camino", date: "", description: "El cadete de MDP Market retiró el producto.", done: false },
  { status: "Entregado", date: "", description: "Producto entregado en tu dirección.", done: false },
  { status: "Confirmación de recepción", date: "", description: "Confirmás que recibiste todo bien y liberamos el pago.", done: false },
];

export default function OperationTimelinePage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[800px] mx-auto w-full px-4 py-10">
        
        <div className="mb-8 flex items-center gap-4">
          <Link href="/mi-cuenta" className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Operación #{params.id}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Seguimiento en tiempo real</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_32px_rgba(15,23,42,0.07)] mb-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">Sony PlayStation 5</h2>
                <p className="text-sm text-slate-500 mt-0.5">Vendido por Electro MDP</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" /> En preparación
              </span>
            </div>
          </div>

          <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 ml-3 mt-8">
            {TIMELINE.map((step, idx) => (
              <div key={idx} className="relative">
                {step.done ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 absolute -left-[19px] bg-white" />
                ) : step.active ? (
                  <div className="w-7 h-7 rounded-full bg-blue-100 absolute -left-[19px] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-7 h-7 text-slate-200 absolute -left-[19px] bg-white" />
                )}
                
                <div className="pl-6">
                  <h3 className={cn("text-base font-semibold", step.done || step.active ? "text-slate-950" : "text-slate-400")}>
                    {step.status}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                  {step.date && (
                    <span className="text-xs font-medium text-slate-400 mt-1 block">
                      {step.date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Acciones de usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:bg-slate-50 transition-colors">
            <MessageSquare className="w-6 h-6 text-slate-600" />
            <span className="text-sm font-semibold text-slate-900">Contactar al vendedor</span>
            <span className="text-xs text-slate-400 text-center">Solo disponible durante la operación</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors group">
            <AlertCircle className="w-6 h-6 text-slate-600 group-hover:text-red-600 transition-colors" />
            <span className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors">Abrir reclamo</span>
            <span className="text-xs text-slate-400 text-center group-hover:text-red-500/70 transition-colors">Tu pago está protegido</span>
          </button>
        </div>

        {/* Botón de confirmación (Simulación visible solo para demo) */}
        <div className="mt-8 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Acción requerida (Demo)</h4>
            <p className="text-xs text-slate-500 mt-1">Una vez entregado, debes liberar el pago.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-colors w-full sm:w-auto">
            Confirmar recepción y liberar pago
          </button>
        </div>

      </main>
    </div>
  );
}
