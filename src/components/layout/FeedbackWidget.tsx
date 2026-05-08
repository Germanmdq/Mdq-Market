"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, MessageSquare, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const STORAGE_KEY = "mdp-market-feedback";

type FeedbackPayload = {
  type: string;
  message: string;
  contact: string;
  page_url: string;
  created_at: string;
};

function saveLocalFeedback(payload: FeedbackPayload) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const items = stored ? JSON.parse(stored) as FeedbackPayload[] : [];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([payload, ...items].slice(0, 30)));
  } catch {
    // Local backup is best-effort only.
  }
}

export default function FeedbackWidget() {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Mejora");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  if (!visible) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    const payload: FeedbackPayload = {
      type,
      message: message.trim(),
      contact: contact.trim(),
      page_url: window.location.href,
      created_at: new Date().toISOString(),
    };

    saveLocalFeedback(payload);

    try {
      await supabase.from("feedback_submissions").insert({
        feedback_type: payload.type,
        message: payload.message,
        contact: payload.contact || null,
        page_url: payload.page_url,
        metadata: {
          user_agent: navigator.userAgent,
        },
      });
    } catch {
      // If the table is not deployed yet, the local backup keeps the submission usable.
    }

    setStatus("sent");
    setMessage("");
    setContact("");
  };

  return (
    <>
      <aside className="fixed bottom-20 left-4 z-40 w-[calc(100vw-2rem)] max-w-[410px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:bottom-6 lg:left-6">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar feedback"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex gap-4 pr-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-950">¡Ayudanos a mejorar!</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Contanos qué viste raro o qué falta. Se envía dentro de MDP Market.
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setStatus("idle");
              }}
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Responder
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.25)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">Enviar mejora</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Tu comentario queda asociado a esta página para revisarlo.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar formulario"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {status === "sent" ? (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                <p className="mt-3 font-semibold text-slate-950">Gracias, enviado.</p>
                <p className="mt-1 text-sm text-slate-600">Lo guardamos para revisar la experiencia.</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900">Tipo</label>
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Mejora</option>
                    <option>Error</option>
                    <option>Diseño</option>
                    <option>Compra</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900">Comentario</label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    rows={5}
                    placeholder="Ej: en producto queda mucho espacio, el horario debería ir después de comprar..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900">Contacto opcional</label>
                  <input
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Email o teléfono"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                >
                  {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Enviar comentario
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
