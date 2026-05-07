export type ProductCondition =
  | "new"
  | "used_like_new"
  | "used_good"
  | "used_with_details"
  | "refurbished";

export type SellerType =
  | "particular"
  | "commerce"
  | "entrepreneur";

export type ProductImages = {
  main?: string;
  side?: string;
  detail?: string;
  context?: string;
  gallery?: string[];
};

export type ProductMetadata = {
  sourceMode?: "original_catalog" | "authorized_copy";
  originalUrl?: string;
  authorization?: string;
  importedAt?: string;
};

export type Product = {
  id: string;

  seller_profile_id?: string | null;

  title: string;
  slug: string;

  category: string;
  subcategory?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;

  description?: string | null;

  price: number;
  old_price?: number | null;
  discount?: number | null;

  condition: ProductCondition;
  seller_type: SellerType;

  seller_name?: string | null;
  seller_verified: boolean;

  zone?: string | null;
  city: string;

  images: ProductImages;
  image_prompts?: Record<string, unknown>;

  tags?: string[];

  featured: boolean;
  featured_deal: boolean;

  protected_payment: boolean;
  mdp_delivery_available: boolean;

  stock: number;

  status: string;

  views?: number;
  sold_count?: number;

  metadata?: ProductMetadata;

  created_at: string;
  updated_at: string;
};
