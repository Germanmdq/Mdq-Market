"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, Search, X } from "lucide-react";
import { Category, getMegaMenuCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";

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
      // Navigate to products with this category
      onClose();
    }
  };

  const handleBack = () => {
    const prevHistory = [...history];
    const prevLevel = prevHistory.pop();
    if (prevLevel) {
      setHistory(prevHistory);
      setCurrentLevel(prevLevel);
      // Logic to find new parent or set to null
      setCurrentParent(null); // Simple version
    }
  };

  const filteredLevel = searchQuery
    ? categories.flatMap(c => [c, ...(c.children || [])]).filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentLevel;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {history.length > 0 ? (
            <button onClick={handleBack} className="p-2 -ml-2 text-slate-600">
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <LayoutGrid className="w-5 h-5 text-blue-600" />
          )}
          <h2 className="font-bold text-slate-900">
            {currentParent ? currentParent.name : "Categorías"}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-slate-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="¿Qué categoría buscas?"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {filteredLevel.map((cat) => (
            <div key={cat.id}>
              {cat.children && cat.children.length > 0 ? (
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 border-b border-slate-50 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ) : (
                <Link
                  href={`/productos?category=${cat.slug}`}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 border-b border-slate-50 transition-colors"
                  onClick={onClose}
                >
                  <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                </Link>
              )}
            </div>
          ))}
          
          {searchQuery === "" && currentParent && (
            <Link
              href={`/productos?category=${currentParent.slug}`}
              className="w-full block px-6 py-6 text-center text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors mt-4"
              onClick={onClose}
            >
              Ver todo en {currentParent.name}
            </Link>
          )}
        </div>
      </div>

      {/* Footer / Quick Actions */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Descubrí MDP Market</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/servicios" onClick={onClose} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-900">Servicios</p>
          </Link>
          <Link href="/profesionales" onClick={onClose} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-900">Profesionales</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryMenu;
