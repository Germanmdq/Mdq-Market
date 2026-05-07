"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Search, Sparkles, ShieldCheck, Zap, Tag, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, getMegaMenuCategories } from "@/lib/categories";

// Helper to determine category type and build correct href
function getCategoryHref(category: Category): string {
  const rootSlug = category.path_slugs?.[0] ?? category.slug;

  // Servicios
  if (rootSlug === "servicios" || category.name.toLowerCase().includes("servicio")) {
    return category.level === 1
      ? "/servicios"
      : `/servicios?category=${category.slug}`;
  }

  // Profesionales
  if (rootSlug === "profesionales" || category.name.toLowerCase().includes("profesional")) {
    return category.level === 1
      ? "/profesionales"
      : `/profesionales?category=${category.slug}`;
  }

  // Productos (default)
  if (category.level === 1) {
    return `/productos?category=${category.slug}`;
  } else if (category.level === 2) {
    // Si es nivel 2, es una subcategoría
    return `/productos?subcategory=${category.slug}`;
  }

  // Nivel 3 o más profundo
  return `/productos?subcategory=${category.slug}`;
}

const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || loaded || loadingCategories) return;
    const loadCategories = async () => {
      setLoadingCategories(true);
      const tree = await getMegaMenuCategories();
      setCategories(tree);
      if (tree.length > 0) {
        setActiveCategory(tree[0]);
      }
      setLoaded(true);
      setLoadingCategories(false);
    };
    loadCategories();
  }, [isOpen, loaded, loadingCategories]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredCategories = searchQuery
    ? categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.children?.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  const visibleSubcategories = activeCategory?.children?.filter(sub => sub.is_active !== false) || [];

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
          isOpen ? "bg-slate-50 text-slate-950" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-medium">Categorías</span>
      </button>

      {/* Mega Menu Panel - 3 Columnas */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[1080px] bg-white rounded-3xl border border-slate-200 shadow-[0_30px_90px_rgba(15,23,42,0.18)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-[260px_minmax(0,1fr)_240px] max-h-[620px]">

            {/* Columna 1: Categorías Principales */}
            <aside className="bg-slate-50/70 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {loadingCategories && (
                  <div className="space-y-2 p-2">
                    <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                )}
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      activeCategory?.id === cat.id
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-700 hover:bg-white hover:text-slate-950"
                    )}
                    onMouseEnter={() => setActiveCategory(cat)}
                    onClick={() => {
                      setActiveCategory(cat);
                      if (!cat.children || cat.children.length === 0) {
                        window.location.href = getCategoryHref(cat);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <span className="truncate">{cat.name}</span>
                    {cat.children && cat.children.length > 0 && (
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-all shrink-0",
                        activeCategory?.id === cat.id ? "translate-x-0 opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} />
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* Columna 2: Subcategorías */}
            <section className="bg-white overflow-y-auto p-6">
              {activeCategory ? (
                visibleSubcategories.length > 0 ? (
                  <div>
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-slate-950">{activeCategory.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">Explora por subcategoría</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {visibleSubcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={getCategoryHref(sub)}
                          className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-950 group-hover:text-blue-600 transition-colors truncate">
                                {sub.name}
                              </div>
                              {sub.children_count > 0 && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {sub.children_count} {sub.children_count === 1 ? 'opción' : 'opciones'}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={getCategoryHref(activeCategory)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Ver todo en {activeCategory.name}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <LayoutGrid className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-950 mb-2">
                      {activeCategory.name}
                    </h3>
                    <Link
                      href={getCategoryHref(activeCategory)}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Ver categoría
                    </Link>
                  </div>
                )
              ) : (
                <div className="py-16 text-center text-sm font-medium text-slate-400">Cargando categorías...</div>
              )}
            </section>

            {/* Columna 3: Accesos Rápidos / Destacados */}
            <aside className="bg-slate-950 text-white p-6 overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-5">
                Accesos rápidos
              </p>

              <div className="space-y-2">
                <Link
                  href="/productos?ofertas=true"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">Ofertas del día</div>
                    <div className="text-xs text-slate-400">Productos con descuento</div>
                  </div>
                </Link>

                <Link
                  href="/productos?delivery=true"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">Entrega MDP</div>
                    <div className="text-xs text-slate-400">Con envío local</div>
                  </div>
                </Link>

                <Link
                  href="/servicios"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">Servicios urgentes</div>
                    <div className="text-xs text-slate-400">Disponibles hoy</div>
                  </div>
                </Link>

                <Link
                  href="/profesionales?verified=true"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">Profesionales verificados</div>
                    <div className="text-xs text-slate-400">Identidad validada</div>
                  </div>
                </Link>

                <Link
                  href="/productos?featured=true"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">Destacados</div>
                    <div className="text-xs text-slate-400">Lo más buscado</div>
                  </div>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/publicar"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  Publicar gratis
                </Link>
              </div>
            </aside>

          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
