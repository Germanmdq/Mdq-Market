"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, X, LayoutGrid, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenu from "../marketplace/MegaMenu";
import MobileCategoryMenu from "../marketplace/MobileCategoryMenu";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-white border-b border-slate-200"
      )}>
        <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-8 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              M
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-slate-950 leading-tight">
                MDP Market
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 leading-tight">
                Mar del Plata
              </p>
            </div>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            <MegaMenu />
            <Link href="/productos" className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">Productos</Link>
            <Link href="/servicios" className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">Servicios</Link>
            <Link href="/profesionales" className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">Profesionales</Link>
          </nav>

          {/* Search */}
          <form action="/buscar" method="GET" className="ml-auto hidden flex-1 max-w-lg lg:block">
            <div className="flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="Buscar productos, servicios..."
                className="ml-2.5 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                required
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="ml-auto lg:ml-0 flex items-center gap-1">
            {user && (
              <Link href="/favoritos" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
            )}
            <Link href="/carrito" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white border-2 border-white">
                3
              </span>
            </Link>

            {!loading && (
              user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-950 truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/mi-cuenta"
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mi cuenta
                      </Link>
                      <Link
                        href="/mis-publicaciones"
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis publicaciones
                      </Link>
                      <Link
                        href="/favoritos"
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Favoritos
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                >
                  Ingresar
                </button>
              )
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search & Quick Cats */}
        <div className="lg:hidden px-4 pb-3 space-y-2 border-t border-slate-100">
          <form action="/buscar" method="GET" className="pt-3">
            <div className="flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="¿Qué estás buscando?"
                className="ml-2.5 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                required
              />
            </div>
          </form>
          <button
            onClick={() => setMobileCategoriesOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-white transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Categorías
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
              ...(user ? [{ label: "Mi cuenta", href: "/mi-cuenta" }] : []),
            ].map(l => (
              <Link key={l.label} href={l.href} className="block px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-2xl hover:bg-blue-700 transition-colors"
              >
                Ingresar
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile Category Drawer Overlay */}
      {mobileCategoriesOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden animate-in slide-in-from-right duration-300">
          <MobileCategoryMenu onClose={() => setMobileCategoriesOpen(false)} />
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Header;
