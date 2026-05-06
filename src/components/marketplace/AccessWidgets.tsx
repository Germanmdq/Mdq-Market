"use client";

import React from "react";
import { 
  PlusCircle, 
  Tag, 
  CreditCard, 
  Smartphone, 
  Truck, 
  Gift,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WIDGETS = [
  { id: 1, label: "Ingresar dinero", icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-50", href: "/billetera" },
  { id: 2, label: "Ofertas", icon: Tag, color: "text-red-600", bg: "bg-red-50", href: "/ofertas" },
  { id: 3, label: "Cuotas sin interés", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50", href: "/beneficios" },
  { id: 4, label: "Recargar celular", icon: Smartphone, color: "text-green-600", bg: "bg-green-50", href: "/recargas" },
  { id: 5, label: "Envíos MDP", icon: Truck, color: "text-orange-600", bg: "bg-orange-50", href: "/envios" },
  { id: 6, label: "Cupones", icon: Gift, color: "text-pink-600", bg: "bg-pink-50", href: "/cupones" },
  { id: 7, label: "Pagar servicios", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", href: "/servicios" },
];

export default function AccessWidgets() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-8 md:gap-0">
        {WIDGETS.map((item) => (
          <Link 
            key={item.id} 
            href={item.href}
            className="flex flex-col items-center gap-3 group shrink-0"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              item.bg, item.color
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-gray-700 whitespace-nowrap group-hover:text-blue-600 transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
