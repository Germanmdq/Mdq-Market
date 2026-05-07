import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

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
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .limit(limit);

  if (error) {
    console.error("Error loading products by category:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getRelatedProducts(product: Product, limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(limit);

  if (error) {
    console.error("Error loading related products:", error);
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

