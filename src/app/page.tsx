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

import { DataShuffler } from "@/lib/dataUtils";

export default function HomePage() {
  const shuffler = new DataShuffler();

  const dailyDeals = shuffler.getDailyDeals(MOCK_PRODUCTS, 10);
  const featuredProducts = shuffler.getFeaturedProducts(MOCK_PRODUCTS, 10);
  const lastViewed = shuffler.getLastViewedProducts(MOCK_PRODUCTS, 10);
  const techProducts = shuffler.getProductsByCategory(MOCK_PRODUCTS, "Tecnología y celulares", 10);
  const entrepreneurs = shuffler.getProductsBySellerType(MOCK_PRODUCTS, "Emprendedor", 10);
  const localStores = shuffler.getProductsBySellerType(MOCK_PRODUCTS, "Comercio", 10);
  
  const servicesToday = shuffler.getServicesAvailableToday(MOCK_SERVICES, 12);
  const verifiedPros = shuffler.getVerifiedProfessionals(MOCK_PROFESSIONALS, 12);
  
  const catalogProducts = shuffler.getRemainingProducts(MOCK_PRODUCTS, 10);

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
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,#2563eb_0%,#0f172a_42%,#020617_100%)] shadow-[0_26px_80px_rgba(15,23,42,0.20)]">
            <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
              
              <div>
                <p className="text-sm font-medium text-blue-200">
                  MDP Market & Services
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Comprá, vendé y contratá en Mar del Plata
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                  Productos locales, servicios verificados, entrega coordinada y operaciones protegidas en una sola plataforma.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/productos"
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100"
                  >
                    Ver productos
                  </Link>

                  <Link
                    href="/servicios"
                    className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/[0.10]"
                  >
                    Buscar servicios
                  </Link>

                  <Link
                    href="/vender"
                    className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/[0.10]"
                  >
                    Publicar gratis
                  </Link>
                </div>
              </div>

              <div className="grid content-center gap-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                      🛡️
                    </span>
                    <p className="text-sm font-semibold text-white">
                      Pago protegido
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    El dinero queda resguardado hasta que la operación se confirma.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                      🚚
                    </span>
                    <p className="text-sm font-semibold text-white">
                      Entrega MDP
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Coordinación local para productos dentro de Mar del Plata.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                      ✅
                    </span>
                    <p className="text-sm font-semibold text-white">
                      Servicios verificados
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Profesionales con reputación, reserva protegida y seguimiento.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ OFERTAS DEL DÍA ═══ */}
      {dailyDeals.length > 0 && (
        <MarketSection eyebrow="Exclusivo" title="Ofertas del día" description="Productos locales con precio especial por tiempo limitado." href="/productos?ofertas=true" linkLabel="Ver todas" className="border-t border-slate-200">
          <MarketCarousel>
            {dailyDeals.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ DESTACADOS ═══ */}
      {featuredProducts.length > 0 && (
        <MarketSection eyebrow="Tendencias" title="Productos destacados" href="/productos" className="border-t border-slate-200">
          <MarketCarousel>
            {featuredProducts.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ VISTOS RECIENTEMENTE ═══ */}
      {lastViewed.length > 0 && (
        <MarketSection eyebrow="Para vos" title="Última visita" href="/productos" className="border-t border-slate-200">
          <MarketCarousel>
            {lastViewed.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ SERVICIOS ═══ */}
      {servicesToday.length > 0 && (
        <MarketSection eyebrow="Soluciones locales" title="Servicios disponibles hoy" description="Profesionales listos para asistirte." href="/servicios" linkLabel="Ver todos" className="border-t border-slate-200 bg-white">
          <MarketCarousel>
            {servicesToday.map(s => (
              <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
                <ServiceCard service={s} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ TECNOLOGÍA ═══ */}
      {techProducts.length > 0 && (
        <MarketSection eyebrow="Novedades" title="Tecnología y Celulares" href="/productos?category=tecnologia" className="border-t border-slate-200 bg-white">
          <MarketCarousel>
            {techProducts.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ PROFESIONALES ═══ */}
      {verifiedPros.length > 0 && (
        <MarketSection eyebrow="Confianza" title="Profesionales verificados" description="Con identidad validada por MDP Market." href="/profesionales" linkLabel="Ver listado" className="border-t border-slate-200 bg-white">
          <MarketCarousel>
            {verifiedPros.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
                <ProfessionalCard professional={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}
      
      {/* ═══ COMERCIOS LOCALES ═══ */}
      {localStores.length > 0 && (
        <MarketSection eyebrow="De la zona" title="Comercios locales" href="/productos" className="border-t border-slate-200 bg-white">
          <MarketCarousel>
            {localStores.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ EMPRENDEDORES ═══ */}
      {entrepreneurs.length > 0 && (
        <MarketSection eyebrow="Artesanal" title="Emprendedores marplatenses" href="/productos" className="border-t border-slate-200 bg-white">
          <MarketCarousel>
            {entrepreneurs.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ CATÁLOGO ═══ */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Explorar el catálogo</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {catalogProducts.map(p => (
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
