"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronDown,
  Briefcase,
  ShieldCheck,
  Zap,
  Sparkles,
  BadgePercent,
  Clock,
  Wrench,
  Home,
  Droplets,
  Paintbrush,
  Flame,
  KeyRound,
  HeartPulse
} from "lucide-react";
import ServiceCard from "@/components/marketplace/ServiceCard";
import { cn } from "@/lib/utils";
import { getPublishedServices } from "@/lib/services";
import { trackActivity } from "@/lib/activity";
import { Service } from "@/types";

const ZONES = [
  "Centro", "Güemes", "Constitución", "La Perla", "Playa Grande",
  "Punta Mogotes", "Camet", "Los Troncos", "Parque Camet"
];

const SERVICE_CATEGORY_META = [
  { match: "electric", icon: Zap, title: "Electricidad", description: "Urgencias, tableros, instalaciones y reparaciones seguras.", color: "from-amber-400 to-orange-500" },
  { match: "plomer", icon: Droplets, title: "Plomería", description: "Pérdidas, baños, cocina, destapes y mantenimiento.", color: "from-sky-400 to-blue-600" },
  { match: "gas", icon: Flame, title: "Gas", description: "Gasistas, calefactores, cocina y revisiones para hoy.", color: "from-red-400 to-rose-600" },
  { match: "pint", icon: Paintbrush, title: "Pintura", description: "Interiores, exteriores, retoques y renovación de ambientes.", color: "from-violet-400 to-fuchsia-600" },
  { match: "cerraj", icon: KeyRound, title: "Cerrajería", description: "Aperturas, cambios de cerradura y copias de llaves.", color: "from-slate-500 to-slate-800" },
  { match: "limp", icon: Sparkles, title: "Limpieza", description: "Hogar, obra, patio, vidrios y servicios recurrentes.", color: "from-emerald-400 to-teal-600" },
  { match: "nutric", icon: HeartPulse, title: "Bienestar", description: "Planes, salud, hábitos y profesionales de cuidado.", color: "from-pink-400 to-rose-500" },
  { match: "hogar", icon: Home, title: "Hogar", description: "Arreglos y mejoras para mantener la casa al día.", color: "from-blue-400 to-indigo-600" },
];

function getServiceCategoryMeta(category: string) {
  const normalized = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return SERVICE_CATEGORY_META.find((item) => normalized.includes(item.match)) ?? {
    icon: Wrench,
    title: category,
    description: "Servicios locales verificados, con reserva protegida y coordinación MDP.",
    color: "from-blue-500 to-cyan-500",
  };
}

function PromoWidgets({ onUrgentClick }: { onUrgentClick: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
          <BadgePercent className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-950">Promo servicios del mes</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">10% bonificado en la primera reserva protegida para barrios seleccionados.</p>
      </div>
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-slate-950 p-5 text-white shadow-xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">
          <Clock className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">Urgencias MDP</p>
        <p className="mt-2 text-xs leading-5 text-blue-100">Electricistas, gasistas y plomeros con disponibilidad para hoy.</p>
        <button onClick={onUrgentClick} className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">
          Ver urgentes
        </button>
      </div>
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Publicidad local</p>
        <p className="mt-2 text-sm font-semibold text-slate-950">La Ferretería de Güemes</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">Herramientas, sanitarios y electricidad con entrega en el día.</p>
      </div>
    </div>
  );
}

function ServiciosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedZone, setSelectedZone] = useState<string>(searchParams.get("zone") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") ?? "");
  const [availableToday, setAvailableToday] = useState(searchParams.get("availableToday") === "true");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const data = await getPublishedServices();
      setServices(data);
      setLoading(false);
    };
    loadServices();
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const query = searchParams.get("q") ?? "";
      setSearchQuery(query);
      setSelectedZone(searchParams.get("zone") ?? "");
      setSelectedCategory(searchParams.get("category") ?? "");
      setAvailableToday(searchParams.get("availableToday") === "true");
      setVerifiedOnly(searchParams.get("verified") === "true");
      if (query) {
        trackActivity({
          event_type: "search",
          entity_type: "search",
          search_query: query,
          metadata: {
            source: "services_url",
            availableToday: searchParams.get("availableToday") === "true",
            zone: searchParams.get("zone"),
          },
        });
      }
    });
  }, [searchParams]);

  const updateUrl = (next?: { q?: string; zone?: string; category?: string; availableToday?: boolean; verified?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());
    const q = next?.q ?? searchQuery;
    const zone = next?.zone ?? selectedZone;
    const category = next?.category ?? selectedCategory;
    const today = next?.availableToday ?? availableToday;
    const verified = next?.verified ?? verifiedOnly;

    if (q) params.set("q", q);
    else params.delete("q");
    if (zone) params.set("zone", zone);
    else params.delete("zone");
    if (category) params.set("category", category);
    else params.delete("category");
    if (today) params.set("availableToday", "true");
    else params.delete("availableToday");
    if (verified) params.set("verified", "true");
    else params.delete("verified");
    router.push(`/servicios?${params.toString()}`, { scroll: false });
  };

  const filteredServices = services.filter((s) => {
    if (selectedCategory && s.category !== selectedCategory && s.subcategory !== selectedCategory) {
      return false;
    }
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.professionalName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedZone && !s.zones.includes(selectedZone)) {
      return false;
    }
    if (availableToday && s.availability !== "Hoy") {
      return false;
    }
    if (verifiedOnly && !s.verified) {
      return false;
    }
    return true;
  });

  const categories = Array.from(
    new Map(
      services
        .filter((service) => service.category)
        .map((service) => [
          service.category,
          {
            name: service.category,
            count: services.filter((item) => item.category === service.category).length,
            today: services.filter((item) => item.category === service.category && item.availability === "Hoy").length,
          },
        ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const shouldShowCategories = !selectedCategory && !searchQuery && !selectedZone && !availableToday && !verifiedOnly;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Servicios en Mar del Plata
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Profesionales verificados con reserva protegida
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
                placeholder="¿Qué servicio necesitás?"
                className="w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
              />
            </div>
            <div className="flex-grow flex items-center px-4 gap-3 py-2.5 bg-white rounded-xl">
              <MapPin className="w-5 h-5 text-slate-400" />
              <select
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  updateUrl({ zone: e.target.value });
                }}
                className="w-full bg-transparent focus:outline-none text-slate-900 appearance-none cursor-pointer"
              >
                <option value="">Toda Mar del Plata</option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => updateUrl()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-xl transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shouldShowCategories ? (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Elegí una categoría de servicio</h2>
              <p className="mt-1 text-sm text-slate-500">Primero elegís el tipo de ayuda; después ves servicios y profesionales disponibles.</p>
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
                    const meta = getServiceCategoryMeta(category.name);
                    const Icon = meta.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => updateUrl({ category: category.name })}
                        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-[0_16px_44px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_26px_76px_rgba(15,23,42,0.16)]"
                      >
                        <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${meta.color} opacity-15 transition group-hover:scale-125 group-hover:opacity-25`} />
                        <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-md transition group-hover:-rotate-6 group-hover:scale-110`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <p className="relative text-lg font-semibold text-slate-950">{meta.title}</p>
                        <p className="relative mt-2 min-h-[40px] text-sm leading-5 text-slate-500">{meta.description}</p>
                        <div className="relative mt-5 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{category.count} servicios</span>
                          {category.today > 0 && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{category.today} hoy</span>
                          )}
                        </div>
                      </button>
                    );
                })}
              </div>
            )}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <button
                onClick={() => updateUrl({ availableToday: true })}
                className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-slate-950 p-6 text-left text-white shadow-[0_24px_70px_rgba(37,99,235,0.22)] transition hover:-translate-y-1"
              >
                <Clock className="mb-5 h-7 w-7" />
                <p className="text-lg font-semibold">Servicios urgentes</p>
                <p className="mt-2 text-sm leading-6 text-blue-100">Electricidad, gas, plomería y arreglos con disponibilidad para hoy.</p>
              </button>
              <button
                onClick={() => updateUrl({ verified: true })}
                className="rounded-3xl border border-emerald-100 bg-white p-6 text-left shadow-[0_16px_44px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.16)]"
              >
                <ShieldCheck className="mb-5 h-7 w-7 text-emerald-600" />
                <p className="text-lg font-semibold text-slate-950">Reserva protegida</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Elegí servicios verificados y mantené todo coordinado dentro de MDP Market.</p>
              </button>
              <Link
                href="/publicar?intent=servicio"
                className="rounded-3xl border border-amber-100 bg-amber-50 p-6 text-left shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.14)]"
              >
                <BadgePercent className="mb-5 h-7 w-7 text-amber-600" />
                <p className="text-lg font-semibold text-slate-950">Publicidad para servicios</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Espacios destacados para ferreterías, técnicos y comercios de barrio.</p>
              </Link>
            </div>
          </section>
        ) : (
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          {/* Sidebar Filters */}
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
                {/* Availability */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Categoría</h3>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {categories.map((category) => (
                      <label key={category.name} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.name}
                          onChange={() => {
                            const value = selectedCategory === category.name ? "" : category.name;
                            setSelectedCategory(value);
                            updateUrl({ category: value });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Disponibilidad</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={availableToday}
                      onChange={(e) => {
                        setAvailableToday(e.target.checked);
                        updateUrl({ availableToday: e.target.checked });
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                      Disponible hoy
                    </span>
                  </label>
                </div>

                {/* Verification */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Confianza</h3>
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
                      Profesionales verificados
                    </span>
                  </label>
                </div>

                {/* Info Card */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Reserva protegida</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        El pago queda retenido hasta que confirmes que el servicio se completó correctamente.
                      </p>
                    </div>
                  </div>
                </div>
                <PromoWidgets onUrgentClick={() => updateUrl({ availableToday: true })} />
              </div>
            </div>
          </aside>

          {/* List Area */}
          <div>
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-950">{filteredServices.length}</h2>
                <span className="text-sm text-slate-600">servicios encontrados</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  className="lg:hidden flex-grow flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-medium border border-slate-200"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </button>
                <div className="relative flex-grow sm:flex-grow-0">
                  <select className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
                    <option>Mejor calificados</option>
                    <option>Más recientes</option>
                    <option>Menor precio</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 mb-2">
                  No encontramos profesionales
                </h3>
                <p className="text-sm text-slate-600">
                  Probá ajustando los filtros o la búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            ¿Sos profesional o tenés una empresa de servicios?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Unite a la red de servicios más confiable de Mar del Plata y empezá a recibir pedidos hoy.
          </p>
          <Link
            href="/alta-profesional"
            className="inline-flex bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            Quiero sumarme
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-12 text-center text-sm font-semibold text-slate-500">Cargando servicios...</div>}>
      <ServiciosContent />
    </Suspense>
  );
}
