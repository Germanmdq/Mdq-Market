import React from "react";
import { Search, Filter, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/marketplace/ProductGrid";

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

  // Apply filters from searchParams
  if (typeof params.category === "string") {
    query = query.eq("category", params.category);
  }

  if (typeof params.subcategory === "string") {
    query = query.eq("subcategory", params.subcategory);
  }

  if (typeof params.zone === "string") {
    query = query.eq("zone", params.zone);
  }

  if (typeof params.sellerType === "string") {
    query = query.eq("seller_type", params.sellerType);
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

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Search */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Productos en Mar del Plata
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Catálogo real cargado desde Supabase.
            </p>
          </div>

          <form action="/productos" method="GET" className="w-full relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              name="q"
              defaultValue={typeof params.q === "string" ? params.q : ""}
              placeholder="Buscar productos..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all outline-none font-semibold text-slate-900"
            />
            {/* Hidden fields for existing filters to preserve them on search */}
            {typeof params.category === "string" && <input type="hidden" name="category" value={params.category} />}
            {typeof params.zone === "string" && <input type="hidden" name="zone" value={params.zone} />}
          </form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {products.length} productos encontrados
          </div>
          <div className="flex items-center gap-4">
             {/* Add simplified filter chips here if needed */}
          </div>
        </div>

        <ProductGrid products={products} />

        {products.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[32px] border border-slate-200 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-xl font-semibold text-slate-950 mb-2">No encontramos resultados</h3>
             <p className="text-slate-500">Probá quitando algunos filtros o cambiando tu búsqueda.</p>
             <a href="/productos" className="mt-8 inline-block text-blue-600 font-semibold hover:underline">
               Limpiar todos los filtros
             </a>
          </div>
        )}
      </div>
    </main>
  );
}
