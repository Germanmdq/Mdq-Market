"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  ChevronDown,
  Clock,
  Briefcase,
  ShieldCheck
} from "lucide-react";
import ServiceCard from "@/components/marketplace/ServiceCard";
import { cn } from "@/lib/utils";
import { getPublishedServices } from "@/lib/services";
import { Service } from "@/types";

const ZONES = [
  "Centro", "Güemes", "Constitución", "La Perla", "Playa Grande",
  "Punta Mogotes", "Camet", "Los Troncos", "Parque Camet"
];

export default function ServiciosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [availableToday, setAvailableToday] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const data = await getPublishedServices();
      setServices(data);
      setLoading(false);
    };
    loadServices();
  }, []);

  const filteredServices = services.filter((s) => {
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.professionalName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedZone && !s.zones.includes(selectedZone)) {
      return false;
    }
    if (availableToday && s.availability !== "Hoy") {
      return false;
    }
    if (verifiedOnly && !s.verified) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Servicios en Mar del Plata
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Profesionales verificados con reserva protegida
            </p>
          </div>

          <div className="max-w-2xl bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-1.5">
            <div className="flex-grow flex items-center px-4 gap-3 py-2.5 bg-white rounded-xl">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué servicio necesitás?"
                className="w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
              />
            </div>
            <div className="flex-grow flex items-center px-4 gap-3 py-2.5 bg-white rounded-xl">
              <MapPin className="w-5 h-5 text-slate-400" />
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-900 appearance-none cursor-pointer"
              >
                <option value="">Toda Mar del Plata</option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-xl transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              "fixed inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-0 lg:block transition-transform duration-300 transform",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
          >
            <div className="h-full lg:h-auto overflow-y-auto p-6 lg:p-6 lg:sticky lg:top-24 lg:bg-white lg:rounded-3xl lg:border lg:border-slate-200 lg:shadow-sm">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="hidden lg:block mb-6">
                <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
              </div>

              <div className="space-y-6">
                {/* Availability */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Disponibilidad</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={availableToday}
                      onChange={(e) => setAvailableToday(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                      Disponible hoy
                    </span>
                  </label>
                </div>

                {/* Verification */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Confianza</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                      Profesionales verificados
                    </span>
                  </label>
                </div>

                {/* Info Card */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Reserva protegida</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        El pago queda retenido hasta que confirmes que el servicio se completó correctamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* List Area */}
          <div>
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-950">{filteredServices.length}</h2>
                <span className="text-sm text-slate-600">servicios encontrados</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  className="lg:hidden flex-grow flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-medium border border-slate-200"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </button>
                <div className="relative flex-grow sm:flex-grow-0">
                  <select className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
                    <option>Mejor calificados</option>
                    <option>Más recientes</option>
                    <option>Menor precio</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 mb-2">
                  No encontramos profesionales
                </h3>
                <p className="text-sm text-slate-600">
                  Probá ajustando los filtros o la búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            ¿Sos profesional o tenés una empresa de servicios?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Unite a la red de servicios más confiable de Mar del Plata y empezá a recibir pedidos hoy.
          </p>
          <Link
            href="/alta-profesional"
            className="inline-flex bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            Quiero sumarme
          </Link>
        </div>
      </section>
    </div>
  );
}
