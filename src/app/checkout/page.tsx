"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Lock,
  Loader2,
  MapPin,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockData";
import { formatPrice, cn } from "@/lib/utils";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState("mp");
  const [step, setStep] = useState(1); // 1: Checkout, 2: Success

  const item = type === "product" 
    ? MOCK_PRODUCTS.find(p => p.id === id) 
    : MOCK_SERVICES.find(s => s.id === id);

  if (!item) {
    return <div className="p-20 text-center font-black text-2xl">Producto no encontrado</div>;
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="relative mb-12">
           <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-200 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
           </div>
           <div className="absolute inset-0 rounded-full border-4 border-blue-600 animate-ping opacity-20" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">¡Pago Fondeado!</h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          Tu plata ya está en custodia con <strong>Pago Entregado MDP</strong>. 
          El {type === "product" ? "vendedor" : "profesional"} fue notificado y coordinarán la entrega por el chat.
        </p>

        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-12 w-full max-w-md">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orden ID</span>
              <span className="text-sm font-bold text-gray-900 font-mono">#MDP-882193</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</span>
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                 <Shield className="w-3 h-3" /> Fondeado
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href="/chat"
            className="flex-1 bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Ir al Chat <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/"
            className="flex-1 bg-gray-100 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-black font-black text-xs uppercase tracking-widest transition-all">
              <ArrowLeft className="w-5 h-5" /> Volver
           </button>
           <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-black text-gray-900 tracking-tighter uppercase tracking-widest">Checkout Seguro MDP</span>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-6">
             {/* 1. Address */}
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">1</div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Dirección de Entrega</h2>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-blue-600 flex justify-between items-center group cursor-pointer transition-all">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="font-black text-gray-900 text-lg leading-tight">Av. Colón 2350, 4ºB</p>
                         <p className="text-sm font-medium text-gray-500">Mar del Plata, Buenos Aires · CP 7600</p>
                      </div>
                   </div>
                   <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Cambiar</button>
                </div>
             </div>

             {/* 2. Payment Method */}
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">2</div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Método de Pago</h2>
                </div>

                <div className="space-y-4">
                   {[
                     { id: "mp", name: "Mercado Pago", sub: "Dinero en cuenta o débito", color: "bg-[#00b1ea]", emoji: "💙" },
                     { id: "card", name: "Tarjeta de Crédito", sub: "Visa, Mastercard, Amex", color: "bg-gray-900", emoji: "💳" },
                   ].map(m => (
                     <button 
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all",
                        method === m.id ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                      )}
                     >
                        <div className="flex items-center gap-4">
                           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-white font-black", m.color)}>
                              {m.id === 'mp' ? 'MP' : m.emoji}
                           </div>
                           <div className="text-left">
                              <p className="font-black text-gray-900">{m.name}</p>
                              <p className="text-xs font-medium text-gray-500">{m.sub}</p>
                           </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          method === m.id ? "border-blue-600" : "border-gray-300"
                        )}>
                           {method === m.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                        </div>
                     </button>
                   ))}
                </div>
             </div>

             {/* Protection Info */}
             <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <Shield className="w-10 h-10 text-blue-300" strokeWidth={3} />
                      <h3 className="text-xl font-black uppercase tracking-widest">Pago Protegido MDP</h3>
                   </div>
                   <p className="text-lg font-medium opacity-90 leading-relaxed mb-4">
                      Al pagar, tu plata queda <strong>en custodia</strong>. El vendedor sabe que está fondeada pero no la cobra hasta que vos confirmes que recibiste todo OK.
                   </p>
                   <p className="text-sm opacity-70">
                      Si hay un problema, abrimos una disputa y te devolvemos el dinero en menos de 48hs.
                   </p>
                </div>
             </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 sticky top-12">
             <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Tu Pedido</h3>
                
                <div className="flex gap-4 mb-8">
                   <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 p-2">
                      <img 
                        src={(item as any).images ? (item as any).images[0] : (item as any).image} 
                        alt={item.title} 
                        className="w-full h-full object-contain" 
                      />
                   </div>
                   <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{item.title}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{type === "product" ? "Producto" : "Servicio"}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex justify-between text-sm font-medium text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatPrice(price)}</span>
                   </div>
                   <div className="flex justify-between text-sm font-medium text-green-600">
                      <span>Envío / Visita técnica</span>
                      <span className="font-black uppercase text-[10px]">Gratis</span>
                   </div>
                   <div className="flex justify-between text-sm font-medium text-blue-600">
                      <span>Cargo de Protección</span>
                      <span className="font-black uppercase text-[10px]">Bonificado</span>
                   </div>
                   <div className="pt-6 border-t border-gray-100 flex flex-col items-center">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total a Pagar</span>
                      <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                         {formatPrice(total)}
                      </span>
                   </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 group mb-6"
                >
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-base uppercase tracking-widest">Pagar y Fondear</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-2 text-center opacity-40">
                   <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                      <Lock className="w-3 h-3" /> Transacción Encriptada
                   </div>
                   <p className="text-[9px] font-medium leading-tight px-4">
                      Esta es una simulación. No se realizarán cargos reales.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black text-gray-400 animate-pulse">Cargando Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
