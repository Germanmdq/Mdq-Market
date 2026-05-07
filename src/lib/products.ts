import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { getCategoryBySlug } from "@/lib/categories";

export async function getPublishedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 12) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .limit(limit);

  if (error) {
    console.error("Error loading featured products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getDailyDeals(limit = 12) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .or("featured_deal.eq.true,discount.gt.0")
    .limit(limit);

  if (error) {
    console.error("Error loading daily deals:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error loading product by slug:", error);
    return null;
  }

  return data as Product;
}

export async function getProductsByCategory(category: string, limit = 12) {
  const categoryRow = await getCategoryBySlug(category);

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .limit(limit);

  query = categoryRow?.id
    ? query.eq("category_id", categoryRow.id)
    : query.eq("category", category);

  const { data, error } = await query;

  if (error) {
    console.error("Error loading products by category:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getRelatedProducts(product: Product, limit = 8) {
  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .neq("id", product.id)
    .limit(limit);

  if (product.category_id) {
    query = query.eq("category_id", product.category_id);
  } else {
    query = query.eq("category", product.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading related products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductsBySeller(sellerProfileId?: string | null, limit = 8) {
  if (!sellerProfileId) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("seller_profile_id", sellerProfileId)
    .limit(limit);

  if (error) {
    console.error("Error loading seller products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading product by ID:", error);
    return null;
  }

  return data as Product;
}
