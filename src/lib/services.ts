import { supabase } from "./supabase/client";
import { Service } from "@/types";

export async function getPublishedServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data as Service[];
}

export async function getServiceBySlug(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching service by slug:", error);
    return null;
  }

  if (data) return data as Service;

  const { data: debugService, error: debugError } = await supabase
    .from("services")
    .select("id,title,slug,status")
    .eq("slug", slug)
    .maybeSingle();

  if (debugError) {
    console.error("Error diagnosing missing service by slug:", debugError);
  } else if (debugService) {
    console.warn("Service exists but is not published:", debugService);
  } else {
    console.warn(`Service slug not found: ${slug}`);
  }

  return null;
}
