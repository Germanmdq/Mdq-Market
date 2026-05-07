"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock, MessageSquare, Package, ShieldCheck } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

type OperationItem = {
  product_id: string;
  title?: string;
  price?: number;
};

type StoredOperation = {
  delivery_slot?: string;
  items?: OperationItem[];
};

const TIMELINE = [
  { key: "pendiente_pago", status: "Pendiente de pago", description: "Se generó la operación protegida.", done: true },
  { key: "pago_protegido", status: "Pago protegido", description: "El pago queda resguardado hasta confirmar recepción.", done: true },
  { key: "vendedor_notificado", status: "Vendedor notificado", description: "Avisamos al vendedor para confirmar disponibilidad.", active: true },
  { key: "disponibilidad_confirmada", status: "Disponibilidad confirmada", description: "El vendedor confirma stock y prepara el producto." },
  { key: "preparando_producto", status: "Preparando producto", description: "El producto queda listo para retiro coordinado." },
  { key: "retiro_coordinado", status: "Retiro coordinado", description: "Coordinamos Entrega MDP dentro de Mar del Plata." },
  { key: "en_camino", status: "En camino", description: "La entrega local va hacia tu dirección." },
  { key: "entregado", status: "Entregado", description: "Recibiste el producto." },
  { key: "finalizado", status: "Finalizado", description: "Confirmás recepción y se libera el pago." },
];

export default function OperationPage({ params }: { params: { id: string } }) {
  const [operation, setOperation] = useState<StoredOperation | null>(null);
  const operationItems = operation?.items ?? [];

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem(`mdp-operation-${params.id}`);
      if (stored) setOperation(JSON.parse(stored) as StoredOperation);
    });
  }, [params.id]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[860px] mx-auto w-full px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/mi-cuenta" className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Operación #{params.id}</h1>
            <p className="text-sm text-slate-500 mt-1">Seguimiento de compra protegida</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">Pago protegido demo</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {operation?.delivery_slot ? `Franja elegida: ${operation.delivery_slot}` : "Entrega MDP a coordinar"}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" /> vendedor_notificado
            </span>
          </div>

          {operationItems.length > 0 && (
            <div className="mb-8 rounded-2xl bg-slate-50 p-4">
              {operationItems.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <Package className="h-5 w-5 shrink-0 text-slate-400" />
                    <span className="truncate font-medium text-slate-800">{item.title}</span>
                  </div>
                  <span className="font-semibold text-slate-950">{formatPrice(item.price ?? 0)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="relative pl-4 border-l-2 border-slate-100 space-y-7 ml-3">
            {TIMELINE.map((step) => (
              <div key={step.key} className="relative">
                {step.done ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 absolute -left-[19px] bg-white" />
                ) : step.active ? (
                  <div className="w-7 h-7 rounded-full bg-blue-100 absolute -left-[19px] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-7 h-7 text-slate-200 absolute -left-[19px] bg-white" />
                )}
                <div className="pl-6">
                  <h3 className={cn("text-base font-semibold", step.done || step.active ? "text-slate-950" : "text-slate-400")}>
                    {step.status}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href={`/chat?operation=${params.id}`} className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:bg-slate-50 transition-colors">
            <MessageSquare className="w-6 h-6 text-slate-600" />
            <span className="text-sm font-semibold text-slate-900">Consultar operación</span>
          </Link>
          <button className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:bg-slate-50 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-900">Confirmar recepción</span>
          </button>
        </div>
      </main>
    </div>
  );
}
