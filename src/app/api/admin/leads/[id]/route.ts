import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getLeadStore } from "@/lib/leadStore";
import {
  LEAD_STATUSES,
  sanitizeText,
  type LeadStatus,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Acceso no autorizado." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const store = getLeadStore();
  const lead = await store.getLeadById(id);

  if (!lead) {
    return NextResponse.json(
      { ok: false, error: "Registro no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, lead });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Acceso no autorizado." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  let body: { estado?: string; nota?: string };
  try {
    body = (await request.json()) as { estado?: string; nota?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Formato JSON inválido." },
      { status: 400 }
    );
  }

  let nextEstado: LeadStatus | undefined;
  if (typeof body.estado === "string" && body.estado.trim()) {
    if (!LEAD_STATUSES.includes(body.estado as LeadStatus)) {
      return NextResponse.json(
        { ok: false, error: "Estado de seguimiento inválido." },
        { status: 400 }
      );
    }
    nextEstado = body.estado as LeadStatus;
  }

  const nota = typeof body.nota === "string" ? sanitizeText(body.nota, 1000) : "";

  const store = getLeadStore();
  const existing = await store.getLeadById(id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Registro no encontrado." },
      { status: 404 }
    );
  }

  const estadoChanged = Boolean(nextEstado && nextEstado !== existing.estado);
  if (!estadoChanged && !nota) {
    return NextResponse.json(
      {
        ok: false,
        error: "Cambia el estado o escribe una nota antes de guardar.",
      },
      { status: 400 }
    );
  }

  const updated = await store.updateLeadFollowUp({
    id,
    estado: nextEstado,
    nota,
    actorName: session.name,
    actorEmail: session.email,
  });

  return NextResponse.json({ ok: true, lead: updated });
}
