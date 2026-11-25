"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ALLOWED_PROGRAMS,
  PORTAL_URLS,
  WHATSAPP_URL,
  type ProgramOption,
} from "@/data/academyContent";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

interface RegistrationFormProps {
  selectedProgram: ProgramOption;
  onChangeProgram: (program: ProgramOption) => void;
}

interface CreatedReceipt {
  id: string;
  nombre: string;
  correo: string;
  programa: string;
  telefono: string | null;
  estado: string;
  createdAt: string;
  telegramNotified: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export function RegistrationForm({
  selectedProgram,
  onChangeProgram,
}: RegistrationFormProps) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [programa, setPrograma] = useState<ProgramOption>(selectedProgram);
  const [telefono, setTelefono] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<CreatedReceipt | null>(null);

  useEffect(() => {
    setPrograma(selectedProgram);
  }, [selectedProgram]);

  const validateClient = () => {
    const next: Record<string, string> = {};
    if (nombre.trim().length < 2) {
      next.nombre = "Ingresa tu nombre completo (mínimo 2 caracteres).";
    }
    if (!EMAIL_RE.test(correo.trim())) {
      next.correo = "Ingresa un correo electrónico válido.";
    }
    if (!ALLOWED_PROGRAMS.includes(programa)) {
      next.programa = "Selecciona un programa de interés.";
    }
    const tel = telefono.trim();
    if (tel.length > 0) {
      const digits = tel.replace(/\D/g, "").length;
      if (!PHONE_RE.test(tel) || digits < 7 || digits > 15) {
        next.telefono =
          "El teléfono es opcional, pero si lo ingresas debe tener 7 a 15 dígitos válidos.";
      }
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          programa,
          telefono: telefono.trim() || null,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(
          data.errors ?? { general: "No se pudo registrar la solicitud." }
        );
        return;
      }

      setReceipt(data.lead as CreatedReceipt);
      setNombre("");
      setCorreo("");
      setTelefono("");
    } catch {
      setErrors({
        general: "Error de conexión. Intenta nuevamente en unos segundos.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="inscripcion"
      className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          {/* Left column: Clear context + Max */}
          <div className="space-y-6">
            <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
              Registro de misión
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Solicita información o{" "}
              <span className="text-[#B783FF]">reserva tu cupo</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#DCD6EA]">
              Déjanos tus datos y el programa que te interesa. Nuestro equipo recibe
              aviso inmediato y te contacta con fechas, modalidad y plan adaptado a tu
              equipo.
            </p>

            <div className="brand-card p-5 flex items-center gap-4">
              <Image
                src="/brand/max-aprobando.png"
                alt="Max aprobando tu solicitud"
                width={90}
                height={180}
                className="h-24 w-auto shrink-0 object-contain"
              />
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p className="font-bold text-white">
                  ¿Prefieres hablar ahora mismo con un especialista?
                </p>
                <p className="text-[#DCD6EA]">
                  También puedes escribir por WhatsApp o abrir el portal oficial.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#B783FF] hover:text-white underline"
                  >
                    Ir a WhatsApp ↗
                  </a>
                  <a
                    href={PORTAL_URLS.inscripcion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#DCD6EA] hover:text-white underline"
                  >
                    Portal de inscripción ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Validated Reto 4 Registration Form */}
          <div className="brand-card p-6 sm:p-8">
            {receipt ? (
              <div
                role="status"
                aria-live="polite"
                className="space-y-5 text-left"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-[#B783FF] px-4 py-1.5 text-xs font-bold text-[#050507]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Registro confirmado · Estado: {receipt.estado}
                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  ¡Recibimos tu solicitud, {receipt.nombre}!
                </h3>
                <p className="text-sm text-[#DCD6EA]">
                  Tu registro quedó guardado con fecha{" "}
                  <strong className="text-white">
                    {new Date(receipt.createdAt).toLocaleString("es-CO", {
                      timeZone: "America/Bogota",
                    })}
                  </strong>{" "}
                  y fue asignado al equipo de AI Academy.
                </p>

                <dl className="grid gap-3 rounded-2xl border border-white/10 bg-[#050507] p-4 text-xs sm:text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#8E8998]">Programa de interés:</dt>
                    <dd className="font-semibold text-white">{receipt.programa}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#8E8998]">Correo:</dt>
                    <dd className="font-medium text-[#DCD6EA]">{receipt.correo}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#8E8998]">Teléfono:</dt>
                    <dd className="font-medium text-[#DCD6EA]">
                      {receipt.telefono ?? "No proporcionado"}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="rounded-[32px] border border-[#B783FF]/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7026E8] hover:border-[#7026E8] transition-colors"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="space-y-4"
                aria-label="Formulario de solicitud de información"
              >
                {errors.general && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-rose-400/50 bg-rose-950/50 p-3 text-xs sm:text-sm text-rose-200"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{errors.general}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="lead-nombre"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#DCD6EA] mb-1.5"
                  >
                    Nombre completo *
                  </label>
                  <input
                    id="lead-nombre"
                    name="nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Valentina Gómez"
                    aria-invalid={Boolean(errors.nombre)}
                    className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-4 py-3 text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
                  />
                  {errors.nombre && (
                    <p role="alert" className="mt-1 text-xs text-rose-300">
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lead-correo"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#DCD6EA] mb-1.5"
                  >
                    Correo electrónico *
                  </label>
                  <input
                    id="lead-correo"
                    name="correo"
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Ej. valentina@empresa.com"
                    aria-invalid={Boolean(errors.correo)}
                    className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-4 py-3 text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
                  />
                  {errors.correo && (
                    <p role="alert" className="mt-1 text-xs text-rose-300">
                      {errors.correo}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="lead-programa"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#DCD6EA] mb-1.5"
                    >
                      Programa de interés *
                    </label>
                    <select
                      id="lead-programa"
                      name="programa"
                      required
                      value={programa}
                      onChange={(e) => {
                        const val = e.target.value as ProgramOption;
                        setPrograma(val);
                        onChangeProgram(val);
                      }}
                      aria-invalid={Boolean(errors.programa)}
                      className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-4 py-3 text-sm text-white focus:border-[#9636FF] focus:outline-none"
                    >
                      {ALLOWED_PROGRAMS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#050507]">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.programa && (
                      <p role="alert" className="mt-1 text-xs text-rose-300">
                        {errors.programa}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lead-telefono"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#DCD6EA] mb-1.5"
                    >
                      Teléfono / WhatsApp (opcional)
                    </label>
                    <input
                      id="lead-telefono"
                      name="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. +57 315 000 0000"
                      aria-invalid={Boolean(errors.telefono)}
                      className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-4 py-3 text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
                    />
                    {errors.telefono && (
                      <p role="alert" className="mt-1 text-xs text-rose-300">
                        {errors.telefono}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[32px] bg-[#7026E8] px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#9636FF] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#B783FF]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {submitting ? "Enviando registro..." : "Enviar solicitud"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
