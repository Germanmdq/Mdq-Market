"use client";

import React, { useState } from "react";
import { Truck, MapPin, Package, Clock, ShieldCheck, Search, LayoutDashboard } from "lucide-react";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "rutas", label: "Rutas activas", icon: Truck },
  { id: "pendientes", label: "Pendientes de retiro", icon: Package },
];

export default function LogisticaPanelPage() {
  const [activeTab, setActiveTab] = useState("rutas");

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1440px] mx-auto w-full px-4 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-600" /> Logística MDP Market
            </h1>
            <p className="text-slate-500 mt-2">Coordinación y ruteo de envíos locales.</p>
          </div>
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
            
            {activeTab === "rutas" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-950">Entregas programadas para hoy</h2>
                  <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 px-4 py-2 rounded-full">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Buscar orden ID o cadete..." className="outline-none w-48" />
                  </div>
                </div>

                {/* Ruta 1 */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_32px_rgba(15,23,42,0.07)]">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider mb-1 block w-max">Zona Centro / Macrocentro</span>
                      <p className="text-sm font-semibold text-slate-950">Cadete asignado: Marcos R.</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-500">Progreso de ruta</p>
                      <p className="font-bold text-slate-950">1 de 4 entregadas</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Parada 1 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-950">#MDP-882180 - Entregada 11:30 hs</p>
                        <p className="text-xs text-slate-600 mt-1">Av. Colón 1234, 5ºB</p>
                      </div>
                    </div>

                    {/* Parada 2 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-950">#MDP-882193 - En camino</p>
                            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Av. Colón 2350, 4ºB</p>
                            <p className="text-xs text-slate-500 mt-1">Comprador: Juan P. - Tel: 2235...</p>
                          </div>
                          <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Franja 16:00 a 19:00</span>
                        </div>
                      </div>
                    </div>

                    {/* Parada 3 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-400">#MDP-882195 - Pendiente</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Rivadavia 3200, PB</p>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}

            {activeTab !== "rutas" && (
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
