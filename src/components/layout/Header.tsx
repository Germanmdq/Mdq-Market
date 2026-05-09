"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, X, LayoutGrid, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenu from "../marketplace/MegaMenu";
import MobileCategoryMenu from "../marketplace/MobileCategoryMenu";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { trackActivity } from "@/lib/activity";

const contextualLinks = [
  { label: "Entrega MDP", href: "/productos?delivery=true" },
  { label: "Pago protegido", href: "/productos?protectedPayment=true" },
  { label: "Servicios urgentes", href: "/servicios?availableToday=true" },
  { label: "Publicar gratis", href: "/registro?intent=publicar&next=/publicar?intent=vender" },
  { label: "Profesionales destacados", href: "/profesionales" },
];

const quickSearches = [
  { label: "iPhone", href: "/productos?q=iphone" },
  { label: "Gasista", href: "/servicios?q=gasista&availableToday=true" },
  { label: "Silla oficina", href: "/productos?q=silla%20oficina" },
  { label: "Plomero", href: "/servicios?q=plomero&availableToday=true" },
  { label: "Notebook", href: "/productos?q=notebook" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const items = JSON.parse(window.localStorage.getItem("mdp-market-cart") ?? "[]");
        setCartCount(Array.isArray(items) ? items.reduce((acc, item) => acc + (item.quantity ?? 1), 0) : 0);
      } catch {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener("mdp-cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("mdp-cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full bg-[#ffe600] transition-all duration-200",
        scrolled
          ? "shadow-sm"
          : ""
      )}>
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#333333] text-lg font-black text-[#ffe600] shadow-sm">
              M
            </div>
            <div className="hidden sm:block">
              <p className="text-[20px] font-bold tracking-tight text-[#333333] leading-tight">
                MDP Market
              </p>
            </div>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            <MegaMenu />
            <Link href="/productos" className="px-3 py-2.5 text-[14px] font-normal text-[#333333] transition-colors hover:text-[#3483fa]">Comprar</Link>
            <Link href="/servicios?availableToday=true" className="px-3 py-2.5 text-[14px] font-normal text-[#333333] transition-colors hover:text-[#3483fa]">Servicios hoy</Link>
            <Link href="/profesionales" className="px-3 py-2.5 text-[14px] font-normal text-[#333333] transition-colors hover:text-[#3483fa]">Profesionales</Link>
            <Link href="/registro?intent=publicar&next=/publicar?intent=vender" className="px-3 py-2.5 text-[14px] font-normal text-[#333333] transition-colors hover:text-[#3483fa]">Vender</Link>
          </nav>

          {/* Search */}
          <form
            action="/productos"
            method="GET"
            className="ml-auto hidden max-w-xl flex-1 lg:block"
            onSubmit={(event) => {
              const formData = new FormData(event.currentTarget);
              const query = String(formData.get("q") ?? "").trim();
              if (query) {
                trackActivity({
                  event_type: "search",
                  entity_type: "search",
                  search_query: query,
                  metadata: { source: "header_search" },
                });
              }
            }}
          >
            <div className="flex h-10 items-center rounded-sm bg-white px-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#3483fa]">
              <input
                type="text"
                name="q"
                placeholder="Buscar productos, marcas y más…"
                className="flex-1 bg-transparent text-base outline-none text-[#333333] placeholder:text-[#999999]"
              />
              <Search className="h-5 w-5 text-[#999999] ml-2 border-l border-slate-200 pl-2" />
            </div>
            <div className="mt-2 flex gap-2 overflow-hidden">
              {quickSearches.map((item) => (
                <Link key={item.label} href={item.href} className="text-[12px] font-normal text-[#333333] transition hover:text-[#3483fa]">
                  {item.label}
                </Link>
              ))}
            </div>
          </form>

          {/* Right Actions */}
          <div className="ml-auto lg:ml-0 flex items-center gap-1">
            {user && (
              <Link href="/favoritos" className="hidden sm:flex h-10 w-10 items-center justify-center text-[#333333] hover:text-[#3483fa] transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
            )}
            <Link href="/carrito" className="flex h-10 w-10 items-center justify-center text-[#333333] hover:text-[#3483fa] transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3483fa] px-1 text-[9px] font-bold text-white border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {!loading && (
              user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex h-10 w-10 items-center justify-center text-[#333333] hover:text-[#3483fa] transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-sm border border-slate-200 shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-[#333333] truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-[#999999] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/cuenta"
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
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="px-3 py-2 text-[14px] font-normal text-[#333333] hover:text-[#3483fa]">
                    Ingresar
                  </Link>
                  <Link href="/registro" className="px-3 py-2 text-[14px] font-normal text-[#333333] hover:text-[#3483fa]">
                    Crear cuenta
                  </Link>
                </div>
              )
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center text-[#333333] hover:text-[#3483fa] transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="border-t border-black/10">
          <div className="mx-auto flex max-w-[1440px] gap-6 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
            {contextualLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 text-[13px] font-normal text-[#333333] transition hover:text-[#3483fa]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile search & Quick Cats */}
        <div className="lg:hidden px-4 pb-3 space-y-2 border-t border-black/10">
          <form
            action="/productos"
            method="GET"
            className="pt-3"
            onSubmit={(event) => {
              const formData = new FormData(event.currentTarget);
              const query = String(formData.get("q") ?? "").trim();
              if (query) {
                trackActivity({
                  event_type: "search",
                  entity_type: "search",
                  search_query: query,
                  metadata: { source: "mobile_header_search" },
                });
              }
            }}
          >
            <div className="flex h-10 items-center rounded-sm bg-white px-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#3483fa]">
              <input
                type="text"
                name="q"
                placeholder="Buscar productos, marcas..."
                className="flex-1 bg-transparent text-sm outline-none text-[#333333] placeholder:text-[#999999]"
              />
              <Search className="h-4 w-4 text-[#999999] ml-2" />
            </div>
          </form>
          <button
            onClick={() => setMobileCategoriesOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white rounded-sm text-sm font-normal text-[#333333] shadow-sm transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Categorías
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
            {[
              { label: "Comprar", href: "/productos" },
              { label: "Servicios hoy", href: "/servicios?availableToday=true" },
              { label: "Profesionales", href: "/profesionales" },
              { label: "Categorías", href: "/categorias" },
              { label: "Ofertas", href: "/productos?ofertas=true" },
              { label: "Publicar gratis", href: "/registro?intent=publicar&next=/publicar?intent=vender" },
              ...(user ? [{ label: "Mi cuenta", href: "/cuenta" }, { label: "Favoritos", href: "/favoritos" }, { label: "Carrito", href: "/carrito" }] : [{ label: "Ingresar", href: "/login" }, { label: "Crear cuenta", href: "/registro" }]),
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
            ) : null}
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
