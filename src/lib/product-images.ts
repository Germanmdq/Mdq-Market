import type { Product } from "@/types/product";

export function getProductMainImage(product: Product) {
  return (
    product.images?.main ||
    product.images?.gallery?.[0] ||
    "/fallbacks/producto.jpg"
  );
}

export function getProductGallery(product: Product) {
  const images = [
    product.images?.main,
    product.images?.side,
    product.images?.detail,
    product.images?.context,
    ...(product.images?.gallery ?? []),
  ].filter(Boolean) as string[];

  return Array.from(new Set(images));
}
