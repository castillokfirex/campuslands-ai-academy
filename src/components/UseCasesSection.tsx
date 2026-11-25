"use client";

import { useState } from "react";
import Image from "next/image";
import { USE_CASES } from "@/data/academyContent";
import { ArrowRight } from "lucide-react";

export function UseCasesSection() {
  const [activeId, setActiveId] = useState<string>(USE_CASES[0].id);
  const [sliderPos, setSliderPos] = useState<number>(62);

  const activeCase = USE_CASES.find((c) => c.id === activeId) ?? USE_CASES[0];

  return (
    <section
      id="casos-uso"
      className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
              Antes / Después
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              El salto concreto según{" "}
              <span className="text-[#B783FF]">tu rol en la empresa</span>
            </h2>
            <p className="text-sm sm:text-base text-[#DCD6EA]">
              Cambia de perfil y desliza el comparador para contrastar cómo opera
              cada rol antes y después de entrenar con AI Academy.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Perfiles de casos de uso"
            className="flex flex-wrap gap-2"
          >
            {USE_CASES.map((item) => {
              const active = item.id === activeCase.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(item.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                    active
                      ? "bg-[#7026E8] text-white"
                      : "border border-[#B783FF]/25 text-[#DCD6EA] hover:border-[#9636FF] hover:text-white"
                  }`}
                >
                  {item.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Before / After Comparative View + Tactile Slider */}
        <div className="mt-10 brand-card p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeCase.role}
              </h3>
              <p className="text-xs text-[#8E8998]">{activeCase.santanderContext}</p>
            </div>
            <span className="rounded-full bg-[#B783FF] px-3.5 py-1 text-xs font-semibold text-[#050507]">
              {activeCase.metricBadge}
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div
              className="rounded-2xl border border-white/10 bg-[#050507] p-5 sm:p-6 transition-opacity"
              style={{ opacity: Math.max(0.45, (100 - sliderPos) / 60) }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/brand/visor-cansado.png"
                  alt="Expresión cansado pero listo"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8E8998]">
                    Situación inicial
                  </span>
                  <h4 className="text-base font-bold text-white">Antes</h4>
                </div>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[#DCD6EA]">
                {activeCase.before}
              </p>
            </div>

            <div
              className="rounded-2xl border-2 border-[#9636FF]/60 bg-[#7026E8]/15 p-5 sm:p-6 transition-opacity"
              style={{ opacity: Math.max(0.55, sliderPos / 65) }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/brand/visor-motivado.png"
                  alt="Expresión motivado"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B783FF]">
                    Con AI Academy
                  </span>
                  <h4 className="text-base font-bold text-white inline-flex items-center gap-1.5">
                    Después <ArrowRight className="h-4 w-4 text-[#B783FF]" aria-hidden="true" />
                  </h4>
                </div>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-white">
                {activeCase.after}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-[#8E8998] mb-2">
              <label htmlFor="before-after-slider">
                Desliza para enfocar el contraste Antes ↔ Después
              </label>
              <span className="text-[#B783FF] font-semibold tabular-nums">
                {sliderPos}% transformación
              </span>
            </div>
            <input
              id="before-after-slider"
              type="range"
              min={15}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-[#7026E8] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
