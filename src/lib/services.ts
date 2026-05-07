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
    .single();

  if (error) {
    console.error("Error fetching service by slug:", error);
    return null;
  }

  return data as Service;
}
