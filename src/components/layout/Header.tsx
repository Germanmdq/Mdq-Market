"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, MapPin, Heart, Bell, X, ChevronDown, Package, Store, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-2" : "bg-white py-3 border-b border-slate-100"
    )}>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="hidden sm:block text-base font-bold text-slate-900">MDP Market</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar productos, servicios o profesionales..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/70 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Nav links desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Productos", href: "/productos", icon: Package },
              { label: "Servicios", href: "/servicios", icon: Store },
              { label: "Profesionales", href: "/profesionales", icon: Briefcase },
            ].map(l => (
              <Link key={l.label} href={l.href} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1 ml-auto">
            <Link href="/favoritos" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition relative">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/carrito" className="flex w-9 h-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition relative">
              <ShoppingCart className="h-[18px] w-[18px]" />
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
            </Link>
            <Link href="/perfil" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-50">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/70 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
          {[
            { label: "Productos", href: "/productos" },
            { label: "Servicios", href: "/servicios" },
            { label: "Profesionales", href: "/profesionales" },
            { label: "Ofertas", href: "/productos?ofertas=true" },
            { label: "Mi cuenta", href: "/perfil" },
          ].map(l => (
            <Link key={l.label} href={l.href} className="block px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
