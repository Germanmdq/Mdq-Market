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
  is_active?: boolean;
  show_in_menu?: boolean;
  children?: Category[];
};

type ProductCategoryReference = {
  category_id?: string | null;
  subcategory_id?: string | null;
};

function isString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

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

  const categories = (data ?? []) as Category[];
  if (categories.length === 0) return [];

  const ids = categories.map((category) => category.id);
  const [{ data: categoryProducts }, { data: subcategoryProducts }] = await Promise.all([
    supabase
      .from("products")
      .select("category_id")
      .eq("status", "published")
      .in("category_id", ids),
    supabase
      .from("products")
      .select("subcategory_id")
      .eq("status", "published")
      .in("subcategory_id", ids),
  ]);

  const categoryIdsWithProducts = new Set(
    ((categoryProducts ?? []) as ProductCategoryReference[]).map((row) => row.category_id).filter(isString)
  );
  const subcategoryIdsWithProducts = new Set(
    ((subcategoryProducts ?? []) as ProductCategoryReference[]).map((row) => row.subcategory_id).filter(isString)
  );
  const idsWithProducts = new Set([...categoryIdsWithProducts, ...subcategoryIdsWithProducts]);

  return pruneEmptyCategories(buildCategoryTree(categories), idsWithProducts);
}

function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  for (const category of categories) {
    map.set(category.id, { ...category, children: [] });
  }

  for (const category of map.values()) {
    const parent = category.parent_id ? map.get(category.parent_id) : null;
    if (parent) {
      parent.children?.push(category);
    } else if (category.is_root) {
      roots.push(category);
    }
  }

  return roots;
}

function pruneEmptyCategories(categories: Category[], idsWithProducts: Set<string>): Category[] {
  return categories
    .map((category) => {
      const children = pruneEmptyCategories(category.children ?? [], idsWithProducts);
      return { ...category, children };
    })
    .filter((category) => idsWithProducts.has(category.id) || Boolean(category.children?.length));
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
