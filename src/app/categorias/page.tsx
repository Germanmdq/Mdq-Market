import Link from "next/link";
import { getCategoryHref } from "@/lib/categories/getCategoryHref";
import { supabase } from "@/lib/supabase/client";
import { Search } from "lucide-react";
import { CategoryAnimation } from "./CategoryAnimation";

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
    <main className="min-h-screen bg-[#ebebeb]">
      <section className="bg-[#ffe600] pb-6 shadow-sm">
        <div className="mx-auto max-w-[1200px] px-4 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-semibold text-[#333333] sm:text-5xl">
            Categorías
          </h1>
          <div className="mx-auto mt-8 max-w-xl relative">
            <div className="flex w-full items-center rounded-sm bg-white shadow-sm p-1">
              <input
                placeholder="Buscar categorías..."
                className="h-12 w-full bg-transparent px-4 text-base outline-none text-[#333333] placeholder:text-[#999999]"
              />
              <button className="flex h-12 w-12 items-center justify-center text-[#999999]">
                 <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        {roots.length === 0 ? (
          <div className="rounded-sm border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-blue-600">Sin categorías visibles</p>
            <h2 className="mt-2 text-2xl font-medium text-[#333333]">
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
                  className="group flex min-h-[320px] flex-col rounded-sm bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-6 h-32 w-full overflow-hidden rounded-sm bg-white p-2 flex items-center justify-center">
                    {root.animation_url ? (
                      <CategoryAnimation src={root.animation_url} className="h-full w-full" />
                    ) : (
                      <img
                        src={root.image_url || `/category-art/${root.slug}.svg`}
                        alt={`Ilustración de ${root.name}`}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/category-art/default.svg";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-medium text-[#333333] group-hover:text-[#3483fa]">
                        {root.name}
                      </h2>
                    </div>
                  </div>

                  {children.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-2">
                      {children.slice(0, 8).map((child) => (
                        <Link
                          key={child.id}
                          href={getCategoryHref(child)}
                          className="text-sm text-[#666666] hover:text-[#3483fa]"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[#999999]">
                      Ver publicaciones.
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <Link
                      href={getCategoryHref(root)}
                      className="inline-flex text-sm font-medium text-[#3483fa] hover:text-blue-700"
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