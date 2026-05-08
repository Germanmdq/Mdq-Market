"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  Bath,
  BadgeCheck,
  BadgePercent,
  Brain,
  BriefcaseBusiness,
  Calculator,
  DraftingCompass,
  Droplets,
  Flame,
  HeartPulse,
  Home,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  Wrench,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import CategoryHeroSlider from "@/components/marketplace/CategoryHeroSlider";

type ProfessionalRow = {
  id: string;
  name: string;
  slug: string;
  avatar?: string | null;
  profession?: string | null;
  category?: string | null;
  subcategories?: string[] | null;
  headline?: string | null;
  bio?: string | null;
  verified?: boolean | null;
  featured?: boolean | null;
  rating?: number | { average?: number } | null;
  completedJobs?: number | null;
  completed_jobs?: number | null;
  zones?: string[] | null;
  zone?: string | null;
  priceFrom?: number | null;
  price_from?: number | null;
};

const FALLBACK_ZONES = ["Centro", "Güemes", "Constitución", "La Perla", "Playa Grande", "Puerto", "Punta Mogotes"];

const PROFESSIONAL_CATEGORY_META = [
  { match: "bano", icon: Bath, title: "Baños", description: "Plomería, sanitarios, grifería, humedad y arreglos puntuales.", color: "from-sky-500 to-blue-700" },
  { match: "calefactor", icon: Flame, title: "Calefactores", description: "Revisión, limpieza, instalación y puesta a punto con coordinación local.", color: "from-orange-500 to-red-700" },
  { match: "cocina", icon: Utensils, title: "Cocinas", description: "Instalación, reparación, gas, extractores y mantenimiento.", color: "from-amber-500 to-orange-700" },
  { match: "gas", icon: Flame, title: "Gas", description: "Gasistas para instalaciones, pérdidas y controles de seguridad.", color: "from-red-500 to-rose-700" },
  { match: "hogar", icon: Home, title: "Hogar", description: "Arreglos, mejoras, mantenimiento y soluciones para la casa.", color: "from-emerald-500 to-teal-700" },
  { match: "perdida", icon: Droplets, title: "Pérdidas", description: "Detección y reparación de pérdidas de agua, gas o humedad.", color: "from-cyan-500 to-blue-700" },
  { match: "plomer", icon: Wrench, title: "Plomería", description: "Destapes, baños, cocina, cañerías y urgencias coordinadas.", color: "from-blue-500 to-indigo-700" },
  { match: "abog", icon: Scale, title: "Legales", description: "Abogados para consultas laborales, familia, contratos y reclamos.", color: "from-indigo-500 to-blue-700" },
  { match: "cont", icon: Calculator, title: "Contabilidad", description: "Monotributo, impuestos, balances y asesoramiento para negocios.", color: "from-emerald-400 to-teal-600" },
  { match: "psic", icon: Brain, title: "Salud mental", description: "Profesionales para orientación, terapia y acompañamiento.", color: "from-violet-400 to-fuchsia-600" },
  { match: "arqu", icon: DraftingCompass, title: "Arquitectura", description: "Planos, reformas, dirección de obra y habilitaciones.", color: "from-amber-400 to-orange-600" },
  { match: "salud", icon: HeartPulse, title: "Salud", description: "Turnos y consultas con profesionales verificados en la ciudad.", color: "from-rose-400 to-red-600" },
  { match: "coach", icon: Sparkles, title: "Desarrollo", description: "Mentorías, carrera, bienestar y mejora personal.", color: "from-cyan-400 to-blue-600" },
];

function getProfessionalCategoryMeta(category: string) {
  const normalized = normalizeText(category);
  return PROFESSIONAL_CATEGORY_META.find((item) => normalized.includes(item.match)) ?? {
    icon: BriefcaseBusiness,
    title: category,
    description: "Profesionales locales con reputación, agenda y contacto protegido.",
    color: "from-blue-500 to-cyan-500",
  };
}

function getProfessionalHeroImages(category?: string) {
  const label = normalizeText(category);
  if (label.includes("gas") || label.includes("calefactor") || label.includes("cocina")) {
    return [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  if (label.includes("plomer") || label.includes("perdida") || label.includes("bano")) {
    return [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  if (label.includes("abog") || label.includes("leg")) {
    return [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  if (label.includes("cont")) {
    return [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    ];
  }
  return [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
  ];
}

function getProfessionalHeroCaptions(category?: string) {
  const categoryName = category || "profesionales";
  return [
    {
      eyebrow: "Profesionales cerca tuyo",
      title: "Resolvé con alguien de confianza",
      description: `Encontrá ${categoryName.toLowerCase()} con perfil, reputación y zonas de atención en Mar del Plata.`,
    },
    {
      eyebrow: "Reserva protegida",
      title: "Pedí turno sin vueltas",
      description: "Elegí profesional, coordiná horario y mantené la operación ordenada dentro de MDP Market.",
    },
    {
      eyebrow: "Servicios locales",
      title: "Menos búsqueda, más solución",
      description: "Filtrá por rubro, verificación y zona para llegar más rápido al perfil correcto.",
    },
  ];
}

function ProfessionalPromoWidgets({ onVerifiedClick }: { onVerifiedClick: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-slate-950 p-5 text-white shadow-xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">
          <BadgeCheck className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">Profesionales verificados</p>
        <p className="mt-2 text-xs leading-5 text-blue-100">Priorizá perfiles con identidad validada, reputación y respuesta clara.</p>
        <button onClick={onVerifiedClick} className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">
          Ver verificados
        </button>
      </div>
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-950">Consulta protegida MDP</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">Contactá sin perder el hilo: pedido, presupuesto y reserva quedan ordenados.</p>
      </div>
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Publicidad local</p>
        <p className="mt-2 text-sm font-semibold text-slate-950">Estudio Contable Centro</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">Alta de monotributo, facturación y consultas para emprendedores.</p>
      </div>
      <div className="rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">
          <BadgePercent className="h-3.5 w-3.5" />
          Perfil destacado
        </div>
        <p className="text-sm font-semibold text-slate-950">Publicá como profesional</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">Aparecé en tu rubro y recibí solicitudes de Mar del Plata.</p>
      </div>
    </div>
  );
}

function normalizeText(value?: string | null) {
  return (value ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toCardProfessional(professional: ProfessionalRow) {
  const ratingValue = typeof professional.rating === "number"
    ? professional.rating
    : professional.rating?.average ?? 0;

  return {
    id: professional.id,
    name: professional.name,
    slug: professional.slug,
    avatar: professional.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`,
    profession: professional.profession || professional.category || "Profesional local",
    category: professional.category || "Servicios",
    subcategories: professional.subcategories || [],
    headline: professional.headline || `${professional.profession || "Profesional"} en Mar del Plata`,
    bio: professional.bio || "Profesional verificado en MDP Market.",
    verified: Boolean(professional.verified),
    featured: Boolean(professional.featured),
    rating: {
      average: ratingValue,
      totalReviews: 0,
      punctuality: ratingValue,
      quality: ratingValue,
      communication: ratingValue,
      value: ratingValue,
    },
    stats: {
      completedJobs: professional.completedJobs ?? professional.completed_jobs ?? 0,
      repeatClients: 0,
      responseTime: "A coordinar",
      memberSince: "",
    },
    zones: professional.zones || (professional.zone ? [professional.zone] : []),
    services: [],
    priceFrom: professional.priceFrom ?? professional.price_from ?? 15000,
    availability: "Consultar",
  };
}

function ProfessionalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [professionals, setProfessionals] = useState<ProfessionalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [selectedZone, setSelectedZone] = useState(searchParams.get("zone") ?? "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");

  useEffect(() => {
    async function loadProfessionals() {
      setLoading(true);
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .order("featured", { ascending: false })
        .order("verified", { ascending: false })
        .limit(80);

      if (error) {
        console.error("Error loading professionals:", error);
        setProfessionals([]);
      } else {
        setProfessionals((data ?? []) as ProfessionalRow[]);
      }
      setLoading(false);
    }

    loadProfessionals();
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setSearchQuery(searchParams.get("q") ?? "");
      setSelectedCategory(searchParams.get("category") ?? "");
      setSelectedZone(searchParams.get("zone") ?? "");
      setVerifiedOnly(searchParams.get("verified") === "true");
    });
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    professionals.forEach((professional) => {
      if (professional.category) set.add(professional.category);
      professional.subcategories?.forEach((subcategory) => set.add(subcategory));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [professionals]);

  const zones = useMemo(() => {
    const set = new Set(FALLBACK_ZONES);
    professionals.forEach((professional) => {
      professional.zones?.forEach((zone) => set.add(zone));
      if (professional.zone) set.add(professional.zone);
    });
    return Array.from(set).slice(0, 14);
  }, [professionals]);

  const updateUrl = (next?: { q?: string; category?: string; zone?: string; verified?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());
    const q = next?.q ?? searchQuery;
    const category = next?.category ?? selectedCategory;
    const zone = next?.zone ?? selectedZone;
    const verified = next?.verified ?? verifiedOnly;

    q ? params.set("q", q) : params.delete("q");
    category ? params.set("category", category) : params.delete("category");
    zone ? params.set("zone", zone) : params.delete("zone");
    verified ? params.set("verified", "true") : params.delete("verified");
    router.push(`/profesionales?${params.toString()}`, { scroll: false });
  };

  const filteredProfessionals = professionals.filter((professional) => {
    const q = normalizeText(searchQuery);
    if (q) {
      const haystack = [
        professional.name,
        professional.profession,
        professional.category,
        professional.headline,
        professional.bio,
        ...(professional.subcategories ?? []),
      ].map(normalizeText).join(" ");
      if (!haystack.includes(q)) return false;
    }

    if (selectedCategory) {
      const categoryNeedle = normalizeText(selectedCategory);
      const categoryMatch =
        normalizeText(professional.category).includes(categoryNeedle) ||
        (professional.subcategories ?? []).some((subcategory) => normalizeText(subcategory).includes(categoryNeedle));
      if (!categoryMatch) return false;
    }

    if (selectedZone) {
      const professionalZones = professional.zones || (professional.zone ? [professional.zone] : []);
      if (!professionalZones.some((zone) => normalizeText(zone) === normalizeText(selectedZone))) return false;
    }

    if (verifiedOnly && !professional.verified) return false;
    return true;
  });

  const shouldShowCategories = !selectedCategory && !searchQuery && !selectedZone && !verifiedOnly;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Profesionales en Mar del Plata
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Expertos certificados con reputación verificada
            </p>
          </div>

          <div className="max-w-2xl bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-1.5">
            <div className="flex-grow flex items-center px-4 gap-3 py-2.5 bg-white rounded-xl">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateUrl();
                }}
                placeholder="¿Qué profesional buscás?"
                className="w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
              />
            </div>
            <button onClick={() => updateUrl()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-xl transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shouldShowCategories ? (
          <section>
            <div className="mb-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]">
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="relative max-w-2xl">
                  <p className="text-sm font-semibold text-blue-200">Profesionales MDP</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Encontrá el profesional correcto</h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                    Elegí rubro, revisá perfiles verificados y reservá con operación protegida dentro de Mar del Plata.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button onClick={() => updateUrl({ verified: true })} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">
                      Ver verificados
                    </button>
                    <a href="#categorias-profesionales" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                      Elegir rubro
                    </a>
                  </div>
                </div>
              </div>
              <CategoryHeroSlider
                images={getProfessionalHeroImages()}
                title="Profesionales en Mar del Plata"
                captions={getProfessionalHeroCaptions()}
              />
            </div>
            <div id="categorias-profesionales" className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Categorías profesionales</h2>
              <p className="mt-1 text-sm text-slate-500">Primero elegís el rubro; después ves profesionales disponibles.</p>
            </div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="h-36 animate-pulse rounded-3xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.map((category) => {
                    const count = professionals.filter((professional) =>
                      normalizeText(professional.category).includes(normalizeText(category)) ||
                      (professional.subcategories ?? []).some((subcategory) => normalizeText(subcategory).includes(normalizeText(category)))
                    ).length;
                    const featuredCount = professionals.filter((professional) =>
                      professional.featured && (
                        normalizeText(professional.category).includes(normalizeText(category)) ||
                        (professional.subcategories ?? []).some((subcategory) => normalizeText(subcategory).includes(normalizeText(category)))
                      )
                    ).length;
                    const meta = getProfessionalCategoryMeta(category);
                    const Icon = meta.icon;

                    return (
                      <button
                        key={category}
                        onClick={() => updateUrl({ category })}
                        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-[0_16px_44px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_26px_76px_rgba(15,23,42,0.16)]"
                      >
                        <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${meta.color} opacity-15 transition group-hover:scale-125 group-hover:opacity-25`} />
                        <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-md transition group-hover:-rotate-6 group-hover:scale-110`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <p className="relative text-lg font-semibold text-slate-950">{meta.title}</p>
                        <p className="relative mt-2 min-h-[40px] text-sm leading-5 text-slate-500">{meta.description}</p>
                        <div className="relative mt-5 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{count} profesionales</span>
                          {featuredCount > 0 && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{featuredCount} destacados</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <button
                    onClick={() => updateUrl({ verified: true })}
                    className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-slate-950 p-6 text-left text-white shadow-[0_24px_70px_rgba(37,99,235,0.22)] transition hover:-translate-y-1"
                  >
                    <BadgeCheck className="mb-5 h-7 w-7" />
                    <p className="text-lg font-semibold">Profesionales verificados</p>
                    <p className="mt-2 text-sm leading-6 text-blue-100">Filtrá perfiles con identidad validada y reputación visible.</p>
                  </button>
                  <button
                    onClick={() => updateUrl({ category: "Contabilidad" })}
                    className="rounded-3xl border border-emerald-100 bg-white p-6 text-left shadow-[0_16px_44px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.16)]"
                  >
                    <Calculator className="mb-5 h-7 w-7 text-emerald-600" />
                    <p className="text-lg font-semibold text-slate-950">Pack emprendedor</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Contadores, marcas, legales y asesoría para vender mejor.</p>
                  </button>
                  <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
                    <BadgePercent className="mb-5 h-7 w-7 text-amber-600" />
                    <p className="text-lg font-semibold text-slate-950">Publicidad profesional</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Espacios destacados para estudios, consultorios y especialistas locales.</p>
                  </div>
                </div>
              </>
            )}
          </section>
        ) : (
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          <aside
            className={cn(
              "fixed inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-0 lg:block transition-transform duration-300 transform",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
          >
            <div className="h-full lg:h-auto overflow-y-auto p-6 lg:p-6 lg:sticky lg:top-24 lg:bg-white lg:rounded-3xl lg:border lg:border-slate-200 lg:shadow-sm">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="hidden lg:block mb-6">
                <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
              </div>

              <div className="space-y-6">
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Categoría</h3>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => {
                              const value = selectedCategory === category ? "" : category;
                              setSelectedCategory(value);
                              updateUrl({ category: value });
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Zona</h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {zones.map((zone) => (
                      <label key={zone} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="zone"
                          checked={selectedZone === zone}
                          onChange={() => {
                            const value = selectedZone === zone ? "" : zone;
                            setSelectedZone(value);
                            updateUrl({ zone: value });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                          {zone}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Verificación</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => {
                        setVerifiedOnly(e.target.checked);
                        updateUrl({ verified: e.target.checked });
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                      Matrícula verificada
                    </span>
                  </label>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Garantía Profesional</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Los profesionales verificados han validado su identidad y/o matrícula.
                      </p>
                    </div>
                  </div>
                </div>
                <ProfessionalPromoWidgets onVerifiedClick={() => updateUrl({ verified: true })} />
              </div>
            </div>
          </aside>

          <div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-950">{filteredProfessionals.length}</h2>
                <span className="text-sm text-slate-600">profesionales encontrados</span>
              </div>
              <button
                className="lg:hidden p-2 bg-slate-50 rounded-lg border border-slate-200"
                onClick={() => setIsSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
                ))}
              </div>
            ) : filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={toCardProfessional(professional)} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
                <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-950">No encontramos profesionales</h3>
                <p className="mt-2 text-sm text-slate-500">Probá cambiar la categoría, zona o búsqueda.</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-12 text-center text-sm font-semibold text-slate-500">Cargando profesionales...</div>}>
      <ProfessionalsContent />
    </Suspense>
  );
}
