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
      <section className="border-b border-slate-200 bg-white sticky top-[68px] sm:top-[76px] z-40">
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

      {/* ═══ HERO BENTO ═══ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            {/* Main Block */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-sm sm:p-10 relative">
              <div className="relative z-10">
                <p className="text-sm font-medium text-blue-300">MDP Market & Services</p>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl leading-[1.1]">
                  Comprá, vendé y contratá en Mar del Plata
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                  Productos locales, servicios verificados y operaciones protegidas en una sola plataforma.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/productos" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                    Ver productos
                  </Link>
                  <Link href="/servicios" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    Buscar servicios
                  </Link>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
                <div className="w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
              </div>
            </div>

            {/* Side Blocks */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center transition hover:shadow-md">
                <p className="text-sm font-semibold text-slate-950 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">🛡</span>
                  Pago protegido
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  La operación queda resguardada hasta que confirmes la entrega o el servicio.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center transition hover:shadow-md">
                <p className="text-sm font-semibold text-slate-950 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">🚚</span>
                  Entrega MDP
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Logística local coordinada dentro de la ciudad, rápida y segura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OFERTAS DEL DÍA ═══ */}
      <MarketSection eyebrow="Exclusivo" title="Ofertas del día" description="Productos locales con precio especial por tiempo limitado." href="/productos?ofertas=true" linkLabel="Ver todas" className="border-t border-slate-200">
        <MarketCarousel>
          {dealsToShow.map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-2">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ DESTACADOS ═══ */}
      <MarketSection eyebrow="Tendencias" title="Productos destacados" href="/productos" className="border-t border-slate-200">
        <MarketCarousel>
          {MOCK_PRODUCTS.filter(p => p.featured).slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-2">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ SERVICIOS ═══ */}
      <MarketSection eyebrow="Soluciones locales" title="Servicios disponibles hoy" description="Profesionales listos para asistirte." href="/servicios" linkLabel="Ver todos" className="border-t border-slate-200">
        <MarketCarousel>
          {MOCK_SERVICES.slice(0, 12).map(s => (
            <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-2">
              <ServiceCard service={s} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ PROFESIONALES ═══ */}
      <MarketSection eyebrow="Confianza" title="Profesionales verificados" description="Con identidad validada por MDP Market." href="/profesionales" linkLabel="Ver listado" className="border-t border-slate-200">
        <MarketCarousel>
          {MOCK_PROFESSIONALS.filter(p => p.verified).slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-2">
              <ProfessionalCard professional={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ CATÁLOGO ═══ */}
      <section className="bg-slate-50 py-16">
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
            <Link href="/productos" className="rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
              Cargar más productos
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
