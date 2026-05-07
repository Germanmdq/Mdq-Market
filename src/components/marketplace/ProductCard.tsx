"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getProductImage } from "@/lib/utils";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isFav, setIsFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(getProductImage(product));

  const discount =
    product.discount ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : undefined);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(15,23,42,0.12)] h-full flex flex-col">
      <Link href={`/productos/${product.slug}`} className="block flex-1 flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop")}
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
