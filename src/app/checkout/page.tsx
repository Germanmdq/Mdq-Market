"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Lock, MapPin, ShieldCheck, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getProductById } from "@/lib/products";
import { getProductMainImage } from "@/lib/product-images";
import { formatPrice, cn } from "@/lib/utils";
import { clearCart, DELIVERY_SLOTS, getCartItems, saveCartItems, type CartItem, type DeliverySlotId } from "@/lib/cart";
import { trackCheckoutStarted, trackDeliverySlotSelected, trackOperationCreated } from "@/lib/analytics";

const OPERATION_STATUSES = [
  "pendiente_pago",
  "pago_protegido",
  "vendedor_notificado",
  "disponibilidad_confirmada",
  "preparando_producto",
  "retiro_coordinado",
  "en_camino",
  "entregado",
  "finalizado",
  "cancelado",
] as const;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");
  const slotFromUrl = searchParams.get("slot") as DeliverySlotId | null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [zone, setZone] = useState("");
  const [address, setAddress] = useState("");
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlotId>(slotFromUrl ?? "hoy-16-19");

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      setError(null);
      try {
        let storedItems = getCartItems();
        if (productId && !storedItems.some((item) => item.productId === productId)) {
          const product = await getProductById(productId);
          if (product) {
            storedItems = [{ productId, quantity: 1, deliverySlot: slotFromUrl ?? "hoy-16-19", product }, ...storedItems];
            saveCartItems(storedItems);
          }
        }

        const hydrated = await Promise.all(
          storedItems.map(async (item) => ({
            ...item,
            product: item.product ?? (await getProductById(item.productId)) ?? undefined,
            deliverySlot: item.deliverySlot ?? slotFromUrl ?? "hoy-16-19",
          }))
        );
        const validItems = hydrated.filter((item) => item.product);
        setItems(validItems);
        saveCartItems(validItems);
        const value = validItems.reduce((acc, item) => acc + (item.product?.price ?? 0) * item.quantity, 0);
        trackCheckoutStarted(value, validItems.length);
      } catch {
        setError("No pudimos preparar el checkout.");
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, [productId, slotFromUrl]);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + (item.product?.price ?? 0) * item.quantity, 0),
    [items]
  );

  const canSubmit = buyerName.trim() && buyerPhone.trim() && zone.trim() && address.trim() && items.length > 0;

  const handleCreateOperation = async () => {
    if (!canSubmit) return;
    setIsProcessing(true);
    setError(null);
    trackDeliverySlotSelected(deliverySlot);

    const operationId = `MDP-${Date.now().toString().slice(-8)}`;
    const payload = {
      code: operationId,
      status: "pago_protegido_demo",
      allowed_statuses: OPERATION_STATUSES,
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      zone,
      address,
      delivery_slot: deliverySlot,
      total_amount: total,
      items: items.map((item) => ({
        product_id: item.productId,
        title: item.product?.title,
        price: item.product?.price,
        quantity: item.quantity,
        seller_profile_id: item.product?.seller_profile_id,
      })),
      protected_payment: true,
      mdp_delivery: true,
      created_at: new Date().toISOString(),
    };

    let finalId = operationId;
    try {
      const { data, error: insertError } = await supabase
        .from("operations")
        .insert(payload)
        .select("id, code")
        .single();

      if (!insertError && data) {
        finalId = data.code ?? data.id;
      }
    } catch {
      // If the table is not available yet, keep the functional local operation.
    }

    window.localStorage.setItem(`mdp-operation-${finalId}`, JSON.stringify(payload));
    clearCart();
    trackOperationCreated(finalId, total);
    router.push(`/operacion/${finalId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-950">No hay productos para comprar</h1>
          <p className="mt-2 text-sm text-slate-500">Agregá un producto al carrito para iniciar una operación protegida.</p>
          <Link href="/productos" className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-950">Operación protegida</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
          <div className="space-y-5">
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-5 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> 1. Datos del comprador
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Nombre y apellido" className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
                <input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="Teléfono de contacto" className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-5">2. Franja horaria para recibir</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {DELIVERY_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setDeliverySlot(slot.id);
                      trackDeliverySlotSelected(slot.id);
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      deliverySlot === slot.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" /> 3. Dirección dentro de Mar del Plata
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Zona o barrio" className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección exacta" className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              </div>
              <p className="mt-3 text-xs text-slate-500">La única modalidad de entrega es Entrega MDP coordinada localmente.</p>
            </section>

            <section className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-slate-950 mb-4">4. Confirmación de operación protegida</h2>
              <ol className="space-y-2 text-sm text-slate-700">
                <li>1. Pagás con operación protegida.</li>
                <li>2. El vendedor confirma disponibilidad.</li>
                <li>3. Coordinamos entrega en Mar del Plata.</li>
                <li>4. Recibís el producto.</li>
                <li>5. Confirmás recepción y se libera el pago.</li>
              </ol>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950 mb-5">5. Resumen</h3>
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                {items.map((item) => {
                  const product = item.product!;
                  return (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 shrink-0 overflow-hidden">
                        <img src={getProductMainImage(product)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-950 text-sm line-clamp-2">{product.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{formatPrice(product.price)} · x{item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3 mb-6 border-b border-slate-100 pb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Entrega MDP</span>
                  <span>Coordinar</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-7">
                <span className="text-base font-semibold text-slate-950">Total</span>
                <span className="text-3xl font-semibold tracking-tight text-slate-950">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleCreateOperation}
                disabled={!canSubmit || isProcessing}
                className="w-full bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Confirmar operación protegida</>}
              </button>
              <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                Estado inicial funcional: pago protegido demo, listo para integrar Mercado Pago o PayPal.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-semibold text-slate-400">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
