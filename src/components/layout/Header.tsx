"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  MessageSquare, 
  User, 
  Menu, 
  X,
  Bell,
  Wallet,
  Zap,
  ChevronDown,
  LayoutGrid,
  ShieldCheck,
  Package,
  Wrench,
  UserCheck,
  History,
  Tag,
  MapPin,
  Clock,
  Star,
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
    <header className="sticky top-0 z-50 w-full">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* NIVEL SUPERIOR: Logo | Búsqueda | Banner Beneficios   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 gap-4 md:gap-8">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg shadow-blue-100 group-hover:rotate-6 transition-all duration-500">M</div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black text-gray-900 leading-none tracking-tighter">MDP MARKET</span>
                <span className="hidden sm:block text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase opacity-70 leading-none mt-1">Mar del Plata</span>
              </div>
            </Link>

            {/* Barra de Búsqueda Centralizada (Desktop) */}
            <div className="hidden lg:flex flex-grow relative group max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-32 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] text-sm font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-all shadow-sm"
                placeholder="Buscar productos, servicios y más..."
              />
              <div className="absolute inset-y-1.5 right-1.5">
                <button className="h-full px-8 bg-gray-900 text-white text-[10px] font-black rounded-[1.5rem] uppercase tracking-widest hover:bg-black transition-all active:scale-95">Buscar</button>
              </div>
            </div>

            {/* Icons / Menu for Mobile & Desktop */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Search Trigger */}
              <button className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-400" onClick={() => setIsMenuOpen(true)}>
                <Search className="w-6 h-6" />
              </button>
              
              {/* Desktop Banner Beneficios */}
              <div className="hidden xl:flex items-center gap-3 px-5 py-2.5 bg-blue-50 rounded-2xl border border-blue-100">
                <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Envío Gratis</span>
                  <span className="text-[11px] font-black text-blue-800">En tu primer compra</span>
                </div>
              </div>

              {/* Cart Trigger */}
              <Link href="/checkout" className="text-gray-600 relative p-2">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </Link>

              {/* Login / Register Buttons (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <button 
                  onClick={() => openAuth("login")}
                  className="px-4 py-2 text-xs font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                  Ingresar
                </button>
                <button 
                  onClick={() => openAuth("register")}
                  className="px-5 py-2.5 bg-gray-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                  Crear cuenta
                </button>
              </div>

              {/* Menu Toggle */}
              <button 
                className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-900 bg-gray-50 rounded-xl"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* NIVEL INFERIOR: Categorías | Ofertas | Historial |     */}
      {/*                 Cuenta | Compras | Carrito             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:block bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 text-[11px] font-bold uppercase tracking-[0.15em]">
            
            {/* Izquierda: Categorías + Ofertas + Historial */}
            <div className="flex items-center gap-8">
              
              {/* Menú de Categorías Desplegable */}
              <div 
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors py-1">
                  <LayoutGrid className="w-4 h-4" /> Categorías <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
                
                {/* Mega Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-[600px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] text-gray-900 normal-case tracking-normal">
                    <div className="space-y-5">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-3">Comprar Productos</h4>
                      <div className="grid gap-3">
                        {CATEGORIES.filter(c => c.type === 'producto').map(cat => (
                          <Link key={cat.id} href={`/productos`} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2.5 group font-medium">
                            <Package className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" /> {cat.name}
                          </Link>
                        ))}
                        <Link href="/productos" className="text-blue-600 pt-3 font-black text-xs border-t border-gray-50 mt-2 flex items-center gap-1">
                          Ver todo el catálogo <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-3">Contratar Servicios</h4>
                      <div className="grid gap-3">
                        {CATEGORIES.filter(c => c.type === 'servicio').map(cat => (
                          <Link key={cat.id} href={`/servicios`} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2.5 group font-medium">
                            <Wrench className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" /> {cat.name}
                          </Link>
                        ))}
                        <Link href="/servicios" className="text-blue-600 pt-3 font-black text-xs border-t border-gray-50 mt-2 flex items-center gap-1">
                          Explorar servicios <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-white/20" />

              <Link href="/productos" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Ofertas
              </Link>
              <Link href="/productos" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Historial
              </Link>
              <Link href="/pedir-servicio" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Urgencias 24hs
              </Link>
              <Link href="/publicar" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Vender
              </Link>
            </div>

            {/* Derecha: Cuenta | Compras | Carrito */}
            <div className="flex items-center gap-6">
              <Link href="/dashboard/usuario" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <User className="w-4 h-4" /> Mi Cuenta <ChevronDown className="w-3 h-3 opacity-40" />
              </Link>
              <Link href="/dashboard/usuario" className="hover:text-blue-400 transition-colors">
                Mis Compras
              </Link>
              <Link href="/favoritos" className="hover:text-blue-400 transition-colors">
                <Heart className="w-4 h-4" />
              </Link>
              <Link href="/chat" className="hover:text-blue-400 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 w-2 h-2 rounded-full" />
              </Link>
              <Link href="/checkout" className="hover:text-blue-400 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE MENU (Overlay)                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[76px] bg-white z-[200] overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="p-6 space-y-8">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input type="text" placeholder="Buscar..." className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl font-bold text-sm" />
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { openAuth("login"); setIsMenuOpen(false); }}
                className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl uppercase tracking-widest text-xs"
              >
                Ingresar
              </button>
              <button 
                onClick={() => { openAuth("register"); setIsMenuOpen(false); }}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-blue-100"
              >
                Crear cuenta
              </button>
            </div>

            {/* Quick Nav */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Productos", icon: Package, href: "/productos", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Servicios", icon: Wrench, href: "/servicios", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Profesionales", icon: UserCheck, href: "/profesionales", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Vender", icon: Zap, href: "/publicar", color: "text-red-600", bg: "bg-red-50" },
                { label: "Urgencias", icon: Clock, href: "/pedir-servicio", color: "text-red-600", bg: "bg-red-50" },
                { label: "Favoritos", icon: Heart, href: "/favoritos", color: "text-pink-600", bg: "bg-pink-50" },
                { label: "Mensajes", icon: MessageSquare, href: "/chat", color: "text-green-600", bg: "bg-green-50" },
                { label: "Mi Cuenta", icon: User, href: "/dashboard/usuario", color: "text-gray-600", bg: "bg-gray-50" },
              ].map(item => (
                <Link key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className={cn("flex items-center gap-3 p-5 rounded-2xl", item.bg)}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                  <span className={cn("text-xs font-black uppercase tracking-widest", item.color)}>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Categories List */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Categorías</h4>
              {CATEGORIES.map(cat => (
                <Link key={cat.id} href={cat.type === 'producto' ? '/productos' : '/servicios'} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-300 -rotate-90" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authView} 
      />
    </header>
  );
};

export default Header;
