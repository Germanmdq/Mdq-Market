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

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_root: boolean;
  is_active?: boolean;
  show_in_menu?: boolean;
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
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <CategoryHeroSlider images={heroImages} title={title} captions={heroCaptions} />

        <form
          action="/productos"
          method="GET"
          className="relative z-10 mx-auto -mt-8 flex max-w-3xl rounded-[1.7rem] border border-slate-200 bg-white p-2 shadow-[0_30px_100px_rgba(15,23,42,0.24)]"
        >
          <div className="flex flex-1 items-center gap-3 px-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Buscar productos..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          {Object.entries(params)
            .filter(([key, value]) => key !== "q" && key !== "page" && Boolean(value))
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          <button className="h-12 rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] transition hover:bg-blue-700">
            Buscar
          </button>
        </form>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Productos en Mar del Plata
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {totalProducts} productos encontrados {totalPages > 1 && `(página ${page} de ${totalPages})`}
          </p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Subcategorías</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Elegí por necesidad</h3>
          </div>
          <Link href="#directorio-categorias" className="hidden items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-600 sm:flex">
            Ver directorio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => {
            const meta = getProductCategoryMeta(category);
            const Icon = meta.icon;
            return (
              <Link
                key={category.id}
                href={`/productos?${category.is_root ? "category" : "subcategory"}=${category.slug}`}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${meta.color} opacity-15 transition group-hover:scale-125 group-hover:opacity-25`} />
                <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-lg transition group-hover:-rotate-3 group-hover:scale-110`}>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="relative text-lg font-semibold text-slate-950">{category.name}</p>
                <p className="relative mt-2 min-h-[48px] text-sm leading-6 text-slate-500">{meta.copy}</p>
                <p className="relative mt-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 w-fit">{category.productCount} publicaciones</p>
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
      eyebrow="Locales"
      title="Tiendas y vendedores destacados"
      description="Perfiles con catálogo activo dentro de MDP Market"
      href="/productos"
      linkLabel="Ver tiendas"
      className="border-t border-slate-200 bg-slate-50"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <Link
            key={seller.name}
            href={`/productos?q=${encodeURIComponent(seller.name)}`}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.16)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Store className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-slate-950">{seller.name}</p>
            <p className="mt-1 text-sm text-slate-500">{seller.count} publicaciones · {seller.zone}</p>
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
      title="Lo que más se está explorando"
      description="Atajos a búsquedas y subcategorías con movimiento"
      className="border-t border-slate-200"
    >
      <div className="flex flex-wrap gap-3">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/productos?subcategory=${subcategory.slug}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
          >
            {subcategory.name}
          </Link>
        ))}
        {tags.map(([tag]) => (
          <Link
            key={tag}
            href={`/productos?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
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
    <section id="directorio-categorias" className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">Directorio</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Todas las categorías</h2>
          <p className="mt-2 text-sm text-slate-500">Un mapa completo para navegar productos por rubro y subcategoría.</p>
        </div>
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {categories.map((category) => (
            <div key={category.id} className="mb-6 break-inside-avoid rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
              <Link href={`/productos?category=${category.slug}`} className="text-base font-semibold text-slate-950 hover:text-blue-600">
                {category.name}
              </Link>
              {category.children.length > 0 && (
                <div className="mt-3 space-y-2">
                  {category.children.slice(0, 12).map((child) => (
                    <Link key={child.id} href={`/productos?subcategory=${child.slug}`} className="block text-sm text-slate-600 hover:text-blue-600">
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
      .select("id, name, slug, parent_id, is_root, is_active, show_in_menu")
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
    <main className="min-h-screen bg-slate-50">
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

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          <Link
            href="/productos?ofertas=true"
            className="rounded-3xl border border-red-100 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
          >
            <BadgePercent className="mb-4 h-7 w-7 text-red-600" />
            <p className="text-base font-semibold text-slate-950">Ofertas y descuentos</p>
            <p className="mt-1 text-sm text-slate-500">Productos con precio especial o descuento activo.</p>
          </Link>
          <Link
            href="/productos?delivery=true"
            className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
          >
            <Truck className="mb-4 h-7 w-7 text-emerald-600" />
            <p className="text-base font-semibold text-slate-950">Entrega MDP</p>
            <p className="mt-1 text-sm text-slate-500">Publicaciones con coordinación local en Mar del Plata.</p>
          </Link>
          <Link
            href="/productos?protectedPayment=true"
            className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
          >
            <ShieldCheck className="mb-4 h-7 w-7 text-blue-600" />
            <p className="text-base font-semibold text-slate-950">Compra protegida</p>
            <p className="mt-1 text-sm text-slate-500">Vendedores locales y pago protegido MDP.</p>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
                <ProductFilters />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <details className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </summary>
                <div className="border-t border-slate-100 p-5">
                  <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}>
                    <ProductFilters mobile />
                  </Suspense>
                </div>
              </details>
            </div>

            {products.length > 0 ? (
              <>
                <div className="mb-5 flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Resultados</p>
                    <p className="mt-1 text-sm text-slate-500">{totalProducts} publicaciones disponibles</p>
                  </div>
                  <p className="text-xs font-medium text-slate-400">Compra protegida y Entrega MDP cuando esté disponible</p>
                </div>
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/productos?${new URLSearchParams({ ...Object.fromEntries(Object.entries(cleanParams).filter(([k]) => k !== "page")), page: String(page - 1) }).toString()}`}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Anterior
                      </Link>
                    )}

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                        if (pageNum > totalPages) return null;

                        return (
                          <Link
                            key={pageNum}
                            href={`/productos?${new URLSearchParams({ ...Object.fromEntries(Object.entries(cleanParams).filter(([k]) => k !== "page")), page: String(pageNum) }).toString()}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === page
                                ? "bg-blue-600 text-white"
                                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                    </div>

                    {page < totalPages && (
                      <Link
                        href={`/productos?${new URLSearchParams({ ...Object.fromEntries(Object.entries(cleanParams).filter(([k]) => k !== "page")), page: String(page + 1) }).toString()}`}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Siguiente
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-blue-600">Sin resultados</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  {searchQuery ? `No encontramos publicaciones para “${searchQuery}”` : "No encontramos resultados"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                  Probá con otra palabra, quitá filtros o explorá productos y servicios disponibles en Mar del Plata.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link
                    href="/productos"
                    className="inline-block rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Ver productos
                  </Link>
                  <Link
                    href="/servicios"
                    className="inline-block rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    Buscar servicios
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="bg-white border-t border-slate-200">
        {/* Ofertas del día */}
        {deals.length > 0 && (
          <MarketSection
            eyebrow="Exclusivo"
            title="Ofertas del día"
            description="Productos locales con precio especial por tiempo limitado"
            href="/productos?ofertas=true"
            linkLabel="Ver todas"
          >
            <MarketCarousel>
              {deals.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Productos destacados */}
        {featured.length > 0 && (
          <MarketSection
            eyebrow="Tendencias"
            title="Productos destacados"
            href="/productos?featured=true"
            className="border-t border-slate-200"
          >
            <MarketCarousel>
              {featured.map(p => (
                <div key={p.id} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_24%] xl:flex-[0_0_19%] py-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        {/* Servicios */}
        {services.length > 0 && (
          <MarketSection
            eyebrow="Soluciones locales"
            title="Servicios disponibles"
            description="Profesionales listos para asistirte"
            href="/servicios"
            linkLabel="Ver todos"
            className="border-t border-slate-200 bg-slate-50"
          >
            <MarketCarousel>
              {services.slice(0, 8).map(s => (
                <div key={s.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%] py-4">
                  <ServiceCard service={s} />
                </div>
              ))}
            </MarketCarousel>
          </MarketSection>
        )}

        <PersonalizedProductSections />
        <StoreHighlights products={(catalogSignals ?? []) as CatalogSignal[]} />
        <TrendLinks categories={categoryTree} products={(catalogSignals ?? []) as CatalogSignal[]} />
        <CategoryDirectory categories={categoryTree} />
      </div>
    </main>
  );
}
