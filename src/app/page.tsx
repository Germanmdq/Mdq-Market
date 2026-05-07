"use client";

import React from "react";
import Link from "next/link";
import {
  Laptop, Smartphone, Home as HomeIcon, Shirt, Bike,
  LayoutGrid, Tv, Sofa, Hammer, Baby, Store, Wrench
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";
import { cn } from "@/lib/utils";

/* ── Category Chips ── */
const CATEGORIES = [
  { name: "Tecnología", icon: Laptop, href: "/productos?category=tecnologia" },
  { name: "Celulares", icon: Smartphone, href: "/productos?category=celulares" },
  { name: "Hogar", icon: Sofa, href: "/productos?category=hogar" },
  { name: "Electro", icon: Tv, href: "/productos?category=electro" },
  { name: "Herramientas", icon: Hammer, href: "/productos?category=herramientas" },
  { name: "Moda", icon: Shirt, href: "/productos?category=moda" },
  { name: "Bebés", icon: Baby, href: "/productos?category=bebes" },
  { name: "Servicios", icon: Wrench, href: "/servicios" },
  { name: "Profesionales", icon: Store, href: "/profesionales" },
];

export default function HomePage() {
  const dailyDeals = MOCK_PRODUCTS.filter(p => p.oldPrice || p.discount);
  const dealsToShow = Array.from(
    new Map([...dailyDeals, ...MOCK_PRODUCTS.filter(p => p.featured)].map(item => [item.id, item])).values()
  ).slice(0, 12);

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* ═══ CATEGORIES BAR ═══ */}
      <section className="border-b border-slate-200 bg-white sticky top-[68px] sm:top-[76px] z-40 shadow-[0_6px_20px_rgba(15,23,42,0.045)]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((c, i) => (
              <Link key={i} href={c.href} className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                <c.icon className="h-4 w-4 text-slate-500" />
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HERO INTEGRADO ═══ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-slate-950 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)] pointer-events-none" />
            <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
              <div>
                <p className="text-sm font-medium text-blue-200">
                  MDP Market & Services
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                  Comprá, vendé y contratá en Mar del Plata
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                  Productos locales, servicios verificados, entrega coordinada y operaciones protegidas en una sola plataforma.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/productos"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Ver productos
                  </Link>
                  <Link
                    href="/servicios"
                    className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    Buscar servicios
                  </Link>
                  <Link
                    href="/vender"
                    className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    Publicar gratis
                  </Link>
                </div>
              </div>
              <div className="grid content-end gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 text-xs">🛡</span>
                    Pago protegido
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    El dinero queda resguardado hasta que la operación se confirma.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs">🚚</span>
                    Entrega MDP
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Coordinación local para productos dentro de Mar del Plata.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-xs">✓</span>
                    Servicios verificados
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Profesionales con reputación, reserva protegida y seguimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OFERTAS DEL DÍA ═══ */}
      <MarketSection eyebrow="Exclusivo" title="Ofertas del día" description="Productos locales con precio especial por tiempo limitado." href="/productos?ofertas=true" linkLabel="Ver todas" className="border-t border-slate-200">
        <MarketCarousel>
          {dealsToShow.map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ DESTACADOS ═══ */}
      <MarketSection eyebrow="Tendencias" title="Productos destacados" href="/productos" className="border-t border-slate-200">
        <MarketCarousel>
          {MOCK_PRODUCTS.filter(p => p.featured).slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ SERVICIOS ═══ */}
      <MarketSection eyebrow="Soluciones locales" title="Servicios disponibles hoy" description="Profesionales listos para asistirte." href="/servicios" linkLabel="Ver todos" className="border-t border-slate-200 bg-white">
        <MarketCarousel>
          {MOCK_SERVICES.slice(0, 12).map(s => (
            <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
              <ServiceCard service={s} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ PROFESIONALES ═══ */}
      <MarketSection eyebrow="Confianza" title="Profesionales verificados" description="Con identidad validada por MDP Market." href="/profesionales" linkLabel="Ver listado" className="border-t border-slate-200 bg-white">
        <MarketCarousel>
          {MOCK_PROFESSIONALS.filter(p => p.verified).slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
              <ProfessionalCard professional={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ CATÁLOGO ═══ */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Explorar el catálogo</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {MOCK_PRODUCTS.slice(12, 22).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/productos" className="rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_6px_20px_rgba(15,23,42,0.045)] transition hover:bg-slate-50 hover:shadow-md">
              Cargar más productos
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
