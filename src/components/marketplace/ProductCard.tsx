"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductMainImage } from "@/lib/product-images";

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }: { product: Product }) {
  const [isFav, setIsFav] = useState(false);
  const imageSrc = getProductMainImage(product);

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.18)]">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-[inherit] bg-slate-50">
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full rounded-t-[inherit] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              const fallback = "/fallbacks/producto.svg";
              if (event.currentTarget.src.includes(fallback)) return;
              console.warn(`Image load failed for ${product.slug}: ${imageSrc}`);
              event.currentTarget.src = fallback;
            }}
          />

          {product.discount ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              {product.discount}% OFF
            </span>
          ) : null}

          <button
            type="button"
            className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-colors ${isFav ? "text-red-500" : "text-slate-400 hover:text-red-500"}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsFav(!isFav);
            }}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.mdp_delivery_available ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                Entrega MDP
              </span>
            ) : null}

            {product.protected_payment ? (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                Pago protegido
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {formatPrice(product.price)}
          </p>

          {product.old_price ? (
            <p className="text-sm text-slate-400 line-through mt-0.5">
              {formatPrice(product.old_price)}
            </p>
          ) : null}

          <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-slate-700">
            {product.title}
          </h3>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">
              {product.seller_verified ? "✓ Verificado" : product.seller_name || "Vendedor"}
            </span>
            <span className="truncate ml-2">{product.zone}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
