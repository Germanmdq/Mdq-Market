"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart, Zap, Clock, MapPin } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFav, setIsFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/productos/${product.slug}`} className="group block h-full">
        <article className="bg-white rounded-[2rem] border border-slate-100 p-3 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-50">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
              onError={() => setImgError(true)}
            />
            
            {/* Badges Floating */}
            <div className="absolute top-2 right-2 z-10">
              <button 
                onClick={handleFavorite}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-90",
                  isFav ? "bg-red-50 text-red-500" : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white"
                )}
              >
                <Heart className={cn("w-4.5 h-4.5", isFav && "fill-current")} />
              </button>
            </div>

            {product.discount && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Badges Row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.mdpDelivery?.available && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700 border border-emerald-100 uppercase tracking-tight">
                  🚚 Entrega MDP
                </span>
              )}
              {product.protectedPayment && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700 border border-blue-100 uppercase tracking-tight">
                  🛡️ Pago Protegido
                </span>
              )}
            </div>

            <h3 className="text-[13px] font-semibold text-slate-800 line-clamp-2 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-slate-950 tracking-tight">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through font-medium">{formatPrice(product.oldPrice)}</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span>{product.zone}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-amber-600 border border-amber-100">
                  <Star className="w-3 h-3 fill-amber-600" />
                  <span className="text-[10px] font-black">{product.sellerRating}</span>
                </div>
              </div>

              <div className="mt-4 w-full h-10 rounded-full bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest flex items-center justify-center transition-all group-hover:bg-blue-600">
                Ver detalle
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
