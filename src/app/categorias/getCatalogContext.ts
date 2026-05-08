import { supabase } from "@/lib/supabase/client";
import { CATEGORY_COPY } from "./category-copy";

export type CatalogContextType = "all" | "category" | "subcategory" | "search";

export interface CatalogContext {
  type: CatalogContextType;
  title: string;
  pageTitle: string;
  eyebrow: string;
  description: string;
  breadcrumb: Array<{ label: string; href: string }>;
  parentCategory?: any;
  currentCategory?: any;
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
  searchQuery?: string;
}

export async function getCatalogContext({
  categorySlug,
  subcategorySlug,
  searchQuery
}: {
  categorySlug?: string;
  subcategorySlug?: string;
  searchQuery?: string;
}): Promise<CatalogContext> {
  const breadcrumb = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" }
  ];

  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true);
  const rows = categories || [];

  if (searchQuery) {
    return {
      type: "search",
      title: `Resultados para "${searchQuery}"`,
      pageTitle: `Búsqueda: ${searchQuery} en Mar del Plata`,
      eyebrow: "Búsqueda",
      description: "Explorá publicaciones locales con compra protegida y entrega coordinada.",
      breadcrumb: [...breadcrumb, { label: "Búsqueda", href: `/productos?q=${encodeURIComponent(searchQuery)}` }],
      searchQuery
    };
  }

  if (subcategorySlug) {
    const current = rows.find((c) => c.slug === subcategorySlug);
    const parent = current?.parent_id ? rows.find((c) => c.id === current.parent_id) : undefined;
    const copy = CATEGORY_COPY[subcategorySlug] || {
      title: `${current?.name || subcategorySlug} en Mar del Plata`,
      description: "Publicaciones locales con compra protegida y entrega coordinada."
    };

    if (parent) breadcrumb.push({ label: parent.name, href: `/productos?category=${parent.slug}` });
    if (current) breadcrumb.push({ label: current.name, href: `/productos?subcategory=${current.slug}` });

    return {
      type: "subcategory",
      title: current?.name || subcategorySlug,
      pageTitle: copy.title,
      eyebrow: "Subcategoría",
      description: copy.description,
      breadcrumb,
      parentCategory: parent,
      currentCategory: current,
      activeCategorySlug: parent?.slug,
      activeSubcategorySlug: subcategorySlug
    };
  }

  if (categorySlug) {
    const current = rows.find((c) => c.slug === categorySlug);
    const copy = CATEGORY_COPY[categorySlug] || {
      title: `${current?.name || categorySlug} en Mar del Plata`,
      description: "Explorá publicaciones locales con compra protegida y entrega coordinada."
    };

    if (current) breadcrumb.push({ label: current.name, href: `/productos?category=${current.slug}` });

    return {
      type: "category",
      title: current?.name || categorySlug,
      pageTitle: copy.title,
      eyebrow: "Categoría",
      description: copy.description,
      breadcrumb,
      currentCategory: current,
      activeCategorySlug: categorySlug
    };
  }

  return {
    type: "all",
    title: "Productos",
    pageTitle: "Productos en Mar del Plata",
    eyebrow: "Catálogo",
    description: "Explorá publicaciones locales con compra protegida y entrega coordinada.",
    breadcrumb
  };
}