import React from "react";
import Link from "next/link";
import { ShoppingBag, Package, ChevronRight, Clock, MapPin, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function ComprasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch orders with their items and product details
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          title,
          images
        )
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <main className="max-w-[900px] mx-auto w-full px-4 pt-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Compras</h1>
            <p className="text-slate-500 font-medium mt-1">Seguí el estado de tus pedidos en Mar del Plata.</p>
          </div>
          <Link href="/productos" className="hidden md:flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:text-blue-700 transition-colors">
            Explorar Productos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {(!orders || orders.length === 0) ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Todavía no realizaste compras</h2>
            <p className="text-slate-500 font-medium mb-10">¡Tu primer producto te está esperando!</p>
            <Link href="/productos" className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              <Search className="w-5 h-5" />
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orden #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {order.status === 'pending' ? 'Pendiente' : 'En camino'}
                       </span>
                       <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                         Pago Protegido
                       </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shrink-0">
                          {item.products?.images?.[0] ? (
                            <img src={item.products.images[0]} alt={item.products.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-slate-200" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-black text-slate-900 truncate">{item.products?.title || "Producto"}</h3>
                          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900">{formatPrice(item.unit_price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                       <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {order.shipping_zone || 'Mar del Plata'}</div>
                       <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                       <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(order.total_amount)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-8 py-4 flex justify-end gap-4">
                   <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Necesito ayuda</button>
                   <Link href={`/operaciones/${order.id}`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Ver Detalles</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
