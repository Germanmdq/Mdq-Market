"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ArrowRight,
  PlusCircle,
  Tag,
  Clock,
  UserCheck,
  Truck,
  Store,
  Zap,
  Star,
  Trophy,
  History,
  ShoppingCart,
  LayoutGrid,
  Laptop,
  Smartphone,
  Home as HomeIcon,
  Shirt,
  Bike
} from "lucide-react";
import { CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { cn, formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
/* CATEGORIES GRID                                                */
/* ═══════════════════════════════════════════════════════════════ */
const CATEGORY_CHIPS = [
  { name: "Tecnología", icon: Laptop, color: "bg-blue-600" },
  { name: "Celulares", icon: Smartphone, color: "bg-emerald-600" },
  { name: "Hogar", icon: HomeIcon, color: "bg-amber-600" },
  { name: "Moda", icon: Shirt, color: "bg-pink-600" },
  { name: "Deportes", icon: Bike, color: "bg-orange-600" },
  { name: "Todos", icon: LayoutGrid, color: "bg-slate-900" },
];

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
    <div className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-red-200">
      <Clock className="w-3.5 h-3.5" />
      Termina en: {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </div>
  );
}

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  
  const heroBanners = [
    { id: 1, image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200", title: "Tecnología local con garantía.", subtitle: "Hasta 40% OFF en productos seleccionados con entrega hoy.", cta: "Ver ofertas", href: "/productos" },
    { id: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200", title: "Moda que recorre la ciudad.", subtitle: "Descubrí el diseño exclusivo de los emprendedores de Mar del Plata.", cta: "Explorar", href: "/productos" },
    { id: 3, image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1200", title: "Expertos a tu servicio.", subtitle: "Profesionales verificados listos para asistirte las 24hs del día.", cta: "Pedir auxilio", href: "/pedir-servicio" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveHero(prev => (prev + 1) % heroBanners.length), 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const dailyDeals = MOCK_PRODUCTS.filter(p => p.oldPrice || p.discount).slice(0, 12);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      
      {/* 1. HERO SLIDER */}
      <section className="relative w-full h-[360px] md:h-[620px] overflow-hidden bg-slate-950 lg:rounded-b-[4rem]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeHero}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={heroBanners[activeHero].image} 
              alt={heroBanners[activeHero].title} 
              className="w-full h-full object-cover opacity-60" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-2xl text-white space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="inline-block bg-blue-600/20 backdrop-blur-md text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-blue-500/20 mb-6">
                      Destacado de hoy
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter leading-[0.9]">{heroBanners[activeHero].title}</h1>
                    <p className="text-base md:text-xl font-medium text-slate-300 mb-10 max-w-lg leading-relaxed opacity-90">{heroBanners[activeHero].subtitle}</p>
                    <Link href={heroBanners[activeHero].href} className="inline-flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl">
                      {heroBanners[activeHero].cta} <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
           {heroBanners.map((_, i) => (
             <button 
              key={i} 
              onClick={() => setActiveHero(i)}
              className={cn("h-1.5 rounded-full transition-all duration-700", i === activeHero ? "w-16 bg-white" : "w-4 bg-white/20 hover:bg-white/40")} 
             />
           ))}
        </div>
      </section>

      {/* 2. CATEGORY PILLS (MOBILE & DESKTOP) */}
      <div className="relative -mt-8 z-30 flex justify-center">
         <div className="bg-white rounded-full shadow-2xl shadow-slate-200 border border-slate-100 p-2 flex gap-1 overflow-x-auto no-scrollbar max-w-full px-4">
            {CATEGORY_CHIPS.map((chip, idx) => (
              <button key={idx} className="flex items-center gap-2.5 px-6 py-3 rounded-full hover:bg-slate-50 transition-all whitespace-nowrap group">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform", chip.color)}>
                  <chip.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{chip.name}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-12 space-y-24 mt-20">
        
        {/* 3. QUICK ACTIONS */}
        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 px-1">
            {QUICK_ACTIONS.map((action, idx) => (
              <Link key={idx} href={action.href} className="flex shrink-0 items-center gap-4 rounded-full border border-slate-100 bg-white px-8 py-4 shadow-sm hover:border-blue-600 hover:shadow-xl hover:shadow-blue-900/5 transition-all active:scale-95 group">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110", action.bg, action.color)}>
                  <action.icon className="w-6 h-6" strokeWidth={3} />
                </div>
                <span className="text-xs font-black text-slate-800 whitespace-nowrap uppercase tracking-widest">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. OFERTAS DEL DÍA (EMBLA) */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div className="space-y-4">
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Exclusivo hoy</span>
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter italic">Ofertas del Día</h2>
               </div>
               <CountdownTimer />
            </div>
            <Link href="/productos?discount=true" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest px-8 py-4 bg-white border border-slate-100 rounded-full transition-all shadow-sm">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <MarketCarousel>
            {dailyDeals.map(product => (
              <div key={product.id} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={product} />
              </div>
            ))}
          </MarketCarousel>
        </section>

        {/* 5. BASADO EN TU VISITA */}
        <section className="space-y-10">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Personalizado</span>
               <h2 className="text-4xl font-black text-slate-950 tracking-tighter">Basado en tu última visita</h2>
            </div>
            <Link href="/productos" className="hidden sm:inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest px-8 py-4 bg-white border border-slate-100 rounded-full transition-all shadow-sm">
              Ver más <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <MarketCarousel>
            {MOCK_PRODUCTS.slice(0, 12).map(product => (
              <div key={product.id} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                <ProductCard product={product} />
              </div>
            ))}
          </MarketCarousel>
        </section>

        {/* 6. SERVICIOS DESTACADOS (MOBILE GRID, DESKTOP EMBLA) */}
        <section className="space-y-10 bg-slate-900 rounded-[3rem] p-8 lg:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="flex items-center justify-between relative z-10 px-2">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Soluciones locales</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter italic">Servicios en Mar del Plata</h2>
            </div>
            <Link href="/servicios" className="hidden sm:flex items-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 hover:text-white transition-all">
              Explorar todo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <MarketCarousel className="relative z-10">
            {MOCK_SERVICES.slice(0, 10).map(service => (
              <div key={service.id} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] xl:flex-[0_0_24%] py-6">
                <ServiceCard service={service} />
              </div>
            ))}
          </MarketCarousel>
        </section>

        {/* 7. PROFESIONALES VERIFICADOS */}
        <section className="space-y-10 pb-12">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Calidad Asegurada</span>
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter flex items-center gap-4 italic">
                Profesionales Verificados <Trophy className="w-10 h-10 text-amber-500 fill-amber-500 hidden sm:block" />
              </h2>
            </div>
            <Link href="/profesionales" className="text-[10px] font-black text-slate-400 hover:text-amber-600 uppercase tracking-widest px-8 py-4 bg-white border border-slate-100 rounded-full transition-all shadow-sm">
              Ver listado <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <MarketCarousel>
            {MOCK_PROFESSIONALS.filter(p => p.verified).slice(0, 10).map(pro => (
              <div key={pro.id} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] xl:flex-[0_0_24%] py-4">
                <ProfessionalCard professional={pro} />
              </div>
            ))}
          </MarketCarousel>
        </section>

        {/* 8. MÁS DE MDP MARKET */}
        <section className="space-y-12 pb-32">
           <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Explorá más</span>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">Tendencias en la ciudad</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {MOCK_PRODUCTS.slice(12, 22).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
           </div>
           <div className="flex justify-center pt-10">
              <Link href="/productos" className="bg-slate-950 text-white px-16 py-6 rounded-full font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                Ver catálogo completo
              </Link>
           </div>
        </section>

      </div>
    </main>
  );
}
