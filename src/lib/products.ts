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
  const seen = new Set<string>();
  const results: Product[] = [];

  const append = (items: Product[]) => {
    for (const item of items) {
      if (item.id === product.id || seen.has(item.id)) continue;
      seen.add(item.id);
      results.push(item);
      if (results.length >= limit) break;
    }
  };

  if (product.subcategory_id) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .neq("id", product.id)
      .eq("subcategory_id", product.subcategory_id)
      .limit(limit);

    if (error) console.error("Error loading related products by subcategory:", error);
    append((data ?? []) as Product[]);
  }

  if (results.length < limit) {
    let query = supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .neq("id", product.id)
      .limit(limit);

    query = product.category_id
      ? query.eq("category_id", product.category_id)
      : query.eq("category", product.category);

    const { data, error } = await query;

    if (error) console.error("Error loading related products:", error);
    append((data ?? []) as Product[]);
  }

  if (results.length < 4) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .neq("id", product.id)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) console.error("Error loading fallback related products:", error);
    append((data ?? []) as Product[]);
  }

  return results.slice(0, limit);
}

export async function getProductsBySubcategory(subcategoryId?: string | null, limit = 8) {
  if (!subcategoryId) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("subcategory_id", subcategoryId)
    .limit(limit);

  if (error) {
    console.error("Error loading products by subcategory:", error);
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
