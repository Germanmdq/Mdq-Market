"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Award, Search, SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";

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
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Elegí una categoría profesional</h2>
              <p className="mt-1 text-sm text-slate-500">Primero elegís el rubro; después ves profesionales disponibles.</p>
            </div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="h-36 animate-pulse rounded-3xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => {
                  const count = professionals.filter((professional) =>
                    normalizeText(professional.category).includes(normalizeText(category)) ||
                    (professional.subcategories ?? []).some((subcategory) => normalizeText(subcategory).includes(normalizeText(category)))
                  ).length;

                  return (
                    <button
                      key={category}
                      onClick={() => updateUrl({ category })}
                      className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                      <p className="text-lg font-semibold text-slate-950">{category}</p>
                      <p className="mt-2 text-sm text-slate-500">{count} profesionales disponibles</p>
                    </button>
                  );
                })}
              </div>
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
