"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import {
  FAQS,
  PORTAL_URLS,
  REVIEWS,
  WHATSAPP_URL,
} from "@/data/academyContent";

export function FaqAndFooter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Reseñas */}
      <section
        id="resenas"
        className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl space-y-3">
            <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
              Reseñas y resultados
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Equipos que pasaron{" "}
              <span className="text-[#B783FF]">de probar IA a integrarla</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((rev) => (
              <article
                key={rev.author}
                className="brand-card flex flex-col justify-between p-6 space-y-4"
              >
                <div className="space-y-3">
                  <span className="inline-block rounded-full border border-[#B783FF]/25 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B783FF]">
                    {rev.mission}
                  </span>
                  <p className="text-sm leading-relaxed text-white">
                    «{rev.quote}»
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs font-semibold text-[#DCD6EA]">
                    {rev.author}
                  </p>
                  <p className="text-[11px] text-[#8E8998]">{rev.badge}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section
        id="faqs"
        className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-3">
            <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
              Preguntas frecuentes
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Resolvemos tus dudas antes de{" "}
              <span className="text-[#B783FF]">despegar</span>
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="brand-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm sm:text-base font-semibold text-white hover:text-[#B783FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#B783FF] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm leading-relaxed text-[#DCD6EA]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050507] py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col gap-10">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
            <div className="space-y-4">
              <Image
                src="/brand/logo-horizontal-white.png"
                alt="Campuslands AI Academy"
                width={185}
                height={42}
                className="h-auto w-[175px]"
              />
              <p className="max-w-sm text-sm text-[#DCD6EA]">
                Transformamos la productividad de los equipos con una adopción de IA
                práctica, guiada y aplicada a problemas reales.
              </p>
              <p className="text-xs text-[#8E8998]">
                Zona Franca Santander · Floridablanca y Bucaramanga, Colombia
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8E8998]">
                Navegación
              </h3>
              <ul className="space-y-2 text-[#DCD6EA]">
                <li>
                  <a href="#beneficios" className="hover:text-[#B783FF]">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#herramientas" className="hover:text-[#B783FF]">
                    Herramientas
                  </a>
                </li>
                <li>
                  <a href="#planes" className="hover:text-[#B783FF]">
                    Planes
                  </a>
                </li>
                <li>
                  <a href="#casos-uso" className="hover:text-[#B783FF]">
                    Casos de uso
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-[#B783FF]">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3 text-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8E8998]">
                Portales y contacto
              </h3>
              <ul className="space-y-2 text-[#DCD6EA]">
                <li>
                  <a
                    href={PORTAL_URLS.inscripcion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B783FF]"
                  >
                    Portal de inscripción ↗
                  </a>
                </li>
                <li>
                  <a
                    href={PORTAL_URLS.diagnostico}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B783FF]"
                  >
                    Encuesta de diagnóstico ↗
                  </a>
                </li>
                <li>
                  <a
                    href={PORTAL_URLS.certificado}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B783FF]"
                  >
                    Validación de certificados ↗
                  </a>
                </li>
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B783FF]"
                  >
                    WhatsApp comercial (+57 305 210 5674) ↗
                  </a>
                </li>
                <li>
                  <Link href="/admin" className="text-[#B783FF] hover:text-white">
                    Panel de seguimiento (/admin)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#8E8998]">
            <p>© 2026 Campuslands AI Academy. Todos los derechos reservados.</p>
            <div className="flex gap-5">
              <a href="#faqs" className="hover:text-[#B783FF]">
                Política de privacidad
              </a>
              <a href="#faqs" className="hover:text-[#B783FF]">
                Términos de uso
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Always-accessible floating WhatsApp button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con un especialista por WhatsApp"
        title="Escríbenos por WhatsApp"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#7026E8] px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_30px_rgba(112,38,232,0.55)] transition-transform hover:scale-105 hover:bg-[#9636FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </>
  );
}
