import Link from "next/link";
import { getCategoryHref } from "@/lib/categories/getCategoryHref";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .eq("show_in_menu", true)
    .order("level", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Categories page error:", error);
  }

  const rows = categories ?? [];
  const roots = rows.filter((c) => c.level === 1 || c.is_root === true);

  const childrenByParent = new Map<string, any[]>();
  for (const category of rows) {
    if (category.parent_id) {
      const current = childrenByParent.get(category.parent_id) ?? [];
      current.push(category);
      childrenByParent.set(category.parent_id, current);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Todas las categorías
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Explorá productos, servicios y profesionales de Mar del Plata por categoría.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <input
              placeholder="¿Qué categoría buscás?"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        {roots.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold text-blue-600">Sin categorías visibles</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Todavía no hay categorías para mostrar.
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Revisá public.categories en Supabase y asegurate de tener is_active=true y show_in_menu=true.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roots.map((root) => {
              const children = childrenByParent.get(root.id) ?? [];
              return (
                <article
                  key={root.id}
                  className="group flex min-h-[320px] flex-col rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                >
                  <div className="mb-6 h-40 w-full overflow-hidden rounded-2xl bg-slate-50 p-4 transition-colors group-hover:bg-slate-100">
                    <img
                      src={root.image_url || `/category-art/${root.slug}.svg`}
                      alt={`Ilustración de ${root.name}`}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/category-art/default.svg";
                      }}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        Categoría
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                        {root.name}
                      </h2>
                    </div>
                    <Link
                      href={getCategoryHref(root)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-700"
                    >
                      Ver
                    </Link>
                  </div>

                  {children.length > 0 ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {children.slice(0, 10).map((child) => (
                        <Link
                          key={child.id}
                          href={getCategoryHref(child)}
                          className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-slate-500">
                      Ver publicaciones disponibles en esta categoría.
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <Link
                      href={getCategoryHref(root)}
                      className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Explorar {root.name} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}