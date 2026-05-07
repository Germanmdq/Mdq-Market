"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductById } from "@/lib/products";
import { getProductMainImage } from "@/lib/product-images";
import { DELIVERY_SLOTS, getCartItems, removeFromCart, saveCartItems, type CartItem, type DeliverySlotId } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCart() {
    setLoading(true);
    setError(null);
    try {
      const storedItems = getCartItems();
      const hydrated = await Promise.all(
        storedItems.map(async (item) => ({
          ...item,
          product: item.product ?? (await getProductById(item.productId)) ?? undefined,
        }))
      );
      const validItems = hydrated.filter((item) => item.product);
      saveCartItems(validItems);
      setItems(validItems);
    } catch {
      setError("No pudimos cargar tu carrito.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(loadCart);
  }, []);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + (item.product?.price ?? 0) * item.quantity, 0),
    [items]
  );

  const updateSlot = (productId: string, deliverySlot: DeliverySlotId) => {
    const next = items.map((item) => item.productId === productId ? { ...item, deliverySlot } : item);
    setItems(next);
    saveCartItems(next);
  };

  const handleRemove = (id: string) => {
    const next = removeFromCart(id);
    setItems(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1120px] mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 mb-8">Tu carrito</h1>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">
            <p className="font-semibold text-slate-950">{error}</p>
            <button onClick={loadCart} className="mt-4 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950 mb-3">Tu carrito está vacío</h2>
            <p className="text-slate-500 mb-8">Descubrí productos locales y agregalos acá.</p>
            <Link href="/productos" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 font-semibold text-white transition hover:bg-slate-800">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8 items-start">
            <div className="space-y-4">
              {items.map((item) => {
                const product = item.product!;
                return (
                  <div key={item.productId} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm grid gap-5 sm:grid-cols-[96px_1fr_auto]">
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 relative">
                      <Image src={getProductMainImage(product)} alt={product.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-950 line-clamp-2">{product.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{product.seller_name || "Vendedor local"} · {product.zone || product.city}</p>
                      <label className="mt-4 block text-xs font-semibold text-slate-500">Franja para recibir</label>
                      <select
                        value={item.deliverySlot ?? "hoy-16-19"}
                        onChange={(event) => updateSlot(item.productId, event.target.value as DeliverySlotId)}
                        className="mt-1 h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                      >
                        {DELIVERY_SLOTS.map((slot) => (
                          <option key={slot.id} value={slot.id}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                      <p className="text-xl font-semibold text-slate-950">{formatPrice(product.price * item.quantity)}</p>
                      <button onClick={() => handleRemove(item.productId)} className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950 mb-5">Resumen</h2>
                <div className="space-y-3 mb-6 border-b border-slate-100 pb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Productos ({items.length})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Entrega MDP</span>
                    <span>A coordinar</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-7">
                  <span className="text-base font-semibold text-slate-950">Total</span>
                  <span className="text-3xl font-semibold tracking-tight text-slate-950">{formatPrice(total)}</span>
                </div>
                <Link href="/checkout" className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2 mb-4">
                  Iniciar checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    La operación protegida retiene el pago hasta que confirmes recepción.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
