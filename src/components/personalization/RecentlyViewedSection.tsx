"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";
import { getFeaturedProducts, getProductById } from "@/lib/products";
import { getRecentSearches, getRecentViews, type ActivityRecord } from "@/lib/activity";
import ProductCard from "@/components/marketplace/ProductCard";
import type { Product } from "@/types/product";

export default function RecentlyViewedSection() {
  const [views, setViews] = useState<ActivityRecord[]>([]);
  const [searches, setSearches] = useState<ActivityRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fallbackProducts, setFallbackProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const recentViews = getRecentViews(12);
      const recentSearches = getRecentSearches(5);
      const productIds = recentViews
        .filter((item) => item.entity_type === "product" && item.entity_id)
        .map((item) => item.entity_id as string)
        .slice(0, 6);

      const recentProducts = await Promise.all(productIds.map((id) => getProductById(id)));
      const featured = productIds.length === 0 ? await getFeaturedProducts(6) : [];

      if (!mounted) return;
      setViews(recentViews);
      setSearches(recentSearches);
      setProducts(recentProducts.filter(Boolean) as Product[]);
      setFallbackProducts(featured);
      setLoading(false);
    }

    load();
    window.addEventListener("mdp-activity-updated", load);
    return () => {
      mounted = false;
      window.removeEventListener("mdp-activity-updated", load);
    };
  }, []);

  const categoryViews = views.filter((item) => item.category_id || item.metadata?.category).slice(0, 4);
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  if (loading) {
    return (
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Basado en tu última visita</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {views.length > 0 ? "Seguimos por donde dejaste" : "Productos destacados para empezar"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {views.length > 0 ? "Vistos recientemente, búsquedas y categorías para continuar." : "Cuando explores MDP Market, esta sección se vuelve personal."}
            </p>
          </div>
          <p className="max-w-md text-xs leading-5 text-slate-400">
            Usamos tu actividad dentro de MDP Market para mejorar tus recomendaciones. Podés borrar tu historial desde tu cuenta.
          </p>
        </div>

        {searches.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searches.map((search) => (
              <Link
                key={search.id}
                href={`/buscar?q=${encodeURIComponent(search.search_query ?? "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Search className="h-3.5 w-3.5" />
                {search.search_query}
              </Link>
            ))}
          </div>
        )}

        {displayProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {displayProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {categoryViews.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categoryViews.map((item) => (
              <Link
                key={`${item.id}-${item.category_id}`}
                href={item.slug ? `/productos?category=${item.slug}` : "/productos"}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Clock className="h-3.5 w-3.5" />
                Más de {String(item.metadata?.category ?? item.title ?? "esta categoría")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
