"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, MessageCircle, Search, ShieldCheck, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getLocalBookings, type ServiceBooking } from "@/lib/bookings";
import { formatPrice } from "@/lib/utils";

function statusLabel(status: ServiceBooking["status"]) {
  const labels = {
    pendiente_confirmacion: "Pendiente",
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    finalizada: "Finalizada",
  };
  return labels[status] ?? status;
}

export default function ProfessionalAgendaPage() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgenda() {
      const local = getLocalBookings();
      let remote: ServiceBooking[] = [];

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("service_bookings")
            .select("*, services(title, professionalName, professional_name)")
            .or(`professional_id.eq.${user.id},professional_id.is.null`)
            .order("booking_date", { ascending: true })
            .limit(40);

          remote = (data ?? []).map((booking: any) => ({
            id: booking.id,
            service_id: booking.service_id,
            professional_id: booking.professional_id,
            service_title: booking.services?.title ?? booking.metadata?.service_title ?? "Servicio profesional",
            professional_name: booking.services?.professionalName ?? booking.services?.professional_name ?? booking.metadata?.professional_name ?? "Profesional",
            client_name: booking.metadata?.client_name ?? "Cliente MDP",
            client_phone: booking.metadata?.client_phone ?? "",
            booking_date: booking.booking_date,
            booking_time: booking.booking_time ?? "A coordinar",
            zone: booking.zone ?? "Mar del Plata",
            address: booking.address ?? "",
            total_price: booking.total_price,
            status: booking.status ?? "pendiente_confirmacion",
            protected_booking: true,
            created_at: booking.created_at ?? booking.booking_date,
          }));
        }
      } catch {
        remote = [];
      }

      const seen = new Set<string>();
      const merged = [...remote, ...local].filter((booking) => {
        if (seen.has(booking.id)) return false;
        seen.add(booking.id);
        return true;
      });

      setBookings(merged);
      setLoading(false);
    }

    loadAgenda();
  }, []);

  const stats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "pendiente_confirmacion").length;
    const confirmed = bookings.filter((booking) => booking.status === "confirmada").length;
    const total = bookings.reduce((sum, booking) => sum + (booking.total_price ?? 0), 0);
    return { pending, confirmed, total };
  }, [bookings]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard/profesional" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Agenda profesional</h1>
            <p className="mt-1 text-sm text-slate-500">Reservas, consultas y turnos protegidos de MDP Market.</p>
          </div>
          <Link href="/servicios" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(37,99,235,0.22)] transition hover:bg-blue-700">
            <Search className="h-4 w-4" />
            Ver servicios publicados
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
            <Clock className="mb-4 h-6 w-6 text-amber-500" />
            <p className="text-2xl font-semibold text-slate-950">{stats.pending}</p>
            <p className="text-sm text-slate-500">pendientes de confirmar</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
            <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />
            <p className="text-2xl font-semibold text-slate-950">{stats.confirmed}</p>
            <p className="text-sm text-slate-500">confirmadas</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
            <ShieldCheck className="mb-4 h-6 w-6 text-blue-600" />
            <p className="text-2xl font-semibold text-slate-950">{stats.total ? formatPrice(stats.total) : "$ 0"}</p>
            <p className="text-sm text-slate-500">en reservas estimadas</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
              <Calendar className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Todavía no hay turnos</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Cuando un cliente reserve un servicio, va a aparecer acá con horario, zona, datos de contacto y estado de la reserva.
            </p>
            <Link href="/alta-profesional" className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Mejorar mi perfil profesional
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.10)]">
                <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">{statusLabel(booking.status)}</span>
                      {booking.protected_booking && (
                        <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">Reserva protegida</span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-slate-950">{booking.service_title}</h2>
                    <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                      <span className="flex items-center gap-2"><User className="h-4 w-4 text-slate-400" />{booking.client_name || "Cliente MDP"}</span>
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />{new Date(booking.booking_date).toLocaleDateString("es-AR")}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{booking.booking_time || "A coordinar"}</span>
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{booking.zone || "Mar del Plata"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link href={`/chat?booking=${booking.id}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </Link>
                    <button className="h-11 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                      Confirmar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
