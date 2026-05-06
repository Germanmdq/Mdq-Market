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
  Trophy
} from "lucide-react";
import { CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/data/mockData";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import AutoProductSlider from "@/components/marketplace/AutoProductSlider";
import { ProductCarousel } from "@/components/marketplace/ProductCarousel";
import { cn, formatPrice } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════ */
/* ACCESOS RÁPIDOS (WIDGETS)                                      */
/* ═══════════════════════════════════════════════════════════════ */
const WIDGETS = [
  { label: "Ingresar dinero", icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-50", href: "/dashboard/usuario" },
  { label: "Ofertas", icon: Tag, color: "text-red-600", bg: "bg-red-50", href: "/productos?discount=true" },
  { label: "Cuotas sin interés", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50", href: "/productos" },
  { label: "Recargar celular", icon: Smartphone, color: "text-green-600", bg: "bg-green-50", href: "/servicios" },
  { label: "Envíos MDP", icon: Truck, color: "text-orange-600", bg: "bg-orange-50", href: "/productos?mdpDelivery=true" },
  { label: "Cupones", icon: Gift, color: "text-pink-600", bg: "bg-pink-50", href: "/productos" },
  { label: "Pagar servicios", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", href: "/pedir-servicio" },
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
    <div className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-black tracking-wider">
      <Clock className="w-4 h-4 mr-1" />
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* HOME PAGE                                                       */
/* ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  
  const heroBanners = [
    { id: 1, image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop", title: "Tecnología al mejor precio", subtitle: "Hasta 40% OFF en celulares y notebooks", cta: "Ver ofertas", href: "/productos" },
    { id: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop", title: "Tejidos marplatenses", subtitle: "Lana pura, diseño exclusivo, directo de la fábrica", cta: "Explorar", href: "/productos" },
    { id: 3, image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1200&auto=format&fit=crop", title: "Urgencias 24hs", subtitle: "Plomero, electricista o cerrajero en menos de 45 min", cta: "Pedir auxilio", href: "/pedir-servicio" },
  ];

  useEffect(() => {
    if (heroBanners.length === 0) return;
    const timer = setInterval(() => setActiveHero(prev => (prev + 1) % heroBanners.length), 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. SLIDER DE HERO */}
      <section className="relative w-full h-[320px] md:h-[520px] overflow-hidden group bg-slate-900 z-0 border-b border-slate-200">
        {heroBanners.map((banner, idx) => (
          <div 
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000",
              idx === activeHero ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
            )}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-8 md:px-16">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-[0.9] drop-shadow-2xl">{banner.title}</h1>
                  <p className="text-lg md:text-xl font-medium text-slate-300 mb-8 max-w-lg leading-relaxed">{banner.subtitle}</p>
                  <Link href={banner.href} className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-600/40">
                    {banner.cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 1.5 SLIDER AUTOPLAY (PRODUCTOS TRENDING) */}
      <AutoProductSlider products={MOCK_PRODUCTS.slice(0, 15)} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-16 relative z-20 pb-20 mt-12">
        
        {/* 2. BARRA DE ACCESOS RÁPIDOS */}
        <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-10">
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-8 pb-2">
            {WIDGETS.map((item, idx) => (
              <Link key={idx} href={item.href} className="flex flex-col items-center gap-4 group shrink-0">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl", item.bg, item.color)}>
                  <item.icon className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-black text-slate-600 whitespace-nowrap group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. BASADO EN TU ÚLTIMA VISITA (CARRUSEL) */}
        <section className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Basado en tu última visita</h2>
              <p className="text-sm text-slate-500 font-medium">Productos que viste recientemente o que podrían interesarte.</p>
            </div>
            <Link href="/productos?source=recent" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all">
              Ver más <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductCarousel>
            {MOCK_PRODUCTS.slice(0, 12).map(product => (
              <div key={product.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>

        {/* 4. OFERTAS DEL DÍA (CON TIMER) */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Ofertas del Día</h2>
              <CountdownTimer />
            </div>
            <Link href="/productos?discount=true" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductCarousel>
            {MOCK_PRODUCTS.filter(p => p.oldPrice).slice(0, 12).map(product => (
              <div key={product.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>

        {/* 5. NAVEGACIÓN POR CATEGORÍA */}
        <section className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter mb-3">Explorá por categoría</h2>
            <p className="text-base text-slate-400 font-medium">Lo que necesitás en Mar del Plata, al alcance de un click.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
            {CATEGORIES.filter(c => c.featured).map(cat => (
              <Link key={cat.id} href={cat.type === 'producto' ? `/productos?category=${cat.id}` : `/servicios?category=${cat.id}`} className="flex flex-col items-center gap-4 group">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-2xl group-hover:scale-110 group-hover:border-blue-100 transition-all duration-500 relative">
                  <span className="text-4xl md:text-5xl group-hover:rotate-12 transition-transform duration-500 z-10">
                    {cat.slug === 'tecnologia-y-celulares' && '📱'}
                    {cat.slug === 'electrodomesticos' && '🏠'}
                    {cat.slug === 'hogar-y-muebles' && '🛋️'}
                    {cat.slug === 'herramientas-y-construccion' && '🔨'}
                    {cat.slug === 'indumentaria-y-accesorios' && '👕'}
                    {cat.slug === 'emprendedores-locales' && '🌊'}
                    {cat.slug === 'plomeria-y-gas' && '🚰'}
                    {cat.slug === 'electricidad-y-security' && '⚡'}
                    {cat.slug === 'construccion-y-mantenimiento' && '🏗️'}
                  </span>
                  <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-5 transition-all duration-500" />
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. SERVICIOS RECOMENDADOS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Servicios Disponibles Hoy</h2>
              <p className="text-sm text-slate-500 font-medium">Profesionales listos para asistirte en Mar del Plata.</p>
            </div>
            <Link href="/servicios?availability=hoy" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductCarousel>
            {MOCK_SERVICES.slice(0, 10).map(service => (
              <div key={service.id} className="w-[82vw] max-w-[340px] sm:w-[320px] flex-none snap-start">
                <ServiceCard service={service} />
              </div>
            ))}
          </ProductCarousel>
        </section>

        {/* 7. PROFESIONALES VERIFICADOS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter flex items-center gap-3">
                Profesionales Verificados <Trophy className="w-7 h-7 text-amber-500" />
              </h2>
              <p className="text-sm text-slate-500 font-medium">Los mejores expertos con identidad y antecedentes validados.</p>
            </div>
            <Link href="/profesionales?verified=true" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all">
              Ver listado <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductCarousel>
            {MOCK_PROFESSIONALS.filter(p => p.verified).slice(0, 10).map(pro => (
              <div key={pro.id} className="w-[82vw] max-w-[320px] sm:w-[300px] flex-none snap-start">
                <ProfessionalCard professional={pro} />
              </div>
            ))}
          </ProductCarousel>
        </section>

        {/* 8. EMPRENDEDORES LOCALES */}
        <section className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Emprendedores de la Costa</h2>
              <p className="text-sm text-slate-500 font-medium">Productos artesanales y únicos fabricados en nuestra ciudad.</p>
            </div>
            <Link href="/productos?sellerType=emprendedor" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all">
              Explorar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductCarousel>
            {MOCK_PRODUCTS.filter(p => p.category === 'cat-8').slice(0, 12).map(product => (
              <div key={product.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>

        {/* 9. MÁS PRODUCTOS EN MDP */}
        <section className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Más productos para vos</h2>
              <p className="text-sm text-slate-500 font-medium">Seguí explorando el catálogo más grande de Mar del Plata.</p>
            </div>
            <Link href="/productos" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all">
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductCarousel>
            {MOCK_PRODUCTS.slice(12, 24).map(product => (
              <div key={product.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>

      </div>
    </main>
  );
}
