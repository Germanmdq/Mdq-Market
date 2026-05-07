"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  MapPin, 
  Heart, 
  Bell,
  Package,
  PlusCircle,
  X,
  ChevronDown,
  Store,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/90 backdrop-blur-xl shadow-sm py-2" : "bg-white py-4 border-b border-slate-50"
    )}>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-all">
              <span className="text-white font-black text-xl italic">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black text-slate-900 tracking-tighter block leading-none">MDP Market</span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Mar del Plata</span>
            </div>
          </Link>

          {/* Search Bar (Protagonist) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Busca productos, servicios o profesionales..."
                className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-full text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <div className="absolute inset-y-1.5 right-1.5 hidden lg:block">
                <Button size="sm" className="rounded-full bg-slate-900 px-6 font-bold text-[10px] uppercase tracking-widest h-full hover:bg-blue-600">
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            {/* Location (Desktop) */}
            <button className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors group">
              <MapPin className="h-4 w-4 text-blue-600" />
              <div className="text-left">
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Enviar a</span>
                <span className="text-xs font-black text-slate-900 leading-none">Mar del Plata</span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/favoritos" className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-600 relative group">
                <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Link>
              
              <Link href="/carrito" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-600 relative group">
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  3
                </span>
              </Link>

              <div className="hidden sm:block h-6 w-px bg-slate-100 mx-1" />

              <Link href="/perfil" className="hidden sm:flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-100 hover:border-blue-600 transition-all group">
                <div className="text-right hidden lg:block">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Hola, Germán</span>
                  <span className="text-[11px] font-black text-slate-900">Mi Cuenta</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden group-hover:scale-105 transition-transform">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=German" alt="User" />
                </div>
              </Link>
            </div>

            {/* Menu Mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop Only) */}
        <div className="hidden md:flex items-center gap-8 mt-4 pb-1 border-t border-slate-50 pt-3 overflow-x-auto no-scrollbar">
          <Link href="/productos" className="text-xs font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2 uppercase tracking-widest shrink-0">
            <Package className="w-4 h-4 text-blue-600" /> Productos
          </Link>
          <Link href="/servicios" className="text-xs font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2 uppercase tracking-widest shrink-0">
            <Store className="w-4 h-4 text-emerald-600" /> Servicios
          </Link>
          <Link href="/profesionales" className="text-xs font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2 uppercase tracking-widest shrink-0">
            <Briefcase className="w-4 h-4 text-amber-600" /> Profesionales
          </Link>
          <div className="h-4 w-px bg-slate-100 shrink-0" />
          <nav className="flex items-center gap-6">
            {["Ofertas", "Historial", "Supermercado", "Moda", "Vender"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors whitespace-nowrap uppercase tracking-widest">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[64px] z-40 bg-white md:hidden animate-in slide-in-from-top duration-300">
           <div className="p-4 space-y-6">
              {/* Search Mobile */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-3">
                 <Link href="/productos" className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-3xl group active:scale-95 transition-all">
                    <Package className="w-8 h-8 text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Productos</span>
                 </Link>
                 <Link href="/servicios" className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-3xl group active:scale-95 transition-all">
                    <Store className="w-8 h-8 text-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Servicios</span>
                 </Link>
              </div>

              <div className="space-y-2">
                 {["Mis Favoritos", "Mis Compras", "Notificaciones", "Ayuda"].map((item) => (
                    <Link key={item} href="#" className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                       <span className="text-sm font-bold text-slate-700">{item}</span>
                       <ChevronDown className="w-4 h-4 -rotate-90 text-slate-300" />
                    </Link>
                 ))}
              </div>

              <Button className="w-full py-7 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                 Ingresar / Registrarse
              </Button>
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;
