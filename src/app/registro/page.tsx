"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Mail, Lock, User, AlertCircle, Loader2, ArrowRight, CheckCircle2, ShieldCheck, BadgeCheck, ShoppingBag, Users } from "lucide-react";

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/mi-cuenta";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/mi-cuenta";
  const isPublishing = searchParams.get("intent") === "publicar" || next.startsWith("/publicar");
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // If email confirmation is enabled, show success message
      // Otherwise redirect
      if (data.session) {
        router.push(next);
        router.refresh();
      } else {
        setSuccess(true);
        setLoading(false);
      }
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    setError(null);

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      setError(`No pudimos iniciar con ${provider === "google" ? "Google" : "Apple"}. Probá con email.`);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-100 text-emerald-600 mx-auto mb-6 shadow-xl shadow-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
            ¡Casi listo!
          </h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Hemos enviado un correo de confirmación a <span className="font-bold text-slate-900">{email}</span>. 
            Por favor, revisá tu bandeja de entrada para activar tu cuenta.
          </p>
          <Link 
            href={`/login?next=${encodeURIComponent(next)}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
          >
            Volver al login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[radial-gradient(circle_at_top,#eaf3ff_0%,#f8fafc_38%,#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-140px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_500px]">
        <section className="hidden lg:block">
          <Link href="/" className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-black text-white shadow-[0_22px_50px_rgba(37,99,235,0.34)]">
              M
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight text-slate-950">MDP Market</p>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Mar del Plata</p>
            </div>
          </Link>
          <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950">
            {isPublishing ? "Publicá en una comunidad más segura." : "Creá tu cuenta y movete con confianza."}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Queremos saber quién sos para cuidar compras, ventas y reservas. Es rápido, local y hace que MDP Market funcione como comunidad.
          </p>
          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Identidad cuidada" },
              { icon: ShoppingBag, title: "Operación protegida" },
              { icon: Users, title: "Comunidad MDP" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-white bg-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
                  <Icon className="mb-4 h-6 w-6 text-blue-600" />
                  <p className="text-sm font-black text-slate-950">{item.title}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-6 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600 text-xl font-black text-white shadow-[0_18px_42px_rgba(37,99,235,0.32)]">
                M
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-950">MDP Market</span>
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.16)] sm:p-10">
          <div className="mb-7">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Crear cuenta</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {isPublishing ? "Publicá con cuenta segura" : "Registrate gratis"}
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              ¿Ya tenés cuenta?{" "}
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-black text-blue-600 hover:text-blue-500">
                Iniciá sesión
              </Link>
            </p>
          </div>

          <div className="mb-7 rounded-3xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">
                  Dos segundos para cuidar la comunidad.
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Saber quién sos ayuda a que compradores, vendedores y profesionales operen con más confianza.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="text-base font-black text-blue-600">G</span>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={loading}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-900 bg-slate-950 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
            >
              <span className="text-base"></span>
              Apple
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">o registrate así</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="space-y-6" onSubmit={handleRegistro}>
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
                  placeholder="Repetí tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-blue-600 border border-transparent rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Al registrarte aceptás nuestros <Link href="#" className="text-slate-600 underline">Términos y Condiciones</Link> y <Link href="#" className="text-slate-600 underline">Políticas de Privacidad</Link>.
            </p>
          </form>
          </div>
        </section>
        </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <RegistroForm />
    </Suspense>
  );
}
