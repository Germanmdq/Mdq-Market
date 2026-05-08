import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, ShieldCheck, Truck, ArrowRight, PackageCheck, MapPin
} from "lucide-react";
import { getProductBySlug, getRelatedProducts, getProductsBySeller } from "@/lib/products";
import { getProductGallery, getProductMainImage } from "@/lib/product-images";
import ProductCard from "@/components/marketplace/ProductCard";
import { formatPrice, cn } from "@/lib/utils";
import ProductPurchasePanel from "@/components/marketplace/ProductPurchasePanel";
import { tagHref, toTitleLabel } from "@/lib/labels";
import { FAQSection, FinalCTASection, StepsExplainer, panelClass } from "@/components/marketplace/detail/DetailContinuity";

const STATUS_BUTTON: Record<string, { label: string; disabled: boolean }> = {
  published: { label: "Comprar ahora", disabled: false },
  sold: { label: "Vendido", disabled: true },
  reserved: { label: "Reservado", disabled: true },
  paused: { label: "Pausado", disabled: true },
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const gallery = getProductGallery(product);
  const mainImage = getProductMainImage(product);
  const [relatedProducts, sellerProducts] = await Promise.all([
    getRelatedProducts(product, 8),
    getProductsBySeller(product.seller_profile_id, 8),
  ]);
  
  const btn = STATUS_BUTTON[product.status] || STATUS_BUTTON.published;
  const conditionLabel = toTitleLabel(product.condition);

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center text-sm text-slate-500 mb-8 gap-2">
          <Link href="/" className="hover:text-slate-950 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-slate-950 transition-colors">Productos</Link>
          <span>/</span>
          <Link href={`/productos?category=${product.category}`} className="hover:text-slate-950 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-slate-950 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          
          {/* ═══ LEFT: Gallery ═══ */}
          <section className="min-w-0 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.10)] lg:hidden">
              <p className="text-sm font-medium text-slate-500">{product.subcategory || product.category}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{product.title}</h1>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">{formatPrice(product.price)}</span>
                {product.old_price && <span className="mb-1 text-xl font-medium text-slate-400 line-through">{formatPrice(product.old_price)}</span>}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.16)] group">
              {product.status === "sold" && (
                <div className="absolute inset-0 bg-slate-950/40 z-10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-lg font-semibold tracking-widest bg-slate-950 px-6 py-3 rounded-full">VENDIDO</span>
                </div>
              )}
              
              <img 
                src={mainImage} 
                alt={product.title} 
                className="aspect-[4/3] h-full w-full rounded-[inherit] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              
              {product.discount ? (
                <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                  {product.discount}% OFF
                </span>
              ) : null}
            </div>
            
            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {gallery.map((img, i) => (
                  <div key={i} className={cn("relative w-20 h-20 rounded-2xl overflow-hidden border shrink-0 transition-all bg-slate-50 shadow-sm", i === 0 ? "border-slate-950" : "border-slate-200 hover:border-slate-400")}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-slate-400" />
                  Stock: {product.stock > 0 ? `${product.stock} disponible${product.stock === 1 ? "" : "s"}` : "sin stock"}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  Zona: {product.zone || product.city}
                </span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                Descripción
              </h2>
              <div className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-wrap">
                {product.description || "Sin descripción disponible."}
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <Link
                      key={`${tag}-${i}`}
                      href={tagHref(tag)}
                      className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
                    >
                      {toTitleLabel(tag)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ═══ RIGHT: Info Panel ═══ */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">{product.subcategory || product.category}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 mb-4 leading-tight">{product.title}</h1>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">{formatPrice(product.price)}</span>
                {product.old_price && <span className="text-xl text-slate-400 line-through font-medium mb-1">{formatPrice(product.old_price)}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {product.mdp_delivery_available && (
                  <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">Entrega MDP</span>
                )}
                {product.protected_payment && (
                  <span className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">Pago protegido</span>
                )}
                <span className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">{conditionLabel}</span>
              </div>
            </div>

            <ProductPurchasePanel product={product} disabled={btn.disabled} buttonLabel={btn.label} />

            {/* Seller & Safety */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="rounded-3xl border border-slate-200 p-6 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-md">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller_name || "Vendedor"}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Vendedor</p>
                  <p className="text-lg font-semibold text-slate-950">{product.seller_name || "Vendedor local"}</p>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> 4.8 · {product.zone || product.city}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">{toTitleLabel(product.seller_type)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
                <p className="text-sm font-semibold text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> Compra protegida
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Tu dinero está seguro. Retenemos el pago hasta que confirmes la recepción del producto.
                </p>
              </div>
              
              {product.mdp_delivery_available && (
                <div className="rounded-3xl border border-slate-200 p-5 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
                  <p className="text-sm font-semibold text-slate-950 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" /> Entrega MDP
                  </p>
                  <div className="mt-2 text-sm text-slate-500 space-y-1">
                    <p>Coordinación local dentro de Mar del Plata.</p>
                    <p>No usamos métodos de envío externos.</p>
                  </div>
                </div>
              )}
            </div>
            </div>
          </aside>
        </div>

        <section className="mt-8 space-y-6">
          <StepsExplainer
            title="Cómo funciona esta compra"
            steps={[
              "Elegís el producto.",
              "Indicás cuándo podés recibirlo.",
              "El vendedor confirma disponibilidad.",
              "MDP coordina la entrega.",
              "Confirmás recepción.",
            ]}
          />

          {relatedProducts.length > 0 && (
            <section className={panelClass}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Más de esta categoría</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Productos relacionados</h2>
                  <p className="mt-2 text-sm text-slate-500">Opciones similares disponibles en Mar del Plata.</p>
                </div>
                <Link href={`/productos?category=${product.category}`} className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex">
                  Ver todos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.slice(0, 8).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {sellerProducts.filter((p) => p.id !== product.id).length > 0 && (
            <section className={panelClass}>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Más del vendedor</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{product.seller_name || "Vendedor local"}</h2>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {sellerProducts.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          <FAQSection
            items={[
              { question: "¿Cómo funciona la entrega MDP?", answer: "La coordinación se hace dentro de Mar del Plata, sin métodos de envío externos." },
              { question: "¿Cuándo se libera el pago?", answer: "El pago se libera cuando confirmás que recibiste el producto correctamente." },
              { question: "¿Puedo coordinar horario?", answer: "Sí. La franja horaria se confirma durante checkout o por chat protegido." },
              { question: "¿Qué pasa si el producto no coincide?", answer: "La operación queda registrada y el soporte puede intervenir antes de liberar el pago." },
            ]}
          />

          <FinalCTASection
            title="Comprá con entrega coordinada en Mar del Plata."
            description="Elegí horario, confirmá recepción y operá con pago protegido dentro de MDP Market."
            primaryHref={`/checkout?type=product&id=${product.id}`}
            primaryLabel="Comprar ahora"
            secondaryHref="/productos"
            secondaryLabel="Seguir viendo productos"
          />
        </section>
      </div>

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
