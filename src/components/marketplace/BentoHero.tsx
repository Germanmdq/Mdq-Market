import React from "react";
import Link from "next/link";
import { AlertCircle, Smartphone, Waves, Briefcase, Sofa, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tiles = [
  { 
    id: 1,
    big: true, 
    emoji: "🚨", 
    icon: AlertCircle,
    tag: "24/7", 
    title: "Servicios de urgencia",
    sub: "Plomero, electricista o cerrajero llegando en minutos. Pago en custodia hasta el OK.",
    bg: "from-red-600 to-red-900", 
    cat: "Servicios urgencia", 
    nav: "servicios-urgencia" 
  },
  { 
    id: 2,
    emoji: "📱", 
    icon: Smartphone,
    tag: "Hasta 30% off", 
    title: "Tecnología",
    sub: "iPhone, MacBook y más", 
    bg: "from-blue-500 to-blue-800", 
    cat: "Tecnología", 
    nav: "tecnologia" 
  },
  { 
    id: 3,
    emoji: "🌊", 
    icon: Waves,
    tag: "Local MDP", 
    title: "Productos marplatenses",
    sub: "Alfajores, vinos, artesanías", 
    bg: "from-green-600 to-green-900", 
    cat: "Productos MDP", 
    nav: "productos-mdp" 
  },
  { 
    id: 4,
    emoji: "💼", 
    icon: Briefcase,
    tag: "Verificados", 
    title: "Profesionales destacados",
    sub: "Salud, educación, asesoría", 
    bg: "from-purple-600 to-purple-900", 
    cat: "Profesionales", 
    nav: "profesionales" 
  },
  { 
    id: 5,
    emoji: "🛋️", 
    icon: Sofa,
    tag: "Llega hoy", 
    title: "Hogar y Electro",
    sub: "Heladeras, aires, muebles", 
    bg: "from-amber-500 to-amber-800", 
    cat: "Hogar y Electro", 
    nav: "hogar-y-electro" 
  },
];

const BentoHero = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px] px-4 max-w-7xl mx-auto mt-6">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <Link
            key={t.id}
            href={`/categorias/${t.nav}`}
            className={cn(
              "relative overflow-hidden rounded-3xl group transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl",
              t.big ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
            )}
          >
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity", t.bg)} />
            
            {/* Decorative Icon Background */}
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Icon className="w-32 h-32 md:w-48 md:h-48 text-white rotate-12" />
            </div>

            {/* Content */}
            <div className="relative h-full p-6 md:p-8 flex flex-col justify-end text-white z-10">
              <div className="mb-auto flex justify-between items-start">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {t.tag}
                </span>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              
              <div>
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform origin-left duration-500">{t.emoji}</div>
                <h3 className={cn(
                  "font-black tracking-tight mb-2 leading-tight",
                  t.big ? "text-3xl md:text-4xl" : "text-xl"
                )}>
                  {t.title}
                </h3>
                <p className="text-sm text-white/80 line-clamp-2 font-medium">
                  {t.sub}
                </p>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
        );
      })}
    </section>
  );
};

export default BentoHero;
