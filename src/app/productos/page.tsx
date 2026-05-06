"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Filter, 
  ChevronDown, 
  Grid2X2, 
  List,
  Search,
  X,
  MapPin,
  ArrowUpDown
} from "lucide-react";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ProductFilters from "@/components/marketplace/ProductFilters";
import { cn } from "@/lib/utils";

export default function ProductosPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Destacados primero");

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full min-h-screen bg-slate-50">
      {/* Header compact for mobile / Search bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos en Mar del Plata..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <ProductFilters />
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="min-w-0 w-full">
            
            {/* Header / Results Info */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-1">
                  Productos en Mar del Plata
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                  Encontrá productos locales con Pago protegido y Entrega MDP.
                </p>
                <div className="mt-2 text-xs font-black text-blue-600 uppercase tracking-widest">
                  {filteredProducts.length} productos encontrados
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
                  <span className="pl-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordenar:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-xs font-black text-slate-900 focus:ring-0 cursor-pointer pr-8"
                  >
                    <option>Destacados primero</option>
                    <option>Más recientes</option>
                    <option>Menor precio</option>
                    <option>Mayor precio</option>
                    <option>Mejor reputación</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden mb-4 flex items-center gap-3">
              <button 
                onClick={() => setIsFiltersOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                Filtros
              </button>

              <div className="flex-1 relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-10 font-black text-xs uppercase tracking-widest shadow-sm appearance-none outline-none"
                >
                  <option>Destacados primero</option>
                  <option>Más recientes</option>
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                </select>
                <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Chips Mobile */}
            <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {CATEGORIES.filter(c => c.type === 'producto').map(cat => (
                <button 
                  key={cat.id}
                  className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                 <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mb-2">No encontramos resultados</h3>
                 <p className="text-slate-500 font-medium">Probá ajustando los filtros o la búsqueda para encontrar lo que necesitás.</p>
                 <button 
                   onClick={() => {setSearchQuery("");}}
                   className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                 >
                   Ver todos los productos
                 </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Filters Mobile Bottom Sheet */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsFiltersOpen(false)} />

          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl transition-all duration-500 transform translate-y-0 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black text-slate-950 tracking-tight">Filtros</h2>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 pt-2">
              <ProductFilters mobile />
            </div>

            <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0">
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all"
              >
                Limpiar
              </button>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="rounded-2xl bg-blue-600 px-4 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
