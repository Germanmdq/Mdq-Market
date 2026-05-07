import React from "react";
import Link from "next/link";
import {
  Laptop, Smartphone, Shirt, Bike,
  Tv, Sofa, Hammer, Baby, Store, Wrench
} from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import type { Service } from "@/types";

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

export default async function HomePage() {
  // Optimized parallel queries with limits
  const [dealsResult, featuredResult, localStoresResult, entrepreneursResult, techResult, catalogResult, servicesResult, professionalsResult] = await Promise.all([
    // Deals (limit 10)
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .or("featured_deal.eq.true,discount.gt.0")
      .order("created_at", { ascending: false })
      .limit(10),

    // Featured (limit 10)
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(10),

    // Local stores (limit 10)
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("seller_type", "commerce")
      .order("created_at", { ascending: false })
      .limit(10),

    // Entrepreneurs (limit 10)
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("seller_type", "entrepreneur")
      .order("created_at", { ascending: false })
      .limit(10),

    // Tech products (limit 10)
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("category", "Tecnología y celulares")
      .order("created_at", { ascending: false })
      .limit(10),

    // Catalog products (limit 10)
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(0, 9),

    // Services available today (limit 6)
    supabase
      .from("services")
      .select("*")
      .eq("status", "published")
      .eq("availability", "Hoy")
      .order("created_at", { ascending: false })
      .limit(6),

    // Verified professionals (limit 6)
    supabase
      .from("professionals")
      .select("*")
      .eq("verified", true)
      .order("rating", { ascending: false })
      .limit(6),
  ]);

  const deals = (dealsResult.data ?? []) as Product[];
  const featured = (featuredResult.data ?? []) as Product[];
  const localStores = (localStoresResult.data ?? []) as Product[];
  const entrepreneurs = (entrepreneursResult.data ?? []) as Product[];
  const techProducts = (techResult.data ?? []) as Product[];
  const catalogProducts = (catalogResult.data ?? []) as Product[];
  const servicesToday = (servicesResult.data ?? []) as Service[];
  const verifiedPros = professionalsResult.data ?? [];

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
                    className="rounded-full bg-white/[0.07] px-5 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition hover:bg-white/[0.12]"
                  >
                    Buscar servicios
                  </Link>

                  <Link
                    href="/vender"
                    className="rounded-full bg-white/[0.07] px-5 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition hover:bg-white/[0.12]"
                  >
                    Publicar gratis
                  </Link>
                </div>
              </div>

              <div className="grid content-center gap-4">
                <div className="rounded-[24px] bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-100">
                      🛡️
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Pago protegido</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        El dinero queda resguardado hasta que la operación se confirma.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-100">
                      🚚
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Entrega MDP</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Coordinación local para productos dentro de Mar del Plata.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-100">
                      ✅
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Servicios verificados</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Profesionales con reputación, reserva protegida y seguimiento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ OFERTAS DEL DÍA ═══ */}
      {deals.length > 0 && (
        <MarketSection eyebrow="Exclusivo" title="Ofertas del día" description="Productos locales con precio especial por tiempo limitado." href="/productos?ofertas=true" linkLabel="Ver todas" className="border-t border-slate-200">
          <MarketCarousel>
            {deals.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ DESTACADOS ═══ */}
      {featured.length > 0 && (
        <MarketSection eyebrow="Tendencias" title="Productos destacados" href="/productos?featured=true" className="border-t border-slate-200">
          <MarketCarousel>
            {featured.map(p => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {/* ═══ SERVICIOS DISPONIBLES HOY ═══ */}
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
        <MarketSection eyebrow="De la zona" title="Comercios locales" href="/productos?sellerType=commerce" className="border-t border-slate-200 bg-white">
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
        <MarketSection eyebrow="Artesanal" title="Emprendedores marplatenses" href="/productos?sellerType=entrepreneur" className="border-t border-slate-200 bg-white">
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
