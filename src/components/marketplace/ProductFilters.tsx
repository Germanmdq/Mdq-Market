"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const ZONES = [
  "Centro", "Güemes", "Constitución", "La Perla", "Playa Grande",
  "Punta Mogotes", "Camet", "Los Troncos", "Parque Camet", "Stella Maris",
  "Colinas de Peralta Ramos", "Bosque Peralta Ramos", "Playa Chica",
  "Puerto", "Alfar", "Faro Norte", "San Carlos", "Las Américas"
];

const CONDITIONS = [
  "Nuevo", "Usado - Como nuevo", "Usado - Buen estado",
  "Usado - Con detalles", "Reacondicionado"
];

const SELLER_TYPES = {
  "commerce": "Comercio",
  "entrepreneur": "Emprendedor",
  "individual": "Particular"
};

interface ProductFiltersProps {
  mobile?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ mobile }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/productos?${params.toString()}`, { scroll: false });
  };

  const currentZone = searchParams.get("zone");
  const currentSellerType = searchParams.get("sellerType");
  const currentCondition = searchParams.get("condition");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const hasProtectedPayment = searchParams.get("protectedPayment") === "true";
  const hasDelivery = searchParams.get("delivery") === "true";
  const isVerified = searchParams.get("verified") === "true";

  const toggleBoolean = (key: string, current: boolean) => {
    updateFilter(key, current ? null : "true");
  };

  return (
    <div className={cn("space-y-6", mobile ? "pb-24" : "")}>
      {!mobile && (
        <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
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
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
          {CONDITIONS.map((condition) => (
            <label key={condition} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                checked={currentCondition === condition}
                onChange={() => updateFilter("condition", currentCondition === condition ? null : condition)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-950 transition-colors">
                {condition}
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
