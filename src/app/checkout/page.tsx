"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { 
  ShieldCheck, ArrowLeft, CheckCircle2, Lock, Loader2, MapPin
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockData";
import { formatPrice, cn, getProductImage } from "@/lib/utils";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState("mp");
  const [step, setStep] = useState(1);

  const item = type === "product" 
    ? MOCK_PRODUCTS.find(p => p.id === id) 
    : MOCK_SERVICES.find(s => s.id === id);

  if (!item) {
    return <div className="p-20 text-center font-semibold text-xl text-slate-500">Producto no encontrado</div>;
  }

  const price = type === "product" ? (item as any).price : (item as any).priceFrom;
  const total = price;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 2000);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-950 mb-4 tracking-tight">¡Operación fondeada!</h1>
        <p className="text-base text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
          El dinero está protegido por MDP Market. El {type === "product" ? "vendedor" : "profesional"} fue notificado y se coordinará la entrega/servicio.
        </p>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 w-full max-w-sm">
           <div className="flex justify-between items-center mb-3 text-sm">
              <span className="font-medium text-slate-500">Orden ID</span>
              <span className="font-semibold text-slate-950">#MDP-882193</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-500">Estado</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Fondeado</span>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href="/mi-cuenta" className="flex-1 bg-slate-950 text-white font-semibold py-3.5 rounded-full transition-colors hover:bg-slate-800">
            Ver mis compras
          </Link>
          <Link href="/" className="flex-1 bg-white border border-slate-300 text-slate-950 font-semibold py-3.5 rounded-full transition-colors hover:bg-slate-50">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

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
          
          {/* Left Form */}
          <div className="space-y-6">
            
            {/* Delivery Address */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
              <h2 className="text-xl font-semibold text-slate-950 mb-6">1. Entrega</h2>
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 flex justify-between items-center cursor-pointer transition hover:border-blue-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 text-base">Av. Colón 2350, 4ºB</p>
                    <p className="text-sm text-slate-500 mt-0.5">Mar del Plata, Buenos Aires</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:underline">Cambiar</button>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
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

            {/* Protected Info */}
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

          {/* Right Summary */}
          <aside className="lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
              <h3 className="text-lg font-semibold text-slate-950 mb-6">Resumen de compra</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 shrink-0 overflow-hidden">
                  <img src={type === "product" ? getProductImage(item as any) : (item as any).image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-950 text-sm line-clamp-2">{item.title}</h4>
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
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>Pago Protegido</span>
                  <span>Incluido</span>
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
              
              <p className="text-xs text-center text-slate-400 mt-4">
                Transacción mock. No se realizan cobros.
              </p>
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
