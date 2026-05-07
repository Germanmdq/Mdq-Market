import { supabase } from "./supabase/client";

export type Category = {
  id: string;
  external_id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  level: number;
  path: string[];
  path_slugs: string[];
  children_count: number;
  is_root: boolean;
  show_in_menu: boolean;
  children?: Category[];
};

export async function getRootCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_root", true)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching root categories:", error);
    return [];
  }

  return data as Category[];
}

export async function getMegaMenuCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .eq("show_in_menu", true)
    .order("level", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading categories for mega menu:", error);
    return [];
  }

  return buildCategoryTree(data ?? []);
}

function buildCategoryTree(categories: any[]): Category[] {
  const map = new Map();
  const roots: Category[] = [];

  for (const category of categories) {
    map.set(category.id, { ...category, children: [] });
  }

  for (const category of map.values()) {
    if (category.parent_id && map.has(category.parent_id)) {
      map.get(category.parent_id).children.push(category);
    } else if (category.is_root) {
      roots.push(category);
    }
  }

  return roots;
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }

  return data as Category;
}

export async function getChildrenCategories(parentId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching children categories:", error);
    return [];
  }

  return data as Category[];
}
