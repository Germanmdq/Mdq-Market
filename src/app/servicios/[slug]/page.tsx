import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Award,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getServiceBySlug } from "@/lib/services";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ServiceCard from "@/components/marketplace/ServiceCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { DetailSection, FAQSection, FinalCTASection, StepsExplainer, TrustMiniCard, miniPanelClass, panelClass, stickyPanelClass } from "@/components/marketplace/detail/DetailContinuity";

export const dynamic = "force-dynamic";

function toCardProfessional(professional: any) {
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
    rating: { average: rating, totalReviews: 0, punctuality: rating, quality: rating, communication: rating, value: rating },
    stats: { completedJobs: professional.completedJobs ?? professional.completed_jobs ?? 0, repeatClients: 0, responseTime: professional.responseTime ?? professional.response_time ?? "A coordinar", memberSince: "" },
    zones: professional.zones || (professional.zone ? [professional.zone] : []),
    services: [],
    priceFrom: professional.priceFrom ?? professional.price_from ?? 15000,
    availability: "Consultar",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Defensive fallbacks
  const serviceAny = service as any;
  const completedJobs = service.completedJobs ?? serviceAny.completed_jobs ?? 0;
  const rating = Number(service.rating ?? 0);
  const reviewsCount = Array.isArray(service.reviews) ? service.reviews.length : (service.reviews ?? 0);
  const mainImage = service.image_url || service.image || "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1200&auto=format&fit=crop";
  const gallery = service.gallery?.length ? service.gallery : [mainImage];
  const zones = Array.isArray(service.zones) ? service.zones : (serviceAny.zone ? [serviceAny.zone] : []);
  const responseTime = service.responseTime || serviceAny.response_time || "A coordinar";
  const availability = service.availability || "Disponible";
  const specialty = service.specialty || service.subcategory || service.category;
  const description = service.description || "Servicio profesional en MDP Market con reserva protegida.";
  const professionalName = service.professionalName || serviceAny.professional_name || "Profesional MDP";
  const priceFrom = Number(service.priceFrom ?? serviceAny.price_from ?? 0);
  const [{ data: servicesData }, { data: professionalsData }] = await Promise.all([
    supabase.from("services").select("*").eq("status", "published").neq("id", service.id).limit(80),
    supabase.from("professionals").select("*").limit(80),
  ]);
  const allServices = (servicesData ?? []) as any[];
  const similarServices = allServices
    .filter((item) => {
      const haystack = `${item.category ?? ""} ${item.subcategory ?? ""} ${item.specialty ?? ""} ${item.professionalName ?? ""} ${item.professional_name ?? ""}`.toLowerCase();
      return haystack.includes(String(service.category ?? "").toLowerCase()) ||
        haystack.includes(String(service.subcategory ?? "").toLowerCase()) ||
        zones.some((zone: string) => haystack.includes(zone.toLowerCase()));
    })
    .slice(0, 8);
  const serviceFallback = allServices.filter((item) => !similarServices.some((related) => related.id === item.id)).slice(0, 8 - similarServices.length);
  const servicesForSections = [...similarServices, ...serviceFallback].slice(0, 8);
  const professionalsForService = ((professionalsData ?? []) as any[])
    .filter((professional) => {
      const haystack = `${professional.name ?? ""} ${professional.profession ?? ""} ${professional.category ?? ""} ${(professional.subcategories ?? []).join(" ")} ${(professional.zones ?? []).join(" ")} ${professional.zone ?? ""}`.toLowerCase();
      return haystack.includes(String(service.category ?? "").toLowerCase()) ||
        haystack.includes(String(service.subcategory ?? "").toLowerCase()) ||
        haystack.includes(professionalName.toLowerCase()) ||
        zones.some((zone: string) => haystack.includes(zone.toLowerCase()));
    })
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Banner / Breadcrumbs */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap text-sm text-gray-500 gap-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/servicios" className="hover:text-blue-600">Servicios</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{service.title}</span>
          </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left Column: Content */}
          <section className="min-w-0 space-y-5">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="relative aspect-[21/9] bg-gray-100">
                  <Image src={mainImage} alt={service.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {completedJobs} Trabajos realizados
                     </div>
                  </div>
               </div>

               <div className="p-6 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                     <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
                          {service.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                           <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-gray-900">{rating}</span>
                              <span className="text-gray-400">({reviewsCount} opiniones)</span>
                           </div>
                           <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                           <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{zones.join(", ")}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                           <Image 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${professionalName}`} 
                            alt={professionalName}
                            fill
                           />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Profesional</span>
                           <span className="font-bold text-gray-900">{professionalName}</span>
                        </div>
                     </div>
                  </div>

                  <div className="prose prose-blue max-w-none mb-12">
                     <h2 className="text-xl font-black mb-4">Sobre el servicio ({specialty})</h2>
                     <p className="text-gray-600 leading-relaxed text-lg">
                        {description}
                     </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100">
                     <div className="flex flex-col gap-1">
                        <Clock className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Respuesta</span>
                        <span className="font-bold text-gray-900">{responseTime}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <Calendar className="w-6 h-6 text-green-500 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Disponibilidad</span>
                        <span className="font-bold text-gray-900">{availability}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <Award className="w-6 h-6 text-purple-500 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Garantía</span>
                        <span className="font-bold text-gray-900">30 Días</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <ShieldCheck className="w-6 h-6 text-orange-500 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pago</span>
                        <span className="font-bold text-gray-900">Protegido</span>
                     </div>
                  </div>
               </div>
            </section>

            <section className={panelClass}>
              <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                    <Image src={gallery[0]} alt={`Trabajo de ${service.title}`} fill className="object-cover" />
                  </div>
                  {gallery.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {gallery.slice(1, 4).map((img, index) => (
                        <div key={`${img}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                          <Image src={img} alt={`Trabajo ${index + 2}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Experiencia comprobable</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Trabajos realizados y experiencia</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Este servicio combina atención por zona, presupuesto inicial y operación protegida para que puedas comparar antes de reservar.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <strong className="block text-xl text-slate-950">{completedJobs || "Activos"}</strong>
                      <span className="text-xs text-slate-500">trabajos</span>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <strong className="block text-xl text-slate-950">{rating.toFixed(1)}</strong>
                      <span className="text-xs text-slate-500">calificación</span>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <strong className="block text-xl text-slate-950">{responseTime}</strong>
                      <span className="text-xs text-slate-500">respuesta</span>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[specialty, ...zones].filter(Boolean).slice(0, 5).map((item) => (
                      <span key={item} className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </section>

          {/* Right Column: Booking Card */}
          <aside className="hidden lg:block">
            <div className={stickyPanelClass}>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_64px_rgba(15,23,42,0.10)]">
               <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Panel de operación</p>
               <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Reservar este servicio</h2>
               <div className="flex flex-col mb-8">
                  <span className="mt-5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Presupuesto inicial desde</span>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-blue-900">{priceFrom > 0 ? formatPrice(priceFrom) : "A presupuestar"}</span>
                     {priceFrom > 0 && <span className="text-gray-400 text-sm">/ visita</span>}
                  </div>
               </div>

               <div className="mb-6 grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Disponibilidad</span>
                    <strong className="text-slate-950">{availability}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Zona</span>
                    <strong className="text-slate-950">{zones[0] || "Mar del Plata"}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Respuesta</span>
                    <strong className="text-slate-950">{responseTime}</strong>
                  </div>
               </div>

               <div className="grid gap-3">
                  <Link 
                    href={`/checkout/profesional?service=${service.id}&title=${encodeURIComponent(service.title)}&professionalName=${encodeURIComponent(professionalName)}&price=${priceFrom || 0}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all text-center flex items-center justify-center gap-2"
                  >
                     <Calendar className="w-5 h-5" />
                     Reservar Turno Ahora
                  </Link>
                  <button className="w-full bg-white border-2 border-gray-200 text-gray-700 font-black py-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                     <MessageSquare className="w-5 h-5" />
                     Solicitar Presupuesto
                  </button>
               </div>

               <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
                  Al reservar aceptás los Términos de Servicio y la Política de Cancelación de MDP Market.
               </p>
            </div>

            <div className={miniPanelClass}>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Seguridad MDP
              </p>
              <div className="mt-4 space-y-3">
                {["Identidad revisada", "Contacto validado", "Operación protegida", "Soporte disponible"].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <TrustMiniCard title="Reserva protegida" description="El pedido, el presupuesto y la coordinación quedan ordenados dentro de MDP Market." />

            <div className={miniPanelClass}>
              <p className="text-sm font-semibold text-slate-950">También puede interesarte</p>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Servicios urgentes", href: "/servicios?availableToday=true" },
                  { label: "Profesionales similares", href: `/profesionales?category=${encodeURIComponent(service.category)}` },
                  { label: "Más de esta categoría", href: `/servicios?category=${encodeURIComponent(service.category)}` },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                    {item.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          </aside>
        </div>

        <section className="mt-8 space-y-6">
          {servicesForSections.length > 0 && (
            <DetailSection eyebrow="Servicios similares" title={`Más servicios de ${service.category}`} description="Alternativas reales para comparar antes de reservar." href={`/servicios?category=${encodeURIComponent(service.category)}`}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {servicesForSections.slice(0, 8).map((item) => <ServiceCard key={item.id} service={item} />)}
              </div>
            </DetailSection>
          )}

          {professionalsForService.length > 0 && (
            <DetailSection eyebrow="Profesionales" title="Profesionales que pueden ayudarte" description="Perfiles relacionados por rubro o zona." href={`/profesionales?category=${encodeURIComponent(service.category)}`}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {professionalsForService.slice(0, 8).map((professional) => <ProfessionalCard key={professional.id} professional={toCardProfessional(professional)} />)}
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
              { question: "¿Cómo se confirma la reserva?", answer: "La confirmación se hace cuando el profesional acepta disponibilidad y condiciones." },
              { question: "¿Puedo cambiar el horario?", answer: "Sí. Podés coordinar por chat antes de confirmar definitivamente." },
              { question: "¿Qué pasa si necesito urgencia?", answer: "Usá la disponibilidad para hoy o consultá antes de reservar." },
              { question: "¿El precio puede variar?", answer: "Si el alcance cambia, el profesional debe confirmarlo antes de avanzar." },
            ]}
          />

          <FinalCTASection
            title="Coordiná el servicio con reserva protegida."
            description="Elegí día, zona y horario para avanzar con más seguridad dentro de MDP Market."
            primaryHref={`/checkout/profesional?service=${service.id}&title=${encodeURIComponent(service.title)}&professionalName=${encodeURIComponent(professionalName)}&price=${priceFrom || 0}`}
            primaryLabel="Reservar servicio"
            secondaryHref="/servicios"
            secondaryLabel="Ver más servicios"
          />
        </section>
      </div>
    </main>
  );
}
