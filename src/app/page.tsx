"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, PlusCircle, Tag, Clock, UserCheck,
  Truck, Store, Laptop, Smartphone, Home as HomeIcon,
  Shirt, Bike, LayoutGrid
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";
import { cn } from "@/lib/utils";

/* ── Quick Actions ── */
const QUICK_ACTIONS = [
  { label: "Publicar", icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-50", href: "/publicar" },
  { label: "Ofertas", icon: Tag, color: "text-red-600", bg: "bg-red-50", href: "/productos?discount=true" },
  { label: "Servicios hoy", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50", href: "/servicios" },
  { label: "Profesionales", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50", href: "/profesionales" },
  { label: "Entrega MDP", icon: Truck, color: "text-orange-600", bg: "bg-orange-50", href: "/productos?mdpDelivery=true" },
  { label: "Comercios", icon: Store, color: "text-purple-600", bg: "bg-purple-50", href: "/productos?sellerType=comercio" },
];

/* ── Category Chips ── */
const CATEGORY_CHIPS = [
  { name: "Tecnología", icon: Laptop },
  { name: "Celulares", icon: Smartphone },
  { name: "Hogar", icon: HomeIcon },
  { name: "Moda", icon: Shirt },
  { name: "Deportes", icon: Bike },
  { name: "Ver todo", icon: LayoutGrid },
];

/* ── Countdown ── */
function Countdown() {
  const [t, setT] = useState({ h: 14, m: 23, s: 5 });
  useEffect(() => {
    const id = setInterval(() => {
      setT(p => {
        let { h, m, s } = p;
        if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = 23; } }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white">
      <Clock className="w-3.5 h-3.5" /> {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
    </span>
  );
}

export default function HomePage() {
  const [hero, setHero] = useState(0);

  const heroes = [
    { img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200", title: "Tecnología local con garantía", sub: "Hasta 40% OFF con entrega hoy en Mar del Plata.", cta: "Ver ofertas", href: "/productos" },
    { img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200", title: "Moda que recorre la ciudad", sub: "Diseño exclusivo de emprendedores marplatenses.", cta: "Explorar", href: "/productos" },
    { img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1200", title: "Expertos a tu servicio", sub: "Profesionales verificados listos para asistirte.", cta: "Pedir servicio", href: "/servicios" },
  ];

  useEffect(() => {
    const id = setInterval(() => setHero(p => (p + 1) % heroes.length), 6000);
    return () => clearInterval(id);
  }, [heroes.length]);

  const dailyDeals = MOCK_PRODUCTS.filter(p => p.oldPrice || p.discount).slice(0, 12);
  const deals = dailyDeals.length >= 8 ? dailyDeals : [...dailyDeals, ...MOCK_PRODUCTS.filter(p => p.featured)].slice(0, 12);

  return (
    <main className="min-h-screen bg-[#f8fafc]">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full h-[280px] sm:h-[400px] md:h-[460px] overflow-hidden bg-slate-900">
        {heroes.map((h, i) => (
          <div key={i} className={cn("absolute inset-0 transition-all duration-1000", i === hero ? "opacity-100" : "opacity-0")}>
            <img src={h.img} alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg text-white">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">{h.title}</h1>
                  <p className="text-sm md:text-base font-medium text-slate-300 mb-6 max-w-md">{h.sub}</p>
                  <Link href={h.href} className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition active:scale-95 shadow-lg">
                    {h.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroes.map((_, i) => (
            <button key={i} onClick={() => setHero(i)} className={cn("h-1 rounded-full transition-all", i === hero ? "w-8 bg-white" : "w-3 bg-white/30")} />
          ))}
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <div className="relative -mt-5 z-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
            {CATEGORY_CHIPS.map((c, i) => (
              <button key={i} className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200/70 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                <c.icon className="w-4 h-4" />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {QUICK_ACTIONS.map((a, i) => (
            <Link key={i} href={a.href} className="flex shrink-0 items-center gap-2.5 rounded-full border border-slate-200/70 bg-white px-4 py-2.5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 active:scale-95">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", a.bg, a.color)}>
                <a.icon className="w-4 h-4" />
              </span>
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ OFERTAS ═══ */}
      <MarketSection eyebrow="Exclusivo" title="Ofertas del día" description="Productos locales con precio especial por tiempo limitado." href="/productos?ofertas=true" linkLabel="Ver todas">
        <div className="mb-4"><Countdown /></div>
        <MarketCarousel>
          {deals.map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ ÚLTIMA VISITA ═══ */}
      <MarketSection eyebrow="Personalizado" title="Basado en tu última visita" href="/productos" linkLabel="Ver más">
        <MarketCarousel>
          {MOCK_PRODUCTS.slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ SERVICIOS ═══ */}
      <MarketSection eyebrow="Soluciones locales" title="Servicios disponibles hoy" description="Profesionales listos para asistirte en Mar del Plata." href="/servicios" linkLabel="Explorar">
        <MarketCarousel>
          {MOCK_SERVICES.slice(0, 12).map(s => (
            <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%]">
              <ServiceCard service={s} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ PROFESIONALES ═══ */}
      <MarketSection eyebrow="Confianza" title="Profesionales verificados" description="Con identidad validada por MDP Market." href="/profesionales" linkLabel="Ver listado">
        <MarketCarousel>
          {MOCK_PROFESSIONALS.filter(p => p.verified).slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%]">
              <ProfessionalCard professional={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ DESTACADOS ═══ */}
      <MarketSection eyebrow="Tendencias" title="Productos destacados" href="/productos">
        <MarketCarousel>
          {MOCK_PRODUCTS.filter(p => p.featured).slice(0, 12).map(p => (
            <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]">
              <ProductCard product={p} />
            </div>
          ))}
        </MarketCarousel>
      </MarketSection>

      {/* ═══ CATÁLOGO ═══ */}
      <section className="py-12">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 mb-1">Explorá más</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Catálogo local</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5 gap-6">
            {MOCK_PRODUCTS.slice(12, 22).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/productos" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-600/20">
              Ver catálogo completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
