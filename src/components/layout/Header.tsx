"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  X,
  Bell,
  Zap,
  ChevronDown,
  LayoutGrid,
  Package,
  Wrench,
  UserCheck,
  User,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/data/mockData";
import AuthModal from "../auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const openAuth = (view: "login" | "register") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        {/* Top Row: Logo | Search | Actions */}
        <div className="flex items-center justify-between py-3 md:py-4 gap-4 lg:gap-12">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all duration-500">M</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none tracking-tighter">MDP MARKET</span>
              <span className="text-[9px] font-black text-blue-600 tracking-[0.2em] uppercase opacity-70 leading-none mt-1">Mar del Plata</span>
            </div>
          </Link>

          {/* Search Bar - Protagonist */}
          <div className="flex-grow relative group max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-24 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all"
              placeholder="Buscar en Mar del Plata..."
            />
            <div className="absolute inset-y-1.5 right-1.5 hidden md:block">
              <button className="h-full px-6 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-sm">Buscar</button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
               <Link href="/favoritos" className="text-slate-500 hover:text-red-500 transition-colors relative group">
                  <Heart className="w-5 h-5 group-hover:fill-current" />
               </Link>
               <Link href="/chat" className="text-slate-500 hover:text-blue-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full border-2 border-white" />
               </Link>
               <Link href="/checkout" className="text-slate-500 hover:text-blue-600 transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">3</span>
               </Link>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => openAuth("login")}
                className="px-4 py-2 text-xs font-black text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-widest"
              >
                Ingresar
              </button>
              <button 
                onClick={() => openAuth("register")}
                className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Crear cuenta
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-50 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Bottom Row: Navigation (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between border-t border-slate-50 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
           <nav className="flex items-center gap-8">
              <div 
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors">
                  <LayoutGrid className="w-3.5 h-3.5" /> Categorías <ChevronDown className="w-3 h-3 opacity-40" />
                </button>
                
                {/* Mega Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-[540px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] text-slate-900 normal-case tracking-normal">
                    <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">Comprar Productos</h4>
                      <div className="grid gap-2.5">
                        {CATEGORIES.filter(c => c.type === 'producto').map(cat => (
                          <Link key={cat.id} href={`/productos`} className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2.5 group font-medium">
                            <Package className="w-4 h-4 opacity-30 group-hover:opacity-100" /> {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">Contratar Servicios</h4>
                      <div className="grid gap-2.5">
                        {CATEGORIES.filter(c => c.type === 'servicio').map(cat => (
                          <Link key={cat.id} href={`/servicios`} className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2.5 group font-medium">
                            <Wrench className="w-4 h-4 opacity-30 group-hover:opacity-100" /> {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/productos" className="hover:text-blue-600 transition-colors">Ofertas</Link>
              <Link href="/servicios" className="hover:text-blue-600 transition-colors">Servicios</Link>
              <Link href="/profesionales" className="hover:text-blue-600 transition-colors">Profesionales</Link>
              <Link href="/publicar" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Vender
              </Link>
           </nav>
           
           <div className="flex items-center gap-6">
              <Link href="/dashboard/usuario" className="hover:text-blue-600 transition-colors">Mis Compras</Link>
              <Link href="/ayuda" className="hover:text-blue-600 transition-colors">Ayuda</Link>
           </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-white z-[200] animate-in slide-in-from-right duration-300">
           <div className="p-6 space-y-8">
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => openAuth("login")} className="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-2xl uppercase tracking-widest text-[10px]">Ingresar</button>
                 <button onClick={() => openAuth("register")} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100">Crear cuenta</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "Productos", icon: Package, href: "/productos", color: "text-blue-600", bg: "bg-blue-50" },
                   { label: "Servicios", icon: Wrench, href: "/servicios", color: "text-purple-600", bg: "bg-purple-50" },
                   { label: "Profesionales", icon: UserCheck, href: "/profesionales", color: "text-amber-600", bg: "bg-amber-50" },
                   { label: "Favoritos", icon: Heart, href: "/favoritos", color: "text-red-600", bg: "bg-red-50" },
                 ].map(item => (
                   <Link key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className={cn("flex flex-col gap-3 p-6 rounded-[2rem] border border-slate-50 shadow-sm", item.bg)}>
                     <item.icon className={cn("w-6 h-6", item.color)} />
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.label}</span>
                   </Link>
                 ))}
              </div>

              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Ayuda y Soporte</h4>
                 <Link href="/ayuda" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700">Centro de Ayuda <ArrowRight className="w-4 h-4 opacity-30" /></Link>
                 <Link href="/reclamos" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700">Mis Reclamos <ArrowRight className="w-4 h-4 opacity-30" /></Link>
              </div>
           </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView={authView} />
    </header>
  );
};

export default Header;
