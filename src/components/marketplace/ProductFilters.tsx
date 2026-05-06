import React from "react";
import { CATEGORIES, ZONES } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  mobile?: boolean;
  onClose?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ mobile, onClose }) => {
  return (
    <div className={cn("space-y-8", mobile ? "pb-24" : "")}>
      {!mobile && (
        <h2 className="text-lg font-black text-slate-950 mb-6">Filtros</h2>
      )}

      {/* Category */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Categoría</h3>
        <div className="space-y-2">
          {CATEGORIES.filter(c => c.type === 'producto' || c.type === 'mixto').map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
              <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Precio</h3>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="number" 
            placeholder="Mínimo" 
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
          <input 
            type="number" 
            placeholder="Máximo" 
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Zone */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Zona</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {ZONES.map(zone => (
            <label key={zone} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
              <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{zone}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Estado</h3>
        <div className="space-y-2">
          {["Nuevo", "Usado como nuevo", "Usado bueno", "Usado con detalles", "Reacondicionado"].map(status => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
              <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Seller Type */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Vendedor</h3>
        <div className="space-y-2">
          {["Verificado", "Comercio", "Emprendedor", "Particular"].map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
              <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Operation */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Operación</h3>
        <div className="space-y-2">
          {[
            { label: "Pago protegido", icon: "🛡️" },
            { label: "Entrega MDP", icon: "🚚" },
            { label: "Destacados", icon: "⭐" }
          ].map(op => (
            <label key={op.label} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
              <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                {op.icon} {op.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
