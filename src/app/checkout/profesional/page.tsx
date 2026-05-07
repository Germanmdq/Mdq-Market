"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle2, Loader2, Lock, MapPin, ShieldCheck, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { formatPrice, cn } from "@/lib/utils";
import { createServiceBooking } from "@/lib/bookings";
import { trackActivity } from "@/lib/activity";

const SLOTS = ["Hoy 16 a 19", "Mañana 10 a 13", "Mañana 16 a 19", "Coordinar por chat"];

type BookingTarget = {
  service_id?: string | null;
  professional_id?: string | null;
  service_title: string;
  professional_name: string;
  price_from?: number | null;
};

function ProfessionalCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") ?? searchParams.get("id");
  const professionalId = searchParams.get("professional") ?? searchParams.get("id");
  const initialSlot = searchParams.get("slot") || "Mañana 10 a 13";

  const [target, setTarget] = useState<BookingTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [zone, setZone] = useState("");
  const [address, setAddress] = useState("");
  const [slot, setSlot] = useState(initialSlot);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTarget() {
      setLoading(true);
      let nextTarget: BookingTarget | null = null;

      if (serviceId) {
        const { data } = await supabase
          .from("services")
          .select("*")
          .eq("id", serviceId)
          .maybeSingle();

        if (data) {
          nextTarget = {
            service_id: data.id,
            professional_id: data.professionalId ?? data.professional_id ?? null,
            service_title: data.title,
            professional_name: data.professionalName ?? data.professional_name ?? "Profesional MDP",
            price_from: data.priceFrom ?? data.price_from ?? null,
          };
        }
      }

      if (!nextTarget && professionalId) {
        const { data } = await supabase
          .from("professionals")
          .select("*")
          .eq("id", professionalId)
          .maybeSingle();

        if (data) {
          nextTarget = {
            professional_id: data.id,
            service_title: searchParams.get("title") ?? "Servicio profesional",
            professional_name: data.name ?? "Profesional MDP",
            price_from: data.priceFrom ?? data.price_from ?? null,
          };
        }
      }

      setTarget(nextTarget ?? {
        service_id: serviceId,
        professional_id: professionalId,
        service_title: searchParams.get("title") ?? "Servicio profesional",
        professional_name: searchParams.get("professionalName") ?? "Profesional MDP",
        price_from: Number(searchParams.get("price") ?? 0) || null,
      });
      setLoading(false);
    }

    loadTarget();
  }, [serviceId, professionalId, searchParams]);

  const canSubmit = clientName.trim() && clientPhone.trim() && zone.trim() && address.trim() && target;

  const handleConfirm = async () => {
    if (!canSubmit || !target) return;
    setProcessing(true);
    setError(null);

    try {
      const booking = await createServiceBooking({
        service_id: target.service_id,
        professional_id: target.professional_id,
        service_title: target.service_title,
        professional_name: target.professional_name,
        client_name: clientName,
        client_phone: clientPhone,
        booking_date: slot.includes("Hoy") ? new Date().toISOString() : new Date(Date.now() + 86400000).toISOString(),
        booking_time: slot,
        zone,
        address,
        total_price: target.price_from ?? null,
      });

      await trackActivity({
        event_type: "checkout_started",
        entity_type: "checkout",
        entity_id: target.service_id ?? target.professional_id,
        title: target.service_title,
        metadata: {
          booking_id: booking.id,
          type: "service_booking",
          slot,
          zone,
        },
      });

      router.push(`/reservas?created=${booking.id}`);
    } catch {
      setError("No pudimos crear la reserva. Probá de nuevo.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-[1180px] px-4 py-10">
        <button onClick={() => router.back()} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Confirmar reserva protegida</h1>
              <p className="mt-2 text-sm text-slate-500">El profesional confirma disponibilidad antes de cerrar el trabajo.</p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-950">
                <User className="h-5 w-5 text-blue-600" />
                Tus datos
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre y apellido" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
                <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Teléfono de contacto" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-950">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Día y horario
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {SLOTS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSlot(item)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                      slot === item ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700 hover:border-slate-300"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-950">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Ubicación en Mar del Plata
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Zona o barrio" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección exacta" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Reserva protegida</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{target?.service_title}</h2>
              <p className="mt-1 text-sm text-slate-500">{target?.professional_name}</p>

              <div className="my-6 border-y border-slate-100 py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Horario</span>
                  <span className="font-semibold text-slate-950">{slot}</span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-slate-500">Precio estimado</span>
                  <span className="font-semibold text-slate-950">{target?.price_from ? formatPrice(target.price_from) : "A presupuestar"}</span>
                </div>
              </div>

              {error && <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={!canSubmit || processing}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
              >
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
                Confirmar reserva
              </button>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <p className="text-xs leading-5 text-blue-900">
                  La reserva queda protegida. El profesional confirma disponibilidad y coordinamos el servicio dentro de Mar del Plata.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function ProfessionalCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-12 text-center text-sm font-semibold text-slate-500">Cargando reserva...</div>}>
      <ProfessionalCheckoutContent />
    </Suspense>
  );
}
