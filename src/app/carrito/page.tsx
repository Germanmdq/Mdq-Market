"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getPublishedProducts } from "@/lib/products";
import { getProductMainImage } from "@/lib/product-images";
import type { Product } from "@/types/product";

export default function CartPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSampleItems() {
      const allProds = await getPublishedProducts();
      setItems(allProds.slice(0, 2)); // Use first 2 products as sample cart
      setLoading(false);
    }
    loadSampleItems();
  }, []);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1024px] mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 mb-10">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-200 p-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950 mb-3">Tu carrito está vacío</h2>
            <p className="text-slate-500 mb-10">Descubrí productos locales y agregalos acá.</p>
            <Link href="/productos" className="inline-flex h-14 items-center justify-center rounded-full bg-slate-950 px-10 font-semibold text-white transition hover:bg-slate-800">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
            
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 relative">
                    <Image src={getProductMainImage(item)} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-950 line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{item.seller_name || "Vendedor local"} · {item.zone || item.city}</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-wider">Pago protegido</span>
                      {item.mdp_delivery_available && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Entrega MDP</span>}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                    <p className="text-xl font-semibold text-slate-950 mb-0 sm:mb-4">{formatPrice(item.price)}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4" /> <span className="sm:hidden uppercase tracking-widest text-[10px]">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950 mb-6">Resumen</h2>
                
                <div className="space-y-3 mb-6 border-b border-slate-100 pb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Productos ({items.length})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Entrega</span>
                    <span>Coordinar</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-semibold text-slate-950">Total</span>
                  <span className="text-3xl font-semibold tracking-tight text-slate-950">{formatPrice(total)}</span>
                </div>

                <Link href={`/checkout?type=product&id=${items[0].id}`} className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2 mb-4">
                  Continuar compra <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-start gap-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    Tu pago está protegido. El vendedor no recibe el dinero hasta que confirmes la entrega satisfactoria.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        )}
      </main>
    </div>
  );
}
