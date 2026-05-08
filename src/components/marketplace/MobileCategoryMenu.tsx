"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Search, 
  X, 
  ShoppingBag, 
  Wrench, 
  UserCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { Category, getMegaMenuCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { getCategoryHref } from "@/lib/categories/getCategoryHref";

interface MobileCategoryMenuProps {
  onClose: () => void;
}

const MobileCategoryMenu = ({ onClose }: MobileCategoryMenuProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<Category[][]>([]);
  const [currentLevel, setCurrentLevel] = useState<Category[]>([]);
  const [currentParent, setCurrentParent] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const tree = await getMegaMenuCategories();
      setCategories(tree);
      setCurrentLevel(tree);
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (cat: Category) => {
    if (cat.children && cat.children.length > 0) {
      setHistory([...history, currentLevel]);
      setCurrentLevel(cat.children);
      setCurrentParent(cat);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    const prevHistory = [...history];
    const prevLevel = prevHistory.pop();
    if (prevLevel) {
      setHistory(prevHistory);
      setCurrentLevel(prevLevel);
      // Simplified: if we're back at root, parent is null
      setCurrentParent(prevHistory.length === 0 ? null : null); // In a real app we'd track the actual parent chain
    }
  };

  const filteredLevel = useMemo(() => {
    if (!searchQuery.trim()) return currentLevel;
    
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
    return results.slice(0, 15);
  }, [searchQuery, categories, currentLevel]);

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          {history.length > 0 ? (
            <button 
              onClick={handleBack} 
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-900 active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <LayoutGrid className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="font-black text-slate-900 text-lg tracking-tight">
              {currentParent ? currentParent.name : "Categorías"}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {currentParent ? "Explorar subcategorías" : "Explorar MDP Market"}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-5 bg-slate-50/50 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="¿Qué categoría buscas?"
            className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          {filteredLevel.map((cat) => (
            <div key={cat.id}>
              {cat.children && cat.children.length > 0 && searchQuery === "" ? (
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className="w-full flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-slate-50 active:bg-slate-100 transition-colors mb-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ) : (
                <Link
                  href={getCategoryHref(cat)}
                  className="w-full flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-slate-50 active:bg-slate-100 transition-colors mb-1"
                  onClick={onClose}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                       <span className="text-sm font-bold text-slate-900 truncate block">{cat.name}</span>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ver productos</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </Link>
              )}
            </div>
          ))}
          
          {searchQuery === "" && currentParent && (
            <Link
              href={getCategoryHref(currentParent)}
              className="mt-6 flex items-center justify-center gap-2 w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100"
              onClick={onClose}
            >
              Ver todo en {currentParent.name}
            </Link>
          )}

          {filteredLevel.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <p className="font-bold text-slate-900">No encontramos nada</p>
              <p className="text-sm text-slate-500 mt-1">Intentá con otra palabra.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions (Bottom) */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Más opciones</p>
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/servicios" 
            onClick={onClose} 
            className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Wrench className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-slate-900 uppercase">Servicios</p>
          </Link>
          <Link 
            href="/profesionales" 
            onClick={onClose} 
            className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-slate-900 uppercase">Pro</p>
          </Link>
        </div>
        <Link 
          href="/publicar" 
          onClick={onClose}
          className="flex items-center justify-between w-full p-5 bg-slate-950 text-white rounded-[1.5rem] active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest pt-0.5">Vender ahora</p>
          </div>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default MobileCategoryMenu;
