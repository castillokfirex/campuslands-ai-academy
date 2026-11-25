import { ALLOWED_PROGRAMS, type ProgramOption } from "@/data/academyContent";

export const LEAD_STATUSES = [
  "Nuevo",
  "Contactado",
  "En seguimiento",
  "Cerrado",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadNote {
  id: string;
  contenido: string;
  autor: string;
  fecha: string;
}

export interface LeadHistoryEntry {
  id: string;
  accion: string;
  campo?: string;
  valorAnterior?: string | null;
  valorNuevo?: string | null;
  detalle?: string;
  usuario: string;
  fecha: string;
}

export interface LeadRecord {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  programa: ProgramOption;
  estado: LeadStatus;
  notas: LeadNote[];
  historial: LeadHistoryEntry[];
  telegramNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValidatedLeadInput {
  nombre: string;
  correo: string;
  programa: ProgramOption;
  telefono: string | null;
}

export function sanitizeText(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export function validateLeadPayload(raw: unknown):
  | { ok: true; data: ValidatedLeadInput }
  | { ok: false; errors: Record<string, string> } {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const errors: Record<string, string> = {};

  const nombre = sanitizeText(obj.nombre, 120);
  const correo = sanitizeText(obj.correo, 160).toLowerCase();
  const programaRaw = sanitizeText(obj.programa, 80);
  const telefonoRaw = sanitizeText(obj.telefono, 30);

  if (nombre.length < 2) {
    errors.nombre = "Ingresa tu nombre completo (mínimo 2 caracteres).";
  }

  if (!correo || !EMAIL_RE.test(correo)) {
    errors.correo = "Ingresa un correo electrónico válido (ej. nombre@empresa.com).";
  }

  if (!ALLOWED_PROGRAMS.includes(programaRaw as ProgramOption)) {
    errors.programa = "Selecciona un programa de interés válido.";
  }

  let telefono: string | null = null;
  if (telefonoRaw.length > 0) {
    const digitsCount = telefonoRaw.replace(/\D/g, "").length;
    if (!PHONE_RE.test(telefonoRaw) || digitsCount < 7 || digitsCount > 15) {
      errors.telefono = "El teléfono es opcional, pero si lo ingresas debe ser válido (7 a 15 dígitos).";
    } else {
      telefono = telefonoRaw;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      nombre,
      correo,
      programa: programaRaw as ProgramOption,
      telefono,
    },
  };
}
