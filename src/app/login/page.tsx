"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Mail, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/cuenta";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/cuenta";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos." : error.message);
      setLoading(false);
    } else {
      router.refresh();
      window.location.assign(next);
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
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

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">o ingresá con email</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
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
            autoComplete="current-password"
            required
            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm">
          <Link href="#" className="font-bold text-slate-400 hover:text-slate-600 transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
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
              Ingresar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-200">
            M
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">MDP Market</span>
        </Link>
        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">
          Bienvenido de vuelta
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-bold text-blue-600 hover:text-blue-500">
            Registrate gratis
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-[0_26px_80px_rgba(15,23,42,0.12)] border border-slate-100 sm:rounded-[2.5rem] sm:px-12">
          <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
