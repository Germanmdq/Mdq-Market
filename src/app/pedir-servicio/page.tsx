"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Camera, 
  Video, 
  MapPin, 
  Zap, 
  Clock, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  ArrowRight,
  Info,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PedirServicioPage() {
  const [step, setStep] = useState(1);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="relative mb-12">
           <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-100 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
           </div>
           <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">¡Pedido Enviado!</h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          Ya notificamos a los profesionales disponibles en tu zona. 
          Recibirás presupuestos y mensajes en tu panel de control a la brevedad.
        </p>

        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-12 w-full max-w-md">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocolo ID</span>
              <span className="text-sm font-bold text-gray-900 font-mono">#URG-MDP-7721</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nivel de Urgencia</span>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                urgency === "Emergencia 24hs" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              )}>
                 <Zap className="w-3 h-3" /> {urgency}
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href="/chat"
            className="flex-1 bg-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Ir a mis Mensajes <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/"
            className="flex-1 bg-gray-100 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black font-black text-xs uppercase tracking-widest transition-all">
              <ArrowLeft className="w-5 h-5" /> Cancelar
           </Link>
           <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-black text-gray-900 tracking-tighter uppercase tracking-widest">Formulario de Entrada (Cliente)</span>
           </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
           <div className="p-10 border-b border-gray-50 bg-blue-50/30">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Describí lo que necesitás</h1>
              <p className="text-gray-500 font-medium">Cuanta más información brindes, más precisos serán los presupuestos.</p>
           </div>

           <form onSubmit={handleSubmit} className="p-10 space-y-12">
              {/* Descripción del Problema */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Descripción del Problema</h3>
                 </div>
                 <textarea 
                   required
                   placeholder="Ej: Tengo una pérdida en la cañería del baño, sale agua por debajo del bidet. Necesito reparación urgente." 
                   className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-medium text-gray-800 h-40 focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all resize-none"
                 ></textarea>
              </div>

              {/* Multimedia Obligatoria */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Multimedia Obligatoria (Mín. 2 fotos)</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 flex flex-col items-center text-center group hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-7 h-7 text-gray-300 group-hover:text-blue-500" />
                       </div>
                       <p className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">Plano General</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Subir Foto o Video</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 flex flex-col items-center text-center group hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Zap className="w-7 h-7 text-gray-300 group-hover:text-blue-500" />
                       </div>
                       <p className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">Detalle de la falla</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Subir Foto o Video</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-3 rounded-xl">
                    <Info className="w-4 h-4" />
                    <span>Se recomienda un video de 10 segundos para mayor precisión.</span>
                 </div>
              </div>

              {/* Nivel de Urgencia */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Nivel de Urgencia</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "Presupuesto", label: "Solo Presupuesto", desc: "No tengo apuro.", icon: FileText, color: "bg-gray-100 text-gray-600" },
                      { id: "En la semana", label: "En la semana", desc: "Coordinar visita.", icon: Calendar, color: "bg-blue-50 text-blue-600" },
                      { id: "Emergencia 24hs", label: "Emergencia 24hs", desc: "Respuesta inmediata.", icon: AlertCircle, color: "bg-red-50 text-red-600" },
                    ].map(u => (
                      <button 
                        key={u.id}
                        type="button"
                        onClick={() => setUrgency(u.id)}
                        className={cn(
                          "p-6 rounded-[1.5rem] border-2 text-left transition-all relative group",
                          urgency === u.id ? "border-blue-600 bg-blue-50/20" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", u.color)}>
                            <u.icon className="w-5 h-5" />
                         </div>
                         <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">{u.label}</h4>
                         <p className="text-[10px] font-bold text-gray-400">{u.desc}</p>
                         {urgency === u.id && <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Ubicación del Trabajo</h3>
                 </div>
                 <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="Calle y altura exacta en Mar del Plata..." 
                      className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all" 
                    />
                 </div>
              </div>

              <div className="pt-10 flex flex-col items-center gap-6 border-t border-gray-50">
                 <div className="flex items-center gap-3 text-blue-700 bg-blue-50 px-6 py-3 rounded-full">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Pedido Protegido por MDP Market</span>
                 </div>
                 <button 
                  type="submit"
                  disabled={!urgency}
                  className="w-full md:w-auto px-20 py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-black rounded-[1.5rem] shadow-2xl shadow-blue-100 transition-all active:scale-95 text-lg"
                 >
                    Enviar Pedido de Auxilio
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}

