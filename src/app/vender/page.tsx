"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, MapPin, Tag, Box, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
        
        {step === 1 ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Publicar producto</h1>
              <p className="text-slate-500 mt-2">Creá tu publicación gratis y llegá a miles de compradores en Mar del Plata.</p>
            </div>

            <form onSubmit={handlePublish} className="space-y-8">
              {/* Fotos */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
                <h2 className="text-lg font-semibold text-slate-950 mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Fotos del producto</h2>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-4">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-950">Hacé click para subir fotos</p>
                  <p className="text-xs text-slate-500 mt-1">Sugerimos usar fondo blanco (JPG, PNG)</p>
                </div>
              </section>

              {/* Info básica */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
                <h2 className="text-lg font-semibold text-slate-950 mb-6 flex items-center gap-2"><Tag className="w-5 h-5" /> Información principal</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Título de la publicación</label>
                    <input type="text" required placeholder="Ej. iPhone 13 128GB Impecable" className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
                      <input type="number" required placeholder="0.00" className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Condición</label>
                      <select required className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Seleccionar...</option>
                        <option value="nuevo">Nuevo</option>
                        <option value="usado_nuevo">Usado como nuevo</option>
                        <option value="usado_bueno">Usado bueno</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                    <textarea required rows={4} placeholder="Describí tu producto con detalle..." className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              </section>

              {/* Logística */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)]">
                <h2 className="text-lg font-semibold text-slate-950 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5" /> Ubicación y Entrega</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Zona (Mar del Plata)</label>
                    <select required className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Seleccionar zona...</option>
                      <option value="centro">Centro</option>
                      <option value="guemes">Güemes</option>
                      <option value="puerto">Puerto</option>
                      <option value="constitucion">Constitución</option>
                    </select>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <input type="checkbox" id="delivery" className="mt-1" defaultChecked />
                    <div>
                      <label htmlFor="delivery" className="text-sm font-medium text-slate-950 cursor-pointer">Ofrecer Entrega MDP</label>
                      <p className="text-xs text-slate-500 mt-0.5">Te conectamos con cadetería local de confianza. El comprador paga el costo.</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isPublishing}
                  className="h-14 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white px-10 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isPublishing ? "Publicando..." : "Confirmar y publicar"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-[0_10px_34px_rgba(15,23,42,0.07)] text-center animate-in fade-in zoom-in duration-500 max-w-lg mx-auto mt-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-950 mb-3">¡Publicación exitosa!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Tu producto ya está disponible en MDP Market. Preparate para recibir consultas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/mi-cuenta" className="flex-1 bg-slate-950 text-white font-semibold py-3.5 rounded-full hover:bg-slate-800 transition">
                Ver mis publicaciones
              </Link>
              <button onClick={() => setStep(1)} className="flex-1 bg-white border border-slate-300 text-slate-950 font-semibold py-3.5 rounded-full hover:bg-slate-50 transition">
                Publicar otro
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
