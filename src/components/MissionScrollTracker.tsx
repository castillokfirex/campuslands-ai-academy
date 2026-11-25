"use client";

import { useEffect, useState } from "react";

const PHASES = [
  { id: "inicio", code: "01", label: "Despegue" },
  { id: "beneficios", code: "02", label: "Propuesta" },
  { id: "herramientas", code: "03", label: "Arsenal IA" },
  { id: "planes", code: "04", label: "Misiones" },
  { id: "casos-uso", code: "05", label: "Impacto" },
  { id: "inscripcion", code: "06", label: "Órbita" },
];

export function MissionScrollTracker() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("inicio");

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      setProgress(pct);

      let current = "inicio";
      for (const p of PHASES) {
        const el = document.getElementById(p.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            current = p.id;
          }
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Also observe reveal-section elements globally
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".reveal-section"));
    if (sections.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      sections.forEach((s) => s.setAttribute("data-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
          }
        }
      },
      { threshold: 0.12 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const currentPhase = PHASES.find((p) => p.id === activeId) ?? PHASES[0];

  return (
    <div
      aria-label="Progreso del recorrido espacial"
      className="border-t border-[#B783FF]/10 bg-[#050507]/85"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-1.5 text-[11px] font-medium">
        <div className="flex items-center gap-2 text-[#DCD6EA]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#9636FF]" aria-hidden="true" />
          <span className="text-[#8E8998] uppercase tracking-[0.14em]">
            Trayectoria
          </span>
          <span className="font-semibold text-white">
            {currentPhase.code} · {currentPhase.label}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {PHASES.map((phase) => {
            const isActive = phase.id === activeId;
            return (
              <a
                key={phase.id}
                href={`#${phase.id}`}
                className={`rounded-full px-2.5 py-0.5 text-[11px] transition-colors ${
                  isActive
                    ? "bg-[#B783FF] text-[#050507] font-semibold"
                    : "text-[#8E8998] hover:text-white"
                }`}
              >
                {phase.code} {phase.label}
              </a>
            );
          })}
        </div>

        <span className="text-[#B783FF] font-semibold tabular-nums">
          {Math.round(progress)}% órbita
        </span>
      </div>

      {/* Scroll-linked orbital progress bar */}
      <div className="h-[2px] w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#7026E8] via-[#9636FF] to-[#B783FF] transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
