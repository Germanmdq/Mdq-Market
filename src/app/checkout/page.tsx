"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { 
  ShieldCheck, ArrowLeft, CheckCircle2, Lock, Loader2, MapPin
} from "lucide-react";
import { MOCK_SERVICES } from "@/data/mockData";
import { getProductById } from "@/lib/products";
import { getProductMainImage } from "@/lib/product-images";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState("mp");
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      if (!id) {
        setLoading(false);
        return;
      }

      if (type === "product") {
        const prod = await getProductById(id);
        setItem(prod);
      } else {
        // Services still use mock for now
        const service = MOCK_SERVICES.find(s => s.id === id);
        setItem(service);
      }
      setLoading(false);
    }
    loadItem();
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!item) {
    return <div className="p-20 text-center font-semibold text-xl text-slate-500">Producto no encontrado</div>;
  }

  const price = type === "product" ? (item as Product).price : (item as any).priceFrom;
  const total = price;
  const title = item.title;
  const image = type === "product" ? getProductMainImage(item as Product) : (item as any).image;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/operaciones/MDP-882193`);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-950">Checkout Protegido</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
          
          <div className="space-y-6">
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950 mb-6">1. Entrega</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Zona / Barrio</label>
                    <select required className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleccionar zona...</option>
                      <option value="centro">Centro / Macrocentro</option>
                      <option value="guemes">Güemes / Chauvín</option>
                      <option value="puerto">Puerto / Punta Mogotes</option>
                      <option value="constitucion">Constitución / La Perla</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dirección exacta</label>
                    <input type="text" required placeholder="Ej. Av. Colón 2350" className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Día y horario de disponibilidad</label>
                  <select required className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleccionar franja horaria...</option>
                    <option value="hoy-10-13">Hoy 10:00 a 13:00 hs</option>
                    <option value="hoy-13-16">Hoy 13:00 a 16:00 hs</option>
                    <option value="hoy-16-19">Hoy 16:00 a 19:00 hs</option>
                    <option value="manana-10-13">Mañana 10:00 a 13:00 hs</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950 mb-6">2. Método de pago</h2>
              <div className="space-y-3">
                {[
                  { id: "mp", name: "Mercado Pago", sub: "Dinero en cuenta o crédito" },
                  { id: "card", name: "Tarjeta de débito/crédito", sub: "Visa, Mastercard, Cabal" },
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "w-full p-5 rounded-2xl border flex items-center justify-between transition-colors",
                      method === m.id ? "border-blue-600 bg-blue-50/50" : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-slate-950">{m.name}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{m.sub}</p>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", method === m.id ? "border-blue-600" : "border-slate-300")}>
                      {method === m.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-sm font-semibold text-slate-950">Pago Protegido</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  El dinero queda retenido en custodia. El vendedor es notificado y recién cobra cuando confirmes la recepción exitosa de la compra.
                </p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950 mb-6">Resumen de compra</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 shrink-0 overflow-hidden relative">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-950 text-sm line-clamp-2">{title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{formatPrice(price)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 border-b border-slate-100 pb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(price)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Entrega MDP</span>
                  <span>Coordinar</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-semibold text-slate-950">Total</span>
                <span className="text-3xl font-semibold tracking-tight text-slate-950">{formatPrice(total)}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Confirmar pago</>}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-semibold text-slate-400">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
