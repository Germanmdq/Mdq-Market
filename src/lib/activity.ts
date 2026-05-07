"use client";

import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

export type ActivityEventType =
  | "product_view"
  | "service_view"
  | "professional_view"
  | "search"
  | "category_view"
  | "add_to_cart"
  | "favorite"
  | "checkout_started";

export type ActivityEntityType =
  | "product"
  | "service"
  | "professional"
  | "category"
  | "search"
  | "cart"
  | "checkout";

export type ActivityPayload = {
  event_type: ActivityEventType;
  entity_type: ActivityEntityType;
  entity_id?: string | null;
  title?: string | null;
  slug?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  search_query?: string | null;
  metadata?: Record<string, unknown>;
};

export type ActivityRecord = ActivityPayload & {
  id: string;
  user_id?: string | null;
  anonymous_id?: string | null;
  created_at: string;
};

const ANON_KEY = "mdp_anonymous_id";
const LOCAL_ACTIVITY_KEY = "mdp_user_activity";

export function getAnonymousId() {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem(ANON_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(ANON_KEY, id);
  return id;
}

function readLocalActivity() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACTIVITY_KEY) ?? "[]") as ActivityRecord[];
  } catch {
    return [];
  }
}

function writeLocalActivity(records: ActivityRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(records.slice(0, 80)));
  window.dispatchEvent(new Event("mdp-activity-updated"));
}

export async function trackActivity(payload: ActivityPayload) {
  if (typeof window === "undefined") return;

  const anonymousId = getAnonymousId();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const record: ActivityRecord = {
    ...payload,
    id: crypto.randomUUID(),
    user_id: user?.id ?? null,
    anonymous_id: anonymousId,
    metadata: payload.metadata ?? {},
    created_at: new Date().toISOString(),
  };

  const localRecords = readLocalActivity().filter((item) => {
    if (payload.event_type === "product_view" && item.entity_id === payload.entity_id) return false;
    if (payload.event_type === "search" && item.search_query === payload.search_query) return false;
    return true;
  });
  writeLocalActivity([record, ...localRecords]);

  await supabase.from("user_activity").insert({
    user_id: user?.id ?? null,
    anonymous_id: anonymousId,
    event_type: payload.event_type,
    entity_type: payload.entity_type,
    entity_id: payload.entity_id ?? null,
    title: payload.title ?? null,
    slug: payload.slug ?? null,
    category_id: payload.category_id ?? null,
    subcategory_id: payload.subcategory_id ?? null,
    search_query: payload.search_query ?? null,
    metadata: payload.metadata ?? {},
  });
}

export function getRecentViews(limit = 12) {
  return readLocalActivity()
    .filter((item) => ["product_view", "service_view", "professional_view", "category_view"].includes(item.event_type))
    .slice(0, limit);
}

export function getRecentSearches(limit = 8) {
  return readLocalActivity()
    .filter((item) => item.event_type === "search" && item.search_query)
    .slice(0, limit);
}

export async function clearActivity() {
  if (typeof window === "undefined") return;
  const anonymousId = getAnonymousId();
  localStorage.removeItem(LOCAL_ACTIVITY_KEY);
  window.dispatchEvent(new Event("mdp-activity-updated"));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("user_activity").delete().eq("user_id", user.id);
  } else if (anonymousId) {
    await supabase.from("user_activity").delete().eq("anonymous_id", anonymousId);
  }
}

export async function getPersonalizedRecommendations(limit = 12) {
  const recentViews = getRecentViews(20);
  const categoryIds = Array.from(new Set(recentViews.map((item) => item.category_id).filter(Boolean))) as string[];
  const viewedProductIds = new Set(
    recentViews.filter((item) => item.entity_type === "product" && item.entity_id).map((item) => item.entity_id)
  );

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("discount", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (categoryIds.length > 0) {
    query = query.in("category_id", categoryIds);
  } else {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) return [];

  return ((data ?? []) as Product[]).filter((product) => !viewedProductIds.has(product.id)).slice(0, limit);
}
