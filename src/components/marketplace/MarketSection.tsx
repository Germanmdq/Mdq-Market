import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

type MarketSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
};

export function MarketSection({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Ver más",
  children,
  className = "",
}: MarketSectionProps) {
  return (
    <section className={`w-full py-8 sm:py-12 ${className}`}>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                {eyebrow}
              </p>
            )}
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500">
                {description}
              </p>
            )}
          </div>

          {href && (
            <Link
              href={href}
              className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:inline-flex"
            >
              {linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
