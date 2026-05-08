import React from "react";
import Link from "next/link";
import {
  Laptop, Smartphone, Shirt,
  Tv, Sofa, Hammer, Baby, Store, Wrench, Search, ShieldCheck, Truck, BadgePercent
} from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";
import SmartSearchAssistant from "@/components/ai/SmartSearchAssistant";
import RecentlyViewedSection from "@/components/personalization/RecentlyViewedSection";
import ForYouSection from "@/components/personalization/ForYouSection";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import type { Service } from "@/types";

/* ── Category Chips ── */
const CATEGORIES = [
  { name: "Tecnología", icon: Laptop, href: "/productos?category=tecnologia-y-celulares" },
  { name: "Celulares", icon: Smartphone, href: "/productos?subcategory=celulares" },
  { name: "Hogar", icon: Sofa, href: "/productos?category=hogar-y-muebles" },
  { name: "Electro", icon: Tv, href: "/productos?category=electrodomesticos" },
  { name: "Herramientas", icon: Hammer, href: "/productos?category=herramientas-y-construccion" },
  { name: "Moda", icon: Shirt, href: "/productos?category=indumentaria-y-accesorios" },
  { name: "Bebés", icon: Baby, href: "/productos?category=bebes-ninos-y-juguetes" },
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
      <section className="border-b border-slate-200 bg-white md:sticky md:top-[76px] md:z-40 md:shadow-[0_6px_20px_rgba(15,23,42,0.045)]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-3 no-scrollbar sm:gap-4">
            {CATEGORIES.map((c, i) => (
              <Link key={i} href={c.href} className="flex min-w-[92px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-white sm:min-w-0 sm:flex-row sm:rounded-full sm:px-4 sm:py-1.5 sm:text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm sm:h-auto sm:w-auto sm:bg-transparent sm:shadow-none">
                  <c.icon className="h-4 w-4" />
                </span>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HERO INTEGRADO ═══ */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-slate-950 shadow-[0_26px_80px_rgba(15,23,42,0.20)]">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/72 to-slate-950/28" />
            <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
              
              <div>
                <p className="text-sm font-semibold text-blue-100">
                  Marketplace local de Mar del Plata
                </p>

                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Encontrá productos, servicios y profesionales cerca tuyo
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                  Comprá con operación protegida, coordiná Entrega MDP o reservá un servicio sin salir de la plataforma.
                </p>

                <form action="/buscar" className="mt-6 flex rounded-2xl bg-white p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.22)]">
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />
                    <input
                      name="q"
                      placeholder="Buscar notebook, gasista, sillón..."
                      className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">
                    Buscar
                  </button>
                </form>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  <Link
                    href="/productos"
                    className="rounded-2xl bg-white px-3 py-3 text-center text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100 sm:rounded-full sm:px-5 sm:text-sm"
                  >
                    Productos
                  </Link>

                  <Link
                    href="/servicios"
                    className="rounded-2xl bg-white/[0.10] px-3 py-3 text-center text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition hover:bg-white/[0.14] sm:rounded-full sm:px-5 sm:text-sm"
                  >
                    Servicios
                  </Link>

                  <Link
                    href="/vender"
                    className="rounded-2xl bg-white/[0.10] px-3 py-3 text-center text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition hover:bg-white/[0.14] sm:rounded-full sm:px-5 sm:text-sm"
                  >
                    Publicar
                  </Link>
                </div>
              </div>

              <div className="grid content-end gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[24px] bg-white/[0.10] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Pago protegido</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
                        El dinero se libera cuando confirmás.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-white/[0.10] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                      <Truck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Entrega MDP</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
                        Coordinación local sin envíos externos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-white/[0.10] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                      <BadgePercent className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Ofertas cerca</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
                        Productos locales con precio especial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="-mt-2 pb-8">
        <SmartSearchAssistant />
      </div>

      <RecentlyViewedSection />
      <ForYouSection />

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
        <MarketSection eyebrow="Novedades" title="Tecnología y Celulares" href="/productos?category=tecnologia-y-celulares" className="border-t border-slate-200 bg-white">
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
        <MarketSection eyebrow="Confianza" title="Profesionales destacados" description="Perfiles con reputación y disponibilidad en Mar del Plata." href="/profesionales" linkLabel="Ver listado" className="border-t border-slate-200 bg-white">
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
