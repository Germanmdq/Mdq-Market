"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";

export default function FeedbackWidget() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
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
            Nos encantaría conocer tu experiencia con nuestros productos y servicios.
          </p>
          <Link
            href="/reclamos?source=feedback"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Responder
          </Link>
        </div>
      </div>
    </aside>
  );
}
