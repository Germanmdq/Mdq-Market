"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Inicio", icon: Home, href: "/" },
  { label: "Buscar", icon: Search, href: "/productos" },
  { label: "Publicar", icon: PlusCircle, href: "/publicar" },
  { label: "Compras", icon: ShoppingBag, href: "/dashboard/usuario?tab=compras" },
  { label: "Cuenta", icon: User, href: "/dashboard/usuario" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 px-6 py-3 pb-8 flex justify-between items-center">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-blue-600 scale-110" : "text-slate-400"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "stroke-[3px]")} />
            <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "opacity-100" : "opacity-60")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
