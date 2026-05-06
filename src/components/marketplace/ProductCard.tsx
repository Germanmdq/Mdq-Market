"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Shield, Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  
  // Category fallbacks
  const getFallbackImage = (category: string) => {
    const fallbacks: Record<string, string> = {
      "cat-1": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop", // Tech
      "cat-2": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop", // Home
      "cat-3": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", // Gadgets
      "cat-4": "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop", // Tools
      "cat-5": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop", // Fashion
      "cat-8": "https://images.unsplash.com/photo-1596435764499-6293e2697418?q=80&w=800&auto=format&fit=crop", // Artisanal
      "cat-10": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop", // Decor
    };
    return fallbacks[category] || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop";
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Connect with Auth/Backend
  };

  return (
    <Link href={`/productos/${product.slug}`} className="block h-full group">
      <article className="bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full relative group shadow-sm">
        {/* Image Container - Full Width Top */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Image
            src={imgError ? getFallbackImage(product.category) : product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Floating Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                {discount}% OFF
              </span>
            )}
            {product.condition === "Usado como nuevo" && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                Como nuevo
              </span>
            )}
          </div>

          <button 
            onClick={handleFavorite}
            className={cn(
              "absolute top-4 right-4 p-2.5 rounded-full transition-all shadow-lg z-20 backdrop-blur-md",
              isFavorite 
                ? "bg-red-50 text-red-500 border border-red-100" 
                : "bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white border border-white/20"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>

          {/* Protected Payment (Subtle Badge) */}
          {product.protectedPayment && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-xl border border-white/20 shadow-sm z-10">
              <Shield className="w-3 h-3 text-blue-600" strokeWidth={3} />
              <span className="text-[8px] font-black text-blue-900 uppercase tracking-widest">Protegido</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                  {formatPrice(product.price)}
               </span>
               {product.oldPrice && (
                 <span className="text-sm text-slate-400 line-through font-medium">
                   {formatPrice(product.oldPrice)}
                 </span>
               )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                 🚚 Entrega MDP
              </span>
              <span className="text-[10px] font-bold text-slate-300">•</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]">
                 {product.zone}
              </span>
            </div>
          </div>
          
          <h3 className="text-[13px] text-slate-600 font-bold mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors min-h-[32px]">
            {product.title}
          </h3>

          {/* Footer Meta */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-600 border border-amber-100">
                   <Star className="w-3 h-3 fill-amber-600" />
                   <span className="text-[11px] font-black">{product.sellerRating}</span>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[80px]">
                   {product.views}+ visitas
                </span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <ShoppingCart className="w-4 h-4" />
             </div>
          </div>

          {/* CTA Button */}
          <div className="mt-5 w-full bg-blue-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-widest whitespace-nowrap">
             Ver producto
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
