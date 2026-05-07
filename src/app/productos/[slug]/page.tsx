"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, ShieldCheck, Share2, Heart, MessageCircle,
  Zap, ChevronLeft, ChevronRight, CheckCircle2, Clock,
  Package, AlertTriangle, Flag, Copy, Eye, Bookmark,
  ChevronDown, ChevronUp, Truck, Store, Award, Send, ArrowRight
} from "lucide-react";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import { formatPrice, cn } from "@/lib/utils";
import ProductCard from "@/components/marketplace/ProductCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";

const STATUS_BUTTON: Record<string, { label: string; disabled: boolean }> = {
  Disponible: { label: "Comprar ahora", disabled: false },
  Reservado: { label: "Producto reservado", disabled: true },
  Vendido: { label: "Producto vendido", disabled: true },
  Pausado: { label: "Publicación pausada", disabled: true },
  "En revisión": { label: "No disponible", disabled: true },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  const [currentImage, setCurrentImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const category = CATEGORIES.find((c) => c.id === product.category);
  const subcategory = category?.subcategories.find((s) => s.id === product.subcategory);
  const similarProducts = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 15);
  const sellerProducts = MOCK_PRODUCTS.filter((p) => p.sellerId === product.sellerId && p.id !== product.id).slice(0, 15);
  const btn = STATUS_BUTTON[product.status] || STATUS_BUTTON.Disponible;
  const attrs = product.attributes || [];
  const visibleAttrs = showAllSpecs ? attrs : attrs.slice(0, 5);

  const handleCopyLink = () => { 
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href); 
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
    }
  };

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-20">
      {/* SECCIÓN SUPERIOR: Detalle Principal */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Breadcrumb */}
        <nav className="flex flex-wrap items-center text-xs text-slate-400 mb-6 gap-1.5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span>›</span>
          {category && <><Link href="/productos" className="hover:text-blue-600 transition-colors">{category.name}</Link><span>›</span></>}
          {subcategory && <><Link href="/productos" className="hover:text-blue-600 transition-colors">{subcategory.name}</Link><span>›</span></>}
          <span className="text-slate-600 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Grid de Detalle Superior */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═══ LEFT: Gallery + Description ═══ */}
          <div className="lg:col-span-7 space-y-8">
            {/* 2. Gallery */}
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3] bg-white group">
                {product.featured && (
                  <span className="absolute top-6 left-6 z-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">Destacado</span>
                )}
                {product.status === "Vendido" && (
                  <div className="absolute inset-0 bg-slate-950/40 z-10 flex items-center justify-center backdrop-blur-sm"><span className="text-white text-3xl font-black tracking-widest bg-slate-950/80 px-10 py-5 rounded-full border border-white/20">VENDIDO</span></div>
                )}
                <Image src={product.images[currentImage]} alt={product.title} fill className="object-contain p-8" />
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage((p) => (p - 1 + product.images.length) % product.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95"><ChevronLeft className="w-6 h-6" /></button>
                    <button onClick={() => setCurrentImage((p) => (p + 1) % product.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95"><ChevronRight className="w-6 h-6" /></button>
                    <span className="absolute bottom-6 right-6 bg-slate-950/80 text-white text-[10px] font-black px-4 py-2 rounded-full border border-white/10">{currentImage + 1} / {product.images.length}</span>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 p-6 overflow-x-auto bg-slate-50/50 no-scrollbar">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={cn("relative w-24 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all bg-white shadow-sm", currentImage === i ? "border-blue-600 scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100")}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 13. Specs Table */}
            {attrs.length > 0 && (
              <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
                <h2 className="text-2xl font-black text-slate-950 mb-8 tracking-tighter">Características principales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                  {visibleAttrs.map((a, i) => (
                    <div key={i} className="flex py-4 border-b border-slate-50 last:border-0 text-sm">
                      <span className="w-1/2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">{a.label}</span>
                      <span className="w-1/2 text-slate-900 font-black">{a.value}</span>
                    </div>
                  ))}
                </div>
                {attrs.length > 5 && (
                  <button onClick={() => setShowAllSpecs(!showAllSpecs)} className="mt-8 text-blue-600 text-[10px] font-black flex items-center gap-2 hover:text-blue-700 transition-colors uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-full w-fit">
                    {showAllSpecs ? <><ChevronUp className="w-4 h-4" /> Ver menos</> : <><ChevronDown className="w-4 h-4" /> Ver todas ({attrs.length})</>}
                  </button>
                )}
              </section>
            )}

            {/* 14. Description */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950 mb-8 tracking-tighter">Descripción</h2>
              <div className={cn("text-slate-600 leading-relaxed whitespace-pre-wrap text-[16px] font-medium", !showFullDesc && "line-clamp-[15]")}>
                {product.description}
              </div>
              {product.description.length > 800 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-8 text-blue-600 text-[10px] font-black hover:text-blue-700 transition-colors uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-full w-fit">
                  {showFullDesc ? "Ver menos" : "Ver descripción completa"}
                </button>
              )}
            </section>

            {/* 17. Preguntas */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950 mb-8 tracking-tighter">Preguntale al vendedor</h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Escribí tu pregunta..." className="flex-1 px-6 py-5 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400" />
                <button className="bg-slate-950 text-white px-10 py-5 rounded-full font-black text-[10px] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 shadow-xl shadow-slate-200">
                  <Send className="w-4 h-4" /> Preguntar
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-10 font-bold uppercase tracking-widest px-2">Protegemos tu privacidad y seguridad en cada paso.</p>
              
              {product.questions && product.questions.length > 0 && (
                <div className="space-y-8 border-t border-slate-50 pt-10">
                  {product.questions.map((q) => (
                    <div key={q.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-50">
                          {q.userName[0]}
                        </div>
                        <span className="text-xs font-black text-slate-900">{q.userName}</span>
                        <span className="text-[9px] text-slate-300 uppercase font-black tracking-widest">Hoy</span>
                      </div>
                      <p className="text-[15px] text-slate-600 font-medium pl-11">{q.question}</p>
                      {q.answer && (
                        <div className="flex gap-4 pl-11">
                           <div className="w-1 h-auto bg-blue-100 rounded-full shrink-0" />
                           <p className="text-[15px] text-blue-700 italic font-bold leading-relaxed">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ═══ RIGHT: Info + Actions ═══ */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* 4. Product Info */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{product.condition}</span>
                <span>|</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {product.views} visitas</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-950 mb-4 leading-[1.1] tracking-tighter">{product.title}</h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full text-amber-600 border border-amber-100">
                   <Star className="w-4 h-4 fill-amber-600" />
                   <span className="text-xs font-black">{product.sellerRating}</span>
                </div>
                {product.sellerVerified && (
                  <span className="text-[9px] font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Verificado
                  </span>
                )}
              </div>

              {/* 5. Precio */}
              <div className="mb-10">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-5xl font-black text-slate-950 tracking-tighter">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="text-2xl text-slate-300 line-through font-bold">{formatPrice(product.oldPrice)}</span>}
                </div>
                {product.discount && (
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest mt-2">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Ahorrás {product.discount}%
                  </div>
                )}
              </div>

              {/* 6. Pago protegido */}
              <div className="flex items-start gap-4 bg-blue-50/50 border border-blue-100 rounded-[1.5rem] p-6 mb-10">
                <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" strokeWidth={2.5} />
                <div>
                  <span className="text-sm font-black text-slate-950 block mb-1">Pago Protegido</span>
                  <span className="text-[11px] text-slate-500 font-bold leading-relaxed opacity-80">Retenemos el pago hasta que confirmes la recepción en Mar del Plata.</span>
                </div>
              </div>

              {/* 7. Botones */}
              <div className="space-y-4 mb-10">
                <Link href={btn.disabled ? "#" : `/checkout?type=product&id=${product.id}`}
                  className={cn("w-full py-5 rounded-full font-black text-center flex items-center justify-center gap-3 transition-all shadow-2xl uppercase tracking-[0.2em] text-[11px]",
                    btn.disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] shadow-blue-200"
                  )}>
                  <Zap className="w-5 h-5 fill-current" /> {btn.label}
                </Link>
                <button className="w-full py-4 rounded-full font-black text-slate-900 border-2 border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] active:scale-[0.98]">
                  <MessageCircle className="w-4 h-4" /> Consultar por chat
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setIsFav(!isFav)} className={cn("py-4 rounded-full font-black text-[10px] uppercase tracking-widest border-2 flex items-center justify-center gap-2 transition-all active:scale-[0.98]", isFav ? "border-red-100 text-red-600 bg-red-50" : "border-slate-100 text-slate-600 hover:bg-slate-50")}>
                    <Heart className={cn("w-4 h-4", isFav && "fill-red-500 text-red-500")} /> {isFav ? "Guardado" : "Favorito"}
                  </button>
                  <button onClick={handleCopyLink} className="py-4 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copiado</> : <><Share2 className="w-4 h-4" /> Compartir</>}
                  </button>
                </div>
              </div>

              {/* 8. Entrega MDP */}
              <div className="bg-slate-950 text-white rounded-[2rem] p-8 mb-10 shadow-2xl shadow-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Entrega MDP Express</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-[11px] font-bold"><span className="text-slate-400 italic">Envío a domicilio:</span><span className="text-white">{formatPrice(product.mdpDelivery.fee)}</span></div>
                  <div className="flex justify-between items-center text-[11px] font-bold"><span className="text-slate-400 italic">Tiempo entrega:</span><span className="text-white">{product.mdpDelivery.estimatedTime}</span></div>
                  <div className="flex justify-between items-center text-[11px] font-bold"><span className="text-slate-400 italic">Origen:</span><span className="text-white">{product.zone}</span></div>
                </div>
                <div className="pt-6 border-t border-white/10">
                   <p className="text-[10px] text-blue-400 font-black italic uppercase tracking-wider text-center">Garantía de Satisfacción 100%</p>
                </div>
              </div>

              {/* Vendedor Info */}
              <div className="border-t border-slate-50 pt-10">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Publicado por</h3>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`} 
                      alt={product.sellerName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-slate-900 tracking-tight">{product.sellerName}</span>
                      {product.sellerVerified && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.sellerType}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center"><span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Reputación</span><span className="text-base font-black text-slate-900 flex items-center justify-center gap-2"><Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {product.sellerRating}</span></div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center"><span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Ventas</span><span className="text-base font-black text-slate-900">{product.sellerSales || "150+"}</span></div>
                </div>
                <Link href={`/vendedores/${product.sellerId}`} className="w-full py-4 rounded-full font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
                  Ver catálogo completo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Seguridad Badge */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <ShieldCheck className="w-7 h-7 text-blue-600" strokeWidth={3} />
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Garantía MDP</h3>
              </div>
              <ul className="space-y-5">
                {[
                  "Tu dinero está protegido por MDP Market.",
                  "Soporte local en Mar del Plata.",
                  "Vendedor con identidad validada.",
                  "Devolución si el producto no coincide."
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4 text-xs text-slate-500 font-bold leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full text-center text-[10px] font-black text-slate-300 hover:text-red-500 transition-all flex items-center justify-center gap-2 py-6 uppercase tracking-widest">
              <Flag className="w-4 h-4" /> Reportar publicación
            </button>
          </div>
        </div>
      </div>

      {/* SECCIONES INFERIORES */}
      
      {similarProducts.length > 0 && (
        <MarketSection eyebrow="Recomendados" title="Productos similares" href={`/productos?category=${product.category}`} linkLabel="Ver más" className="bg-white border-t border-slate-100 mt-16">
          <MarketCarousel>
            {similarProducts.map((p: any) => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}

      {sellerProducts.length > 0 && (
        <MarketSection eyebrow="Vendedor" title={`Más de ${product.sellerName}`} href={`/vendedores/${product.sellerId}`} linkLabel="Ver catálogo" className="bg-slate-50 border-t border-slate-100">
          <MarketCarousel>
            {sellerProducts.map((p: any) => (
              <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]">
                <ProductCard product={p} />
              </div>
            ))}
          </MarketCarousel>
        </MarketSection>
      )}


    </main>
  );
}
