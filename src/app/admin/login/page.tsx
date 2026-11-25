"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo iniciar sesión.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión al validar credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050507] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full halo-electric"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full halo-evox"
      />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/brand/logo-vertical-color.png"
            alt="Campuslands AI Academy"
            width={130}
            height={97}
            className="h-auto w-[125px]"
          />
          <div>
            <span className="brand-pill-tag inline-flex items-center gap-1.5 px-3 py-1 text-[10px]">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Acceso administrativo
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-white">
              Panel de Seguimiento
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#DCD6EA]">
              Inicia sesión para consultar registros, actualizar estados y auditar
              notas del equipo.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="brand-card p-6 sm:p-7 space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-400/50 bg-rose-950/50 p-3 text-xs text-rose-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#DCD6EA] mb-1.5"
            >
              Correo de administrador
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aiacademy.local"
              className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-4 py-3 text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#DCD6EA] mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-4 py-3 text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[32px] bg-[#7026E8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9636FF] disabled:opacity-60 transition-colors"
          >
            {loading ? "Verificando..." : "Ingresar al panel"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B783FF] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Volver a la landing principal
          </Link>
        </div>
      </div>
    </main>
  );
}
