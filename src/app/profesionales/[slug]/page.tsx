"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, ShieldCheck, Share2, Heart, MessageCircle,
  Zap, CheckCircle2, Clock, Flag, Award, Calendar, ChevronDown, Check,
  FileText, Briefcase, ChevronRight, X
} from "lucide-react";
import { MOCK_PROFESSIONAL_DETAILS, CATEGORIES, MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/data/mockData";
import { formatPrice, cn } from "@/lib/utils";

export default function ProfessionalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const professional = MOCK_PROFESSIONAL_DETAILS.find((p) => p.slug === slug) || MOCK_PROFESSIONAL_DETAILS[0];
  // Normalizing availability
  const availabilityIsObject = typeof professional.availability !== "string";
  const schedule = availabilityIsObject ? (professional.availability as any).schedule : [];
  const nextAvailable = availabilityIsObject ? (professional.availability as any).nextAvailable : (typeof professional.availability === "string" ? professional.availability : "Consultar");

  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(schedule[0]?.day || "");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Normalizing services (ensure they are objects for the UI)
  const normalizedServices = professional.services.map((s: any) => {
    if (typeof s === "string") {
      // Try to find full service details if available, otherwise mock
      const fullService = MOCK_SERVICES.find(ms => ms.id === s);
      return fullService || { 
        id: s, 
        title: "Servicio Profesional", 
        description: "Detalles del servicio a consultar con el profesional.",
        priceFrom: professional.priceFrom || 0,
        priceType: "Desde",
        estimatedDuration: "A convenir",
        directBooking: true,
        requiresQuote: false,
        urgentAvailable: false
      };
    }
    return s;
  });

  const selectedService = normalizedServices.find(s => s.id === selectedServiceId) || normalizedServices[0];
  const currentSchedule = schedule.find((s: any) => s.day === selectedDay);

  const similarProfessionals = MOCK_PROFESSIONALS.filter(p => p.id !== professional.id).slice(0, 4);
  const similarServices = MOCK_SERVICES.filter(s => s.professionalId !== professional.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
      {/* 1. Breadcrumb */}
      <nav className="flex flex-wrap items-center text-xs text-gray-400 mb-6 gap-1.5">
        <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
        <span>›</span>
        <Link href="/profesionales" className="hover:text-blue-600 transition-colors">Profesionales</Link>
        <span>›</span>
        <span className="text-gray-600 font-medium truncate max-w-[200px]">{professional.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ═══ LEFT: Full Profile ═══ */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 2. Header Profesional */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
            {professional?.coverImage ? (
              <div className="h-32 w-full relative bg-blue-900">
                <Image src={professional.coverImage} alt="Cover" fill className="object-cover opacity-80" />
              </div>
            ) : (
              <div className="h-32 w-full bg-gradient-to-r from-blue-600 to-blue-800" />
            )}
            
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex justify-between items-start">
                <div className="relative -mt-12 w-24 h-24 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-md">
                  <Image src={professional.avatar} alt={professional.name} fill className="object-cover" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setIsFav(!isFav)} className={cn("p-2 rounded-full border transition-all", isFav ? "border-red-200 text-red-600 bg-red-50" : "border-gray-200 text-gray-400 hover:bg-gray-50")}>
                    <Heart className={cn("w-5 h-5", isFav && "fill-red-500")} />
                  </button>
                  <button onClick={handleCopyLink} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all">
                    {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-gray-900">{professional.name}</h1>
                  {professional.verified && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-lg font-bold text-gray-700">{professional.profession}</p>
                <p className="text-sm text-gray-500 mt-1">{professional.headline}</p>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                  <div className="flex items-center gap-1 font-black text-gray-900 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {professional.rating.average} <span className="text-gray-500 font-medium ml-1">({professional.rating.totalReviews} opiniones)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-bold">{professional.stats.completedJobs}</span> trabajos
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Responde en <span className="font-bold">{professional.stats.responseTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {professional.verified && <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded uppercase tracking-wider">Verificado MDP</span>}
                  {professional.license?.status === "Activa" && <span className="text-[10px] font-black text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded uppercase tracking-wider">{professional.license.type}</span>}
                  {professional.featured && <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded uppercase tracking-wider">Profesional destacado</span>}
                  <span className="text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded uppercase tracking-wider">Disponible hoy</span>
                </div>
              </div>
            </div>
          </div>

          <section id="servicios" className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4">Servicios ofrecidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normalizedServices.map((service: any) => (
                <div 
                  key={service.id} 
                  onClick={() => setSelectedServiceId(service.id)}
                  className={cn(
                    "border-2 rounded-xl p-4 cursor-pointer transition-all",
                    selectedServiceId === service.id ? "border-blue-600 bg-blue-50/50" : "border-gray-100 hover:border-blue-200 bg-white"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 leading-tight pr-4">{service.title}</h3>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", selectedServiceId === service.id ? "border-blue-600 bg-blue-600" : "border-gray-300")}>
                      {selectedServiceId === service.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm font-black text-gray-900">{service.priceType === "Desde" ? "Desde " : ""}{service.priceType === "A presupuestar" ? "A cotizar" : formatPrice(service.priceFrom)}</span>
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Clock className="w-3 h-3" />{service.estimatedDuration}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.directBooking && <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Reserva directa</span>}
                    {service.requiresQuote && <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Requiere presupuesto</span>}
                    {service.urgentAvailable && <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">Urgencia disponible</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="disponibilidad" className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900">Disponibilidad</h2>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">Próximo turno: {nextAvailable}</span>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {schedule.map((dayItem: any) => (
                <button
                  key={dayItem.day}
                  onClick={() => { setSelectedDay(dayItem.day); setSelectedSlot(null); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors",
                    selectedDay === dayItem.day ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {dayItem.day}
                </button>
              ))}
            </div>

            {currentSchedule && currentSchedule.slots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {currentSchedule.slots.map((slot: string) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-bold border-2 transition-all",
                      selectedSlot === slot ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 font-medium">No hay horarios disponibles para este día.</p>
                <p className="text-xs text-gray-400 mt-1">Podés solicitar un presupuesto o consultar por chat.</p>
              </div>
            )}
          </section>

          {/* 8. Experiencia (Bio) & Zonas */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4">Sobre el profesional</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{professional.bio}</p>
            
            <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />Zonas de cobertura</h3>
            <div className="flex flex-wrap gap-2">
              {professional.zones.map((z: string) => (
                <span key={z} className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{z}</span>
              ))}
            </div>
          </section>

          {/* 9. Trabajos realizados (Portfolio) */}
          {professional.portfolio && professional.portfolio.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-4">Trabajos realizados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professional.portfolio.map((item: any) => (
                  <div key={item.id} className="rounded-xl border border-gray-100 overflow-hidden group">
                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {item.verified && (
                        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[9px] font-black text-blue-700 px-2 py-1 rounded uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <span>{item.zone}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Verificaciones */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" />Verificaciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Identidad verificada</div>
              <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Teléfono validado</div>
              <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Email validado</div>
              <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Documentación revisada</div>
              {professional.license && professional.license.status === "Activa" && (
                <div className="flex items-center gap-2 text-gray-900 font-bold sm:col-span-2 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Award className="w-5 h-5 text-blue-600 shrink-0" /> 
                  <div>
                    <span className="block text-sm">{professional.license.type}</span>
                    <span className="text-xs text-gray-500 font-normal">Verificada por MDP Market</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 11 & 10. Rating y Opiniones */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-gray-100 pb-8">
              <div className="text-center md:text-left shrink-0">
                <h2 className="text-lg font-black text-gray-900 mb-2">Opiniones</h2>
                <div className="text-5xl font-black text-gray-900 mb-2">{professional.rating.average}</div>
                <div className="flex justify-center md:justify-start gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s: number) => <Star key={s} className={cn("w-4 h-4", s <= Math.round(professional.rating.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />)}
                </div>
                <p className="text-xs text-gray-500 font-medium">{professional.rating.totalReviews} opiniones verificadas</p>
              </div>
              <div className="flex-1 space-y-2 text-xs font-bold text-gray-600">
                <div className="flex items-center gap-3"><span className="w-24 shrink-0">Puntualidad</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(professional.rating.punctuality / 5) * 100}%` }} /></div><span className="w-6 text-right">{professional.rating.punctuality}</span></div>
                <div className="flex items-center gap-3"><span className="w-24 shrink-0">Calidad</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(professional.rating.quality / 5) * 100}%` }} /></div><span className="w-6 text-right">{professional.rating.quality}</span></div>
                <div className="flex items-center gap-3"><span className="w-24 shrink-0">Comunicación</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(professional.rating.communication / 5) * 100}%` }} /></div><span className="w-6 text-right">{professional.rating.communication}</span></div>
                <div className="flex items-center gap-3"><span className="w-24 shrink-0">Precio</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(professional.rating.value / 5) * 100}%` }} /></div><span className="w-6 text-right">{professional.rating.value}</span></div>
              </div>
            </div>

            <div className="space-y-6">
              {professional.reviews.map((review: any) => (
                <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">{review.userName.charAt(0)}</div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 block leading-tight">{review.userName}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s: number) => <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />)}</span>
                          <span>· {review.date}</span>
                        </div>
                      </div>
                    </div>
                    {review.verified && <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Operación verificada</span>}
                  </div>
                  <p className="text-xs text-gray-500 font-bold bg-gray-50 inline-block px-2 py-1 rounded mb-2">Servicio: {review.serviceName}</p>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                  {review.professionalResponse && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <span className="text-xs font-bold text-gray-900 mb-1 block">Respuesta de {professional.name}:</span>
                      <p className="text-sm text-gray-600">{review.professionalResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 12. FAQ */}
          {professional.faq && professional.faq.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {professional.faq.map((item: any, i: number) => {
                  const q = typeof item === 'string' ? item : item.question;
                  const a = typeof item === 'string' ? "" : item.answer;
                  return (
                    <div key={i}>
                      <h3 className="font-bold text-sm text-gray-900 mb-1">{q}</h3>
                      {a && <p className="text-sm text-gray-600">{a}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 14. Otros profesionales */}
          {similarProfessionals.length > 0 && (
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-4">Otros profesionales sugeridos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {similarProfessionals.map((p: any) => (
                  <Link key={p.id} href={`/profesionales/${p.slug}`} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all group flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform bg-gray-50">
                      <Image src={p.avatar} alt={p.name} width={64} height={64} className="object-cover" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{p.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{p.profession}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-900 bg-yellow-50 px-2 py-0.5 rounded">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{p.rating.average}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ═══ RIGHT: Sticky Card de Reserva ═══ */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 space-y-4">
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-6">
                
                {selectedService ? (
                  <div className="mb-6">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Servicio seleccionado</span>
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-2">{selectedService.title}</h3>
                    <div className="text-3xl font-black text-gray-900 mb-1">
                      {selectedService.priceType === "Desde" ? <span className="text-base text-gray-500 font-bold">Desde </span> : ""}
                      {selectedService.priceType === "A presupuestar" ? "A cotizar" : formatPrice(selectedService.priceFrom)}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-2">Servicios profesionales</h3>
                    <div className="text-3xl font-black text-gray-900 mb-1">
                      <span className="text-base text-gray-500 font-bold">Desde </span>{formatPrice(professional.priceFrom || 0)}
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" />Día</span>
                    <span className="font-bold text-gray-900">{selectedDay || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4" />Horario</span>
                    <span className={cn("font-bold text-gray-900", !selectedSlot && "text-red-500")}>{selectedSlot || "Seleccionar"}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <Link 
                    href={selectedSlot && selectedService ? `/checkout/profesional?id=${professional.id}&service=${selectedService.id}&day=${selectedDay}&slot=${selectedSlot}` : "#disponibilidad"}
                    className={cn(
                      "w-full py-4 rounded-xl font-black text-center flex items-center justify-center gap-2 transition-all shadow-lg text-sm",
                      selectedSlot && selectedService 
                        ? "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]" 
                        : "bg-gray-900 hover:bg-black text-white"
                    )}
                  >
                    {selectedSlot ? "Reservar turno ahora" : "Seleccionar horario"}
                  </Link>

                  <Link 
                    href={`/presupuesto?id=${professional.id}&service=${selectedService?.id || ""}`}
                    className="w-full py-3.5 rounded-xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" /> Solicitar presupuesto
                  </Link>

                  <button className="w-full py-3.5 rounded-xl font-bold text-blue-600 border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4" /> Consultar por chat
                  </button>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-black text-blue-900 block mb-1">Reserva protegida</span>
                      <p className="text-[11px] text-blue-800/80 leading-relaxed">Tu pago queda protegido por MDP Market hasta que confirmes la asistencia del profesional o finalización del trabajo.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 text-[10px] text-gray-500 text-center border-t border-gray-100">
                Por seguridad, no se comparten datos de contacto (teléfono, email) antes de confirmar la reserva. Toda comunicación debe realizarse a través del chat protegido.
              </div>
            </div>

            {/* 15. Reportar */}
            <button className="w-full text-center text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 py-2">
              <Flag className="w-3.5 h-3.5" />Reportar perfil profesional
            </button>
            
          </div>
        </div>

      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:hidden z-50 flex gap-2">
        <Link 
          href={selectedSlot && selectedService ? `/checkout/profesional?id=${professional.id}&service=${selectedService.id}&day=${selectedDay}&slot=${selectedSlot}` : "#disponibilidad"}
          className="flex-1 bg-blue-600 text-white font-black rounded-xl py-3.5 text-center text-sm shadow-lg flex items-center justify-center"
        >
          {selectedSlot ? "Reservar turno" : "Seleccionar horario"}
        </Link>
        <button className="bg-blue-50 text-blue-600 border border-blue-100 font-bold rounded-xl px-4 py-3.5 flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
