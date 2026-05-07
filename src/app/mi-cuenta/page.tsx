"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, Settings, LogOut, Package, MapPin, User, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/components/marketplace/ProductCard";

const TABS = [
  { id: "perfil", label: "Mi perfil", icon: User },
  { id: "compras", label: "Mis compras", icon: ShoppingBag },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "direcciones", label: "Direcciones", icon: MapPin },
];

export default function MiCuentaPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoadingData(true);
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      setProfile(profileData);

      // Load orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, products(*)")
        .eq("buyer_id", user?.id)
        .order("created_at", { ascending: false });
      setOrders(ordersData || []);

      // Load favorites
      const { data: favoritesData } = await supabase
        .from("favorites")
        .select("*, products(*)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      setFavorites(favoritesData || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1280px] mx-auto w-full px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Mi Cuenta</h1>
          <p className="text-slate-500 mt-2">Gestioná tus compras, favoritos y datos personales</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-950"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 w-full">
            {/* Perfil Tab */}
            {activeTab === "perfil" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-950">Mi perfil</h2>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Nombre completo</label>
                      <input
                        type="text"
                        value={profile?.full_name || user?.user_metadata?.full_name || ""}
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Email</label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Teléfono</label>
                      <input
                        type="tel"
                        value={profile?.phone || ""}
                        placeholder="Sin configurar"
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Ubicación</label>
                      <input
                        type="text"
                        value={profile?.location || ""}
                        placeholder="Sin configurar"
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compras Tab */}
            {activeTab === "compras" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-950">Mis compras</h2>
                {loadingData ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto" />
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Orden #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-slate-950">
                            {new Date(order.created_at).toLocaleDateString("es-AR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                          {order.status === "pending" && "Pendiente"}
                          {order.status === "confirmed" && "Confirmada"}
                          {order.status === "shipped" && "Enviada"}
                          {order.status === "delivered" && "Entregada"}
                          {order.status === "cancelled" && "Cancelada"}
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                          {order.products?.image ? (
                            <img src={order.products.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-slate-950">{order.products?.title || "Producto"}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-slate-950">${order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No tenés compras aún</p>
                  </div>
                )}
              </div>
            )}

            {/* Favoritos Tab */}
            {activeTab === "favoritos" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-950">Mis favoritos</h2>
                {loadingData ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto" />
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => fav.products && (
                      <ProductCard key={fav.id} product={fav.products} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No tenés favoritos guardados</p>
                  </div>
                )}
              </div>
            )}

            {/* Direcciones Tab */}
            {activeTab === "direcciones" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-950">Mis direcciones</h2>
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No tenés direcciones guardadas</p>
                  <button className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
                    Agregar dirección
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
