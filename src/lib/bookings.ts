"use client";

import { supabase } from "@/lib/supabase/client";

export type ServiceBooking = {
  id: string;
  service_id?: string | null;
  professional_id?: string | null;
  service_title: string;
  professional_name: string;
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  zone: string;
  address: string;
  total_price?: number | null;
  status: "pendiente_confirmacion" | "confirmada" | "cancelada" | "finalizada";
  protected_booking: boolean;
  created_at: string;
};

const BOOKINGS_KEY = "mdp-service-bookings";

export function getLocalBookings() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? "[]") as ServiceBooking[];
  } catch {
    return [];
  }
}

export function saveLocalBooking(booking: ServiceBooking) {
  if (typeof window === "undefined") return;
  const current = getLocalBookings();
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...current].slice(0, 40)));
}

export async function createServiceBooking(booking: Omit<ServiceBooking, "id" | "created_at" | "status" | "protected_booking">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const localBooking: ServiceBooking = {
    ...booking,
    id: `RSV-${Date.now().toString().slice(-8)}`,
    status: "pendiente_confirmacion",
    protected_booking: true,
    created_at: new Date().toISOString(),
  };

  saveLocalBooking(localBooking);

  try {
    const { data } = await supabase
      .from("service_bookings")
      .insert({
        client_id: user?.id ?? null,
        service_id: booking.service_id ?? null,
        professional_id: booking.professional_id ?? null,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        zone: booking.zone,
        address: booking.address,
        total_price: booking.total_price ?? null,
        status: "pendiente_confirmacion",
        metadata: {
          service_title: booking.service_title,
          professional_name: booking.professional_name,
          client_name: booking.client_name,
          client_phone: booking.client_phone,
          protected_booking: true,
        },
      })
      .select("id")
      .single();

    if (data?.id) {
      return { ...localBooking, id: data.id };
    }
  } catch {
    // Local booking keeps the reservation flow functional until the table is present.
  }

  return localBooking;
}
