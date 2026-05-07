"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, AlertCircle, Settings, LogOut, Package, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "compras", label: "Mis compras", icon: ShoppingBag },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "reclamos", label: "Reclamos", icon: AlertCircle },
  { id: "direcciones", label: "Direcciones", icon: MapPin },
  { id: "ajustes", label: "Ajustes", icon: Settings },
];

export default function MiCuentaPage() {
  const [activeTab, setActiveTab] = useState("compras");

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1280px] mx-auto w-full px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Mi Cuenta</h1>
          <p className="text-slate-500 mt-2">Gestioná tus compras, favoritos y datos personales.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Nav */}
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
            <div className="pt-4 mt-4 border-t border-slate-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 w-full">
            {activeTab === "compras" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-950">Compras recientes</h2>
                
                {/* Mock Order */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Orden #MDP-882193</p>
                      <p className="text-sm text-slate-950">12 de Agosto, 2024</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                      Entregado, pendiente de confirmación
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-950">Sony PlayStation 5</h3>
                      <p className="text-sm text-slate-500 mt-1">Vendedor: Electro MDP</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-950">$850.000</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
                    <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-full transition border border-slate-200">
                      Abrir reclamo
                    </button>
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full transition shadow-sm">
                      Confirmar recepción
                    </button>
                  </div>
                </div>

              </div>
            )}

            {activeTab !== "compras" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
                <p className="text-slate-500 font-medium">Esta sección estará disponible próximamente.</p>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
