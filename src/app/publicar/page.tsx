"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Wrench, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Camera,
  MapPin,
  ChevronRight,
  Info,
  DollarSign,
  Truck,
  FileText,
  Clock,
  Shield,
  Layers,
  Barcode,
  Settings,
  Scale,
  Calendar,
  CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

type PublishType = "producto" | "servicio" | "profesional" | null;

export default function PublicarPage() {
  const [selectedType, setSelectedType] = useState<PublishType>(null);
  const [step, setStep] = useState(1);

  const options = [
    { 
      id: "producto", 
      title: "Vender un Producto", 
      desc: "Stock físico, herramientas, materiales o equipos.", 
      icon: <Package className="w-8 h-8" />,
      color: "blue",
      features: ["Control de Stock", "Ficha Técnica Pro", "Garantía"]
    },
    { 
      id: "servicio", 
      title: "Servicios y Gremios", 
      desc: "Reparaciones, instalaciones y mantenimiento técnico.", 
      icon: <Wrench className="w-8 h-8" />,
      color: "orange",
      features: ["Presupuestos Directos", "Matrícula Validada", "Zonas"]
    },
    { 
      id: "profesional", 
      title: "Perfil Profesional", 
      desc: "Abogados, contadores, arquitectos o prestadores certificados.", 
      icon: <UserCheck className="w-8 h-8" />,
      color: "purple",
      features: ["Agenda Online", "Reputación Pro", "Certificados"]
    }
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : setSelectedType(null);

  if (selectedType === "producto") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 flex items-center justify-between">
           <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-xs uppercase tracking-widest transition-all">
              <ChevronRight className="w-4 h-4 rotate-180" /> Volver
           </button>
           <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn("w-12 h-1.5 rounded-full transition-all", i <= step ? "bg-blue-600" : "bg-gray-200")} />
              ))}
           </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="p-10 border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-4 mb-2">
                 <Package className="w-6 h-6 text-blue-600" />
                 <h1 className="text-3xl font-black text-gray-900 tracking-tight">Formulario Técnico de Producto</h1>
              </div>
              <p className="text-gray-500 font-medium">Completá la información para la venta directa y gestión de inventario.</p>
           </div>

           <div className="p-10 space-y-12">
              {/* Sección A: Datos de Identidad */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">A. Datos de Identidad</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título de la Publicación</label>
                       <input type="text" placeholder="Ej: Taladro Percutor Bosch GSB 13 RE 650W" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría Jerárquica</label>
                       <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none">
                          <option>Herramientas &gt; Eléctricas</option>
                          <option>Hogar &gt; Muebles</option>
                          <option>Tecnología &gt; Celulares</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código SKU / Referencia</label>
                       <div className="relative">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="ID-INTERNO-001" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GTIN / Código de Barras</label>
                       <div className="relative">
                          <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="EAN-13 o UPC" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sección B: Ficha Técnica */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">B. Ficha Técnica (Atributos)</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
                       <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold">
                          <option>Nuevo</option>
                          <option>Usado</option>
                          <option>Reacondicionado</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Marca</label>
                       <input type="text" placeholder="Ej: Bosch" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modelo Exacto</label>
                       <input type="text" placeholder="Ej: GSB 13 RE" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dimensiones y Peso</label>
                       <div className="grid grid-cols-4 gap-2">
                          <input type="text" placeholder="Al" className="w-full px-2 py-4 bg-gray-50 border border-gray-100 rounded-xl text-center font-bold" />
                          <input type="text" placeholder="An" className="w-full px-2 py-4 bg-gray-50 border border-gray-100 rounded-xl text-center font-bold" />
                          <input type="text" placeholder="Pr" className="w-full px-2 py-4 bg-gray-50 border border-gray-100 rounded-xl text-center font-bold" />
                          <input type="text" placeholder="Kg" className="w-full px-2 py-4 bg-gray-50 border border-gray-100 rounded-xl text-center font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alimentación / Voltaje</label>
                       <input type="text" placeholder="Ej: 220V / Batería 18V" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                 </div>
              </div>

              {/* Sección C: Comercial y Entrega */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">C. Comercial y Entrega</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Final de Lista</label>
                       <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                          <input type="number" placeholder="0.00" className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-lg" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Real</label>
                       <input type="number" placeholder="Unidades disponibles" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logística de Entrega</label>
                       <div className="flex gap-2">
                          <div className="flex-grow py-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-700 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                             <CheckSquare className="w-3 h-3" /> Gestionada por Entrega MDP
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Garantía (Meses)</label>
                       <div className="relative">
                          <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="Ej: 12 meses de fábrica" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex justify-end gap-4 border-t border-gray-50">
                 <button className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl">
                    Publicar Producto
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (selectedType === "servicio") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 flex items-center justify-between">
           <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-xs uppercase tracking-widest transition-all">
              <ChevronRight className="w-4 h-4 rotate-180" /> Volver
           </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="p-10 border-b border-gray-50 bg-orange-50/30">
              <div className="flex items-center gap-4 mb-2">
                 <Wrench className="w-6 h-6 text-orange-600" />
                 <h1 className="text-3xl font-black text-gray-900 tracking-tight">Formulario para Servicios y Gremios</h1>
              </div>
              <p className="text-gray-500 font-medium">Validación de autoridad profesional y estructura de presupuestos.</p>
           </div>

           <div className="p-10 space-y-12">
              {/* Sección A: Perfil del Prestador */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-orange-600 pl-4">
                    <UserCheck className="w-5 h-5 text-orange-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">A. Perfil del Prestador</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre / Razón Social</label>
                       <input type="text" placeholder="Nombre legal de la empresa o profesional" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Especialidad (Rubro)</label>
                       <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold appearance-none">
                          <option>Plomería</option>
                          <option>Refrigeración</option>
                          <option>Gas</option>
                          <option>Electricidad</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matrícula Profesional</label>
                       <input type="text" placeholder="Número oficial y ente emisor" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zona de Cobertura (MDP)</label>
                       <input type="text" placeholder="Ej: Barrios o radio en Km" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                 </div>
              </div>

              {/* Sección B: Definición del Servicio */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-orange-600 pl-4">
                    <CheckSquare className="w-5 h-5 text-orange-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">B. Definición del Servicio Técnico</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre de la Prestación</label>
                       <input type="text" placeholder="Ej: Mantenimiento integral de calderas duales" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Checklist de Tareas</label>
                          <textarea placeholder="Detallá los puntos que ejecutás en el trabajo..." className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold h-32 resize-none"></textarea>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Exclusiones</label>
                          <textarea placeholder="¿Qué NO está incluido? (Ej: repuestos, materiales)" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold h-32 resize-none"></textarea>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Disponibilidad Horaria</label>
                       <div className="relative">
                          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="Ej: Lunes a Viernes 08:00 a 18:00hs" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sección C: Estructura de Cobro */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-orange-600 pl-4">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">C. Estructura de Cobro Directo</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Costo de Diagnóstico (Visita)</label>
                       <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                          <input type="number" placeholder="Valor fijo visita inicial" className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor Hora Hombre</label>
                       <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                          <input type="number" placeholder="Para trabajos sin precio cerrado" className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Método de Pago</label>
                       <div className="flex gap-2">
                          <div className="flex-grow py-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-700 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                             <Shield className="w-3 h-3" /> Pago Protegido por MDP Market
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condición de Anticipo (%)</label>
                       <input type="text" placeholder="Ej: 50% para inicio o insumos" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" />
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex justify-end gap-4 border-t border-gray-50">
                 <button className="px-10 py-5 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all active:scale-95 shadow-xl shadow-orange-100">
                    Publicar Servicio
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-16 space-y-4">
         <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">¿Qué vas a ofrecer hoy?</h1>
         <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">Elegí la estructura técnica que mejor se adapte a tu rubro para una publicación profesional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {options.map((opt) => (
          <button 
            key={opt.id}
            onClick={() => setSelectedType(opt.id as any)}
            className="bg-white rounded-[3rem] border-2 border-gray-100 p-10 text-left hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 group flex flex-col h-full relative overflow-hidden"
          >
             <div className={cn(
               "w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-sm",
               opt.color === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : 
               opt.color === "orange" ? "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" : 
               "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
             )}>
                {opt.icon}
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{opt.title}</h3>
             <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium flex-grow">
               {opt.desc}
             </p>
             
             <ul className="space-y-4 mb-10">
                {opt.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-black text-gray-700 uppercase tracking-tight">
                     <div className={cn("w-2 h-2 rounded-full", 
                        opt.color === "blue" ? "bg-blue-500" : 
                        opt.color === "orange" ? "bg-orange-500" : 
                        "bg-purple-500"
                     )}></div>
                     {feat}
                  </li>
                ))}
             </ul>

             <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                <span className={cn(
                   "font-black text-sm uppercase tracking-widest",
                   opt.color === "blue" ? "text-blue-600" : 
                   opt.color === "orange" ? "text-orange-600" : 
                   "text-purple-600"
                )}>Seleccionar</span>
                <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                   opt.color === "blue" ? "bg-gray-50 group-hover:bg-blue-600 group-hover:text-white" : 
                   opt.color === "orange" ? "bg-gray-50 group-hover:bg-orange-600 group-hover:text-white" : 
                   "bg-gray-50 group-hover:bg-purple-600 group-hover:text-white"
                )}>
                   <ArrowRight className="w-6 h-6" />
                </div>
             </div>
          </button>
        ))}
      </div>

      {/* Safety Badge */}
      <div className="mt-20 flex items-center gap-4 bg-gray-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl">
         <ShieldCheck className="w-8 h-8 text-blue-400" />
         <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Protección MDP Market</p>
            <p className="text-sm font-medium">Tus cobros están garantizados por nuestro sistema de custodia.</p>
         </div>
      </div>
    </div>
  );
}
