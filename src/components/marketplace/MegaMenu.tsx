"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, getMegaMenuCategories } from "@/lib/categories";

const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const tree = await getMegaMenuCategories();
      setCategories(tree);
    };
    loadCategories();
  }, []);

  const filteredCategories = searchQuery
    ? categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.children?.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
          isOpen ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase tracking-wider">Categorías</span>
      </button>

      {/* Mega Menu Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[1180px] bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_32px_80px_rgba(15,23,42,0.14)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-[600px]">
            
            {/* Columna 1: Root Categories */}
            <div className="w-[300px] border-r border-slate-100 flex flex-col bg-slate-50/50">
              <div className="p-6 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Buscar categorías..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all group",
                      activeCategory?.id === cat.id 
                        ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    )}
                    onMouseEnter={() => setActiveCategory(cat)}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      activeCategory?.id === cat.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )} />
                  </button>
                ))}
              </div>
            </div>

            {/* Columna 2 & 3: Subcategories */}
            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar p-10">
              {activeCategory ? (
                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  {activeCategory.children?.map((sub) => (
                    <div key={sub.id} className="space-y-4">
                      <Link 
                        href={`/productos?category=${sub.slug}`}
                        className="text-base font-bold text-slate-950 hover:text-blue-600 transition-colors block"
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.name}
                      </Link>
                      <div className="grid gap-2">
                        {sub.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/productos?category=${sub.slug}&subcategory=${child.slug}`}
                            className="text-sm text-slate-500 hover:text-blue-600 transition-colors py-1"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                        {sub.children_count > 5 && (
                          <Link
                            href={`/productos?category=${sub.slug}`}
                            className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-2 hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            Ver todo
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!activeCategory.children || activeCategory.children.length === 0) && (
                    <div className="col-span-2 flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                      <LayoutGrid className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-medium">No hay subcategorías disponibles</p>
                      <Link 
                        href={`/productos?category=${activeCategory.slug}`}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-600/20"
                        onClick={() => setIsOpen(false)}
                      >
                        Ver todos los productos de {activeCategory.name}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center animate-pulse">
                    <LayoutGrid className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-400">Explora MDP Market</p>
                    <p className="text-sm">Selecciona una categoría principal para comenzar</p>
                  </div>
                </div>
              )}
            </div>

            {/* Banner/Featured Area (Optional Col 4) */}
            <div className="w-[200px] bg-slate-950 p-8 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent" />
                <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Destacado</p>
                    <h4 className="text-white font-bold leading-tight">Nuevos Ingresos en Mar del Plata</h4>
                    <Link href="/productos" className="text-xs text-blue-400 font-bold hover:underline">Explorar ahora →</Link>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
