"use client";

import { useState } from "react";
import { BENEFITS, URGENCY_POINTS } from "@/data/academyContent";
import { Clock, Layers, MessageSquare, Route } from "lucide-react";

const BENEFIT_ICONS = {
  practica: Layers,
  entregables: Route,
  soporte: MessageSquare,
  rutas: Clock,
} as const;

export function BenefitsAndUrgencySection() {
  const [teamSize, setTeamSize] = useState(8);
  const [manualHours, setManualHours] = useState(5);

  // Conservative 35% time recovery estimate when applying structured AI workflows
  const monthlyRecovered = Math.round(teamSize * manualHours * 4 * 0.35);

  return (
    <>
      <section
        id="beneficios"
        className="reveal-section relative py-16 sm:py-24 scroll-mt-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl space-y-4">
            <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
              Beneficios
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              ¿Por qué elegir{" "}
              <span className="text-[#B783FF]">Campuslands AI Academy</span>?
            </h2>
            <p className="text-sm sm:text-base text-[#DCD6EA]">
              Enseñan quienes construyen asistentes y automatizaciones reales todos
              los días. Cada ejercicio parte de una tarea que tu equipo ya hace.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((item) => {
              const Icon = BENEFIT_ICONS[item.id];
              return (
                <article
                  key={item.id}
                  className="brand-card group flex flex-col gap-4 p-6 transition-all hover:border-[#9636FF]/60 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7026E8] text-sm font-bold text-white">
                      {item.step}
                    </span>
                    <Icon
                      className="h-5 w-5 text-[#B783FF] transition-transform group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#DCD6EA]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="urgencia"
        className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
                ¿Por qué ahora?
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Cada semana sin IA aplicada{" "}
                <span className="text-[#B783FF]">cuesta velocidad</span> y margen
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {URGENCY_POINTS.map((point) => (
                  <article
                    key={point.title}
                    className="brand-card p-5 space-y-2 hover:border-[#9636FF]/50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-white">
                      {point.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#DCD6EA]">
                      {point.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Interactive Time Recovery Simulator */}
            <aside className="brand-card p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B783FF]">
                  Simulador de impacto operativo
                </span>
                <h3 className="mt-1 text-xl font-bold text-white">
                  Calcula cuánto tiempo manual podrías liberar al mes
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <label htmlFor="calc-team" className="text-[#DCD6EA]">
                      Personas en tu equipo
                    </label>
                    <strong className="text-white tabular-nums">
                      {teamSize} {teamSize === 1 ? "persona" : "personas"}
                    </strong>
                  </div>
                  <input
                    id="calc-team"
                    type="range"
                    min={1}
                    max={40}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full accent-[#7026E8] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <label htmlFor="calc-hours" className="text-[#DCD6EA]">
                      Horas semanales repetitivas por persona
                    </label>
                    <strong className="text-white tabular-nums">
                      {manualHours} h / semana
                    </strong>
                  </div>
                  <input
                    id="calc-hours"
                    type="range"
                    min={1}
                    max={15}
                    value={manualHours}
                    onChange={(e) => setManualHours(Number(e.target.value))}
                    className="w-full accent-[#9636FF] cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#7026E8] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.14em] text-[#DCD6EA]">
                  Estimación conservadora (35 % de automatización)
                </p>
                <p className="mt-1 text-3xl sm:text-4xl font-extrabold tabular-nums">
                  {monthlyRecovered} horas / mes
                </p>
                <p className="mt-1 text-xs text-[#DCD6EA]">
                  Tiempo que tu equipo puede dedicar a clientes, estrategia y cierre.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
