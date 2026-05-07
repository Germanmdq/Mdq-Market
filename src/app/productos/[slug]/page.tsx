"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, ShieldCheck, Heart, Zap, ChevronLeft, ChevronRight, CheckCircle2,
  Flag, Truck, ArrowRight
} from "lucide-react";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import { formatPrice, cn } from "@/lib/utils";
import ProductCard from "@/components/marketplace/ProductCard";

const STATUS_BUTTON: Record<string, { label: string; disabled: boolean }> = {
  Disponible: { label: "Comprar ahora", disabled: false },
  Reservado: { label: "Reservado", disabled: true },
  Vendido: { label: "Vendido", disabled: true },
  Pausado: { label: "Pausado", disabled: true },
  "En revisión": { label: "No disponible", disabled: true },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  const [currentImage, setCurrentImage] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const category = CATEGORIES.find((c) => c.id === product.category);
  const subcategory = category?.subcategories.find((s) => s.id === product.subcategory);
  const similarProducts = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const sellerProducts = MOCK_PRODUCTS.filter((p) => p.sellerId === product.sellerId && p.id !== product.id).slice(0, 4);
  const btn = STATUS_BUTTON[product.status] || STATUS_BUTTON.Disponible;

  return (
    <main className="w-full bg-white min-h-screen">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center text-sm text-slate-500 mb-8 gap-2">
          <Link href="/" className="hover:text-slate-950 transition-colors">Inicio</Link>
          <span>/</span>
          {category && <><Link href="/productos" className="hover:text-slate-950 transition-colors">{category.name}</Link><span>/</span></>}
          {subcategory && <><Link href="/productos" className="hover:text-slate-950 transition-colors">{subcategory.name}</Link><span>/</span></>}
          <span className="text-slate-950 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 items-start">
          
          {/* ═══ LEFT: Gallery ═══ */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden group">
              {product.status === "Vendido" && (
                <div className="absolute inset-0 bg-slate-950/40 z-10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-lg font-semibold tracking-widest bg-slate-950 px-6 py-3 rounded-full">VENDIDO</span>
                </div>
              )}
              
              <Image 
                src={product.images[currentImage] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"} 
                alt={product.title} 
                fill 
                className="object-contain p-4 transition-transform duration-500" 
              />
              
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage((p) => (p - 1 + product.images.length) % product.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 border border-slate-200 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-105">
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <button onClick={() => setCurrentImage((p) => (p + 1) % product.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 border border-slate-200 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-105">
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                </>
              )}
              
              {product.discount ? (
                <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                  {product.discount}% OFF
                </span>
              ) : null}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={cn("relative w-20 h-20 rounded-xl overflow-hidden border shrink-0 transition-all bg-slate-50", currentImage === i ? "border-slate-950" : "border-slate-200 hover:border-slate-400")}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Info Panel ═══ */}
          <aside className="lg:sticky lg:top-28 space-y-8">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">{subcategory?.name || category?.name || "Producto"}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 mb-4 leading-tight">{product.title}</h1>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-xl text-slate-400 line-through font-medium mb-1">{formatPrice(product.oldPrice)}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {product.mdpDelivery?.available && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">Entrega MDP</span>
                )}
                {product.protectedPayment && (
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">Pago protegido</span>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{product.condition}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-3">
              <Link href={btn.disabled ? "#" : `/checkout?type=product&id=${product.id}`}
                className={cn("h-12 rounded-full font-semibold text-center flex items-center justify-center transition-colors text-sm",
                  btn.disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800 text-white"
                )}>
                {btn.label}
              </Link>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <button className="h-12 rounded-full font-semibold text-slate-950 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center text-sm">
                  Agregar al carrito
                </button>
                <button onClick={() => setIsFav(!isFav)} className="h-12 w-12 rounded-full border border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-colors text-slate-500 hover:text-red-500">
                  <Heart className={cn("w-5 h-5", isFav && "fill-red-500 text-red-500")} />
                </button>
              </div>
            </div>

            {/* Seller & Safety */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`} alt={product.sellerName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Vendedor</p>
                  <p className="text-sm font-semibold text-slate-950">{product.sellerName}</p>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {product.sellerRating} · {product.zone}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
                <p className="text-sm font-semibold text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> Compra protegida
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Tu dinero está seguro. Retenemos el pago hasta que confirmes la recepción del producto.
                </p>
              </div>
              
              {product.mdpDelivery?.available && (
                <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
                  <p className="text-sm font-semibold text-slate-950 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" /> Entrega MDP
                  </p>
                  <div className="mt-2 text-sm text-slate-500 space-y-1">
                    <p>Envío local: <span className="font-medium text-slate-950">{formatPrice(product.mdpDelivery.fee)}</span></p>
                    <p>Tiempo: <span className="font-medium text-slate-950">{product.mdpDelivery.estimatedTime}</span></p>
                  </div>
                </div>
              )}
            </div>

          </aside>
        </div>
      </div>

      {/* ═══ DETALLES DEL PRODUCTO ═══ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Detalles del producto
              </h2>
            </div>
            <div className="space-y-10">
              
              {/* Description */}
              <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                {product.description}
              </div>

              {/* Attributes */}
              {product.attributes && product.attributes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-950 mb-4">Especificaciones</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-sm">
                    {product.attributes.map((a, i) => (
                      <div key={i} className={cn("flex px-4 py-3", i % 2 === 0 ? "bg-slate-50" : "bg-white")}>
                        <span className="w-1/2 font-medium text-slate-500">{a.label}</span>
                        <span className="w-1/2 font-medium text-slate-950">{a.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTOS RELACIONADOS ═══ */}
      {similarProducts.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Productos relacionados
              </h2>
              <Link href={`/productos?category=${product.category}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ MÁS DEL VENDEDOR ═══ */}
      {sellerProducts.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Más de {product.sellerName}
              </h2>
              <Link href={`/vendedores/${product.sellerId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sellerProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Buy Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-4 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Link href={btn.disabled ? "#" : `/checkout?type=product&id=${product.id}`}
          className={cn("h-12 w-full rounded-full font-semibold text-center flex items-center justify-center transition-colors text-sm",
            btn.disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800 text-white"
          )}>
          {btn.label}
        </Link>
      </div>

    </main>
  );
}
