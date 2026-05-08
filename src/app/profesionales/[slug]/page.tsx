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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
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

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
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

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
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

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
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

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Presupuesto inicial</p>
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
          </aside>
        </div>
      </div>
    </main>
  );
}
