import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn, formatPrice } from "@/lib/utils";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { DetailSection, FAQSection, FinalCTASection, StepsExplainer, TrustMiniCard, miniPanelClass, panelClass, stickyPanelClass } from "@/components/marketplace/detail/DetailContinuity";

export const dynamic = "force-dynamic";

type ProfessionalRow = Record<string, any>;

const FALLBACK_PROFESSIONALS: Record<string, ProfessionalRow> = {
  "juan-perez-gasista": {
    id: "juan-perez-gasista",
    name: "Juan Pérez",
    slug: "juan-perez-gasista",
    profession: "Gasista matriculado",
    category: "Gas",
    headline: "Gasista en Mar del Plata para instalaciones, pérdidas, cocinas y calefactores.",
    bio: "Atención local para trabajos de gas, revisión de artefactos, conexiones, pérdidas y mantenimiento preventivo. Reserva protegida y coordinación dentro de Mar del Plata.",
    verified: true,
    featured: true,
    rating: 4.8,
    completed_jobs: 32,
    response_time: "Menos de 2 horas",
    zone: "Centro",
    zones: ["Centro", "Güemes", "La Perla", "Constitución"],
    price_from: 25000,
    services: [
      {
        id: "visita-gas",
        title: "Visita técnica de gas",
        description: "Revisión inicial, diagnóstico y presupuesto para instalaciones o reparaciones.",
        price_from: 25000,
      },
      {
        id: "calefactor-gas",
        title: "Service de calefactor",
        description: "Limpieza, control, encendido y revisión de seguridad.",
        price_from: 32000,
      },
    ],
  },
};

function ratingValue(professional: ProfessionalRow) {
  if (typeof professional.rating === "number") return professional.rating;
  return professional.rating?.average ?? 0;
}

function normalizeProfessional(row: ProfessionalRow) {
  const rating = ratingValue(row);
  const zones = Array.isArray(row.zones) ? row.zones : (row.zone ? [row.zone] : []);
  const priceFrom = Number(row.priceFrom ?? row.price_from ?? 0);
  const completedJobs = Number(row.completedJobs ?? row.completed_jobs ?? row.stats?.completedJobs ?? 0);

  return {
    id: row.id,
    name: row.name || "Profesional MDP",
    slug: row.slug || row.id,
    avatar: row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.name || row.id)}`,
    coverImage: row.coverImage || row.cover_image || row.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(row.name || row.id)}`,
    profession: row.profession || row.category || "Profesional local",
    category: row.category || "Servicios",
    headline: row.headline || `${row.profession || row.category || "Profesional"} en Mar del Plata`,
    bio: row.bio || "Profesional de MDP Market, con atención por zonas, reputación visible y reserva protegida.",
    verified: Boolean(row.verified),
    featured: Boolean(row.featured),
    rating,
    totalReviews: row.rating?.totalReviews ?? row.total_reviews ?? 0,
    responseTime: row.responseTime ?? row.response_time ?? row.stats?.responseTime ?? "A coordinar",
    completedJobs,
    zones,
    priceFrom,
    services: Array.isArray(row.services) ? row.services : [],
    portfolio: Array.isArray(row.portfolio) ? row.portfolio : [],
    credentials: Array.isArray(row.credentials) ? row.credentials : [],
  };
}

function toCardProfessional(professional: ProfessionalRow) {
  const rating = typeof professional.rating === "number" ? professional.rating : professional.rating?.average ?? 0;
  return {
    id: professional.id,
    name: professional.name || "Profesional MDP",
    slug: professional.slug || professional.id,
    avatar: professional.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name || professional.id}`,
    profession: professional.profession || professional.category || "Profesional local",
    category: professional.category || "Servicios",
    subcategories: professional.subcategories || [],
    headline: professional.headline || `${professional.profession || "Profesional"} en Mar del Plata`,
    bio: professional.bio || "Profesional de MDP Market.",
    verified: Boolean(professional.verified),
    featured: Boolean(professional.featured),
    rating: {
      average: rating,
      totalReviews: professional.total_reviews ?? 0,
      punctuality: rating,
      quality: rating,
      communication: rating,
      value: rating,
    },
    stats: {
      completedJobs: professional.completedJobs ?? professional.completed_jobs ?? 0,
      repeatClients: 0,
      responseTime: professional.responseTime ?? professional.response_time ?? "A coordinar",
      memberSince: "",
    },
    zones: professional.zones || (professional.zone ? [professional.zone] : []),
    services: [],
    priceFrom: professional.priceFrom ?? professional.price_from ?? 15000,
    availability: "Consultar",
  };
}

export default async function ProfessionalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("professionals")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .maybeSingle();

  if (error) {
    console.error("Error loading professional detail:", error);
  }

  const row = data ?? FALLBACK_PROFESSIONALS[slug];

  if (!row) {
    notFound();
  }

  const professional = normalizeProfessional(row);
  const [{ data: servicesData }, { data: professionalsData }] = await Promise.all([
    supabase.from("services").select("*").eq("status", "published").limit(80),
    supabase.from("professionals").select("*").neq("id", professional.id).limit(80),
  ]);
  const serviceRows = (servicesData ?? []) as any[];
  const professionalRows = (professionalsData ?? []) as ProfessionalRow[];
  const relatedServices = serviceRows
    .filter((service) => {
      const haystack = `${service.professional_profile_id ?? ""} ${service.professionalId ?? ""} ${service.professional_id ?? ""} ${service.professionalName ?? ""} ${service.professional_name ?? ""} ${service.category ?? ""} ${service.subcategory ?? ""} ${service.specialty ?? ""}`.toLowerCase();
      return haystack.includes(String(professional.id).toLowerCase()) ||
        haystack.includes(professional.name.toLowerCase()) ||
        haystack.includes(professional.category.toLowerCase()) ||
        haystack.includes(professional.profession.toLowerCase());
    })
    .slice(0, 8);
  const fallbackServices = serviceRows.filter((service) => !relatedServices.some((item) => item.id === service.id)).slice(0, 8 - relatedServices.length);
  const servicesForSections = [...relatedServices, ...fallbackServices].slice(0, 8);
  const similarProfessionals = professionalRows
    .filter((item) => {
      const haystack = `${item.profession ?? ""} ${item.category ?? ""} ${(item.subcategories ?? []).join(" ")} ${(item.zones ?? []).join(" ")} ${item.zone ?? ""}`.toLowerCase();
      return haystack.includes(professional.category.toLowerCase()) ||
        haystack.includes(professional.profession.toLowerCase()) ||
        professional.zones.some((zone: string) => haystack.includes(zone.toLowerCase()));
    })
    .slice(0, 8);
  const serviceCards = professional.services.map((service: any, index: number) => {
    if (typeof service === "string") {
      return {
        id: `${professional.id}-service-${index}`,
        title: service,
        description: "Servicio disponible con presupuesto y coordinación protegida.",
        priceFrom: professional.priceFrom,
      };
    }
    return {
      id: service.id || `${professional.id}-service-${index}`,
      title: service.title || service.name || "Servicio profesional",
      description: service.description || "Servicio disponible con presupuesto y coordinación protegida.",
      priceFrom: Number(service.priceFrom ?? service.price_from ?? professional.priceFrom ?? 0),
    };
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">Inicio</Link>
          <span>/</span>
          <Link href="/profesionales" className="hover:text-blue-600">Profesionales</Link>
          <span>/</span>
          <span className="font-medium text-slate-900">{professional.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
              <div className="relative h-44 bg-slate-200">
                <img src={professional.coverImage} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
              </div>
              <div className="p-6">
                <div className="-mt-16 mb-5 flex items-end justify-between gap-4">
                  <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg">
                    <img src={professional.avatar} alt={professional.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-wrap gap-2 pb-2">
                    {professional.featured && (
                      <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">Destacado</span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-medium text-blue-600">{professional.profession}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{professional.name}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{professional.headline}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Star className="mb-2 h-5 w-5 fill-amber-400 text-amber-400" />
                    <p className="text-lg font-semibold text-slate-950">{professional.rating.toFixed(1)}</p>
                    <p className="text-xs text-slate-500">{professional.totalReviews} opiniones</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Briefcase className="mb-2 h-5 w-5 text-blue-600" />
                    <p className="text-lg font-semibold text-slate-950">{professional.completedJobs}</p>
                    <p className="text-xs text-slate-500">trabajos realizados</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Clock className="mb-2 h-5 w-5 text-emerald-600" />
                    <p className="text-lg font-semibold text-slate-950">{professional.responseTime}</p>
                    <p className="text-xs text-slate-500">tiempo de respuesta</p>
                  </div>
                </div>
              </div>
            </div>

            <section className={panelClass}>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Sobre el profesional</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{professional.bio}</p>
              {professional.zones.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-slate-900">Zonas de atención</p>
                  <div className="flex flex-wrap gap-2">
                    {professional.zones.map((zone: string) => (
                      <span key={zone} className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">{zone}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className={panelClass}>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Servicios ofrecidos</h2>
              {serviceCards.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {serviceCards.map((service: any) => (
                    <article key={service.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h3 className="font-semibold text-slate-950">{service.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{service.description}</p>
                      <p className="mt-4 text-lg font-semibold text-slate-950">
                        {service.priceFrom > 0 ? `Desde ${formatPrice(service.priceFrom)}` : "A presupuestar"}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-medium text-slate-700">Este profesional todavía no cargó servicios específicos.</p>
                  <p className="mt-1 text-sm text-slate-500">Podés consultar por chat o pedir presupuesto protegido.</p>
                </div>
              )}
            </section>

            <section className={panelClass}>
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Verificaciones
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Identidad revisada", "Perfil activo", "Contacto validado", "Operación protegida disponible"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
              {professional.credentials.length > 0 && (
                <div className="mt-5 space-y-2">
                  {professional.credentials.map((credential: any, index: number) => (
                    <div key={credential.name || index} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                      <Award className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{credential.name || credential.type}</p>
                        <p className="text-xs text-slate-500">{credential.status || "Validado"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>

          <aside className="hidden lg:block">
            <div className={stickyPanelClass}>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Panel de operación</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Reservar profesional</h2>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Presupuesto inicial</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {professional.priceFrom > 0 ? `Desde ${formatPrice(professional.priceFrom)}` : "A presupuestar"}
              </p>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Reserva protegida
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-800/80">
                  El pago queda protegido hasta que confirmes el servicio realizado.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <Link
                  href={`/checkout/profesional?professional=${professional.id}&title=${encodeURIComponent(professional.profession)}&professionalName=${encodeURIComponent(professional.name)}&price=${professional.priceFrom || 0}`}
                  className={cn(
                    "flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  Reservar profesional
                </Link>
                <Link
                  href={`/chat?professional=${professional.id}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Consultar
                </Link>
                <Link
                  href={`/pedir-servicio?professional=${professional.id}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4" />
                  Solicitar presupuesto
                </Link>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {professional.zones[0] || "Mar del Plata"}
                </p>
                <Link href="/profesionales" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Ver más profesionales <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className={miniPanelClass}>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Seguridad MDP
              </p>
              <div className="mt-4 space-y-3">
                {["Identidad revisada", "Contacto validado", "Reserva protegida", "Soporte disponible"].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <TrustMiniCard title="Reserva protegida" description="Pedido, presupuesto y reserva quedan registrados para dar seguimiento dentro de MDP Market." />
            {similarProfessionals.length > 0 && (
              <div className={miniPanelClass}>
                <p className="text-sm font-semibold text-slate-950">Más profesionales</p>
                <div className="mt-4 space-y-3">
                  {similarProfessionals.slice(0, 3).map((item) => (
                    <Link key={item.id} href={`/profesionales/${item.slug || item.id}`} className="block rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            </div>
          </aside>
        </div>

        <section className="mt-8 space-y-6">
          <section className={panelClass}>
            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                <img src={professional.coverImage} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Experiencia comprobable</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Trabajos realizados en Mar del Plata</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Perfil con actividad, zonas de atención y reserva protegida para comparar antes de avanzar.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <strong className="block text-xl text-slate-950">{professional.completedJobs || "Activo"}</strong>
                    <span className="text-xs text-slate-500">trabajos</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <strong className="block text-xl text-slate-950">{professional.rating.toFixed(1)}</strong>
                    <span className="text-xs text-slate-500">calificación</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <strong className="block text-xl text-slate-950">{professional.responseTime}</strong>
                    <span className="text-xs text-slate-500">respuesta</span>
                  </div>
                </div>
                {professional.zones.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {professional.zones.slice(0, 5).map((zone: string) => (
                      <span key={zone} className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
                        {zone}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <DetailSection eyebrow="Disponibilidad" title="Disponibilidad horaria" description="Coordiná una franja antes de confirmar la reserva.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Hoy 16 a 19", "Mañana 10 a 13", "Mañana 16 a 19", "Coordinar por chat"].map((slot) => (
                <div key={slot} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800">{slot}</div>
              ))}
            </div>
          </DetailSection>

          {servicesForSections.length > 0 && (
            <DetailSection eyebrow="Servicios relacionados" title="Otros servicios que pueden interesarte" description="Opciones reales disponibles en Mar del Plata." href={`/servicios?category=${encodeURIComponent(professional.category)}`}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {servicesForSections.slice(0, 8).map((service) => <ServiceCard key={service.id} service={service} />)}
              </div>
            </DetailSection>
          )}

          {similarProfessionals.length > 0 && (
            <DetailSection eyebrow="Profesionales similares" title={`Más opciones en ${professional.category}`} description="Perfiles relacionados por rubro, especialidad o zona." href={`/profesionales?category=${encodeURIComponent(professional.category)}`}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {similarProfessionals.slice(0, 8).map((item) => <ProfessionalCard key={item.id} professional={toCardProfessional(item)} />)}
              </div>
            </DetailSection>
          )}

          <StepsExplainer
            title="Cómo funciona la reserva protegida"
            steps={[
              "Elegís el servicio.",
              "Indicás día, horario y zona.",
              "El profesional confirma disponibilidad.",
              "El trabajo se realiza.",
              "Confirmás la finalización.",
            ]}
          />

          <FAQSection
            items={[
              { question: "¿Qué significa reserva protegida?", answer: "La solicitud queda registrada y el pago se libera cuando confirmás que el trabajo fue realizado." },
              { question: "¿Puedo pedir presupuesto antes de reservar?", answer: "Sí. Podés consultar o solicitar presupuesto desde el panel derecho." },
              { question: "¿Qué pasa si el profesional no confirma?", answer: "La operación no avanza y podés elegir otro profesional o pedir soporte." },
              { question: "¿Se comparten mis datos personales?", answer: "Los datos se usan para coordinar la operación dentro de MDP Market." },
            ]}
          />

          <FinalCTASection
            title="¿Querés resolverlo con un profesional?"
            description="Reservá, consultá o pedí presupuesto sin compartir tus datos antes de confirmar."
            primaryHref={`/checkout/profesional?professional=${professional.id}&title=${encodeURIComponent(professional.profession)}&professionalName=${encodeURIComponent(professional.name)}&price=${professional.priceFrom || 0}`}
            primaryLabel="Reservar profesional"
            secondaryHref="/profesionales"
            secondaryLabel="Ver más profesionales"
          />
        </section>
      </div>
    </main>
  );
}
