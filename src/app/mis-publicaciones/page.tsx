import React from "react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Package, Eye, ShoppingCart, Edit3, Trash2, ChevronRight, Search, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function MisPublicacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <main className="max-w-[1100px] mx-auto w-full px-4 pt-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 tracking-tight">Mis Publicaciones</h1>
            <p className="text-slate-500 mt-1">Gestioná tus productos a la venta en Mar del Plata</p>
          </div>
          <Link href="/publicar" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 transition-all">
            <PlusCircle className="w-5 h-5" />
            Publicar Nuevo Producto
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           {[
             { label: "Publicaciones", value: products?.length || 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Vistas Totales", value: products?.reduce((acc, p) => acc + (p.views || 0), 0) || 0, icon: Eye, color: "text-slate-600", bg: "bg-slate-50" },
             { label: "Ventas", value: products?.reduce((acc, p) => acc + (p.sold_count || 0), 0) || 0, icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Ingresos Est.", value: formatPrice(products?.reduce((acc, p) => acc + ((p.sold_count || 0) * p.price), 0) || 0), icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
           ].map((stat) => (
             <div key={stat.label} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg, stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-medium text-slate-500 uppercase">{stat.label}</p>
                <p className="text-xl font-semibold text-slate-950 mt-1">{stat.value}</p>
             </div>
           ))}
        </div>

        {(!products || products.length === 0) ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-950 mb-2">No tenés publicaciones activas</h2>
            <p className="text-slate-500 mb-10">Empezá a vender hoy mismo en el marketplace más grande de MDP</p>
            <Link href="/publicar" className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 transition-all">
              <PlusCircle className="w-5 h-5" />
              Publicar mi primer producto
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-medium text-slate-500 uppercase">Producto</th>
                    <th className="px-8 py-5 text-xs font-medium text-slate-500 uppercase">Estado</th>
                    <th className="px-8 py-5 text-xs font-medium text-slate-500 uppercase">Precio</th>
                    <th className="px-8 py-5 text-xs font-medium text-slate-500 uppercase">Stock</th>
                    <th className="px-8 py-5 text-xs font-medium text-slate-500 uppercase text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-950 truncate max-w-[200px]">{product.title}</p>
                            <p className="text-xs text-slate-500">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={cn(
                           "px-3 py-1 rounded-full text-xs font-medium",
                           product.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                         )}>
                           {product.status === 'published' ? 'Activo' : 'Pausado'}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-semibold text-slate-950">{formatPrice(product.price)}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-medium text-slate-600">{product.stock || 0}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                              <Edit3 className="w-5 h-5" />
                           </button>
                           <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 className="w-5 h-5" />
                           </button>
                           <Link href={`/productos/${product.slug}`} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                              <ChevronRight className="w-5 h-5" />
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
