"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Loader2, Search, Sparkles, X } from "lucide-react";
import { interpretLocalIntent, type IntentResult } from "@/lib/ai/local-intent";
import { trackActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

const CHIPS = [
  { label: "Comprar producto", value: "Busco un producto" },
  { label: "Contratar servicio", value: "Necesito un servicio para hoy" },
  { label: "Buscar profesional", value: "Busco un profesional" },
  { label: "Publicar algo", value: "Quiero vender" },
  { label: "Ver ofertas", value: "Ver ofertas cerca mío" },
];

function intentLabel(result: IntentResult) {
  const labels: Record<IntentResult["intent"], string> = {
    search_product: "Te llevo a productos",
    search_service: "Te llevo a servicios",
    search_professional: "Te llevo a profesionales",
    publish_product: "Te llevo a publicar",
    offers: "Te llevo a ofertas",
    unknown: "Busco en todo MDP Market",
  };
  return labels[result.intent];
}

export default function SmartSearchAssistant() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<IntentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const resolveIntent = async (value: string) => {
    try {
      const response = await fetch("/api/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      if (!response.ok) throw new Error("intent_failed");
      return (await response.json()) as IntentResult;
    } catch {
      return interpretLocalIntent(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    setLoading(true);
    const nextResult = await resolveIntent(value);
    setResult(nextResult);
    await trackActivity({
      event_type: "search",
      entity_type: "search",
      search_query: value,
      metadata: {
        source: "smart_search_assistant",
        interpreted_intent: nextResult.intent,
        href: nextResult.href,
      },
    });
    setLoading(false);
    router.push(nextResult.href);
  };

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Asistente MDP
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                ¿Qué estás buscando hoy en Mar del Plata?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Contame qué necesitás y te llevo al producto, servicio o profesional correcto.
              </p>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setQuery(chip.value)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => {
                      const value = event.target.value;
                      setQuery(value);
                      setResult(value.trim() ? interpretLocalIntent(value) : null);
                    }}
                    placeholder="Ej: necesito un gasista para hoy en zona Centro"
                    className="min-h-12 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  disabled={loading}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                  Buscar con IA
                </button>
              </form>

              {result && query.trim() && (
                <p className="mt-3 text-xs font-medium text-slate-500">
                  {intentLabel(result)}: <span className="text-blue-700">{result.href}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_16px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-700 lg:bottom-6"
        aria-label="Abrir asistente"
      >
        <Bot className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed bottom-40 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:bottom-20">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">¿Qué estás buscando hoy?</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Productos, servicios, profesionales, publicaciones u ofertas.
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej: notebook usada hasta 700 mil"
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            />
            <button className={cn("flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-semibold text-white", loading && "bg-slate-300")}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Resolver
            </button>
          </form>
        </div>
      )}
    </>
  );
}
