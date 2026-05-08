import Link from "next/link";
import type React from "react";
import { ArrowRight, CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

export function DetailSection({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Ver más",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? <p className="text-sm font-semibold text-blue-600">{eyebrow}</p> : null}
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
        </div>
        {href ? (
          <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            {linkLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function StepsExplainer({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
  return (
    <DetailSection eyebrow="Operación protegida" title={title} description="Un flujo claro evita consultas perdidas y mantiene la operación dentro de MDP Market.">
      <ol className="grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
      </ol>
    </DetailSection>
  );
}

export function FAQSection({ items }: { items: FAQ[] }) {
  return (
    <DetailSection eyebrow="Preguntas frecuentes" title="Antes de avanzar" description="Respuestas rápidas para decidir con más seguridad.">
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold text-slate-950">
              <HelpCircle className="h-5 w-5 shrink-0 text-blue-600" />
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </DetailSection>
  );
}

export function TrustMiniCard({
  title = "Operación protegida",
  description = "Mantenemos la compra, reserva o consulta dentro de MDP Market para que el seguimiento sea claro.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
      <p className="flex items-center gap-2 text-sm font-semibold text-blue-950">
        <ShieldCheck className="h-5 w-5 text-blue-600" />
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-blue-900/75">{description}</p>
    </div>
  );
}

export function FinalCTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.24)] sm:p-10">
      <CheckCircle2 className="mb-5 h-8 w-8 text-blue-200" />
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href={primaryHref} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
