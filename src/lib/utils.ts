import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { Product } from "@/types";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

const fallbackByCategory: Record<string, string> = {
  "Tecnología y celulares": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
  "Electrodomésticos": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
  "Hogar y muebles": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
  "Herramientas y construcción": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
  "Indumentaria y accesorios": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
  "Bebés, niños y juguetes": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=600&auto=format&fit=crop",
  "Bicicletas y movilidad": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop",
  "Emprendedores locales": "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=600&auto=format&fit=crop",
  "Comercios locales": "https://images.unsplash.com/photo-1534723452862-4c874e70d6f3?q=80&w=600&auto=format&fit=crop",
  "Decoración y jardín": "https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=600&auto=format&fit=crop",
};

export function getProductImage(product: Product) {
  return (
    product.images?.[0] ||
    fallbackByCategory[product.category] ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
  );
}
