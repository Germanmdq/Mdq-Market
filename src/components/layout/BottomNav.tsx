"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Inicio", icon: Home, href: "/" },
  { label: "Buscar", icon: Search, href: "/productos" },
  { label: "Publicar", icon: PlusCircle, href: "/publicar", primary: true },
  { label: "Compras", icon: ShoppingBag, href: "/operaciones" },
  { label: "Cuenta", icon: User, href: "/mi-cuenta" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-white/95 backdrop-blur-xl px-3 py-2 lg:hidden">
      <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center -mt-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-90 transition border-4 border-white">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={cn(
              "flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-90",
              isActive ? "text-blue-600" : "text-slate-400"
            )}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px] mt-0.5", isActive ? "font-semibold text-blue-600" : "font-medium text-slate-400")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
