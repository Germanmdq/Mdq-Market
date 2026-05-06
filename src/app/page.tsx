"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ChevronLeft,
  Clock,
  Zap,
  Tag,
  ArrowRight,
  Wallet,
  CreditCard,
  Gift,
  Truck,
  Smartphone,
  PlusCircle,
  Star,
  Shield,
  Heart,
  ShoppingCart,
  CheckCircle2,
  MapPin,
  Trophy,
  History,
  Store,
  UserCheck,
  Package
} from "lucide-react";
import { CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import AutoProductSlider from "@/components/marketplace/AutoProductSlider";
import CategoryPills from "@/components/marketplace/CategoryPills";
import { ContentCarousel } from "@/components/ui/ContentCarousel";
import { cn, formatPrice } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════ */
/* QUICK ACTIONS (PILLS)                                          */
/* ═══════════════════════════════════════════════════════════════ */
const QUICK_ACTIONS = [
  { label: "Publicar", icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-50", href: "/publicar" },
  { label: "Ofertas", icon: Tag, color: "text-red-600", bg: "bg-red-50", href: "/productos?discount=true" },
  { label: "Servicios Hoy", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50", href: "/servicios?availability=hoy" },
  { label: "Profesionales", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50", href: "/profesionales" },
  { label: "Entrega MDP", icon: Truck, color: "text-orange-600", bg: "bg-orange-50", href: "/productos?mdpDelivery=true" },
  { label: "Comercios", icon: Store, color: "text-purple-600", bg: "bg-purple-50", href: "/productos?sellerType=comercio" },
  { label: "Pagar Servicios", icon: Zap, color: "text-pink-600", bg: "bg-pink-50", href: "/pedir-servicio" },
];

/* ═══════════════════════════════════════════════════════════════ */
/* COUNTDOWN TIMER COMPONENT                                      */
/* ═══════════════════════════════════════════════════════════════ */
function CountdownTimer() {
  const [time, setTime] = useState({ h: 14, m: 23, s: 5 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
      <Clock className="w-3.5 h-3.5" />
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </div>
  );
}

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  
  const heroBanners = [
    { id: 1, image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200", title: "Tecnología en Mar del Plata", subtitle: "Hasta 40% OFF en celulares y notebooks con entrega hoy.", cta: "Ver ofertas", href: "/productos" },
    { id: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200", title: "Emprendedores Locales", subtitle: "Diseño exclusivo y calidad artesanal de nuestra ciudad.", cta: "Explorar", href: "/productos" },
    { id: 3, image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1200", title: "Servicios de Urgencia", subtitle: "Profesionales verificados listos para asistirte las 24hs.", cta: "Pedir auxilio", href: "/pedir-servicio" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveHero(prev => (prev + 1) % heroBanners.length), 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      
      {/* 1. HERO SLIDER */}
      <section className="relative w-full h-[320px] md:h-[560px] overflow-hidden bg-slate-900 border-b border-slate-200 lg:rounded-b-[4rem]">
        {heroBanners.map((banner, idx) => (
          <div 
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000",
              idx === activeHero ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
            )}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter leading-[0.85]">{banner.title}</h1>
                  <p className="text-base md:text-xl font-bold text-slate-300 mb-10 max-w-lg leading-relaxed opacity-90">{banner.subtitle}</p>
                  <Link href={banner.href} className="inline-flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl">
                    {banner.cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Hero Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
           {heroBanners.map((_, i) => (
             <button 
              key={i} 
              onClick={() => setActiveHero(i)}
              className={cn("h-1.5 rounded-full transition-all duration-500", i === activeHero ? "w-12 bg-white" : "w-2 bg-white/30")} 
             />
           ))}
        </div>
      </section>

      {/* 2. CATEGORY PILLS (MOBILE & DESKTOP) */}
      <div className="relative -mt-6 lg:-mt-10 z-30">
         <CategoryPills />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-16 mt-12">
        
        {/* 3. QUICK ACTIONS (PILLS) */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 lg:p-8">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {QUICK_ACTIONS.map((action, idx) => (
              <Link key={idx} href={action.href} className="flex shrink-0 items-center gap-3 rounded-full border border-slate-100 bg-white px-6 py-3 shadow-sm hover:border-blue-600 transition-all active:scale-95 group">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110", action.bg, action.color)}>
                  <action.icon className="w-5 h-5" strokeWidth={3} />
                </div>
                <span className="text-[11px] font-black text-slate-700 whitespace-nowrap uppercase tracking-widest">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. SECTIONS WITH CAROUSELS */}
        
        {/* BASADO EN TU ÚLTIMA VISITA */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Personalizado</span>
               <h2 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter">Basado en tu visita</h2>
            </div>
            <Link href="/productos" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full transition-all">
              Ver más <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ContentCarousel>
            {MOCK_PRODUCTS.slice(0, 12).map(product => (
              <div key={product.id} className="w-[82vw] max-w-[300px] sm:w-[280px] lg:w-[290px] flex-none snap-start py-4">
                <ProductCard product={product} />
              </div>
            ))}
          </ContentCarousel>
        </section>

        {/* OFERTAS DEL DÍA */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Exclusivo</span>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter">Ofertas del Día</h2>
               </div>
               <CountdownTimer />
            </div>
            <Link href="/productos?discount=true" className="text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-full transition-all">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ContentCarousel>
            {MOCK_PRODUCTS.filter(p => p.oldPrice).slice(0, 12).map(product => (
              <div key={product.id} className="w-[82vw] max-w-[300px] sm:w-[280px] lg:w-[290px] flex-none snap-start py-4">
                <ProductCard product={product} />
              </div>
            ))}
          </ContentCarousel>
        </section>

        {/* SERVICIOS HOY */}
        <section className="space-y-8 bg-blue-600 rounded-[3rem] p-8 lg:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em]">Urgencias y más</span>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter">Servicios Disponibles Hoy</h2>
            </div>
            <Link href="/servicios" className="hidden sm:flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              Explorar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ContentCarousel showGradients={false}>
            {MOCK_SERVICES.slice(0, 10).map(service => (
              <div key={service.id} className="w-[82vw] max-w-[340px] sm:w-[320px] lg:w-[340px] flex-none snap-start py-4">
                <ServiceCard service={service} />
              </div>
            ))}
          </ContentCarousel>
        </section>

        {/* PROFESIONALES VERIFICADOS */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Confianza Total</span>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter flex items-center gap-3">
                Profesionales Verificados <Trophy className="w-8 h-8 text-amber-500 fill-amber-500" />
              </h2>
            </div>
            <Link href="/profesionales" className="text-[10px] font-black text-slate-400 hover:text-amber-600 uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full transition-all">
              Ver listado <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ContentCarousel>
            {MOCK_PROFESSIONALS.filter(p => p.verified).slice(0, 10).map(pro => (
              <div key={pro.id} className="w-[82vw] max-w-[320px] sm:w-[300px] lg:w-[320px] flex-none snap-start py-4">
                <ProfessionalCard professional={pro} />
              </div>
            ))}
          </ContentCarousel>
        </section>

        {/* MÁS DE MDP */}
        <section className="space-y-8">
           <div className="text-center space-y-2">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter">Más productos en MDP</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Catálogo local actualizado</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-8">
              {MOCK_PRODUCTS.slice(12, 22).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
           </div>
           <div className="flex justify-center pt-8">
              <Link href="/productos" className="bg-slate-950 text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                Ver catálogo completo
              </Link>
           </div>
        </section>

      </div>
    </main>
  );
}
