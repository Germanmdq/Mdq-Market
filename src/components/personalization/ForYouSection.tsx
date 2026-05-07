"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPersonalizedRecommendations } from "@/lib/activity";
import ProductCard from "@/components/marketplace/ProductCard";
import type { Product } from "@/types/product";

export default function ForYouSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const recommendations = await getPersonalizedRecommendations(8);
      if (!mounted) return;
      setProducts(recommendations);
      setLoading(false);
    }

    load();
    window.addEventListener("mdp-activity-updated", load);
    return () => {
      mounted = false;
      window.removeEventListener("mdp-activity-updated", load);
    };
  }, []);

  if (loading) {
    return (
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Para vos</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Recomendaciones según tu recorrido
            </h2>
          </div>
          <Link href="/productos" className="hidden items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex">
            Ver más
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
