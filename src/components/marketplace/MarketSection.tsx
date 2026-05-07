import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
    <section className={cn("w-full py-10 sm:py-14 bg-white", className)}>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            {eyebrow && (
              <p className="text-sm font-medium text-blue-600">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          {href && (
            <Link
              href={href}
              className="text-sm font-medium text-slate-950 hover:text-blue-600 transition-colors hidden sm:flex items-center gap-1"
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
