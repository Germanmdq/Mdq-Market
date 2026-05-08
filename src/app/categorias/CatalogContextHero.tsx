import Link from "next/link";
import { CatalogContext } from "./getCatalogContext";

export function CatalogContextHero({ context, resultCount }: { context: CatalogContext, resultCount?: number }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
          {context.breadcrumb.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              <Link href={item.href} className="hover:text-blue-600 transition font-medium">
                {item.label}
              </Link>
              {index < context.breadcrumb.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              {context.eyebrow}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {context.pageTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {context.description}
            </p>
          </div>
          <div className="w-full">
             <input 
               type="text" 
               placeholder={`Buscar en ${context.title.toLowerCase()}...`} 
               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition" 
             />
          </div>
        </div>
      </div>
    </section>
  );
}