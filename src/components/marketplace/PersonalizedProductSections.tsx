"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getLastVisitedCategory, getRecentlyViewedProducts } from "@/lib/cart";
import ProductCard from "@/components/marketplace/ProductCard";
import type { Product } from "@/types/product";

export default function PersonalizedProductSections() {
  const [recent, setRecent] = useState<Product[]>([]);
  const [lastCategory, setLastCategory] = useState<{ slug: string; name: string } | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setRecent(getRecentlyViewedProducts());
      setLastCategory(getLastVisitedCategory());
    });
  }, []);

  if (recent.length === 0 && !lastCategory) return null;

  return (
    <section className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {lastCategory && (
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Basado en tu última visita</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Más de esta categoría</h2>
            </div>
            <Link href={`/productos?category=${lastCategory.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Ver categoría
            </Link>
          </div>
        )}

        {recent.length > 0 && (
          <div>
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-950">Productos vistos recientemente</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {recent.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
