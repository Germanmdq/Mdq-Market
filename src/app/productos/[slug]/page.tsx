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
import { ProductCarousel } from "@/components/marketplace/ProductCarousel";

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

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-20">
      {/* SECCIÓN SUPERIOR: Detalle Principal */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Breadcrumb */}
        <nav className="flex flex-wrap items-center text-xs text-gray-400 mb-6 gap-1.5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span>›</span>
          {category && <><Link href="/productos" className="hover:text-blue-600 transition-colors">{category.name}</Link><span>›</span></>}
          {subcategory && <><Link href="/productos" className="hover:text-blue-600 transition-colors">{subcategory.name}</Link><span>›</span></>}
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Grid de Detalle Superior */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═══ LEFT: Gallery + Description ═══ */}
          <div className="lg:col-span-7 space-y-8">
            {/* 2. Gallery */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3] bg-white group">
                {product.featured && (
                  <span className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg">Destacado</span>
                )}
                {product.status === "Vendido" && (
                  <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center"><span className="text-white text-2xl font-black">VENDIDO</span></div>
                )}
                <Image src={product.images[currentImage]} alt={product.title} fill className="object-contain p-6" />
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage((p) => (p - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => setCurrentImage((p) => (p + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronRight className="w-5 h-5" /></button>
                    <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full">{currentImage + 1} / {product.images.length}</span>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50/50">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={cn("relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-white", currentImage === i ? "border-blue-600 scale-105" : "border-slate-200 opacity-60 hover:opacity-100")}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 13. Specs Table */}
            {attrs.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-950 mb-6">Características principales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                  {visibleAttrs.map((a, i) => (
                    <div key={i} className="flex py-3.5 border-b border-slate-50 last:border-0 text-sm">
                      <span className="w-1/2 text-slate-500 font-medium">{a.label}</span>
                      <span className="w-1/2 text-slate-900 font-bold">{a.value}</span>
                    </div>
                  ))}
                </div>
                {attrs.length > 5 && (
                  <button onClick={() => setShowAllSpecs(!showAllSpecs)} className="mt-6 text-blue-600 text-sm font-black flex items-center gap-1 hover:underline uppercase tracking-wider">
                    {showAllSpecs ? <><ChevronUp className="w-4 h-4" /> Ver menos</> : <><ChevronDown className="w-4 h-4" /> Ver todas ({attrs.length})</>}
                  </button>
                )}
              </section>
            )}

            {/* 14. Description */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-950 mb-6">Descripción</h2>
              <div className={cn("text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]", !showFullDesc && "line-clamp-[12]")}>
                {product.description}
              </div>
              {product.description.length > 500 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-6 text-blue-600 text-sm font-black hover:underline uppercase tracking-wider">
                  {showFullDesc ? "Ver menos" : "Ver descripción completa"}
                </button>
              )}
            </section>

            {/* 17. Preguntas */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-950 mb-6">Preguntale al vendedor</h2>
              <div className="flex gap-3 mb-6">
                <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Escribí tu pregunta..." className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95"><Send className="w-4 h-4" />Preguntar</button>
              </div>
              <p className="text-xs text-slate-400 mb-8 font-medium">Por seguridad, no compartas datos de contacto. MDP Market protege tus pagos.</p>
              {product.questions && product.questions.length > 0 && (
                <div className="space-y-6 border-t border-slate-100 pt-8">
                  {product.questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{q.userName}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Hoy</span>
                      </div>
                      <p className="text-[15px] text-slate-600 pl-1">{q.question}</p>
                      {q.answer && (
                        <div className="flex gap-3 pl-4 border-l-2 border-blue-200">
                           <p className="text-[15px] text-blue-700 italic font-medium leading-relaxed">{q.answer}</p>
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
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{product.condition}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{product.views} visitas</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-950 mb-2 leading-tight tracking-tighter">{product.title}</h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-600">
                   <Star className="w-4 h-4 fill-amber-600" />
                   <span className="text-sm font-black">{product.sellerRating}</span>
                </div>
                {product.sellerVerified && <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100">Vendedor Verificado</span>}
              </div>

              {/* 5. Precio */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-black text-slate-950 tracking-tighter">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="text-xl text-slate-400 line-through font-medium">{formatPrice(product.oldPrice)}</span>}
                </div>
                {product.discount && <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">Ahorrás {product.discount}%</span>}
                <p className="text-xs text-slate-400 mt-3 font-medium">IVA incluido (donde corresponda)</p>
              </div>

              {/* 6. Pago protegido */}
              <div className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8">
                <ShieldCheck className="w-7 h-7 text-blue-600 shrink-0" strokeWidth={2.5} />
                <div>
                  <span className="text-sm font-black text-slate-950 block mb-1">Pago Protegido</span>
                  <span className="text-xs text-slate-500 font-medium leading-relaxed">MDP Market retiene el pago hasta que confirmes que recibiste el producto en condiciones.</span>
                </div>
              </div>

              {/* 7. Botones */}
              <div className="space-y-3 mb-8">
                <Link href={btn.disabled ? "#" : `/checkout?type=product&id=${product.id}`}
                  className={cn("w-full py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm",
                    btn.disabled ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]"
                  )}>
                  <Zap className="w-5 h-5 fill-current" />{btn.label}
                </Link>
                <button className="w-full py-4 rounded-2xl font-black text-blue-600 border-2 border-blue-100 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest active:scale-[0.98]">
                  <MessageCircle className="w-4 h-4" />Consultar por chat
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setIsFav(!isFav)} className={cn("flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 flex items-center justify-center gap-2 transition-all active:scale-[0.98]", isFav ? "border-red-100 text-red-600 bg-red-50" : "border-slate-100 text-slate-600 hover:bg-slate-50")}>
                    <Heart className={cn("w-4 h-4", isFav && "fill-red-500 text-red-500")} />{isFav ? "Guardado" : "Favorito"}
                  </button>
                  <button onClick={handleCopyLink} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-slate-100 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    {copied ? <><CheckCircle2 className="w-4 h-4 text-green-500" />Copiado</> : <><Share2 className="w-4 h-4" />Compartir</>}
                  </button>
                </div>
              </div>

              {/* 8. Entrega MDP */}
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-6 h-6 text-green-700" />
                  <span className="text-sm font-black text-green-800 uppercase tracking-widest">Entrega MDP</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center"><span className="text-slate-500 font-medium italic">Envío a domicilio:</span><span className="font-black text-slate-900">{formatPrice(product.mdpDelivery.fee)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 font-medium italic">Tiempo entrega:</span><span className="font-bold text-slate-900">{product.mdpDelivery.estimatedTime}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 font-medium italic">Zona de origen:</span><span className="font-bold text-slate-900">{product.zone}</span></div>
                </div>
                <p className="text-[10px] text-green-600 mt-4 pt-4 border-t border-green-200/50 font-bold italic leading-tight">Compromiso MDP Market: Entrega 100% segura o devolvemos tu dinero.</p>
              </div>

              {/* Vendedor Info Compact */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Información del vendedor</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100"><Store className="w-8 h-8 text-slate-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">{product.sellerName}</span>
                      {product.sellerVerified && <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50" />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.sellerType}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reputación</span><span className="font-black text-slate-900 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />{product.sellerRating}</span></div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ventas</span><span className="font-black text-slate-900">{product.sellerSales || 0}</span></div>
                </div>
                <Link href={`/vendedores/${product.sellerId}`} className="w-full mt-4 py-4 rounded-xl font-black text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">Ver perfil completo <ArrowRight className="w-3 h-3" /></Link>
              </div>
            </div>

            {/* Seguridad Badge */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest">Compra Segura</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Tu dinero está protegido por MDP Market.",
                  "Soporte local en Mar del Plata.",
                  "Vendedor con identidad validada.",
                  "Devolución si el producto no coincide."
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-500 font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full text-center text-[10px] font-black text-slate-300 hover:text-red-400 transition-all flex items-center justify-center gap-2 py-4 uppercase tracking-[0.2em]">
              <Flag className="w-3.5 h-3.5" /> Reportar publicación
            </button>
          </div>
        </div>
      </div>

      {/* SECCIONES INFERIORES: Carruseles */}
      
      {/* 1. Productos similares */}
      {similarProducts.length > 0 && (
        <section className="w-full bg-slate-50 border-t border-slate-100 mt-16">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter">
                  Productos similares
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Otras publicaciones que pueden interesarte en {category?.name}.
                </p>
              </div>

              <Link href={`/productos?category=${product.category}`} className="hidden sm:inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-[0.2em] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                Ver más <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ProductCarousel>
              {similarProducts.map((p: any) => (
                <div key={p.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* 2. Más de este vendedor */}
      {sellerProducts.length > 0 && (
        <section className="w-full bg-white border-t border-slate-100">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter">
                  Más de {product.sellerName}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Descubrí todos los productos de este vendedor.
                </p>
              </div>

              <Link href={`/vendedores/${product.sellerId}`} className="hidden sm:inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-[0.2em] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                Ver catálogo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ProductCarousel>
              {sellerProducts.map((p: any) => (
                <div key={p.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* 3. También te puede interesar (Random) */}
      <section className="w-full bg-slate-50 border-t border-slate-100">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter">
              También te puede interesar
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Tendencias en Mar del Plata hoy.
            </p>
          </div>

          <ProductCarousel>
            {MOCK_PRODUCTS.slice(10, 25).map((p: any) => (
              <div key={p.id} className="w-[82vw] max-w-[300px] sm:w-[280px] flex-none snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </ProductCarousel>
        </div>
      </section>

    </main>
  );
}
