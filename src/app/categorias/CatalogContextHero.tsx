import Link from "next/link";
import { CatalogContext } from "./getCatalogContext";
import { Search } from "lucide-react";

export function CatalogContextHero({ context, resultCount }: { context: CatalogContext, resultCount?: number }) {
  return (
    <section className="bg-[#ffe600] shadow-sm">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap gap-2 text-sm text-[#333333]">
          {context.breadcrumb.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              <Link href={item.href} className="hover:text-[#3483fa] transition font-medium">
                {item.label}
              </Link>
              {index < context.breadcrumb.length - 1 && <span className="text-[#999999]">&gt;</span>}
            </span>
          ))}
        </nav>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#333333]">
              {context.pageTitle}
            </h1>
          </div>
          <div className="w-full lg:w-96 relative">
            <input 
              type="text" 
              placeholder={`Buscar en ${context.title.toLowerCase()}...`} 
              className="w-full rounded-sm bg-white px-4 py-2.5 text-sm text-[#333333] shadow-sm outline-none placeholder:text-[#999999]" 
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
          </div>
        </div>
      </div>
    </section>
  );
}