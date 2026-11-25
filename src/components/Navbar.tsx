"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { PORTAL_URLS } from "@/data/academyContent";
import { MissionScrollTracker } from "./MissionScrollTracker";

const SECTION_LINKS = [
  { label: "Beneficios", href: "#beneficios" },
  { label: "Herramientas", href: "#herramientas" },
  { label: "Planes", href: "#planes" },
  { label: "¿Por qué ahora?", href: "#urgencia" },
  { label: "Casos de uso", href: "#casos-uso" },
  { label: "FAQs", href: "#faqs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-[#050507]/90 backdrop-blur-md border-b border-[#B783FF]/15"
          : "bg-[#050507]/60 backdrop-blur-sm"
      }`}
    >
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#7026E8] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido principal
      </a>

      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3"
      >
        {/* Official horizontal logo respecting min-width >= 160px and protection zone x */}
        <a
          href="#inicio"
          className="inline-flex shrink-0 items-center py-2 px-1 rounded-lg focus-visible:outline-2 focus-visible:outline-[#B783FF]"
          aria-label="Campuslands AI Academy — Ir al inicio"
        >
          <Image
            src="/brand/logo-horizontal-white.png"
            alt="Campuslands AI Academy"
            width={185}
            height={42}
            priority
            className="h-auto w-[165px] sm:w-[185px]"
          />
        </a>

        {/* Desktop navigation */}
        <div className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-[#DCD6EA]">
          {SECTION_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-[#B783FF] focus-visible:outline-2 focus-visible:outline-[#B783FF] rounded px-1 py-1"
            >
              {item.label}
            </a>
          ))}
          <span className="h-4 w-px bg-white/15" aria-hidden="true" />
          <a
            href={PORTAL_URLS.diagnostico}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-[#B783FF] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#B783FF] rounded px-1 py-1"
          >
            Diagnóstico
          </a>
          <a
            href={PORTAL_URLS.certificado}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap transition-colors hover:text-[#B783FF] focus-visible:outline-2 focus-visible:outline-[#B783FF] rounded px-1 py-1"
          >
            Certificado
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex whitespace-nowrap items-center rounded-full border border-[#B783FF]/25 px-3.5 py-2 text-xs font-medium text-[#DCD6EA] transition-colors hover:border-[#B783FF] hover:text-white focus-visible:outline-2 focus-visible:outline-[#B783FF]"
          >
            Panel Admin
          </Link>
          <a
            href="#inscripcion"
            className="hidden sm:inline-flex whitespace-nowrap items-center justify-center rounded-[32px] bg-[#7026E8] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#9636FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
          >
            Inscríbete
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex xl:hidden h-10 w-10 items-center justify-center rounded-xl border border-[#B783FF]/25 bg-[#050507] text-white hover:border-[#9636FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div
          id="menu-movil"
          className="xl:hidden border-t border-[#B783FF]/15 bg-[#050507]/95 backdrop-blur-lg px-4 py-5"
        >
          <div className="flex flex-col gap-2">
            {SECTION_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#DCD6EA] hover:bg-[#B783FF]/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <a
              href={PORTAL_URLS.diagnostico}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#B783FF] hover:bg-[#B783FF]/10"
            >
              Diagnóstico empresarial ↗
            </a>
            <a
              href={PORTAL_URLS.certificado}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#DCD6EA] hover:bg-[#B783FF]/10"
            >
              Validar certificado ↗
            </a>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#DCD6EA] hover:bg-[#B783FF]/10"
            >
              Panel de seguimiento (/admin)
            </Link>
            <a
              href="#inscripcion"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-[32px] bg-[#7026E8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#9636FF]"
            >
              Inscríbete ahora
            </a>
          </div>
        </div>
      )}

      <MissionScrollTracker />
    </header>
  );
}
