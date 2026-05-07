"use client";

import React, { useState } from "react";
import { Users, Package, Wrench, Shield, DollarSign, AlertTriangle, LayoutDashboard, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "usuarios", label: "Usuarios", icon: Users },
  { id: "productos", label: "Productos", icon: Package },
  { id: "servicios", label: "Servicios", icon: Wrench },
  { id: "pagos", label: "Pagos retenidos", icon: DollarSign },
  { id: "reclamos", label: "Reclamos", icon: AlertTriangle },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" /> Panel de Administración
            </h1>
            <p className="text-slate-500 mt-2">Gestión general de MDP Market (Mock)</p>
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
            
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 mb-2">Ventas del mes</p>
                    <p className="text-3xl font-semibold text-slate-950">$ 4.2M</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 mb-2">Órdenes activas</p>
                    <p className="text-3xl font-semibold text-slate-950">142</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 mb-2">Reclamos</p>
                    <p className="text-3xl font-semibold text-red-600">3</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 mb-2">Nuevos Usuarios</p>
                    <p className="text-3xl font-semibold text-slate-950">84</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
                  <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Gráficos y analíticas próximamente.</p>
                </div>
              </>
            )}

            {activeTab !== "dashboard" && (
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
