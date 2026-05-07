import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight, Search, Wrench, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function ReservasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookings } = await supabase
    .from("service_bookings")
    .select(`
      *,
      services (
        title,
        professionalName,
        category
      )
    `)
    .eq("client_id", user.id)
    .order("booking_date", { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <main className="max-w-[900px] mx-auto w-full px-4 pt-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Reservas</h1>
            <p className="text-slate-500 font-medium mt-1">Gestioná tus turnos con profesionales de Mar del Plata.</p>
          </div>
          <Link href="/servicios" className="hidden md:flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest hover:text-emerald-700 transition-colors">
            Buscar Servicios
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {(!bookings || bookings.length === 0) ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No tenés reservas activas</h2>
            <p className="text-slate-500 font-medium mb-10">¡Encontrá al profesional ideal para tu próximo proyecto!</p>
            <Link href="/servicios" className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
              <Search className="w-5 h-5" />
              Explorar Servicios
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all border-l-4 border-l-emerald-500">
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 leading-tight">{booking.services?.title || "Servicio"}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <User className="w-3 h-3 text-slate-400" />
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{booking.services?.professionalName || "Profesional"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {booking.status === 'pending' ? 'Confirmado' : booking.status}
                       </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(booking.booking_date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario</p>
                        <p className="text-sm font-bold text-slate-900">{booking.booking_time || "A coordinar"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{booking.zone || "Mar del Plata"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                       <ShieldCheck className="w-4 h-4 text-blue-600" />
                       <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Reserva Protegida</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Precio Estimado</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{booking.total_price ? formatPrice(booking.total_price) : "A presupuestar"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-8 py-4 flex justify-end gap-6">
                   <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancelar Turno</button>
                   <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">Chatear con Profesional</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
