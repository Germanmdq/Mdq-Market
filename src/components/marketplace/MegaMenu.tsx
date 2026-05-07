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
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
          isOpen ? "bg-slate-50 text-slate-950" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-medium">Categorías</span>
      </button>

      {/* Mega Menu Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[1120px] bg-white rounded-3xl border border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.16)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex max-h-[70vh]">
            
            {/* Columna 1: Root Categories */}
            <div className="w-[280px] border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-5 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      activeCategory?.id === cat.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-700 hover:bg-white hover:text-slate-950"
                    )}
                    onMouseEnter={() => setActiveCategory(cat)}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-all",
                      activeCategory?.id === cat.id ? "translate-x-0 opacity-100" : "opacity-0 group-hover:opacity-100"
                    )} />
                  </button>
                ))}
              </div>
            </div>

            {/* Columna 2 & 3: Subcategories */}
            <div className="flex-1 bg-white overflow-y-auto p-8">
              {activeCategory ? (
                <div className="grid grid-cols-3 gap-x-8 gap-y-8">
                  {activeCategory.children?.map((sub) => (
                    <div key={sub.id} className="space-y-3">
                      <Link
                        href={`/productos?category=${sub.slug}`}
                        className="text-sm font-semibold text-slate-950 hover:text-blue-600 transition-colors block"
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.name}
                      </Link>
                      <div className="space-y-2">
                        {sub.children?.slice(0, 5).map((child) => (
                          <Link
                            key={child.id}
                            href={`/productos?category=${sub.slug}&subcategory=${child.slug}`}
                            className="text-sm text-slate-600 hover:text-blue-600 transition-colors block"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                        {sub.children_count > 5 && (
                          <Link
                            href={`/productos?category=${sub.slug}`}
                            className="text-xs font-semibold text-blue-600 mt-1 hover:underline inline-block"
                            onClick={() => setIsOpen(false)}
                          >
                            Ver más →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!activeCategory.children || activeCategory.children.length === 0) && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-16 text-slate-400 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                        <LayoutGrid className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">No hay subcategorías disponibles</p>
                      <Link
                        href={`/productos?category=${activeCategory.slug}`}
                        className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Ver productos de {activeCategory.name}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-300 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <LayoutGrid className="w-8 h-8 text-slate-200" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-400">Selecciona una categoría</p>
                    <p className="text-sm text-slate-400 mt-1">Explora el catálogo completo de MDP Market</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
