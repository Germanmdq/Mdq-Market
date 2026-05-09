import React, { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Baby,
  Bike,
  Hammer,
  Home,
  Laptop,
  Palette,
  PawPrint,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sofa,
  Sparkles,
  Store,
  Tags,
  Truck,
  Utensils,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import ProductCard from "@/components/marketplace/ProductCard";
import ServiceCard from "@/components/marketplace/ServiceCard";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import { MarketSection } from "@/components/marketplace/MarketSection";
import { getPublishedServices } from "@/lib/services";
import PersonalizedProductSections from "@/components/marketplace/PersonalizedProductSections";
import CategoryHeroSlider from "@/components/marketplace/CategoryHeroSlider";
import { normalizeSearchQuery, sanitizePostgrestSearchTerm } from "@/lib/search/buildSearchHref";
import { CategoryAnimation } from "../categorias/CategoryAnimation";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_root: boolean;
  is_active?: boolean;
  show_in_menu?: boolean;
  image_url?: string | null;
  animation_url?: string | null;
};

type CategoryNode = CategoryRow & {
  children: CategoryNode[];
  productCount: number;
};

type CatalogSignal = {
  category_id?: string | null;
  subcategory_id?: string | null;
  seller_name?: string | null;
  zone?: string | null;
  tags?: string[] | null;
};

function normalizeLabel(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getProductCategoryMeta(category: CategoryNode | { name: string; slug: string }) {
  const label = normalizeLabel(`${category.name} ${category.slug}`);
  if (label.includes("hogar") || label.includes("mueble")) return { icon: Sofa, color: "from-cyan-500 to-blue-700", copy: "Muebles, organización, decoración y soluciones para renovar ambientes." };
  if (label.includes("tecnolog") || label.includes("celular") || label.includes("notebook")) return { icon: Laptop, color: "from-indigo-500 to-blue-700", copy: "Equipos, accesorios y tecnología disponible en Mar del Plata." };
  if (label.includes("bici") || label.includes("movilidad")) return { icon: Bike, color: "from-emerald-500 to-teal-700", copy: "Movilidad urbana, repuestos y oportunidades para moverte mejor." };
  if (label.includes("bebe") || label.includes("nino") || label.includes("juguete")) return { icon: Baby, color: "from-pink-500 to-rose-600", copy: "Juguetes, cuidado, ropa y productos familiares seleccionados." };
  if (label.includes("herramient") || label.includes("construccion")) return { icon: Hammer, color: "from-amber-500 to-orange-700", copy: "Herramientas, obra, mantenimiento y equipamiento para resolver." };
  if (label.includes("deco") || label.includes("jardin")) return { icon: Home, color: "from-lime-500 to-emerald-700", copy: "Jardín, deco y detalles para mejorar tu casa." };
  if (label.includes("mascota")) return { icon: PawPrint, color: "from-violet-500 to-purple-700", copy: "Productos para mascotas, cuidado y accesorios." };
  if (label.includes("comercio") || label.includes("almacen") || label.includes("cafe") || label.includes("verduleria")) return { icon: Utensils, color: "from-red-500 to-orange-700", copy: "Comercios locales, alimentos, bazar y compras de cercanía." };
  if (label.includes("arte") || label.includes("libreria")) return { icon: Palette, color: "from-fuchsia-500 to-pink-700", copy: "Librería, creatividad, útiles y regalos locales." };
  return { icon: Tags, color: "from-blue-500 to-cyan-700", copy: "Publicaciones locales con compra protegida y entrega coordinada." };
}

function getProductHeroImages(category?: CategoryNode | null) {
  const label = normalizeLabel(`${category?.name ?? ""} ${category?.slug ?? ""}`);
  if (label.includes("hogar") || label.includes("mueble")) {
    return [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  if (label.includes("tecnolog") || label.includes("celular") || label.includes("notebook")) {
    return [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  if (label.includes("bici") || label.includes("movilidad")) {
    return [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1529422643029-d4585747aaf2?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  if (label.includes("comercio") || label.includes("almacen") || label.includes("cafe")) {
    return [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  return [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1400&q=80",
  ];
}

function getProductHeroCaptions(title: string, category?: CategoryNode | null) {
  const categoryName = category?.name ?? "MDP Market";
  return [
    {
      eyebrow: "Inspiración local",
      title: title.replace("Encontrá más en ", ""),
      description: `Ideas, oportunidades y publicaciones reales para comprar ${categoryName.toLowerCase()} en Mar del Plata.`,
    },
    {
      eyebrow: "Compra protegida",
      title: "Elegí con más confianza",
      description: "Revisá precio, zona, vendedor y entrega antes de avanzar con la operación.",
    },
    {
      eyebrow: "Entrega MDP",
      title: "Coordinación dentro de la ciudad",
      description: "Sin envíos externos: acordamos la entrega local cuando completás la compra.",
    },
  ];
}

function buildCategoryTree(categories: CategoryRow[], products: CatalogSignal[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (product.category_id) counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
    if (product.subcategory_id) counts.set(product.subcategory_id, (counts.get(product.subcategory_id) ?? 0) + 1);
  }

  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const category of categories) {
    map.set(category.id, { ...category, children: [], productCount: counts.get(category.id) ?? 0 });
  }

  for (const category of map.values()) {
    const parent = category.parent_id ? map.get(category.parent_id) : null;
    if (parent) parent.children.push(category);
    else if (category.is_root) roots.push(category);
  }

  const prune = (nodes: CategoryNode[]): CategoryNode[] =>
    nodes
      .map((node) => {
        const children = prune(node.children);
        return {
          ...node,
          children,
          productCount: node.productCount + children.reduce((sum, child) => sum + child.productCount, 0),
        };
      })
      .filter((node) => node.productCount > 0 || node.children.length > 0)
      .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));

  return prune(roots);
}

function findCategoryNodeByParam(categories: CategoryNode[], value?: string | null): CategoryNode | null {
  if (!value) return null;
  const normalizedValue = normalizeLabel(value).replace(/&/g, "y").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  for (const category of categories) {
    const normalizedSlug = normalizeLabel(category.slug).replace(/&/g, "y").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const normalizedName = normalizeLabel(category.name).replace(/&/g, "y").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (normalizedSlug === normalizedValue || normalizedName === normalizedValue) return category;
    const child = findCategoryNodeByParam(category.children, value);
    if (child) return child;
  }

  return null;
}

function findParentCategory(categories: CategoryNode[], childId?: string | null): CategoryNode | null {
  if (!childId) return null;
  for (const category of categories) {
    if (category.children.some((child) => child.id === childId)) return category;
    const parent = findParentCategory(category.children, childId);
    if (parent) return parent;
  }
  return null;
}

function CategoryQuickLinks({
  title,
  categories,
  heroImages,
  heroCaptions,
  params,
  totalProducts,
  totalPages,
  page,
}: {
  title: string;
  categories: CategoryNode[];
  heroImages: string[];
  heroCaptions: { eyebrow: string; title: string; description: string }[];
  params: Record<string, string>;
  totalProducts: number;
  totalPages: number;
  page: number;
}) {
  if (!categories.length) return null;

  return (
    <section className="bg-[#ebebeb]">
      <div className="bg-[#ffe600] py-3 shadow-sm">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <form
            action="/productos"
            method="GET"
            className="relative mx-auto flex w-full max-w-2xl items-center rounded-sm bg-white shadow-sm"
          >
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Buscar productos, marcas y más…"
              className="min-w-0 flex-1 px-4 py-2.5 text-base text-[#333333] outline-none placeholder:text-[#999999]"
            />
            {Object.entries(params)
              .filter(([key, value]) => key !== "q" && key !== "page" && Boolean(value))
              .map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <button className="flex h-full items-center justify-center border-l border-slate-200 px-4 text-[#999999] hover:text-[#3483fa] transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <CategoryHeroSlider images={heroImages} title={title} captions={heroCaptions} />

        <div className="mt-8 flex flex-wrap justify-center gap-6 overflow-x-auto pb-4">
          {categories.slice(0, 10).map((category) => {
            const imageUrl = category.image_url || `/category-art/${category.slug}.svg`;
            return (
              <Link
                key={category.id}
                href={`/productos?${category.is_root ? "category" : "subcategory"}=${category.slug}`}
                className="group flex min-w-[80px] flex-col items-center gap-3 text-center transition"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:shadow-md">
                  {category.animation_url ? (
                    <CategoryAnimation src={category.animation_url} className="h-8 w-8" />
                  ) : (
                    <img
                      src={imageUrl}
                      alt={`Ilustración de ${category.name}`}
                      className="h-8 w-8 object-contain"
                      onError={(e) => { e.currentTarget.src = "/category-art/default.svg"; }}
                    />
                  )}
                </div>
                <p className="text-xs text-[#666666] group-hover:text-[#3483fa]">{category.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StoreHighlights({ products }: { products: CatalogSignal[] }) {
  const sellers = Array.from(
    products.reduce((map, product) => {
      if (!product.seller_name) return map;
      const current = map.get(product.seller_name) ?? { name: product.seller_name, count: 0, zone: product.zone || "Mar del Plata" };
      map.set(product.seller_name, { ...current, count: current.count + 1, zone: current.zone || product.zone || "Mar del Plata" });
      return map;
    }, new Map<string, { name: string; count: number; zone: string }>())
  )
    .map(([, seller]) => seller)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (!sellers.length) return null;

  return (
    <MarketSection
      eyebrow="Tiendas oficiales"
      title="Tiendas destacadas"
      href="/productos"
      linkLabel="Ver tiendas"
      className="bg-transparent"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <Link
            key={seller.name}
            href={`/productos?q=${encodeURIComponent(seller.name)}`}
            className="rounded-sm bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 text-[#333333]">
              <Store className="h-6 w-6" />
            </div>
            <p className="text-base font-medium text-[#333333]">{seller.name}</p>
            <p className="mt-1 text-sm text-[#999999]">{seller.count} publicaciones · {seller.zone}</p>
          </Link>
        ))}
      </div>
    </MarketSection>
  );
}

function TrendLinks({ categories, products }: { categories: CategoryNode[]; products: CatalogSignal[] }) {
  const subcategories = categories.flatMap((category) => category.children).slice(0, 10);
  const tagCounts = new Map<string, number>();
  products.forEach((product) => product.tags?.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)));
  const tags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  if (!subcategories.length && !tags.length) return null;

  return (
    <MarketSection
      eyebrow="Tendencias"
      title="Búsquedas populares"
      className="bg-transparent"
    >
      <div className="flex flex-wrap gap-3">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/productos?subcategory=${subcategory.slug}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-[#3483fa] shadow-sm transition hover:bg-slate-50"
          >
            {subcategory.name}
          </Link>
        ))}
        {tags.map(([tag]) => (
          <Link
            key={tag}
            href={`/productos?q=${encodeURIComponent(tag)}`}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm text-[#333333] transition hover:bg-slate-200"
          >
            {tag}
          </Link>
        ))}
      </div>
    </MarketSection>
  );
}

function CategoryDirectory({ categories }: { categories: CategoryNode[] }) {
  if (!categories.length) return null;

  return (
    <section id="directorio-categorias" className="bg-white border-t border-slate-200 py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#333333]">Categorías populares</h2>
        </div>
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {categories.map((category) => (
            <div key={category.id} className="mb-6 break-inside-avoid rounded-sm border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <Link href={`/productos?category=${category.slug}`} className="text-base font-medium text-[#333333] hover:text-[#3483fa]">
                {category.name}
              </Link>
              {category.children.length > 0 && (
                <div className="mt-3 space-y-2">
                  {category.children.slice(0, 12).map((child) => (
                    <Link key={child.id} href={`/productos?subcategory=${child.slug}`} className="block text-sm text-[#666666] hover:text-[#3483fa]">
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const params = (await searchParams) ?? {};
  const searchQuery = typeof params.q === "string" ? normalizeSearchQuery(params.q) : "";

  const normalizeFilterValue = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "y")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const findCategoryId = async (value: string) => {
    const { data } = await supabase
      .from("categories")
      .select("id, slug, name")
      .or(`slug.eq.${value},name.eq.${value}`);

    const normalizedValue = normalizeFilterValue(value);
    const category = data?.find((item) =>
      normalizeFilterValue(item.slug ?? "") === normalizedValue ||
      normalizeFilterValue(item.name ?? "") === normalizedValue
    );

    return category?.id ?? null;
  };

  // Pagination
  const PRODUCTS_PER_PAGE = 24;
  const rawPage = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  // Count query for total
  const countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const query = supabase
    .from("products")
    .select("*")
    .eq("status", "published");

  // Apply filters (to both query and countQuery)
  const applyFilters = async (q: typeof query, qCount: typeof countQuery) => {
    if (typeof params.category === "string") {
      const categoryId = await findCategoryId(params.category);

      if (categoryId) {
        q = q.eq("category_id", categoryId);
        qCount = qCount.eq("category_id", categoryId);
      }
    }

    if (typeof params.subcategory === "string") {
      const subcategoryId = await findCategoryId(params.subcategory);

      if (subcategoryId) {
        q = q.eq("subcategory_id", subcategoryId);
        qCount = qCount.eq("subcategory_id", subcategoryId);
      }
    }

    if (typeof params.zone === "string") {
      q = q.eq("zone", params.zone);
      qCount = qCount.eq("zone", params.zone);
    }

    if (typeof params.sellerType === "string") {
      q = q.eq("seller_type", params.sellerType);
      qCount = qCount.eq("seller_type", params.sellerType);
    }

    if (typeof params.condition === "string") {
      q = q.eq("condition", params.condition);
      qCount = qCount.eq("condition", params.condition);
    }

    if (params.ofertas === "true") {
      const filter = "featured_deal.eq.true,discount.gt.0";
      q = q.or(filter);
      qCount = qCount.or(filter);
    }

    if (params.featured === "true") {
      q = q.eq("featured", true);
      qCount = qCount.eq("featured", true);
    }

    if (typeof params.minPrice === "string") {
      q = q.gte("price", Number(params.minPrice));
      qCount = qCount.gte("price", Number(params.minPrice));
    }

    if (typeof params.maxPrice === "string") {
      q = q.lte("price", Number(params.maxPrice));
      qCount = qCount.lte("price", Number(params.maxPrice));
    }

    if (params.protectedPayment === "true") {
      q = q.eq("protected_payment", true);
      qCount = qCount.eq("protected_payment", true);
    }

    if (params.delivery === "true") {
      q = q.eq("mdp_delivery_available", true);
      qCount = qCount.eq("mdp_delivery_available", true);
    }

    if (searchQuery) {
      const safeQ = sanitizePostgrestSearchTerm(searchQuery);
      if (safeQ) {
        const filter = [
          `title.ilike.%${safeQ}%`,
          `description.ilike.%${safeQ}%`,
          `category.ilike.%${safeQ}%`,
          `subcategory.ilike.%${safeQ}%`,
        ].join(",");
        q = q.or(filter);
        qCount = qCount.or(filter);
      }
    }

    return { q, qCount };
  };

  const { q: filteredQuery, qCount: filteredCountQuery } = await applyFilters(query, countQuery);

  const [{ data, error }, { count }] = await Promise.all([
    filteredQuery.order("created_at", { ascending: false }).range(from, to),
    filteredCountQuery,
  ]);

  if (error) {
    console.error("Error fetching products:", error);
  }

  const products = (data ?? []) as Product[];
  const totalProducts = count ?? 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Fetch additional content for sections below
  const dealsQuery = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .or("featured_deal.eq.true,discount.gt.0")
    .order("created_at", { ascending: false })
    .limit(8);

  const featuredQuery = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const [dealsResult, featuredResult] = await Promise.all([
    dealsQuery,
    featuredQuery,
  ]);

  const deals = (dealsResult.data ?? []) as Product[];
  const featured = (featuredResult.data ?? []) as Product[];
  const services = await getPublishedServices();
  const [{ data: categoryRows }, { data: catalogSignals }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, parent_id, is_root, is_active, show_in_menu, image_url, animation_url")
      .eq("is_active", true)
      .order("level", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("category_id, subcategory_id, seller_name, zone, tags")
      .eq("status", "published")
      .limit(400),
  ]);
  const categoryTree = buildCategoryTree((categoryRows ?? []) as CategoryRow[], (catalogSignals ?? []) as CatalogSignal[]);
  const selectedCategoryParam = typeof params.category === "string" ? params.category : null;
  const selectedSubcategoryParam = typeof params.subcategory === "string" ? params.subcategory : null;
  const selectedCategoryNode = findCategoryNodeByParam(categoryTree, selectedCategoryParam);
  const selectedSubcategoryNode = findCategoryNodeByParam(categoryTree, selectedSubcategoryParam);
  const selectedNode = selectedSubcategoryNode ?? selectedCategoryNode;
  const selectedParentNode = selectedSubcategoryNode ? findParentCategory(categoryTree, selectedSubcategoryNode.id) : selectedCategoryNode;
  const quickCategories = selectedNode?.children.length
    ? selectedNode.children
    : selectedParentNode?.children.length
      ? selectedParentNode.children
      : categoryTree;
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => typeof value === "string")
  ) as Record<string, string>;

  return (
    <main className="min-h-screen bg-[#ebebeb]">
      <CategoryQuickLinks
        title={selectedNode ? `Encontrá más en ${selectedNode.name}` : "Comprá por categoría"}
        categories={quickCategories}
        heroImages={getProductHeroImages(selectedNode)}
        heroCaptions={getProductHeroCaptions(selectedNode ? `Encontrá más en ${selectedNode.name}` : "Comprá por categoría", selectedNode)}
        params={cleanParams}
        totalProducts={totalProducts}
        totalPages={totalPages}
        page={page}
      />

      <section className="bg-[#ebebeb] pb-6">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid divide-y md:divide-y-0 md:divide-x divide-slate-200 rounded-sm bg-white shadow-sm md:grid-cols-3">
            <Link
              href="/productos?ofertas=true"
              className="flex items-center gap-4 p-6 transition hover:bg-slate-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#3483fa]">
                <BadgePercent className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#333333]">Ofertas y descuentos</p>
                <p className="text-sm text-[#666666]">Productos con precio especial</p>
              </div>
            </Link>
            <Link
              href="/productos?delivery=true"
              className="flex items-center gap-4 p-6 transition hover:bg-slate-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#00a650]">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#333333]">Entrega MDP</p>
                <p className="text-sm text-[#666666]">Coordinación en Mar del Plata</p>
              </div>
            </Link>
            <Link
              href="/productos?protectedPayment=true"
              className="flex items-center gap-4 p-6 transition hover:bg-slate-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#3483fa]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#333333]">Compra protegida</p>
                <p className="text-sm text-[#666666]">Pago seguro y garantizado</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 pb-6">
              <h1 className="text-[26px] font-semibold text-[#333333] mb-1">
                {selectedNode ? selectedNode.name : searchQuery ? `Resultados para "${searchQuery}"` : "Productos"}
              </h1>
              <p className="text-sm text-[#666666] mb-6">
                {totalProducts} resultados
              </p>
              <Suspense fallback={<div className="h-96 animate-pulse bg-slate-200 rounded-sm" />}>
                <ProductFilters />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <h1 className="text-2xl font-semibold text-[#333333] mb-1">
                {selectedNode ? selectedNode.name : searchQuery ? `Resultados para "${searchQuery}"` : "Productos"}
              </h1>
              <p className="text-sm text-[#666666] mb-4">{totalProducts} resultados</p>
              <details className="rounded-sm border border-slate-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-medium text-[#333333]">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtrar y ordenar
                </summary>
                <div className="border-t border-slate-100 p-5">
                  <Suspense fallback={<div className="h-48 animate-pulse rounded-sm bg-slate-100" />}>
                    <ProductFilters mobile />
                  </Suspense>
                </div>
              </details>
            </div>

            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-1">
                    {page > 1 && (
                      <Link
                        href={`/productos?${new URLSearchParams({ ...Object.fromEntries(Object.entries(cleanParams).filter(([k]) => k !== "page")), page: String(page - 1) }).toString()}`}
                        className="flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium text-[#3483fa] transition-colors hover:bg-blue-50"
                      >
                        <span className="sr-only">Anterior</span>
                        <ArrowRight className="h-4 w-4 rotate-180" />
                      </Link>
                    )}

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      if (pageNum > totalPages) return null;

                      return (
                        <Link
                          key={pageNum}
                          href={`/productos?${new URLSearchParams({ ...Object.fromEntries(Object.entries(cleanParams).filter(([k]) => k !== "page")), page: String(pageNum) }).toString()}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-sm text-sm font-medium transition-colors ${
                            pageNum === page
                              ? "bg-[#3483fa] text-white"
                              : "text-[#666666] hover:bg-slate-200"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}

                    {page < totalPages && (
                      <Link
                        href={`/productos?${new URLSearchParams({ ...Object.fromEntries(Object.entries(cleanParams).filter(([k]) => k !== "page")), page: String(page + 1) }).toString()}`}
                        className="flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium text-[#3483fa] transition-colors hover:bg-blue-50"
                      >
                        <span className="sr-only">Siguiente</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center bg-white rounded-sm shadow-sm">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="mt-2 text-[22px] font-medium text-[#333333]">
                  No hay publicaciones que coincidan con tu búsqueda.
                </h3>
                <ul className="mx-auto mt-6 max-w-md text-sm text-[#666666] text-left list-disc list-inside">
                  <li className="mb-2"><strong>Revisá la ortografía</strong> de la palabra.</li>
                  <li className="mb-2">Utilizá <strong>palabras más genéricas</strong> o menos palabras.</li>
                  <li>Navegá por las categorías para encontrar un producto similar.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="bg-[#ebebeb] pb-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Ofertas del día */}
        {deals.length > 0 && (
          <MarketSection
            eyebrow=""
            title="Ofertas de hoy"
            href="/productos?ofertas=true"
            linkLabel="Ver todas"
            className="bg-transparent px-0"
          >
            <MarketCarousel>
              {deals.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_20%] py-4 pr-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Productos destacados */}
        {featured.length > 0 && (
          <MarketSection
            eyebrow=""
            title="Inspirado en lo último que viste"
            href="/productos?featured=true"
            className="bg-transparent px-0"
          >
            <MarketCarousel>
              {featured.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_20%] py-4 pr-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Servicios */}
        {services.length > 0 && (
          <MarketSection
            eyebrow=""
            title="Servicios locales disponibles"
            href="/servicios"
            linkLabel="Ver todos"
            className="bg-transparent px-0"
          >
            <MarketCarousel>
              {services.slice(0, 8).map(s => (
                <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4 pr-4">
                  <ServiceCard service={s} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        <PersonalizedProductSections />
        <StoreHighlights products={(catalogSignals ?? []) as CatalogSignal[]} />
        <TrendLinks categories={categoryTree} products={(catalogSignals ?? []) as CatalogSignal[]} />
        </div>
      </div>
      <CategoryDirectory categories={categoryTree} />
    </main>
  );
}
