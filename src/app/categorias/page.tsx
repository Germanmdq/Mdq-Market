import Link from "next/link";
import {
  Baby,
  Bike,
  BriefcaseBusiness,
  Calculator,
  Droplets,
  Flame,
  Hammer,
  Home,
  Laptop,
  Scale,
  Search,
  ShieldCheck,
  Sofa,
  Sparkles,
  Store,
  Tags,
  Utensils,
  Wrench,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { MarketCarousel } from "@/components/ui/MarketCarousel";
import CategoryHeroSlider from "@/components/marketplace/CategoryHeroSlider";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_root: boolean;
  path_slugs?: string[] | null;
};

type CategoryCard = {
  id: string;
  name: string;
  slug: string;
  href: string;
  count: number;
  description: string;
  icon: any;
  color: string;
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function categoryMeta(name: string, slug: string) {
  const label = normalize(`${name} ${slug}`);
  if (label.includes("tecnolog") || label.includes("celular") || label.includes("notebook")) return { icon: Laptop, color: "from-indigo-500 to-blue-700", description: "Tecnología, celulares, notebooks y accesorios locales." };
  if (label.includes("hogar") || label.includes("mueble")) return { icon: Sofa, color: "from-cyan-500 to-blue-700", description: "Muebles, organización y objetos para renovar ambientes." };
  if (label.includes("bici") || label.includes("movilidad")) return { icon: Bike, color: "from-emerald-500 to-teal-700", description: "Bicicletas, movilidad urbana, repuestos y accesorios." };
  if (label.includes("bebe") || label.includes("nino") || label.includes("juguete")) return { icon: Baby, color: "from-pink-500 to-rose-700", description: "Juguetes, cuidado, ropa y productos para familias." };
  if (label.includes("herramient") || label.includes("construccion")) return { icon: Hammer, color: "from-amber-500 to-orange-700", description: "Herramientas, obra, mantenimiento y equipamiento." };
  if (label.includes("comercio") || label.includes("almacen") || label.includes("cafe")) return { icon: Store, color: "from-red-500 to-orange-700", description: "Comercios de cercanía, alimentos y compras locales." };
  return { icon: Tags, color: "from-blue-500 to-cyan-700", description: "Publicaciones reales con compra protegida y Entrega MDP." };
}

function serviceMeta(name: string) {
  const label = normalize(name);
  if (label.includes("gas") || label.includes("calefactor")) return { icon: Flame, color: "from-red-500 to-rose-700", description: "Urgencias, revisiones, instalaciones y mantenimiento." };
  if (label.includes("plomer") || label.includes("perdida") || label.includes("bano")) return { icon: Droplets, color: "from-sky-500 to-blue-700", description: "Pérdidas, baños, destapes y arreglos del hogar." };
  if (label.includes("cocina")) return { icon: Utensils, color: "from-amber-500 to-orange-700", description: "Instalación, reparación y mantenimiento de cocina." };
  if (label.includes("hogar")) return { icon: Home, color: "from-emerald-500 to-teal-700", description: "Soluciones para mantener y mejorar tu casa." };
  return { icon: Wrench, color: "from-blue-500 to-indigo-700", description: "Servicios locales con reserva protegida y coordinación MDP." };
}

function professionalMeta(name: string) {
  const label = normalize(name);
  if (label.includes("abog") || label.includes("legal")) return { icon: Scale, color: "from-indigo-500 to-blue-700", description: "Asesoría legal, contratos, reclamos y consultas." };
  if (label.includes("cont")) return { icon: Calculator, color: "from-emerald-500 to-teal-700", description: "Impuestos, monotributo, balances y negocios." };
  if (label.includes("gas") || label.includes("plomer") || label.includes("hogar")) return { icon: BriefcaseBusiness, color: "from-cyan-500 to-blue-700", description: "Profesionales verificados para resolver en tu zona." };
  return { icon: BriefcaseBusiness, color: "from-violet-500 to-purple-700", description: "Perfiles con reputación, disponibilidad y contacto protegido." };
}

function CategorySliderSection({
  eyebrow,
  title,
  description,
  cards,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cards: CategoryCard[];
}) {
  if (!cards.length) return null;

  return (
    <section className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <MarketCarousel>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.id} className="min-w-0 flex-[0_0_82%] py-4 sm:flex-[0_0_44%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
                <Link
                  href={card.href}
                  className="group relative block min-h-[230px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
                >
                  <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.color} opacity-15 transition group-hover:scale-125 group-hover:opacity-25`} />
                  <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg transition group-hover:-rotate-3 group-hover:scale-110`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="relative text-lg font-semibold text-slate-950">{card.name}</p>
                  <p className="relative mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{card.description}</p>
                  <p className="relative mt-5 w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {card.count} disponibles
                  </p>
                </Link>
              </div>
            );
          })}
        </MarketCarousel>
      </div>
    </section>
  );
}

export default async function CategoriesPage() {
  const [{ data: categoryRows }, { data: productSignals }, { data: services }, { data: professionals }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, parent_id, is_root, path_slugs")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("category_id, subcategory_id")
      .eq("status", "published")
      .limit(500),
    supabase
      .from("services")
      .select("id, category, subcategory")
      .eq("status", "published")
      .limit(300),
    supabase
      .from("professionals")
      .select("id, category, subcategories")
      .limit(300),
  ]);

  const categories = (categoryRows ?? []) as CategoryRow[];
  const productCounts = new Map<string, number>();
  (productSignals ?? []).forEach((product: any) => {
    if (product.category_id) productCounts.set(product.category_id, (productCounts.get(product.category_id) ?? 0) + 1);
    if (product.subcategory_id) productCounts.set(product.subcategory_id, (productCounts.get(product.subcategory_id) ?? 0) + 1);
  });

  const productCards = categories
    .filter((category) => {
      const root = category.path_slugs?.[0];
      return productCounts.has(category.id) && root !== "servicios" && root !== "profesionales";
    })
    .sort((a, b) => (productCounts.get(b.id) ?? 0) - (productCounts.get(a.id) ?? 0))
    .slice(0, 18)
    .map((category) => {
      const meta = categoryMeta(category.name, category.slug);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        href: `/productos?${category.is_root ? "category" : "subcategory"}=${category.slug}`,
        count: productCounts.get(category.id) ?? 0,
        ...meta,
      };
    });

  const serviceCounts = new Map<string, number>();
  (services ?? []).forEach((service: any) => {
    [service.category, service.subcategory].filter(Boolean).forEach((name: string) => {
      serviceCounts.set(name, (serviceCounts.get(name) ?? 0) + 1);
    });
  });
  const serviceCards = Array.from(serviceCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([name, count]) => ({
    id: `service-${name}`,
    name,
    slug: name,
    href: `/servicios?category=${encodeURIComponent(name)}`,
    count,
    ...serviceMeta(name),
  }));

  const professionalCounts = new Map<string, number>();
  (professionals ?? []).forEach((professional: any) => {
    if (professional.category) professionalCounts.set(professional.category, (professionalCounts.get(professional.category) ?? 0) + 1);
    (professional.subcategories ?? []).forEach((name: string) => {
      professionalCounts.set(name, (professionalCounts.get(name) ?? 0) + 1);
    });
  });
  const professionalCards = Array.from(professionalCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([name, count]) => ({
    id: `professional-${name}`,
    name,
    slug: name,
    href: `/profesionales?category=${encodeURIComponent(name)}`,
    count,
    ...professionalMeta(name),
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <CategoryHeroSlider
            title="Categorías MDP Market"
            images={[
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
            ]}
            captions={[
              {
                eyebrow: "Comprar",
                title: "Productos por categoría",
                description: "Explorá publicaciones locales con compra protegida y Entrega MDP.",
              },
              {
                eyebrow: "Contratar",
                title: "Servicios para resolver hoy",
                description: "Encontrá rubros claros, disponibilidad y reserva protegida.",
              },
              {
                eyebrow: "Reservar",
                title: "Profesionales verificados",
                description: "Elegí especialistas por rubro, zona y reputación.",
              },
            ]}
          />
          <form action="/buscar" className="relative z-10 mx-auto -mt-8 flex max-w-3xl rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input name="q" placeholder="Buscar categoría, servicio o rubro..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </div>
            <button className="h-12 rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)]">Buscar</button>
          </form>
        </div>
      </section>

      <CategorySliderSection
        eyebrow="Comprar"
        title="Categorías de productos"
        description="Publicaciones locales con precio claro, pago protegido y Entrega MDP cuando está disponible."
        cards={productCards}
      />
      <CategorySliderSection
        eyebrow="Contratar"
        title="Categorías de servicios"
        description="Servicios disponibles por rubro, con reserva protegida y coordinación dentro de Mar del Plata."
        cards={serviceCards}
      />
      <CategorySliderSection
        eyebrow="Reservar"
        title="Profesiones y especialistas"
        description="Profesionales verificados, perfiles con reputación y contacto protegido."
        cards={professionalCards}
      />

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]">
          <Sparkles className="mb-5 h-8 w-8 text-blue-200" />
          <h2 className="text-2xl font-semibold tracking-tight">¿No encontrás el rubro?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Usá el asistente o publicá tu necesidad: MDP Market te lleva al producto, servicio o profesional correcto.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/servicios" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">Pedir servicio</Link>
            <Link href="/publicar" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">Publicar gratis</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
