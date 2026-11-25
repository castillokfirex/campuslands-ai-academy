"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LEAD_STATUSES,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/validation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  LogOut,
  MessageSquarePlus,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react";

interface AdminDashboardProps {
  admin: { email: string; name: string };
  initialLeads: LeadRecord[];
}

const STATUS_BADGE: Record<LeadStatus, string> = {
  Nuevo: "bg-[#7026E8] text-white",
  Contactado: "bg-[#B783FF] text-[#050507]",
  "En seguimiento": "border border-[#9636FF] bg-[#9636FF]/20 text-white",
  Cerrado: "bg-white/15 text-[#DCD6EA]",
};

function formatDateCO(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboard({ admin, initialLeads }: AdminDashboardProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  const [editEstado, setEditEstado] = useState<LeadStatus>("Nuevo");
  const [newNota, setNewNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = {
      Todos: leads.length,
      Nuevo: 0,
      Contactado: 0,
      "En seguimiento": 0,
      Cerrado: 0,
    };
    for (const l of leads) {
      map[l.estado] = (map[l.estado] ?? 0) + 1;
    }
    return map;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "Todos" && l.estado !== statusFilter) return false;
      if (q) {
        const hay = `${l.nombre} ${l.correo} ${l.programa} ${
          l.telefono ?? ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, statusFilter, search]);

  const openLead = (lead: LeadRecord) => {
    setSelectedLead(lead);
    setEditEstado(lead.estado);
    setNewNota("");
    setFeedback("");
    setErrorMsg("");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.ok) {
        setLeads(data.leads);
        if (selectedLead) {
          const updated = (data.leads as LeadRecord[]).find(
            (x) => x.id === selectedLead.id
          );
          if (updated) setSelectedLead(updated);
        }
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    setErrorMsg("");
    setFeedback("");

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: editEstado,
          nota: newNota.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "No se pudieron guardar los cambios.");
        return;
      }

      const updated = data.lead as LeadRecord;
      setLeads((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setSelectedLead(updated);
      setEditEstado(updated.estado);
      setNewNota("");
      setFeedback("Seguimiento actualizado y registrado en el historial.");
    } catch {
      setErrorMsg("Error de red al guardar el seguimiento.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#DCD6EA]">
      {/* Top Bar */}
      <header className="border-b border-[#B783FF]/15 bg-[#050507]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Volver a la landing">
              <Image
                src="/brand/logo-horizontal-white.png"
                alt="Campuslands AI Academy"
                width={165}
                height={37}
                className="h-auto w-[160px]"
              />
            </Link>
            <span className="hidden sm:inline-block h-5 w-px bg-white/15" />
            <span className="brand-pill-tag px-3 py-1 text-[10px]">
              Panel de Seguimiento
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <p className="font-semibold text-white">{admin.name}</p>
              <p className="text-[#8E8998]">{admin.email}</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-[#B783FF]/25 px-3 py-2 text-xs text-[#DCD6EA] hover:border-[#B783FF] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Landing
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-600/80 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        {/* Status summary filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["Todos", ...LEAD_STATUSES].map((st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-[#7026E8] text-white"
                      : "border border-[#B783FF]/20 text-[#DCD6EA] hover:border-[#9636FF]"
                  }`}
                >
                  {st} ({counts[st] ?? 0})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="h-4 w-4 text-[#8E8998] absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar nombre, correo o plan..."
                aria-label="Buscar registros"
                className="w-full rounded-full border border-[#B783FF]/25 bg-[#050507] pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#B783FF]/30 px-3.5 py-2 text-xs font-semibold text-white hover:border-[#9636FF]"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Actualizar
            </button>
          </div>
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="brand-card p-10 text-center space-y-2">
            <p className="text-base font-bold text-white">
              No hay solicitudes registradas con este filtro
            </p>
            <p className="text-xs sm:text-sm text-[#8E8998]">
              Envía una solicitud desde el formulario de la landing para verla
              aquí al instante.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="brand-card p-5 flex flex-col justify-between gap-4 hover:border-[#9636FF]/60 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${
                        STATUS_BADGE[lead.estado]
                      }`}
                    >
                      {lead.estado}
                    </span>
                    <span className="text-[11px] text-[#8E8998]">
                      {formatDateCO(lead.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white leading-snug">
                      {lead.nombre}
                    </h2>
                    <p className="text-xs text-[#B783FF] font-semibold">
                      {lead.programa}
                    </p>
                  </div>

                  <div className="text-xs text-[#DCD6EA] space-y-1">
                    <p className="truncate">{lead.correo}</p>
                    <p className="text-[#8E8998]">
                      Tel: {lead.telefono ?? "No proporcionado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <span className="text-[11px] text-[#8E8998]">
                    {lead.notas.length}{" "}
                    {lead.notas.length === 1 ? "nota" : "notas"} ·{" "}
                    {lead.historial.length} eventos
                  </span>
                  <button
                    type="button"
                    onClick={() => openLead(lead)}
                    className="rounded-full bg-[#7026E8] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#9636FF] transition-colors"
                  >
                    Gestionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Lead Detail & Audit History Modal/Drawer */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm"
        >
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-[#B783FF]/25 bg-[#050507] p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold ${
                    STATUS_BADGE[selectedLead.estado]
                  }`}
                >
                  {selectedLead.estado}
                </span>
                <h2
                  id="lead-detail-title"
                  className="mt-2 text-2xl font-extrabold text-white"
                >
                  {selectedLead.nombre}
                </h2>
                <p className="text-sm font-semibold text-[#B783FF]">
                  {selectedLead.programa}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                aria-label="Cerrar detalle"
                className="rounded-full border border-white/15 p-2 text-[#DCD6EA] hover:border-[#B783FF] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lead Contact Data */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
              <div>
                <dt className="text-[#8E8998]">Correo electrónico</dt>
                <dd className="mt-0.5 font-semibold text-white break-all">
                  {selectedLead.correo}
                </dd>
              </div>
              <div>
                <dt className="text-[#8E8998]">Teléfono</dt>
                <dd className="mt-0.5 font-semibold text-white">
                  {selectedLead.telefono ?? "No proporcionado"}
                </dd>
              </div>
              <div>
                <dt className="text-[#8E8998]">Fecha de registro</dt>
                <dd className="mt-0.5 text-[#DCD6EA]">
                  {formatDateCO(selectedLead.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-[#8E8998]">Aviso por Telegram (n8n)</dt>
                <dd className="mt-0.5 inline-flex items-center gap-1 text-[#B783FF] font-semibold">
                  <Send className="h-3 w-3" aria-hidden="true" />
                  {selectedLead.telegramNotified
                    ? "Notificado vía webhook"
                    : "Pendiente / sin webhook"}
                </dd>
              </div>
            </dl>

            {/* Status + Note Update Form */}
            <form
              onSubmit={handleSaveFollowUp}
              className="brand-card p-5 space-y-4"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquarePlus
                  className="h-4 w-4 text-[#B783FF]"
                  aria-hidden="true"
                />
                Actualizar estado y añadir nota
              </h3>

              {feedback && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-xl bg-[#7026E8]/25 border border-[#9636FF] p-3 text-xs text-white"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#B783FF] shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-400/50 bg-rose-950/50 p-3 text-xs text-rose-200"
                >
                  {errorMsg}
                </div>
              )}

              <div>
                <label
                  htmlFor="edit-estado"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#DCD6EA] mb-1.5"
                >
                  Estado de seguimiento
                </label>
                <select
                  id="edit-estado"
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as LeadStatus)}
                  className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-3.5 py-2.5 text-sm text-white focus:border-[#9636FF] focus:outline-none"
                >
                  {LEAD_STATUSES.map((st) => (
                    <option key={st} value={st} className="bg-[#050507]">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-nota"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#DCD6EA] mb-1.5"
                >
                  Nueva nota de seguimiento
                </label>
                <textarea
                  id="new-nota"
                  rows={3}
                  value={newNota}
                  onChange={(e) => setNewNota(e.target.value)}
                  placeholder="Ej. Se contactó por WhatsApp, solicitó propuesta para equipo de 10 personas..."
                  className="w-full rounded-xl border border-[#B783FF]/25 bg-[#050507] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8E8998] focus:border-[#9636FF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-[32px] bg-[#7026E8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#9636FF] disabled:opacity-60 transition-colors"
              >
                {saving ? "Guardando..." : "Guardar seguimiento"}
              </button>
            </form>

            {/* Saved Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B783FF]">
                Notas registradas ({selectedLead.notas.length})
              </h3>
              {selectedLead.notas.length === 0 ? (
                <p className="text-xs text-[#8E8998]">
                  Aún no hay notas registradas para esta persona.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {selectedLead.notas.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-2xl border border-[#B783FF]/20 bg-[#B783FF]/[0.06] p-3.5 text-xs space-y-1.5"
                    >
                      <p className="text-sm text-white leading-relaxed">
                        {n.contenido}
                      </p>
                      <p className="text-[11px] text-[#8E8998]">
                        Por <strong className="text-[#DCD6EA]">{n.autor}</strong>{" "}
                        · {formatDateCO(n.fecha)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Audit History (Qué cambió, quién lo hizo y cuándo) */}
            <div className="space-y-3 pb-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B783FF] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Historial de auditoría ({selectedLead.historial.length})
              </h3>
              <ol className="space-y-2.5 border-l border-[#9636FF]/40 pl-4">
                {selectedLead.historial.map((h) => (
                  <li key={h.id} className="text-xs space-y-1 relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#9636FF]"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-white">{h.accion}</strong>
                      <span className="text-[11px] text-[#8E8998]">
                        {formatDateCO(h.fecha)}
                      </span>
                    </div>
                    {h.detalle && (
                      <p className="text-[#DCD6EA]">{h.detalle}</p>
                    )}
                    {h.campo === "estado" && (
                      <p className="text-[11px] text-[#B783FF]">
                        {h.valorAnterior ?? "Sin estado"} → {h.valorNuevo}
                      </p>
                    )}
                    <p className="text-[11px] text-[#8E8998]">
                      Responsable:{" "}
                      <span className="text-[#DCD6EA]">{h.usuario}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
