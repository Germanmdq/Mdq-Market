import React, { Suspense } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";
import { getPublishedServices } from "@/lib/services";
import { MOCK_PROFESSIONALS } from "@/data/mockData";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "published");

  // Apply category filter using ID lookup
  if (typeof params.category === "string") {
    // Look up category by slug to get ID
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();

    if (categoryData) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  // Apply subcategory filter using ID lookup
  if (typeof params.subcategory === "string") {
    // Look up subcategory by slug to get ID
    const { data: subcategoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.subcategory)
      .single();

    if (subcategoryData) {
      query = query.eq("subcategory_id", subcategoryData.id);
    }
  }

  if (typeof params.zone === "string") {
    query = query.eq("zone", params.zone);
  }

  if (typeof params.sellerType === "string") {
    query = query.eq("seller_type", params.sellerType);
  }

  if (typeof params.condition === "string") {
    query = query.eq("condition", params.condition);
  }

  if (params.ofertas === "true") {
    query = query.or("featured_deal.eq.true,discount.gt.0");
  }

  if (params.featured === "true") {
    query = query.eq("featured", true);
  }

  if (typeof params.minPrice === "string") {
    query = query.gte("price", Number(params.minPrice));
  }

  if (typeof params.maxPrice === "string") {
    query = query.lte("price", Number(params.maxPrice));
  }

  if (params.protectedPayment === "true") {
    query = query.eq("protected_payment", true);
  }

  if (params.delivery === "true") {
    query = query.eq("mdp_delivery_available", true);
  }

  if (params.verified === "true") {
    query = query.eq("seller_verified", true);
  }

  if (typeof params.q === "string" && params.q.trim()) {
    query = query.ilike("title", `%${params.q.trim()}%`);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching products:", error);
  }

  const products = (data ?? []) as Product[];

  // Fetch additional content for sections below
  const dealsQuery = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .or("featured_deal.eq.true,discount.gt.0")
    .order("created_at", { ascending: false })
    .limit(8);

  const featuredQuery = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const [dealsResult, featuredResult] = await Promise.all([
    dealsQuery,
    featuredQuery,
  ]);

  const deals = (dealsResult.data ?? []) as Product[];
  const featured = (featuredResult.data ?? []) as Product[];
  const services = await getPublishedServices();
  const professionals = MOCK_PROFESSIONALS.slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Productos en Mar del Plata
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              {products.length} productos encontrados
            </p>
          </div>

          <form action="/productos" method="GET" className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              name="q"
              defaultValue={typeof params.q === "string" ? params.q : ""}
              placeholder="Buscar productos..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-900"
            />
            {/* Preserve existing filters */}
            {typeof params.category === "string" && <input type="hidden" name="category" value={params.category} />}
            {typeof params.zone === "string" && <input type="hidden" name="zone" value={params.zone} />}
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
                <ProductFilters />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 mb-2">No encontramos resultados</h3>
                <p className="text-sm text-slate-600 mb-6">Probá quitando algunos filtros o cambiando tu búsqueda.</p>
                <a
                  href="/productos"
                  className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Limpiar todos los filtros
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="bg-white border-t border-slate-200">
        {/* Ofertas del día */}
        {deals.length > 0 && (
          <MarketSection
            eyebrow="Exclusivo"
            title="Ofertas del día"
            description="Productos locales con precio especial por tiempo limitado"
            href="/productos?ofertas=true"
            linkLabel="Ver todas"
          >
            <MarketCarousel>
              {deals.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Productos destacados */}
        {featured.length > 0 && (
          <MarketSection
            eyebrow="Tendencias"
            title="Productos destacados"
            href="/productos?featured=true"
            className="border-t border-slate-200"
          >
            <MarketCarousel>
              {featured.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Servicios */}
        {services.length > 0 && (
          <MarketSection
            eyebrow="Soluciones locales"
            title="Servicios disponibles"
            description="Profesionales listos para asistirte"
            href="/servicios"
            linkLabel="Ver todos"
            className="border-t border-slate-200 bg-slate-50"
          >
            <MarketCarousel>
              {services.slice(0, 8).map(s => (
                <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
                  <ServiceCard service={s} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Profesionales */}
        {professionals.length > 0 && (
          <MarketSection
            eyebrow="Confianza"
            title="Profesionales verificados"
            description="Con identidad validada por MDP Market"
            href="/profesionales"
            linkLabel="Ver listado"
            className="border-t border-slate-200 bg-white"
          >
            <MarketCarousel>
              {professionals.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
                  <ProfessionalCard professional={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}
      </div>
    </main>
  );
}
