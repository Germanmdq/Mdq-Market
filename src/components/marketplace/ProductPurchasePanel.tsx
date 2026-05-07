"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { addToCart, DELIVERY_SLOTS, rememberProductView, type DeliverySlotId } from "@/lib/cart";
import { trackActivity } from "@/lib/activity";
import { trackDeliverySlotSelected, trackProductAddedToCart, trackProductViewed } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function ProductPurchasePanel({
  product,
  disabled,
  buttonLabel,
}: {
  product: Product;
  disabled: boolean;
  buttonLabel: string;
}) {
  const [slot, setSlot] = useState<DeliverySlotId>("hoy-16-19");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    rememberProductView(product);
    trackProductViewed(product);
    trackActivity({
      event_type: "product_view",
      entity_type: "product",
      entity_id: product.id,
      title: product.title,
      slug: product.slug,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
      metadata: {
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        zone: product.zone,
      },
    });
  }, [product]);

  const handleSlot = (value: DeliverySlotId) => {
    setSlot(value);
    trackDeliverySlotSelected(value);
  };

  const handleAdd = () => {
    addToCart(product, slot);
    trackProductAddedToCart({ id: product.id, title: product.title, price: product.price, quantity: 1 });
    trackActivity({
      event_type: "add_to_cart",
      entity_type: "cart",
      entity_id: product.id,
      title: product.title,
      slug: product.slug,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
      metadata: { delivery_slot: slot, price: product.price },
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-950">¿Cuándo podés recibirlo?</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DELIVERY_SLOTS.map((deliverySlot) => (
            <button
              key={deliverySlot.id}
              type="button"
              onClick={() => handleSlot(deliverySlot.id)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors",
                slot === deliverySlot.id
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              )}
            >
              {deliverySlot.label}
            </button>
          ))}
        </div>
      </div>

      <Link
        href={disabled ? "#" : `/checkout?type=product&id=${product.id}&slot=${slot}`}
        className={cn(
          "h-12 rounded-full font-semibold text-center flex items-center justify-center transition-colors text-sm",
          disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800 text-white"
        )}
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
      >
        {buttonLabel}
      </Link>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="h-12 rounded-full font-semibold text-slate-950 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "Agregado" : "Agregar"}
        </button>
        <Link
          href={`/chat?product=${product.id}`}
          className="h-12 rounded-full font-semibold text-slate-950 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          Consultar
        </Link>
        <button className="h-12 w-12 rounded-full border border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-colors text-slate-500 hover:text-red-500">
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
