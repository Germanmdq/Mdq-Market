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
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(15,23,42,0.11)] h-full flex flex-col">
      <Link href={`/productos/${product.slug}`} className="block flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/fallbacks/producto.svg";
            }}
          />

          {product.discount ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-white z-10 shadow-sm">
              {product.discount}% off
            </span>
          ) : null}

          <button
            type="button"
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:text-red-500 ${isFav ? "text-red-500" : "text-slate-500"}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsFav(!isFav);
            }}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {product.mdp_delivery_available ? (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                Entrega MDP
              </span>
            ) : null}

            {product.protected_payment ? (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                Pago protegido
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950 leading-tight">
            {formatPrice(product.price)}
          </p>

          {product.old_price ? (
            <p className="text-sm text-slate-400 line-through mt-0.5">
              {formatPrice(product.old_price)}
            </p>
          ) : null}

          <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-medium leading-5 text-slate-700">
            {product.title}
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              {product.seller_verified ? "Vendedor verificado" : "Vendedor"}
            </span>
            <span className="truncate ml-2">{product.zone}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
