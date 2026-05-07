"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { 
  Package, 
  DollarSign, 
  MapPin, 
  Image as ImageIcon, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

type MenuCategory = {
  id: string;
  name: string;
};

function PublicarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MenuCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    condition: "Nuevo",
    zone: "",
    stock: "1",
    images: [""]
  });

  const publishQuery = searchParams.get("q") ?? "";
  const publishIntent = searchParams.get("intent");

  function buildPublishSuggestion(query: string) {
    const value = query.toLowerCase();
    if (value.includes("bici") || value.includes("bicicleta")) {
      return {
        title: "Bicicleta MTB rodado 29 usada en buen estado",
        categoryTerm: "bicicletas",
        description: "Bicicleta MTB rodado 29, ideal para uso urbano o recreativo. Se entrega en Mar del Plata con Entrega MDP. Consultar disponibilidad.",
        priceRange: "$180.000 - $260.000 según estado",
      };
    }
    if (value.includes("notebook")) {
      return {
        title: "Notebook usada en buen estado",
        categoryTerm: "tecnologia",
        description: "Notebook usada, ideal para estudio, trabajo o uso diario. Se entrega en Mar del Plata con Entrega MDP. Consultar detalles y disponibilidad.",
        priceRange: "$350.000 - $900.000 según marca, memoria y estado",
      };
    }
    return {
      title: query ? `${query.charAt(0).toUpperCase()}${query.slice(1)} usado en buen estado` : "",
      categoryTerm: "",
      description: query ? `${query} en buen estado. Se entrega en Mar del Plata con Entrega MDP. Consultar disponibilidad.` : "",
      priceRange: "Definir según estado, marca y demanda local",
    };
  }

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("is_root", true)
        .order("name");
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (publishIntent !== "vender" || !publishQuery) return;
    queueMicrotask(() => {
      const suggestion = buildPublishSuggestion(publishQuery);
      setFormData((current) => ({
        ...current,
        title: current.title || suggestion.title,
        description: current.description || suggestion.description,
      }));
    });
  }, [publishIntent, publishQuery]);

  const handleCategoryChange = async (catId: string) => {
    const category = categories.find(c => c.id === catId);
    setFormData({ ...formData, category: category?.name || "", subcategory: "" });
    
    if (catId) {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", catId)
        .order("name");
      setSubcategories(data || []);
    } else {
      setSubcategories([]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const slug = `${slugify(formData.title)}-${Math.random().toString(36).slice(2, 7)}`;

    const productData = {
      seller_profile_id: user.id,
      title: formData.title,
      slug: slug,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      price: parseFloat(formData.price),
      condition: formData.condition,
      seller_type: profile?.role === 'vendedor' ? 'Particular' : 'Particular', // Defaulting for now
      seller_name: profile?.full_name || "Vendedor",
      seller_verified: profile?.is_verified || false,
      zone: formData.zone,
      city: "Mar del Plata",
      images: formData.images.filter(img => img.trim() !== ""),
      status: 'published', // Published for demo purposes
      stock: parseInt(formData.stock),
      protected_payment: true,
      mdp_delivery_available: true
    };

    const { error } = await supabase
      .from("products")
      .insert(productData);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/mis-publicaciones");
      router.refresh();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <main className="max-w-[800px] mx-auto w-full px-4 pt-12">
        
        <Link href="/mi-cuenta" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-8">
          <ChevronLeft className="w-5 h-5" />
          Volver a Mi Cuenta
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100">
              <Plus className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vender en MDP Market</h1>
              <p className="text-slate-500 font-medium mt-1">Llegá a miles de compradores en toda la ciudad.</p>
            </div>
          </div>

          <form onSubmit={handlePublish} className="space-y-10">
            {publishIntent === "vender" && publishQuery && (
              <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-blue-700">Asistente de publicación</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950">
                  Te ayudo a publicar: {publishQuery}
                </h2>
                <div className="mt-4 grid gap-3 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-950">Título sugerido:</span> {buildPublishSuggestion(publishQuery).title}</p>
                  <p><span className="font-semibold text-slate-950">Descripción:</span> {buildPublishSuggestion(publishQuery).description}</p>
                  <p><span className="font-semibold text-slate-950">Precio sugerido:</span> {buildPublishSuggestion(publishQuery).priceRange}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const suggestion = buildPublishSuggestion(publishQuery);
                    setFormData((current) => ({
                      ...current,
                      title: suggestion.title,
                      description: suggestion.description,
                    }));
                  }}
                  className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Usar sugerencia
                </button>
              </section>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-800 text-sm font-bold">
                Error: {error}
              </div>
            )}

            {/* Basic Info */}
            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Información Básica</h3>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Título de la publicación</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Samsung Galaxy S23 Ultra 256GB"
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Categoría</label>
                  <select
                    required
                    className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Subcategoría</label>
                  <select
                    required
                    className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                    value={subcategories.find(s => s.name === formData.subcategory)?.id || ""}
                    onChange={(e) => setFormData({...formData, subcategory: subcategories.find(s => s.id === e.target.value)?.name || ""})}
                  >
                    <option value="">Seleccionar...</option>
                    {subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Price & Stock */}
            <section className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Precio y Disponibilidad</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Precio</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-slate-300" />
                      </div>
                      <input
                        type="number"
                        required
                        placeholder="0.00"
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Stock</label>
                    <input
                      type="number"
                      required
                      className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
               </div>
            </section>

            {/* Description */}
            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detalles del Producto</h3>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Descripción</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Contá los detalles, uso, fallas, accesorios incluidos..."
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Condición</label>
                    <select
                      className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    >
                      <option>Nuevo</option>
                      <option>Usado como nuevo</option>
                      <option>Usado bueno</option>
                      <option>Usado con detalles</option>
                      <option>Reacondicionado</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Barrio / Zona de retiro</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Macrocentro, Güemes, La Perla..."
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                        value={formData.zone}
                        onChange={(e) => setFormData({...formData, zone: e.target.value})}
                      />
                    </div>
                 </div>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Imágenes (URLs)</h3>
               <div className="space-y-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://..."
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData({...formData, images: newImages});
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, images: [...formData.images, ""]})}
                    className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-blue-700 transition-colors ml-1"
                  >
                    <Plus className="w-4 h-4" /> Agregar otra imagen
                  </button>
               </div>
            </section>

            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                 <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest leading-none pt-0.5">Publicación Protegida por MDP Market</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Publicar Ahora
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default function PublicarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-12 text-center text-sm font-semibold text-slate-500">Cargando publicación...</div>}>
      <PublicarContent />
    </Suspense>
  );
}
