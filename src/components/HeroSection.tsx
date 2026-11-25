"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDownRight, Sparkles, Compass } from "lucide-react";
import {
  HERO_CREW_PROFILES,
  type ProgramOption,
} from "@/data/academyContent";

interface HeroSectionProps {
  onSelectProgram: (program: ProgramOption) => void;
}

export function HeroSection({ onSelectProgram }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [spot, setSpot] = useState({ x: 52, y: 38 });
  const [selectedCrew, setSelectedCrew] = useState<string>(HERO_CREW_PROFILES[0].id);

  const activeCrew =
    HERO_CREW_PROFILES.find((c) => c.id === selectedCrew) ?? HERO_CREW_PROFILES[0];

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden bg-[#050507] pt-36 pb-16 sm:pt-40 sm:pb-24"
    >
      {/* Corner brand halos (Electric Violet top-right, Evox Purple bottom-left) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 sm:h-[420px] sm:w-[420px] rounded-full halo-electric"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 sm:h-[380px] sm:w-[380px] rounded-full halo-evox"
      />

      {/* Reactive orbital light field tracking pointer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(520px circle at ${spot.x}% ${spot.y}%, rgba(150, 54, 255, 0.14), transparent 62%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left column: Mission Briefing */}
          <div className="space-y-6">
            <span className="brand-pill-tag inline-flex items-center gap-2 px-4 py-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Campuslands AI Academy · Colombia
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.08] tracking-tight text-white">
              Te explicamos lo complejo de forma simple y{" "}
              <span className="text-[#B783FF]">
                después te mostramos cómo hacerlo
              </span>
              .
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#DCD6EA]">
              Ayudamos a empresas, líderes y profesionales a pasar de abrir herramientas
              sueltas a integrar la IA en su trabajo, sus procesos y sus resultados.
            </p>

            {/* Preserved core message from original landing */}
            <blockquote className="rounded-2xl border border-[#B783FF]/20 bg-[#B783FF]/[0.06] px-4 py-3.5 text-sm text-[#DCD6EA]">
              <p className="italic">
                «No es la especie más fuerte ni la más inteligente la que sobrevive,
                sino la que mejor se adapta a los cambios.»
              </p>
              <footer className="mt-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#B783FF]">
                Evoluciona a la velocidad de la tecnología · Charles Darwin
              </footer>
            </blockquote>

            {/* Interactive Role Selector (Piece #1: Hero reacts to visitor choice) */}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8E8998]">
                Paso 0 · Elige tu perfil para ajustar tu ruta de misión:
              </p>
              <div
                role="tablist"
                aria-label="Selecciona tu perfil"
                className="flex flex-wrap gap-2.5"
              >
                {HERO_CREW_PROFILES.map((profile) => {
                  const active = profile.id === activeCrew.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCrew(profile.id)}
                      className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                        active
                          ? "bg-[#7026E8] text-white shadow-[0_0_24px_rgba(112,38,232,0.55)]"
                          : "border border-[#B783FF]/25 bg-[#050507] text-[#DCD6EA] hover:border-[#9636FF] hover:text-white"
                      }`}
                    >
                      {profile.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Mission Briefing output for selected crew */}
              <div
                aria-live="polite"
                className="brand-card p-5 space-y-3 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B783FF]">
                    <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                    {activeCrew.badge}
                  </span>
                  <span className="text-xs font-semibold text-white bg-[#7026E8] rounded-full px-3 py-1">
                    Ruta sugerida: {activeCrew.suggestedTarget}
                  </span>
                </div>
                <p className="text-sm text-[#DCD6EA]">
                  <strong className="text-white">Reto habitual:</strong> {activeCrew.pain}
                </p>
                <p className="text-sm text-[#DCD6EA]">
                  <strong className="text-[#B783FF]">Qué construyes con nosotros:</strong>{" "}
                  {activeCrew.deliverable}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#planes"
                className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-[#7026E8] px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#9636FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
              >
                Ver planes
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#inscripcion"
                onClick={() => onSelectProgram(activeCrew.suggestedPlan)}
                className="inline-flex items-center justify-center rounded-[32px] border border-[#B783FF]/40 bg-transparent px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors hover:border-[#B783FF] hover:bg-[#B783FF]/10 focus-visible:outline-2 focus-visible:outline-[#B783FF]"
              >
                Solicitar misión {activeCrew.suggestedPlan.split(" ")[0]}
              </a>
            </div>
          </div>

          {/* Right column: Official vertical brand mark + Max mascot */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[420px] rounded-[32px] border border-[#B783FF]/20 bg-[#0B0A10]/90 p-6 sm:p-8 text-center">
              <div className="flex justify-center pb-4 border-b border-white/10">
                <Image
                  src="/brand/logo-vertical-color.png"
                  alt="Campuslands AI Academy"
                  width={170}
                  height={127}
                  priority
                  className="h-auto w-[140px] sm:w-[165px]"
                />
              </div>

              <div className="relative mx-auto mt-4 flex justify-center">
                <Image
                  src="/brand/max-presentando.png"
                  alt="Max, astronauta oficial de Campuslands AI Academy"
                  width={320}
                  height={520}
                  priority
                  className="h-[250px] sm:h-[310px] w-auto object-contain drop-shadow-[0_18px_40px_rgba(112,38,232,0.35)]"
                />
              </div>

              <div className="mt-4 rounded-2xl bg-[#B783FF]/10 px-4 py-3 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B783FF]">
                  Max · Profesional con IA
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#DCD6EA]">
                  «No solo hablamos de IA: la enseñamos, la aplicamos y la llevamos a
                  problemas reales de tu equipo.»
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
