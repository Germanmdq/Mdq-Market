"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  PlusCircle, 
  ShoppingBag, 
  User, 
  Heart 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Inicio", icon: Home, href: "/" },
  { label: "Buscar", icon: Search, href: "/productos" },
  { label: "Vender", icon: PlusCircle, href: "/publicar", primary: true },
  { label: "Favoritos", icon: Heart, href: "/favoritos" },
  { label: "Mi Cuenta", icon: User, href: "/perfil" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-4 pb-safe-area-inset-bottom md:hidden lg:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link 
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-8 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center shadow-xl shadow-slate-200 group-active:scale-90 transition-all border-4 border-white">
                  <Icon className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-1 rounded-2xl transition-all active:scale-90",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon 
                className={cn("w-5.5 h-5.5 transition-all", isActive && "scale-110")} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={cn(
                "text-[9px] font-black mt-1 uppercase tracking-tight",
                isActive ? "text-blue-600" : "text-slate-400"
              )}>
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
