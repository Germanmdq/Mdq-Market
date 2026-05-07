"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Award
} from "lucide-react";
import { MOCK_PROFESSIONALS, ZONES } from "@/data/mockData";
import { cn, formatPrice } from "@/lib/utils";

export default function ProfessionalsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredProfessionals = MOCK_PROFESSIONALS.filter((prof) => {
    if (searchQuery && !prof.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !prof.profession.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedZone && !prof.zones.includes(selectedZone)) {
      return false;
    }
    if (verifiedOnly && !prof.verified) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Profesionales en Mar del Plata
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Expertos certificados con reputación verificada
            </p>
          </div>

          <div className="max-w-2xl bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-1.5">
            <div className="flex-grow flex items-center px-4 gap-3 py-2.5 bg-white rounded-xl">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué profesional buscás?"
                className="w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-xl transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </div>

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
                {/* Zone */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Zona</h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {ZONES.slice(0, 10).map((zone) => (
                      <label key={zone} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="zone"
                          checked={selectedZone === zone}
                          onChange={() => setSelectedZone(selectedZone === zone ? "" : zone)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                          {zone}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedZone && (
                    <button
                      onClick={() => setSelectedZone("")}
                      className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                    >
                      Limpiar zona
                    </button>
                  )}
                </div>

                {/* Verification */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Verificación</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                      Matrícula verificada
                    </span>
                  </label>
                </div>

                {/* Info */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Garantía Profesional</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Los profesionales verificados han validado su identidad y/o matrícula.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid Area */}
          <div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-950">{filteredProfessionals.length}</h2>
                <span className="text-sm text-slate-600">profesionales encontrados</span>
              </div>
              <button
                className="lg:hidden p-2 bg-slate-50 rounded-lg border border-slate-200"
                onClick={() => setIsSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProfessionals.map((prof) => (
                <Link
                  key={prof.id}
                  href={`/profesionales/${prof.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover" />
                      </div>
                      {prof.verified && (
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm" title="Verificado">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-950 mb-0.5 group-hover:text-blue-600 transition-colors">
                      {prof.name}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mb-4">{prof.profession}</p>

                    <div className="flex items-center gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-950">{prof.rating.average}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-slate-600">{prof.stats.completedJobs} trabajos</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {prof.zones.slice(0, 3).map((z) => (
                        <span
                          key={z}
                          className="flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
                        >
                          <MapPin className="w-3 h-3" />
                          {z}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto p-6 pt-0 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Desde</span>
                      <span className="text-xl font-semibold text-slate-950">{formatPrice(prof.priceFrom)}</span>
                    </div>
                    <div className="bg-slate-950 text-white font-medium px-5 py-2.5 rounded-xl text-sm group-hover:bg-blue-600 transition-colors">
                      Ver perfil
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
