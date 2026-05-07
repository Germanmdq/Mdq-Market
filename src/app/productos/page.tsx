"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Filter, ChevronDown, Search, X, MapPin, ArrowUpDown } from "lucide-react";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ProductFilters from "@/components/marketplace/ProductFilters";
import { Product } from "@/types";

export type ProductFilterState = {
  categories: string[];
  zones: string[];
  minPrice: string;
  maxPrice: string;
  conditions: string[];
  sellerTypes: string[];
  verifiedOnly: boolean;
  deliveryOnly: boolean;
  protectedPaymentOnly: boolean;
};

const initialFilters: ProductFilterState = {
  categories: [],
  zones: [],
  minPrice: "",
  maxPrice: "",
  conditions: [],
  sellerTypes: [],
  verifiedOnly: false,
  deliveryOnly: false,
  protectedPaymentOnly: false,
};

export default function ProductosPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Destacados primero");
  const [filters, setFilters] = useState<ProductFilterState>(initialFilters);

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Apply active filters
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    if (filters.zones.length > 0) {
      result = result.filter(p => filters.zones.includes(p.zone));
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.conditions.length > 0) {
      result = result.filter(p => filters.conditions.includes(p.condition));
    }
    if (filters.sellerTypes.length > 0) {
      result = result.filter(p => p.sellerType && filters.sellerTypes.includes(p.sellerType));
    }
    if (filters.verifiedOnly) {
      result = result.filter(p => p.sellerVerified);
    }
    if (filters.deliveryOnly) {
      result = result.filter(p => p.mdpDelivery?.available);
    }
    if (filters.protectedPaymentOnly) {
      result = result.filter(p => p.protectedPayment);
    }

    // Sort
    if (sortBy === "Menor precio") result.sort((a, b) => a.price - b.price);
    if (sortBy === "Mayor precio") result.sort((a, b) => b.price - a.price);
    if (sortBy === "Mejor reputación") result.sort((a, b) => (b.sellerRating || 0) - (a.sellerRating || 0));

    return result;
  }, [searchQuery, filters, sortBy]);

  const activeFilterCount = 
    filters.categories.length + 
    filters.zones.length + 
    filters.conditions.length + 
    filters.sellerTypes.length + 
    (filters.minPrice ? 1 : 0) + 
    (filters.maxPrice ? 1 : 0) + 
    (filters.verifiedOnly ? 1 : 0) + 
    (filters.deliveryOnly ? 1 : 0) + 
    (filters.protectedPaymentOnly ? 1 : 0);

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
  };

  const removeFilter = (key: keyof ProductFilterState, val?: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (Array.isArray(next[key]) && val) {
        (next[key] as string[]) = (next[key] as string[]).filter(x => x !== val);
      } else if (typeof next[key] === 'boolean') {
        (next[key] as boolean) = false;
      } else if (typeof next[key] === 'string') {
        (next[key] as string) = "";
      }
      return next;
    });
  };

  return (
    <main className="w-full min-h-screen bg-slate-50 pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
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

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <ProductFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <section className="min-w-0 w-full">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-1">
                  Productos
                </h1>
                <div className="mt-2 text-xs font-black text-blue-600 uppercase tracking-widest">
                  {filteredProducts.length} resultados
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
                  <span className="pl-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordenar:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-xs font-black text-slate-900 focus:ring-0 cursor-pointer pr-8 outline-none"
                  >
                    <option>Destacados primero</option>
                    <option>Menor precio</option>
                    <option>Mayor precio</option>
                    <option>Mejor reputación</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:hidden mb-4 flex items-center gap-3">
              <button 
                onClick={() => setIsFiltersOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <div className="flex-1 relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-10 font-black text-xs uppercase tracking-widest shadow-sm appearance-none outline-none"
                >
                  <option>Destacados primero</option>
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                </select>
                <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filtros activos:</span>
                
                {filters.categories.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 text-white text-[10px] font-bold tracking-wide">
                    {c} <button onClick={() => removeFilter("categories", c)}><X className="w-3 h-3 hover:text-red-400" /></button>
                  </span>
                ))}
                {filters.zones.map(z => (
                  <span key={z} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 text-white text-[10px] font-bold tracking-wide">
                    {z} <button onClick={() => removeFilter("zones", z)}><X className="w-3 h-3 hover:text-red-400" /></button>
                  </span>
                ))}
                {filters.verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-wide">
                    Verificados <button onClick={() => removeFilter("verifiedOnly")}><X className="w-3 h-3 hover:text-blue-200" /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline ml-2">
                  Limpiar todos
                </button>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 mt-6 shadow-sm">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">No encontramos resultados</h3>
                 <p className="text-slate-500 text-sm">Probá quitando algunos filtros o cambiando tu búsqueda.</p>
                 <button onClick={clearFilters} className="mt-6 text-blue-600 font-bold text-sm hover:underline">
                   Limpiar filtros
                 </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950 tracking-tight">Filtros</h2>
              <button onClick={() => setIsFiltersOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 pt-2">
              <ProductFilters filters={filters} setFilters={setFilters} mobile />
            </div>
            <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0">
              <button onClick={clearFilters} className="rounded-2xl border border-slate-200 px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-900">
                Limpiar
              </button>
              <button onClick={() => setIsFiltersOpen(false)} className="rounded-2xl bg-blue-600 px-4 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100">
                Ver {filteredProducts.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
