"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, Truck, DollarSign, MessageSquare, AlertCircle, LayoutDashboard, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ventas", label: "Ventas", icon: DollarSign },
  { id: "entregas", label: "Entregas a coordinar", icon: Truck },
  { id: "productos", label: "Publicaciones", icon: Package },
  { id: "mensajes", label: "Mensajes", icon: MessageSquare },
  { id: "reclamos", label: "Reclamos", icon: AlertCircle },
];

export default function VendedorPanelPage() {
  const [activeTab, setActiveTab] = useState("entregas");

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1280px] mx-auto w-full px-4 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Panel de Vendedor</h1>
            <p className="text-slate-500 mt-2">Gestioná tus ventas, publicaciones y entregas de MDP Market.</p>
          </div>
          <Link href="/vender" className="bg-slate-950 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-800 transition-colors">
            Publicar producto
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <aside className="w-full lg:w-64 shrink-0 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                  activeTab === tab.id 
                    ? "bg-slate-950 text-white" 
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-950"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="flex-1 w-full space-y-6">
            
            {activeTab === "entregas" && (
              <>
                <h2 className="text-xl font-semibold text-slate-950">Entregas a coordinar</h2>
                
                {/* Mock Sale to Coordinate */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_32px_rgba(15,23,42,0.07)]">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Orden #MDP-882193</p>
                      <p className="text-sm text-slate-950">Comprador: Juan P. - Hace 2 horas</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Pendiente de coordinación
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-950">Sony PlayStation 5</h3>
                      <p className="text-sm text-slate-500 mt-1">Pago protegido activo ($850.000)</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-600">Disponibilidad del comprador:</p>
                      <p className="font-semibold text-slate-950">Hoy de 16:00 a 19:00 hs</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3 justify-end items-center">
                    <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-full transition border border-slate-200">
                      Rechazar venta
                    </button>
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full transition shadow-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Confirmar disponibilidad y preparar
                    </button>
                  </div>
                </div>

                {/* Delivered Sale */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_32px_rgba(15,23,42,0.07)] opacity-75">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Orden #MDP-882190</p>
                      <p className="text-sm text-slate-950">Comprador: María G. - Ayer</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                      Entregado, esperando liberación de pago
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-950">Samsung Galaxy S23</h3>
                      <p className="text-sm text-slate-500 mt-1">Total: $1.200.000</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab !== "entregas" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-sm text-center">
                <p className="text-slate-500 font-medium">Sección {activeTab} en desarrollo.</p>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
