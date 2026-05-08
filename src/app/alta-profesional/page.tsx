import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Creá tu perfil",
    description: "Cargá tu rubro, zonas de atención, experiencia y datos de contacto.",
  },
  {
    icon: ClipboardList,
    title: "Publicá tus servicios",
    description: "Mostrá precios desde, disponibilidad y trabajos que querés recibir.",
  },
  {
    icon: CalendarCheck,
    title: "Recibí reservas",
    description: "Los clientes eligen horario, zona y dejan el pedido ordenado.",
  },
  {
    icon: ShieldCheck,
    title: "Trabajá protegido",
    description: "La operación queda registrada y coordinada dentro de MDP Market.",
  },
];

const benefits = [
  "Aparecés en servicios y profesionales",
  "Reservas y consultas desde Mar del Plata",
  "Perfil con verificación visible",
  "Panel para seguir pedidos y trabajos",
];

export default function AltaProfesionalPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <BadgeCheck className="h-4 w-4" />
              Alta profesional MDP
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Sumá tus servicios a MDP Market
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Creá un perfil profesional, publicá tus servicios y recibí consultas o reservas de clientes en Mar del Plata.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registro?role=profesional"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(37,99,235,0.24)] transition hover:bg-blue-700"
              >
                Crear cuenta profesional
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/profesional"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition hover:border-blue-200 hover:text-blue-700"
              >
                Ir al panel profesional
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(37,99,235,0.20)]">
              <Sparkles className="mb-5 h-8 w-8" />
              <p className="text-xl font-semibold">Más visibilidad para tu oficio o profesión</p>
              <p className="mt-3 text-sm leading-6 text-blue-100">
                La idea no es solo figurar en una lista: es recibir pedidos claros, con zona, horario y contexto.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Cómo funciona</h2>
          <p className="mt-1 text-sm text-slate-500">Un flujo corto para empezar a recibir trabajos sin pantallas rotas.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.10)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Link
            href="/publicar?intent=servicio"
            className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.14)]"
          >
            <MessageSquare className="mb-5 h-7 w-7 text-emerald-600" />
            <p className="text-lg font-semibold text-slate-950">Quiero ofrecer un servicio</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Usá el flujo de publicación para cargar tu primera oferta y aparecer en el marketplace.
            </p>
          </Link>
          <Link
            href="/profesionales"
            className="rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_26px_76px_rgba(15,23,42,0.16)]"
          >
            <UserCheck className="mb-5 h-7 w-7 text-blue-600" />
            <p className="text-lg font-semibold text-slate-950">Ver profesionales publicados</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Revisá cómo se muestran los perfiles y categorías dentro de MDP Market.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
