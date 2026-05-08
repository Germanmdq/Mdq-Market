"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
        <p className="text-sm font-semibold text-red-600">Algo falló</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          No pudimos cargar esta página
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Probá recargar o volvé al inicio de MDP Market.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Ir al inicio
          </a>
        </div>
      </section>
    </main>
  );
}
