"use client";

import { useMemo, useState } from "react";
import { Check, Rocket, Sparkles } from "lucide-react";
import {
  MISSION_PLANS,
  PORTAL_URLS,
  type ProgramOption,
} from "@/data/academyContent";

interface PlansSectionProps {
  selectedProgram: ProgramOption;
  onChooseProgram: (program: ProgramOption) => void;
}

const TEAM_ANSWERS = [
  { id: "individual", label: "Solo yo (individual)" },
  { id: "equipo", label: "Equipo (2 a 15 personas)" },
  { id: "empresa", label: "Empresa (+15 o varias áreas)" },
] as const;

const TIME_ANSWERS = [
  { id: "4h", label: "4 horas (arranque rápido)" },
  { id: "8h", label: "8 horas (por rol)" },
  { id: "12h", label: "12 horas (con automatización)" },
  { id: "medida", label: "A la medida" },
  { id: "247", label: "A mi ritmo 24/7" },
] as const;

const GOAL_ANSWERS = [
  { id: "asistente", label: "Dominar asistente diario" },
  { id: "agentes", label: "Construir agentes propios" },
  { id: "automatizar", label: "Automatizar con n8n" },
  { id: "corporativo", label: "Transformar toda la empresa" },
] as const;

const PLAN_TO_OPTION: Record<string, ProgramOption> = {
  ignition: "Ignition (4 horas)",
  booster: "Booster (8 horas)",
  liftoff: "Liftoff (12 horas)",
  odyssey: "Odyssey (Personalizado)",
  nebula: "Nebula (Pregrabado)",
};

export function PlansSection({
  selectedProgram,
  onChooseProgram,
}: PlansSectionProps) {
  const [team, setTeam] = useState<string>("equipo");
  const [time, setTime] = useState<string>("12h");
  const [goal, setGoal] = useState<string>("automatizar");

  const recommended = useMemo(() => {
    let best = MISSION_PLANS[2]; // Liftoff default
    let bestScore = -1;
    for (const plan of MISSION_PLANS) {
      let score = 0;
      if (plan.idealTeam.includes(team)) score += 2;
      if (plan.idealTime.includes(time)) score += 4;
      if (plan.idealGoal.includes(goal)) score += 3;
      if (score > bestScore) {
        bestScore = score;
        best = plan;
      }
    }
    return best;
  }, [team, time, goal]);

  const handleSelectPlan = (planId: string) => {
    const option = PLAN_TO_OPTION[planId];
    if (option) {
      onChooseProgram(option);
      const target = document.getElementById("inscripcion");
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="planes"
      className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl space-y-3">
          <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
            Misiones de formación
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Elige tu <span className="text-[#B783FF]">misión de despegue</span>
          </h2>
          <p className="text-sm sm:text-base text-[#DCD6EA]">
            Desde una inmersión práctica de 4 horas hasta programas corporativos a la
            medida y formación pregrabada 24/7.
          </p>
        </div>

        {/* Interactive 3-Question Recommender (Piece #3) */}
        <div className="mt-8 brand-card p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Rocket className="h-4 w-4 text-[#B783FF]" aria-hidden="true" />
              Recomendador rápido de misión (3 preguntas)
            </div>
            <span className="text-xs text-[#8E8998]">
              Responde para destacar el plan ideal
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B783FF]">
                1. ¿Quién se forma?
              </p>
              <div className="flex flex-wrap gap-2">
                {TEAM_ANSWERS.map((ans) => (
                  <button
                    key={ans.id}
                    type="button"
                    onClick={() => setTeam(ans.id)}
                    aria-pressed={team === ans.id}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                      team === ans.id
                        ? "bg-[#7026E8] text-white"
                        : "border border-[#B783FF]/20 text-[#DCD6EA] hover:border-[#9636FF]"
                    }`}
                  >
                    {ans.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B783FF]">
                2. ¿Tiempo disponible?
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_ANSWERS.map((ans) => (
                  <button
                    key={ans.id}
                    type="button"
                    onClick={() => setTime(ans.id)}
                    aria-pressed={time === ans.id}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                      time === ans.id
                        ? "bg-[#7026E8] text-white"
                        : "border border-[#B783FF]/20 text-[#DCD6EA] hover:border-[#9636FF]"
                    }`}
                  >
                    {ans.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B783FF]">
                3. ¿Meta principal?
              </p>
              <div className="flex flex-wrap gap-2">
                {GOAL_ANSWERS.map((ans) => (
                  <button
                    key={ans.id}
                    type="button"
                    onClick={() => setGoal(ans.id)}
                    aria-pressed={goal === ans.id}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                      goal === ans.id
                        ? "bg-[#7026E8] text-white"
                        : "border border-[#B783FF]/20 text-[#DCD6EA] hover:border-[#9636FF]"
                    }`}
                  >
                    {ans.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            aria-live="polite"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#9636FF]/45 bg-[#7026E8]/15 p-4 sm:p-5"
          >
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B783FF]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Misión recomendada para ti
              </p>
              <p className="mt-1 text-lg sm:text-xl font-extrabold text-white">
                {recommended.title} · {recommended.duration} ({recommended.phase})
              </p>
              <p className="text-xs sm:text-sm text-[#DCD6EA]">
                {recommended.recommendedFor}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectPlan(recommended.id)}
              className="shrink-0 rounded-[32px] bg-[#7026E8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9636FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
            >
              Solicitar {recommended.title}
            </button>
          </div>
        </div>

        {/* All 5 Plans Grid */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {MISSION_PLANS.map((plan) => {
            const isRecommended = plan.id === recommended.id;
            const isSelectedInForm = PLAN_TO_OPTION[plan.id] === selectedProgram;
            return (
              <article
                key={plan.id}
                className={`flex flex-col justify-between rounded-[28px] p-6 transition-all ${
                  isRecommended
                    ? "border-2 border-[#9636FF] bg-[#7026E8]/15 shadow-[0_0_32px_rgba(150,54,255,0.22)]"
                    : "brand-card hover:border-[#9636FF]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B783FF]">
                      {plan.phase}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        isRecommended
                          ? "bg-[#B783FF] text-[#050507]"
                          : "bg-white/10 text-[#DCD6EA]"
                      }`}
                    >
                      {isRecommended ? "Recomendado" : plan.highlightTag}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-extrabold text-white">
                    {plan.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#B783FF]">
                    {plan.duration}
                  </p>

                  <ul className="mt-5 space-y-2.5 text-xs sm:text-[13px] text-[#DCD6EA]">
                    {plan.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <Check
                          className="h-4 w-4 shrink-0 text-[#B783FF] mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full rounded-[32px] px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                      isSelectedInForm || isRecommended
                        ? "bg-[#7026E8] text-white hover:bg-[#9636FF]"
                        : "border border-[#B783FF]/35 text-white hover:bg-[#7026E8] hover:border-[#7026E8]"
                    }`}
                  >
                    {isSelectedInForm ? "Seleccionado en formulario" : plan.ctaLabel}
                  </button>

                  {plan.externalUrl && (
                    <a
                      href={plan.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-[11px] font-medium text-[#B783FF] hover:text-white underline-offset-4 hover:underline"
                    >
                      Ver plataforma Nebula ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8E8998]">
          <span>
            ¿Ya sabes qué programa quieres? También puedes completar tu matrícula en el{" "}
            <a
              href={PORTAL_URLS.inscripcion}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B783FF] underline hover:text-white"
            >
              portal directo de inscripción ↗
            </a>
            .
          </span>
        </div>
      </div>
    </section>
  );
}
