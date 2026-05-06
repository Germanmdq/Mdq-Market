"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Truck, Star } from "lucide-react";

interface AutoProductSliderProps {
  products: Product[];
}

const SliderProductCard = ({ product }: { product: Product }) => {
  const [imgError, setImgError] = React.useState(false);
  const fallback = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop";

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="w-48 shrink-0 bg-white rounded-3xl border border-gray-100 p-2 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 group"
    >
      <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50 relative">
        <Image
          src={imgError ? fallback : (product.images?.[0] || fallback)}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          onError={() => setImgError(true)}
        />
        {product.oldPrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">
            {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-sm border border-white/20">
          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          <span className="text-[9px] font-black text-gray-900">{product.sellerRating}</span>
        </div>
      </div>
      
      <div className="px-2 pb-2 space-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black text-gray-900 tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <h3 className="text-[10px] font-bold text-gray-500 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center justify-between pt-1">
           <div className="flex items-center gap-1 text-[8px] font-black text-green-600 uppercase">
              <Truck className="w-2.5 h-2.5" /> MDP
           </div>
           <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">
              {product.zone}
           </span>
        </div>
      </div>
    </Link>
  );
};

const AutoProductSlider: React.FC<AutoProductSliderProps> = ({ products = [] }) => {
  // We double the products array to create a seamless loop
  const displayProducts = [...products, ...products];

  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm py-10 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">
            Tendencias en Mar del Plata
          </h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full mt-1" />
        </div>
        <span className="text-[10px] font-black text-blue-600 px-3 py-1 bg-blue-50 rounded-full uppercase tracking-widest animate-pulse">
          En vivo
        </span>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {displayProducts.map((product, idx) => (
            <SliderProductCard key={`${product.id}-${idx}`} product={product} />
          ))}
        </motion.div>
        
        {/* Gradients for fading effect */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default AutoProductSlider;
