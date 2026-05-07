const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export type ProductImages = {
  main?: string;
  side?: string;
  detail?: string;
  context?: string;
  gallery?: string[];
};

function parseImages(images: unknown): ProductImages {
  if (!images) return {};

  if (typeof images === "string") {
    try {
      return JSON.parse(images) as ProductImages;
    } catch {
      return {};
    }
  }

  if (typeof images === "object") {
    return images as ProductImages;
  }

  return {};
}

function isAbsoluteUrl(value?: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function normalizeStoragePath(path?: string | null) {
  if (!path) return null;

  if (isAbsoluteUrl(path)) return path;

  const cleanPath = path.replace(/^\/+/, "");

  if (!SUPABASE_URL) return `/${cleanPath}`;

  // Si el path ya contiene "storage/v1/object/public", es una URL absoluta mal formada o parcial
  if (path.includes("storage/v1/object/public")) {
      // Intentar extraer el path relativo si es posible, o devolver como está si empieza con /
      return path.startsWith("http") ? path : `${SUPABASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
}

export function getProductMainImage(product: any) {
  if (!product) return "/fallbacks/producto.svg";
  
  const images = parseImages(product.images);

  const raw =
    images.main ||
    images.gallery?.[0] ||
    images.side ||
    images.detail ||
    images.context ||
    null;

  const resolved = normalizeStoragePath(raw);
  
  return resolved || "/fallbacks/producto.svg";
}

export function getProductGallery(product: any) {
  if (!product) return [];
  
  const images = parseImages(product.images);

  const rawImages = [
    images.main,
    images.side,
    images.detail,
    images.context,
    ...(images.gallery ?? []),
  ].filter(Boolean) as string[];

  return Array.from(
    new Set(
      rawImages
        .map((image) => normalizeStoragePath(image))
        .filter(Boolean) as string[]
    )
  );
}
