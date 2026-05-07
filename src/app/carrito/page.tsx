"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/utils";
import Header from "@/components/layout/Header";

export default function CartPage() {
  const [items, setItems] = useState([MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]]);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 mb-8">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950 mb-2">Tu carrito está vacío</h2>
            <p className="text-slate-500 mb-8">Descubrí productos locales y agregalos acá.</p>
            <Link href="/productos" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 font-semibold text-white transition hover:bg-slate-800">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
            
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 relative">
                    <Image src={getProductImage(item)} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-slate-950 line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{item.sellerName} · {item.zone}</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">Pago protegido</span>
                      {item.mdpDelivery?.available && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">Entrega MDP</span>}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                    <p className="text-xl font-semibold text-slate-950 mb-0 sm:mb-4">{formatPrice(item.price)}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> <span className="sm:hidden">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
                <h2 className="text-lg font-semibold text-slate-950 mb-6">Resumen</h2>
                
                <div className="space-y-3 mb-6 border-b border-slate-100 pb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Productos ({items.length})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Entrega</span>
                    <span className="text-slate-400">A coordinar</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-semibold text-slate-950">Total</span>
                  <span className="text-3xl font-semibold tracking-tight text-slate-950">{formatPrice(total)}</span>
                </div>

                <Link href={`/checkout?type=product&id=${items[0].id}`} className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2 mb-4">
                  Continuar compra <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    Tu pago está protegido. El vendedor no recibe el dinero hasta que confirmes la entrega.
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
