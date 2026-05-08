import React, { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Truck,
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

function CategoryQuickLinks({
  title,
  categories,
}: {
  title: string;
  categories: CategoryNode[];
}) {
  if (!categories.length) return null;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Explorá el catálogo</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          </div>
          <Link href="#directorio-categorias" className="hidden items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-600 sm:flex">
            Ver directorio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              href={`/productos?category=${category.slug}`}
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm transition group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-950">{category.name}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">{category.productCount} publicaciones</p>
            </Link>
          ))}
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
      href="/productos?verified=true"
      linkLabel="Ver verificados"
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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

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
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
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

    if (params.verified === "true") {
      q = q.eq("seller_verified", true);
      qCount = qCount.eq("seller_verified", true);
    }

    if (typeof params.q === "string" && params.q.trim()) {
      q = q.ilike("title", `%${params.q.trim()}%`);
      qCount = qCount.ilike("title", `%${params.q.trim()}%`);
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
  const selectedCategoryNode = selectedCategoryParam
    ? categoryTree.find((category) => normalizeFilterValue(category.slug) === normalizeFilterValue(selectedCategoryParam) || normalizeFilterValue(category.name) === normalizeFilterValue(selectedCategoryParam))
    : null;
  const quickCategories = selectedCategoryNode?.children.length ? selectedCategoryNode.children : categoryTree;
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => typeof value === "string")
  ) as Record<string, string>;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Productos en Mar del Plata
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              {totalProducts} productos encontrados {totalPages > 1 && `(página ${page} de ${totalPages})`}
            </p>
          </div>

          <form action="/productos" method="GET" className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              name="q"
              defaultValue={typeof params.q === "string" ? params.q : ""}
              placeholder="Buscar productos..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-900"
            />
            {/* Preserve existing filters */}
            {typeof params.category === "string" && <input type="hidden" name="category" value={params.category} />}
            {typeof params.zone === "string" && <input type="hidden" name="zone" value={params.zone} />}
          </form>
        </div>
      </div>

      <CategoryQuickLinks
        title={selectedCategoryNode ? `Encontrá más en ${selectedCategoryNode.name}` : "Comprá por categoría"}
        categories={quickCategories}
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
            href="/productos?protectedPayment=true&verified=true"
            className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
          >
            <ShieldCheck className="mb-4 h-7 w-7 text-blue-600" />
            <p className="text-base font-semibold text-slate-950">Compra protegida</p>
            <p className="mt-1 text-sm text-slate-500">Vendedores verificados y pago protegido MDP.</p>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
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
                <h3 className="text-lg font-semibold text-slate-950 mb-2">No encontramos resultados</h3>
                <p className="text-sm text-slate-600 mb-6">Probá quitando algunos filtros o cambiando tu búsqueda</p>
                <Link
                  href="/productos"
                  className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Limpiar todos los filtros
                </Link>
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
