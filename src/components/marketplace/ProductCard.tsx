"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductMainImage } from "@/lib/product-images";
import { toTitleLabel } from "@/lib/labels";

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
    <article className="group flex h-full min-h-[430px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_64px_rgba(15,23,42,0.16)]">
      <Link href={`/productos/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        <div className="flex flex-1 flex-col p-4">
          <div className="flex min-h-[28px] flex-wrap items-start gap-1.5">
            {product.mdp_delivery_available ? (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Entrega MDP
              </span>
            ) : null}

            {product.protected_payment ? (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Pago protegido
              </span>
            ) : null}
          </div>

          <div className="mt-3 min-h-[54px]">
            <p className="text-xl font-semibold tracking-tight text-slate-950">
              {formatPrice(product.price)}
            </p>
            {product.old_price ? (
              <p className="mt-0.5 text-sm text-slate-400 line-through">
                {formatPrice(product.old_price)}
              </p>
            ) : null}
          </div>

          <h3 className="mt-2 min-h-[44px] line-clamp-2 text-sm font-semibold leading-snug text-slate-950">
            {product.title}
          </h3>

          <div className="mt-3 min-h-[26px]">
            <span className="rounded-full bg-slate-700 px-2.5 py-1 text-[10px] font-semibold text-white">
              {toTitleLabel(product.condition)}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="font-medium">
              {product.seller_name || "Vendedor local"}
            </span>
            <span className="truncate ml-2">{product.zone}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
