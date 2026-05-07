"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMegaMenuCategories, type Category } from "@/lib/categories";

const ZONES = [
  "Centro", "Güemes", "Constitución", "La Perla", "Playa Grande",
  "Punta Mogotes", "Camet", "Los Troncos", "Parque Camet", "Stella Maris",
  "Colinas de Peralta Ramos", "Bosque Peralta Ramos", "Playa Chica",
  "Puerto", "Alfar", "Faro Norte", "San Carlos", "Las Américas"
];

const CONDITIONS = {
  new: "Nuevo",
  used_like_new: "Usado - como nuevo",
  used_good: "Usado - buen estado",
  used_with_details: "Usado - con detalles",
  refurbished: "Reacondicionado",
};

const SELLER_TYPES = {
  "commerce": "Comercio",
  "entrepreneur": "Emprendedor",
  "particular": "Particular"
};

interface ProductFiltersProps {
  mobile?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ mobile }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let mounted = true;
    getMegaMenuCategories().then((tree) => {
      if (!mounted) return;
      setCategories(tree);
      setLoadingCategories(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/productos?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push("/productos", { scroll: false });

  const currentCategory = searchParams.get("category");
  const currentSubcategory = searchParams.get("subcategory");
  const currentZone = searchParams.get("zone");
  const currentSellerType = searchParams.get("sellerType");
  const currentCondition = searchParams.get("condition");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const hasProtectedPayment = searchParams.get("protectedPayment") === "true";
  const hasDelivery = searchParams.get("delivery") === "true";
  const isVerified = searchParams.get("verified") === "true";
  const hasOffers = searchParams.get("ofertas") === "true";

  const subcategories = useMemo(
    () => categories.find((category) => category.slug === currentCategory)?.children ?? categories.flatMap((category) => category.children ?? []).slice(0, 18),
    [categories, currentCategory]
  );

  const chips = [
    currentCategory && { key: "category", label: categories.find((c) => c.slug === currentCategory)?.name ?? currentCategory },
    currentSubcategory && { key: "subcategory", label: subcategories.find((c) => c.slug === currentSubcategory)?.name ?? currentSubcategory },
    currentMinPrice && { key: "minPrice", label: `Desde $${Number(currentMinPrice).toLocaleString("es-AR")}` },
    currentMaxPrice && { key: "maxPrice", label: `Hasta $${Number(currentMaxPrice).toLocaleString("es-AR")}` },
    currentZone && { key: "zone", label: currentZone },
    currentCondition && { key: "condition", label: CONDITIONS[currentCondition as keyof typeof CONDITIONS] ?? currentCondition },
    currentSellerType && { key: "sellerType", label: SELLER_TYPES[currentSellerType as keyof typeof SELLER_TYPES] ?? currentSellerType },
    hasDelivery && { key: "delivery", label: "Entrega MDP" },
    hasProtectedPayment && { key: "protectedPayment", label: "Pago protegido" },
    hasOffers && { key: "ofertas", label: "Ofertas" },
    isVerified && { key: "verified", label: "Vendedor verificado" },
  ].filter(Boolean) as { key: string; label: string }[];

  const toggleBoolean = (key: string, current: boolean) => {
    updateFilter(key, current ? null : "true");
  };

  return (
    <div className={cn("space-y-6", mobile ? "pb-24" : "")}>
      {!mobile && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
          {chips.length > 0 && (
            <button onClick={clearAll} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Limpiar
            </button>
          )}
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => updateFilter(chip.key, null)}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {chip.label} ×
            </button>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Categoría</h3>
        {loadingCategories ? (
          <div className="space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <div className="space-y-1.5">
            {categories.slice(0, 14).map((category) => (
              <label key={category.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === category.slug}
                  onChange={() => updateFilter("category", currentCategory === category.slug ? null : category.slug)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {subcategories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Subcategoría</h3>
          <div className="space-y-1.5">
            {subcategories.slice(0, 16).map((subcategory) => (
              <label key={subcategory.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="subcategory"
                  checked={currentSubcategory === subcategory.slug}
                  onChange={() => updateFilter("subcategory", currentSubcategory === subcategory.slug ? null : subcategory.slug)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                  {subcategory.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Rango de precio</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mín"
            defaultValue={currentMinPrice || ""}
            onBlur={(e) => updateFilter("minPrice", e.target.value || null)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <input
            type="number"
            placeholder="Máx"
            defaultValue={currentMaxPrice || ""}
            onBlur={(e) => updateFilter("maxPrice", e.target.value || null)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Zone */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Zona</h3>
        <div className="space-y-1.5">
          {ZONES.map((zone) => (
            <label key={zone} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="zone"
                checked={currentZone === zone}
                onChange={() => updateFilter("zone", currentZone === zone ? null : zone)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                {zone}
              </span>
            </label>
          ))}
        </div>
        {currentZone && (
          <button
            onClick={() => updateFilter("zone", null)}
            className="mt-2 text-xs font-medium text-blue-600 hover:underline"
          >
            Limpiar zona
          </button>
        )}
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Estado</h3>
        <div className="space-y-1.5">
          {Object.entries(CONDITIONS).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                checked={currentCondition === key}
                onChange={() => updateFilter("condition", currentCondition === key ? null : key)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
        {currentCondition && (
          <button
            onClick={() => updateFilter("condition", null)}
            className="mt-2 text-xs font-medium text-blue-600 hover:underline"
          >
            Limpiar estado
          </button>
        )}
      </div>

      {/* Seller Type */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Tipo de vendedor</h3>
        <div className="space-y-1.5">
          {Object.entries(SELLER_TYPES).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sellerType"
                checked={currentSellerType === key}
                onChange={() => updateFilter("sellerType", currentSellerType === key ? null : key)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
        {currentSellerType && (
          <button
            onClick={() => updateFilter("sellerType", null)}
            className="mt-2 text-xs font-medium text-blue-600 hover:underline"
          >
            Limpiar tipo
          </button>
        )}
      </div>

      {/* Special Features */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Características</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasOffers}
              onChange={() => toggleBoolean("ofertas", hasOffers)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
              Ofertas
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasProtectedPayment}
              onChange={() => toggleBoolean("protectedPayment", hasProtectedPayment)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
              Pago protegido
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasDelivery}
              onChange={() => toggleBoolean("delivery", hasDelivery)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
              Entrega en MDP
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={() => toggleBoolean("verified", isVerified)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
              Vendedor verificado
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
