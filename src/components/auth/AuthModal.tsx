"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (view === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || "Error al iniciar sesión");
        } else {
          onClose();
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message || "Error al crear cuenta");
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-600 p-8 pb-12 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-3xl font-semibold mb-2">
            {view === "login" ? "Hola de nuevo" : "Crear cuenta"}
          </h2>
          <p className="text-blue-100 text-sm">
            {view === "login"
              ? "Ingresá para gestionar tus compras y ventas en MDP Market"
              : "Unite a la mayor comunidad de Mar del Plata"}
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8 -mt-6 bg-white rounded-t-3xl relative">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {view === "login" && (
                <div className="text-right">
                  <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                view === "login" ? "Ingresar" : "Crear cuenta"
              )}
            </button>
          </form>

          {/* Footer del Modal */}
          <div className="mt-6 text-center text-sm text-slate-600">
            {view === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button
                  onClick={() => {
                    setView("register");
                    setError(null);
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Registrate gratis
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button
                  onClick={() => {
                    setView("login");
                    setError(null);
                  }}
                  className="text-blue-600 font-medium hover:underline"
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
