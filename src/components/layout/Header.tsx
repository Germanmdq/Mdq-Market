"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenu from "../marketplace/MegaMenu";
import MobileCategoryMenu from "../marketplace/MobileCategoryMenu";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.04)] py-2" 
          : "bg-white py-4 border-b border-slate-200/50"
      )}>
        <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              M
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-semibold tracking-tight text-slate-950 leading-tight">
                MDP Market
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-blue-600 leading-tight">
                Mar del Plata
              </p>
            </div>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden items-center gap-4 lg:flex">
            <MegaMenu />
            <Link href="/productos" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Productos</Link>
            <Link href="/servicios" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Servicios</Link>
            <Link href="/profesionales" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Profesionales</Link>
          </nav>

          {/* Search */}
          <div className="ml-auto hidden flex-1 max-w-md lg:block">
            <div className="flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar productos, servicios..."
                className="ml-2 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <Link href="/favoritos" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/carrito" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white border-2 border-white">
                3
              </span>
            </Link>
            <Link href="/mi-cuenta" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search & Quick Cats */}
        <div className="lg:hidden px-4 pb-3 pt-2 space-y-2">
          <div className="flex h-11 items-center rounded-full border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="ml-3 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>
          <button 
            onClick={() => setMobileCategoriesOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-200"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            VER CATEGORÍAS
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
            {[
              { label: "Productos", href: "/productos" },
              { label: "Servicios", href: "/servicios" },
              { label: "Profesionales", href: "/profesionales" },
              { label: "Ofertas", href: "/productos?ofertas=true" },
              { label: "Vender", href: "/vender" },
              { label: "Mi cuenta", href: "/mi-cuenta" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="block px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Mobile Category Drawer Overlay */}
      {mobileCategoriesOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden animate-in slide-in-from-right duration-300">
          <MobileCategoryMenu onClose={() => setMobileCategoriesOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;
