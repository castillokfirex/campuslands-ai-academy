import { NextResponse } from "next/server";
import { getLeadStore } from "@/lib/leadStore";
import { validateLeadPayload } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { general: "Formato JSON inválido." } },
      { status: 400 }
    );
  }

  const parsed = validateLeadPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, errors: parsed.errors },
      { status: 400 }
    );
  }

  const store = getLeadStore();
  const lead = await store.createLead(parsed.data);

  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  let telegramNotified = false;

  if (webhookUrl) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
      if (secret) {
        headers["X-Webhook-Secret"] = secret;
      }

      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: lead.id,
          nombre: lead.nombre,
          correo: lead.correo,
          programa: lead.programa,
          telefono: lead.telefono,
          estado: lead.estado,
          fecha: lead.createdAt,
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (hookRes.ok) {
        telegramNotified = true;
        await store.markTelegramNotified(lead.id);
      }
    } catch (err) {
      console.warn("Error notificando webhook n8n:", err);
    }
  }

  return NextResponse.json(
    {
      ok: true,
      lead: {
        id: lead.id,
        nombre: lead.nombre,
        correo: lead.correo,
        programa: lead.programa,
        telefono: lead.telefono,
        estado: lead.estado,
        createdAt: lead.createdAt,
        telegramNotified,
      },
    },
    { status: 201 }
  );
}
