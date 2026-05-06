"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowLeft, ShoppingCart, Search } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";

export default function FavoritosPage() {
  const favorites = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-12">
         <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-gray-900 transition-all shadow-sm">
               <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mis Favoritos</h1>
         </div>
         <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{favorites.length} Items guardados</span>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {favorites.map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-200" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Tu lista está vacía</h2>
           <p className="text-gray-500 mb-8 max-w-xs mx-auto">Guardá los productos y servicios que te interesan para verlos más tarde.</p>
           <Link href="/productos" className="inline-flex items-center gap-2 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Search className="w-5 h-5" />
              Explorar Marketplace
           </Link>
        </div>
      )}
    </div>
  );
}
