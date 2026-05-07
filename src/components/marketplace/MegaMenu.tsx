"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  LayoutGrid, 
  Search, 
  X, 
  Tag, 
  Truck, 
  Wrench, 
  UserCheck, 
  PlusCircle, 
  Smartphone, 
  Home, 
  Hammer, 
  Dog, 
  ShoppingBag,
  Zap,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, getMegaMenuCategories } from "@/lib/categories";

// Helper to get category icons based on name or slug
const getCategoryIcon = (name: string, slug: string) => {
  const n = name.toLowerCase();
  const s = slug.toLowerCase();
  
  if (s.includes("tecnologia") || s.includes("celulares") || s.includes("computacion")) return <Smartphone className="w-4 h-4" />;
  if (s.includes("hogar") || s.includes("muebles") || s.includes("electrodomesticos")) return <Home className="w-4 h-4" />;
  if (s.includes("herramientas") || s.includes("construccion")) return <Hammer className="w-4 h-4" />;
  if (s.includes("mascotas") || s.includes("animales")) return <Dog className="w-4 h-4" />;
  if (s.includes("servicios")) return <Wrench className="w-4 h-4" />;
  if (s.includes("profesionales")) return <UserCheck className="w-4 h-4" />;
  
  return <ShoppingBag className="w-4 h-4" />;
};

// Helper for correct links
const getCategoryHref = (category: Category) => {
  const rootSlug = category.path_slugs?.[0] ?? category.slug;

  if (rootSlug === "servicios") {
    return category.level === 1
      ? "/servicios"
      : `/servicios?category=${category.slug}`;
  }

  if (rootSlug === "profesionales") {
    return category.level === 1
      ? "/profesionales"
      : `/profesionales?category=${category.slug}`;
  }

  return category.level === 1
    ? `/productos?category=${category.slug}`
    : `/productos?subcategory=${category.slug}`;
};

const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const tree = await getMegaMenuCategories();
      setCategories(tree);
      if (tree.length > 0) setActiveCategory(tree[0]);
    };
    loadCategories();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Filtered results for search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    const results: Category[] = [];
    
    const flatten = (cats: Category[]) => {
      cats.forEach(cat => {
        if (cat.name.toLowerCase().includes(query)) {
          results.push(cat);
        }
        if (cat.children) flatten(cat.children);
      });
    };
    
    flatten(categories);
    return results.slice(0, 10);
  }, [searchQuery, categories]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 group",
          isOpen 
            ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
        )}
      >
        <LayoutGrid className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-90")} />
        <span className="text-sm font-bold uppercase tracking-widest pt-0.5">Categorías</span>
      </button>

      {/* Mega Menu Panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-[1080px] bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_40px_100px_rgba(15,23,42,0.18)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Internal Search Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar categorías, marcas, servicios..."
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all shadow-sm placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          <div className={cn(
            "grid",
            searchQuery ? "grid-cols-1" : "grid-cols-[280px_1fr_240px]"
          )}>
            
            {/* SEARCH RESULTS VIEW */}
            {searchQuery ? (
              <div className="p-8 min-height-[400px]">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">Resultados para "{searchQuery}"</p>
                {searchResults && searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {searchResults.map((cat) => (
                      <Link
                        key={cat.id}
                        href={getCategoryHref(cat)}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm">
                          {getCategoryIcon(cat.name, cat.slug)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Explorar</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">No encontramos esa categoría</p>
                    <p className="text-sm text-slate-500 mt-1">Intentá con otras palabras o navegá el menú lateral.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Columna 1: Categorías Principales */}
                <div className="bg-slate-50/70 border-r border-slate-100 flex flex-col p-3 max-h-[580px] overflow-y-auto">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 mt-2 ml-3">Explorar</p>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                          activeCategory?.id === cat.id
                            ? "bg-white text-blue-600 shadow-md shadow-slate-200/50"
                            : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                        )}
                        onMouseEnter={() => setActiveCategory(cat)}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "transition-transform duration-300",
                            activeCategory?.id === cat.id ? "scale-110" : "group-hover:scale-110"
                          )}>
                            {getCategoryIcon(cat.name, cat.slug)}
                          </span>
                          <span className="pt-0.5">{cat.name}</span>
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-all duration-300",
                          activeCategory?.id === cat.id ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Columna 2: Subcategorías (Cards) */}
                <div className="bg-white p-8 max-h-[580px] overflow-y-auto">
                  {activeCategory && (
                    <div className="space-y-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeCategory.name}</h2>
                          <p className="text-slate-500 text-sm font-medium mt-1">Descubrí las mejores opciones en Mar del Plata</p>
                        </div>
                        <Link 
                          href={getCategoryHref(activeCategory)}
                          className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          Ver Todo <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {activeCategory.children && activeCategory.children.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {activeCategory.children.map((sub) => (
                            <Link
                              key={sub.id}
                              href={getCategoryHref(sub)}
                              className="group p-5 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all flex flex-col"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{sub.name}</div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">Explorar subcategoría</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                            {getCategoryIcon(activeCategory.name, activeCategory.slug)}
                          </div>
                          <p className="text-lg font-bold text-slate-900">¿Listo para explorar?</p>
                          <p className="text-sm text-slate-500 mt-1 mb-6">Esta categoría tiene productos directos sin subgrupos.</p>
                          <Link
                            href={getCategoryHref(activeCategory)}
                            className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                            onClick={() => setIsOpen(false)}
                          >
                            Ver productos ahora
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Columna 3: Accesos Rápidos (Dark Mode Feel) */}
                <div className="bg-slate-950 p-7 flex flex-col h-full">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-6">Accesos Rápidos</p>
                  
                  <div className="space-y-3 flex-1">
                    {[
                      { label: "Ofertas del día", icon: Zap, href: "/productos?ofertas=true", color: "text-amber-400" },
                      { label: "Entrega MDP", icon: Truck, href: "/productos?entrega=mdp", color: "text-blue-400" },
                      { label: "Servicios 24 hs", icon: Wrench, href: "/servicios?urgencia=true", color: "text-emerald-400" },
                      { label: "Profesionales", icon: UserCheck, href: "/profesionales", color: "text-purple-400" },
                      { label: "Publicar Gratis", icon: PlusCircle, href: "/publicar", color: "text-pink-400" },
                    ].map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3.5 p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/90 hover:bg-white/10 hover:border-white/20 transition-all group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={cn("transition-transform group-hover:scale-110", link.color)}>
                          <link.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider pt-0.5">{link.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Promo bottom right */}
                  <div className="mt-8 p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">MDP MARKET APP</p>
                    <p className="text-sm font-black mt-1 leading-tight">Comprá local, <br /> crecé local.</p>
                    <button className="mt-4 w-full py-2.5 bg-white text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                      INSTALAR APP
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
