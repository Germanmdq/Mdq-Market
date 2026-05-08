import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getCategoryHref } from "@/lib/categories/getCategoryHref";

export const dynamic = "force-dynamic";

const LEGACY_SLUGS: Record<string, string> = {
  herramientas: "herramientas-y-construccion",
  hogar: "hogar-y-muebles",
  electro: "electrodomesticos",
  tecnologia: "tecnologia-y-celulares",
  moda: "indumentaria-y-accesorios",
  bebes: "bebes-ninos-y-juguetes",
  construccion: "herramientas-y-construccion",
  "hogar-y-electro": "hogar-y-muebles",
};

export default async function CategoryRedirectPage({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}) {
  const resolvedParams = await params;
  const candidates = resolvedParams.slug.filter((part) => part && part !== "categorias");

  for (const candidate of candidates) {
    const slug = LEGACY_SLUGS[candidate] ?? candidate;
    const { data: category } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (category) {
      redirect(getCategoryHref(category));
    }
  }

  notFound();
}
