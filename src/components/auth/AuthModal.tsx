"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Globe, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente suave */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 pb-12 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-3xl font-black mb-2">
            {view === "login" ? "¡Hola de nuevo!" : "Crear cuenta"}
          </h2>
          <p className="text-blue-100 text-sm font-medium">
            {view === "login" 
              ? "Ingresá para gestionar tus compras y ventas en MDP Market." 
              : "Unite a la mayor comunidad de Mar del Plata."}
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8 -mt-6 bg-white rounded-t-[32px] relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Ej: Juan Pérez"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {view === "login" && (
                <div className="text-right">
                  <button type="button" className="text-xs font-bold text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                view === "login" ? "Ingresar ahora" : "Crear mi cuenta"
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black text-gray-400">
              <span className="bg-white px-4">O continuar con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-sm text-gray-700">
              <Globe className="w-5 h-5 text-red-500" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-sm text-gray-700">
              <LayoutGrid className="w-5 h-5 text-gray-600" />
              Github
            </button>
          </div>

          {/* Footer del Modal */}
          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            {view === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button 
                  onClick={() => setView("register")}
                  className="text-blue-600 font-black hover:underline"
                >
                  Registrate gratis
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button 
                  onClick={() => setView("login")}
                  className="text-blue-600 font-black hover:underline"
                >
                  Iniciá sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
