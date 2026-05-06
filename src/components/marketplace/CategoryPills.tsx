"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/mockData";
import { cn } from "@/lib/utils";

const CategoryPills = () => {
  return (
    <div className="w-full bg-white lg:bg-transparent py-4 lg:py-0">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex gap-2.5 overflow-x-auto px-4 lg:px-8 pb-1 no-scrollbar select-none">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.type === "producto" ? "/productos" : "/servicios"}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-slate-100 bg-white px-5 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 group"
            >
              <span className="text-base group-hover:scale-125 transition-transform">{category.icon}</span>
              <span className="uppercase tracking-widest">{category.name}</span>
            </Link>
          ))}
          
          {/* View More Pill */}
          <Link
            href="/productos"
            className="flex shrink-0 items-center gap-2 rounded-full border border-slate-100 bg-slate-900 px-6 py-2.5 text-xs font-black text-white shadow-sm hover:bg-blue-600 transition-all active:scale-95"
          >
            VER TODAS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPills;
