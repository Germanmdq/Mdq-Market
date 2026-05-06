"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart, Zap, Clock, MapPin } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFav, setIsFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getFallbackImage = (category: string) => {
    const fallbacks: Record<string, string> = {
      "cat-1": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
      "cat-2": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800",
      "cat-3": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
      "cat-4": "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800",
      "cat-5": "https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=800",
    };
    return fallbacks[category] || "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800";
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <Link href={`/productos/${product.slug}`} className="group block h-full">
      <article className="bg-white rounded-[2rem] border border-slate-100 p-3 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-50 group-hover:shadow-inner transition-all">
          <Image
            src={imgError ? getFallbackImage(product.category) : product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
          
          {/* Favorite Button */}
          <button 
            onClick={handleFavorite}
            className={cn(
              "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all z-10 active:scale-90",
              isFav ? "bg-red-50 text-red-500" : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white"
            )}
          >
            <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
          </button>

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Badges Row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
             {product.mdpDelivery?.available && (
               <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 border border-emerald-100 uppercase tracking-tighter">
                 🚚 Entrega MDP
               </span>
             )}
             {product.protectedPayment && (
               <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700 border border-blue-100 uppercase tracking-tighter">
                 🛡️ Pago Protegido
               </span>
             )}
          </div>

          <div className="mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.condition}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-950 tracking-tighter">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through font-bold">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-4 min-h-[40px] group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-amber-600 border border-amber-100">
               <Star className="w-3 h-3 fill-amber-600" />
               <span className="text-[11px] font-black">{product.sellerRating}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>{product.zone}</span>
            </div>
          </div>

          <div className="mt-4 w-full h-10 rounded-full bg-slate-950 group-hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center transition-all shadow-xl active:scale-95">
            Ver producto
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
