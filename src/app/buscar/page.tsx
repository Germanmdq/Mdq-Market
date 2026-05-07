import React from "react";
import Link from "next/link";
import { Search, Package, Wrench, User, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import SearchActivityTracker from "@/components/activity/SearchActivityTracker";
import type { Product } from "@/types/product";
import type { Service } from "@/types";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  if (!query) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-950 mb-2">Buscá en MDP Market</h1>
            <p className="text-slate-600">Productos, servicios y profesionales de Mar del Plata</p>
          </div>
        </div>
      </main>
    );
  }

  // Search in parallel across all tables
  const [productsResult, servicesResult, professionalsResult] = await Promise.all([
    // Search products
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,zone.ilike.%${query}%`)
      .limit(12),

    // Search services
    supabase
      .from("services")
      .select("*")
      .eq("status", "published")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(8),

    // Search professionals
    supabase
      .from("professionals")
      .select("*")
      .or(`name.ilike.%${query}%,profession.ilike.%${query}%,category.ilike.%${query}%,zone.ilike.%${query}%`)
      .limit(8),
  ]);

  const products = (productsResult.data ?? []) as Product[];
  const services = (servicesResult.data ?? []) as Service[];
  const professionals = professionalsResult.data ?? [];

  const totalResults = products.length + services.length + professionals.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <SearchActivityTracker query={query} source="global_search_page" />
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-slate-950 mb-4">
            Resultados para &ldquo;{query}&rdquo;
          </h1>
          <p className="text-sm text-slate-600">
            {totalResults === 0
              ? "No encontramos resultados"
              : `${totalResults} ${totalResults === 1 ? "resultado" : "resultados"} encontrados`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        {totalResults === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950 mb-2">No encontramos resultados</h3>
            <p className="text-sm text-slate-600 mb-6">Probá con otros términos de búsqueda</p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/productos"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Ver productos
              </Link>
              <Link
                href="/servicios"
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Ver servicios
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Products */}
            {products.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Productos</h2>
                      <p className="text-sm text-slate-600">{products.length} encontrados</p>
                    </div>
                  </div>
                  <Link
                    href={`/productos?q=${encodeURIComponent(query)}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Servicios</h2>
                      <p className="text-sm text-slate-600">{services.length} encontrados</p>
                    </div>
                  </div>
                  <Link
                    href={`/servicios?q=${encodeURIComponent(query)}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </section>
            )}

            {/* Professionals */}
            {professionals.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Profesionales</h2>
                      <p className="text-sm text-slate-600">{professionals.length} encontrados</p>
                    </div>
                  </div>
                  <Link
                    href={`/profesionales?q=${encodeURIComponent(query)}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {professionals.map((professional) => (
                    <ProfessionalCard key={professional.id} professional={professional} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
