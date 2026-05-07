import type { Product } from "@/types/product";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function isAbsoluteUrl(value?: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function normalizeStoragePath(path?: string | null) {
  if (!path) return null;

  if (isAbsoluteUrl(path)) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, "");

  if (!SUPABASE_URL) {
    return `/${cleanPath}`;
  }

  // Si viene como "products/slug/main.svg", eso es bucket/path.
  // La URL pública correcta es:
  // https://PROJECT.supabase.co/storage/v1/object/public/products/slug/main.svg
  return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
}

export function getProductMainImage(product: Product) {
  const raw =
    product.images?.main ||
    product.images?.gallery?.[0] ||
    product.images?.side ||
    product.images?.detail ||
    product.images?.context ||
    null;

  return normalizeStoragePath(raw) || "/fallbacks/producto.svg";
}

export function getProductGallery(product: Product) {
  const rawImages = [
    product.images?.main,
    product.images?.side,
    product.images?.detail,
    product.images?.context,
    ...(product.images?.gallery ?? []),
  ].filter(Boolean) as string[];

  const normalized = rawImages
    .map((image) => normalizeStoragePath(image))
    .filter(Boolean) as string[];

  return Array.from(new Set(normalized));
}
