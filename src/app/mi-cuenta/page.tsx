import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Heart, 
  AlertCircle, 
  Settings, 
  Package, 
  MapPin, 
  Calendar, 
  PlusCircle, 
  LayoutDashboard,
  User as UserIcon,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function MiCuentaPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name || profile?.display_name || user.email?.split("@")[0] || "Usuario";

  const MENU_SECTIONS = [
    {
      title: "Mi Actividad",
      items: [
        { label: "Mis compras", href: "/compras", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Mis reservas", href: "/reservas", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Favoritos", href: "/favoritos", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
      ]
    },
    {
      title: "Vender",
      items: [
        { label: "Publicar producto", href: "/publicar", icon: PlusCircle, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Mis publicaciones", href: "/mis-publicaciones", icon: LayoutDashboard, color: "text-amber-600", bg: "bg-amber-50" },
      ]
    },
    {
      title: "Configuración",
      items: [
        { label: "Mi perfil", href: "/perfil", icon: UserIcon, color: "text-slate-600", bg: "bg-slate-100" },
        { label: "Direcciones", href: "/perfil#direcciones", icon: MapPin, color: "text-slate-600", bg: "bg-slate-100" },
        { label: "Reclamos", href: "/reclamos", icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-100" },
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <main className="max-w-[1100px] mx-auto w-full px-4 pt-12">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.06)] mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10 w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-200 uppercase">
            {userName.charAt(0)}
          </div>
          <div className="relative z-10 text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Hola, {userName}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Gestioná tus compras, reservas y publicaciones desde un solo lugar.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                Miembro desde {new Date(user.created_at).getFullYear()}
              </span>
              <span className="px-3 py-1 bg-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Cuenta Verificada
              </span>
            </div>
          </div>
          <div className="relative z-10">
             <LogoutButton className="bg-white border border-slate-200 shadow-sm px-6 py-3 rounded-2xl hover:bg-red-50 hover:border-red-100" />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-4">{section.title}</h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg, item.color)}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-slate-700">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
