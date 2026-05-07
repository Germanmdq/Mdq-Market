"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

const FALLBACK_BY_CAT: Record<string, string> = {
  "cat-1": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
  "cat-2": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
  "cat-3": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
  "cat-4": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
  "cat-5": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
  "cat-6": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=600&auto=format&fit=crop",
  "cat-7": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop",
  "cat-8": "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=600&auto=format&fit=crop",
  "cat-9": "https://images.unsplash.com/photo-1534723452862-4c874e70d6f3?q=80&w=600&auto=format&fit=crop",
  "cat-10": "https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=600&auto=format&fit=crop",
};
const FALLBACK_DEFAULT = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isFav, setIsFav] = useState(false);
  const fallback = FALLBACK_BY_CAT[product.category] || FALLBACK_DEFAULT;
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || fallback);

  const discount =
    product.discount ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : undefined);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md h-full flex flex-col">
      <Link href={`/productos/${product.slug}`} className="block flex-1 flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgSrc(fallback)}
          />

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFav(!isFav); }}
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:text-red-500 ${isFav ? "text-red-500" : "text-slate-500"}`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
          </button>

          {discount ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              {discount}% off
            </span>
          ) : null}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="mb-3 flex flex-wrap gap-2">
            {product.mdpDelivery?.available && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                Entrega MDP
              </span>
            )}
            {product.protectedPayment && (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                Pago protegido
              </span>
            )}
          </div>

          <p className="text-lg font-semibold tracking-tight text-slate-950 leading-tight">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice && (
            <p className="text-sm font-medium text-slate-400 line-through mt-0.5">
              {formatPrice(product.oldPrice)}
            </p>
          )}

          <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-slate-700">
            {product.title}
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>★ {product.sellerRating ?? 4.8}</span>
            <span className="truncate ml-2">{product.zone}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
