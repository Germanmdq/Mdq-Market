"use client";

import type { Product } from "@/types/product";

export const DELIVERY_SLOTS = [
  { id: "hoy-16-19", label: "Hoy 16 a 19" },
  { id: "manana-10-13", label: "Mañana 10 a 13" },
  { id: "manana-16-19", label: "Mañana 16 a 19" },
  { id: "coordinar-chat", label: "Coordinar por chat" },
] as const;

export type DeliverySlotId = (typeof DELIVERY_SLOTS)[number]["id"];

export type CartItem = {
  productId: string;
  quantity: number;
  deliverySlot?: DeliverySlotId;
  product?: Product;
};

const CART_KEY = "mdp-market-cart";
const RECENT_KEY = "mdp-market-recent-products";
const LAST_CATEGORY_KEY = "mdp-market-last-category";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("mdp-cart-updated"));
}

export function getCartItems() {
  return readJson<CartItem[]>(CART_KEY, []);
}

export function saveCartItems(items: CartItem[]) {
  writeJson(CART_KEY, items);
}

export function addToCart(product: Product, deliverySlot?: DeliverySlotId) {
  const items = getCartItems();
  const existing = items.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += 1;
    existing.deliverySlot = deliverySlot ?? existing.deliverySlot;
    existing.product = product;
  } else {
    items.push({ productId: product.id, quantity: 1, deliverySlot, product });
  }

  saveCartItems(items);
  return items;
}

export function removeFromCart(productId: string) {
  const next = getCartItems().filter((item) => item.productId !== productId);
  saveCartItems(next);
  return next;
}

export function clearCart() {
  saveCartItems([]);
}

export function rememberProductView(product: Product) {
  if (typeof window === "undefined") return;
  const recent = readJson<Product[]>(RECENT_KEY, []).filter((item) => item.id !== product.id);
  writeJson(RECENT_KEY, [product, ...recent].slice(0, 12));
  if (product.category_id || product.category) {
    window.localStorage.setItem(
      LAST_CATEGORY_KEY,
      JSON.stringify({
        id: product.category_id ?? null,
        slug: product.category,
        name: product.category,
      })
    );
  }
}

export function getRecentlyViewedProducts() {
  return readJson<Product[]>(RECENT_KEY, []);
}

export function getLastVisitedCategory() {
  return readJson<{ id: string | null; slug: string; name: string } | null>(LAST_CATEGORY_KEY, null);
}
