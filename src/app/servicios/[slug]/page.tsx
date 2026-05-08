import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Award,
  ChevronLeft,
  ChevronRight,
  Info,
  Phone
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { getServiceBySlug } from "@/lib/services";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
  const description = service.description || "Servicio profesional verificado en MDP Market con reserva protegida.";
  const professionalName = service.professionalName || serviceAny.professional_name || "Profesional MDP";
  const priceFrom = Number(service.priceFrom ?? serviceAny.price_from ?? 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex text-sm text-gray-500 gap-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/servicios" className="hover:text-blue-600">Servicios</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{service.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="relative aspect-[21/9] bg-gray-100">
                  <Image src={mainImage} alt={service.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     {service.verified && (
                       <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          Verificado
                       </div>
                     )}
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

            {/* Gallery Section */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <h2 className="text-xl font-black mb-6">Trabajos realizados</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-pointer">
                       <Image 
                        src={img} 
                        alt={`Trabajo ${i + 1}`} 
                        fill 
                        className="object-cover" 
                       />
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Column: Booking Card */}
          <div className="space-y-6">
            <aside className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 sticky top-24">
               <div className="flex flex-col mb-8">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Presupuesto inicial desde</span>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-blue-900">{priceFrom > 0 ? formatPrice(priceFrom) : "A presupuestar"}</span>
                     {priceFrom > 0 && <span className="text-gray-400 text-sm">/ visita</span>}
                  </div>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                     <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                     <div className="text-xs text-blue-900">
                        <span className="font-bold block mb-1">Reserva Protegida</span>
                        El profesional recibe el pago recién cuando confirmás que el servicio fue realizado correctamente.
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
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
            </aside>

            {/* Support Info */}
            <div className="bg-blue-900 rounded-3xl p-8 text-white">
               <h3 className="font-black mb-4 text-lg">¿Necesitás ayuda urgente?</h3>
               <p className="text-blue-200 text-sm mb-6">
                  Nuestro equipo de soporte técnico en Mar del Plata te ayuda a elegir al mejor profesional para tu problema.
               </p>
               <button className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contactar Soporte
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
