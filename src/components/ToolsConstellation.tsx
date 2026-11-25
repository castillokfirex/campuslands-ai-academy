"use client";

import { useState } from "react";
import { AI_TOOLS, type ToolItem } from "@/data/academyContent";
import { Sparkles, Terminal } from "lucide-react";

const CATEGORIES = [
  "Todas",
  "Asistentes",
  "Automatización",
  "Conocimiento",
  "Multimedia",
] as const;

export function ToolsConstellation() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Todas");
  const [selectedTool, setSelectedTool] = useState<ToolItem>(AI_TOOLS[0]);
  const [showDemoOutput, setShowDemoOutput] = useState(true);

  const visibleTools =
    category === "Todas"
      ? AI_TOOLS
      : AI_TOOLS.filter((t) => t.category === category);

  const handleSelect = (tool: ToolItem) => {
    setSelectedTool(tool);
    setShowDemoOutput(false);
    requestAnimationFrame(() => setShowDemoOutput(true));
  };

  return (
    <section
      id="herramientas"
      className="reveal-section relative py-16 sm:py-24 scroll-mt-28 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="brand-pill-tag inline-block px-3.5 py-1 text-[11px]">
              Exploración libre · 14 herramientas
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Explora la{" "}
              <span className="text-[#B783FF]">constelación de herramientas</span>{" "}
              de IA
            </h2>
            <p className="text-sm sm:text-base text-[#DCD6EA]">
              Toca cualquier nodo para inspeccionar su alcance y simular un caso
              práctico real de trabajo.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar herramientas por categoría"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                    active
                      ? "bg-[#7026E8] text-white"
                      : "border border-[#B783FF]/20 text-[#DCD6EA] hover:border-[#9636FF] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* Interactive Constellation Grid */}
          <div className="brand-card p-5 sm:p-7 relative overflow-hidden">
            <div className="mb-4 flex items-center justify-between text-xs text-[#8E8998]">
              <span>Mostrando {visibleTools.length} de 14 herramientas del ecosistema</span>
              <span className="text-[#B783FF] font-medium">Selecciona un nodo</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {visibleTools.map((tool) => {
                const active = tool.id === selectedTool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelect(tool)}
                    aria-pressed={active}
                    className={`group flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-[#B783FF] ${
                      active
                        ? "border-[#9636FF] bg-[#7026E8] text-white shadow-[0_0_24px_rgba(150,54,255,0.45)]"
                        : "border-[#B783FF]/15 bg-[#050507]/80 text-[#DCD6EA] hover:border-[#9636FF]/60 hover:bg-[#B783FF]/10"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`inline-flex h-8 w-10 items-center justify-center rounded-lg text-[11px] font-bold tracking-wider ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-[#B783FF]/15 text-[#B783FF]"
                        }`}
                      >
                        {tool.shortCode}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          active ? "bg-white" : "bg-[#9636FF]/60 group-hover:bg-[#B783FF]"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-sm font-bold text-white leading-snug">
                      {tool.name}
                    </span>
                    <span
                      className={`text-[11px] ${
                        active ? "text-[#DCD6EA]" : "text-[#8E8998]"
                      }`}
                    >
                      {tool.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Tool Inspector + Live Prompt Demo */}
          <aside
            aria-live="polite"
            className="brand-card p-6 sm:p-7 space-y-5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="brand-pill-tag inline-block px-3 py-0.5 text-[10px]">
                  {selectedTool.category}
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-white">
                  {selectedTool.name}
                </h3>
                <p className="text-sm font-medium text-[#B783FF]">
                  {selectedTool.tagline}
                </p>
              </div>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7026E8] text-xs font-extrabold text-white">
                {selectedTool.shortCode}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-[#DCD6EA]">
              {selectedTool.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedTool.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-[#B783FF]/25 bg-[#050507]/70 px-3 py-1 text-xs font-medium text-[#DCD6EA]"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Interactive Prompt in Action Demo */}
            <div className="rounded-2xl border border-[#9636FF]/35 bg-[#050507] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B783FF]">
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                  Prompt en acción
                </span>
                <button
                  type="button"
                  onClick={() => setShowDemoOutput((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#7026E8] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#9636FF] focus-visible:outline-2 focus-visible:outline-[#B783FF]"
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {showDemoOutput ? "Ocultar resultado" : "Ejecutar ejemplo"}
                </button>
              </div>

              <p className="text-xs leading-relaxed text-white bg-white/[0.04] rounded-xl p-3 border border-white/10">
                «{selectedTool.samplePrompt}»
              </p>

              {showDemoOutput && (
                <div className="rounded-xl border border-[#9636FF]/35 bg-[#7026E8]/15 p-3 text-xs leading-relaxed text-[#DCD6EA]">
                  <strong className="text-white block mb-1">
                    Entregable esperado en clase:
                  </strong>
                  {selectedTool.sampleOutput}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
