"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFav, setIsFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || "");
  const fallback = "https://placehold.co/400x300/f1f5f9/94a3b8?text=MDP+Market";

  const discount =
    product.discount ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : undefined);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={imgSrc || fallback}
            alt={product.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgSrc(fallback)}
          />

          {discount ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          ) : null}

          <button
            type="button"
            onClick={handleFavorite}
            className={cn(
              "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 backdrop-blur-sm shadow-sm transition active:scale-90",
              isFav
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500"
            )}
            aria-label="Agregar a favoritos"
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {product.mdpDelivery?.available && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              🚚 Entrega MDP
            </span>
          )}
          {product.protectedPayment && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              🛡 Pago protegido
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xl font-bold tracking-tight text-slate-950">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-xs font-medium text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
        </div>

        <Link href={`/productos/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug text-slate-800 transition group-hover:text-blue-700">
            {product.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-bold text-amber-600">
            <Star className="h-3 w-3 fill-current" />
            {product.sellerRating}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1 truncate font-medium text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {product.zone}
          </span>
        </div>

        <Link
          href={`/productos/${product.slug}`}
          className="mt-4 flex h-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ver producto
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
