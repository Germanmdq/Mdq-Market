"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft, Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

export default function FavoritosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  async function loadFavorites() {
    try {
      const { data } = await supabase
        .from("favorites")
        .select("*, products(*)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      const products = data?.map((fav) => fav.products).filter(Boolean) || [];
      setFavorites(products as Product[]);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-950 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-slate-950 tracking-tight">Mis Favoritos</h1>
        </div>
        <span className="text-sm font-medium text-slate-500">{favorites.length} productos guardados</span>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-950 mb-2">Tu lista está vacía</h2>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto">Guardá los productos y servicios que te interesan para verlos más tarde</p>
          <Link href="/productos" className="inline-flex items-center gap-2 bg-slate-950 text-white font-medium px-8 py-4 rounded-full hover:bg-slate-800 transition-all shadow-sm">
            <Search className="w-5 h-5" />
            Explorar Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
