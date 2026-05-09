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
    <article className="group flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md">
      <Link href={`/productos/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white border-b border-slate-100">
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-contain p-2"
            loading="lazy"
            onError={(event) => {
              const fallback = "/fallbacks/producto.svg";
              if (event.currentTarget.src.includes(fallback)) return;
              console.warn(`Image load failed for ${product.slug}: ${imageSrc}`);
              event.currentTarget.src = fallback;
            }}
          />

          <button
            type="button"
            className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors ${isFav ? "text-[#3483fa]" : "text-[#ccc] hover:text-[#3483fa]"}`}
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
          <div className="flex flex-col items-start mb-2 space-y-1">
            {product.mdp_delivery_available ? (
              <span className="text-[12px] font-semibold text-[#00a650]">
                Llega gratis a MDP
              </span>
            ) : null}

            {product.protected_payment ? (
              <span className="text-[12px] font-semibold text-[#3483fa]">
                Compra Protegida
              </span>
            ) : null}
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[24px] font-normal tracking-tight text-[#333333]">
              {formatPrice(product.price)}
            </p>
              {product.discount ? (
                <span className="text-[14px] font-normal text-[#00a650]">
                  {product.discount}% OFF
                </span>
              ) : null}
            </div>
            {product.old_price ? (
              <p className="text-[12px] text-[#999999] line-through mt-[-4px]">
                {formatPrice(product.old_price)}
              </p>
            ) : null}
          </div>

          <h3 className="mb-2 line-clamp-2 text-[14px] font-light leading-snug text-[#666666]">
            {product.title}
          </h3>

          <div className="mt-auto flex items-center gap-2 text-[12px] text-[#999999]">
            <span>
              {product.seller_name || "Vendedor"}
            </span>
            <span>·</span>
            <span>{toTitleLabel(product.condition)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
