import React from "react";
import { Shield, Lock, CheckCircle2, Unlock, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  { 
    icon: Lock, 
    title: "Pagás y queda fondeado", 
    sub: "La plata no llega al vendedor todavía" 
  },
  { 
    icon: CheckCircle2, 
    title: "Recibís el producto o servicio", 
    sub: "Coordinás todo desde el chat" 
  },
  { 
    icon: Unlock, 
    title: "Das el OK y se libera", 
    sub: "Si hay problema, te devolvemos" 
  },
];

const ProtectedPaymentBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 mb-12">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col lg:flex-row gap-12 items-center overflow-hidden relative shadow-2xl">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full -ml-48 -mb-48 blur-3xl" />

        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black tracking-[0.2em] uppercase opacity-80">
              Diferencial MDP Market
            </span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none">
            Pago Entregado MDP
          </h3>
          
          <p className="text-blue-100 text-lg leading-relaxed max-w-xl mb-8 font-medium">
            Tu plata queda en custodia hasta que confirmes que todo está OK. 
            Si algo falla, abrimos disputa y te devolvemos. Es la forma más segura de comprar en la ciudad.
          </p>

          <Link 
            href="/como-funciona"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-xl"
          >
            Cómo funciona <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 relative z-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/5 hover:bg-white/15 transition-colors">
                <div className="bg-blue-500/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="font-black text-sm mb-2 leading-tight uppercase tracking-tight">{step.title}</h4>
                <p className="text-xs text-blue-100/70 font-medium leading-relaxed">{step.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProtectedPaymentBanner;
