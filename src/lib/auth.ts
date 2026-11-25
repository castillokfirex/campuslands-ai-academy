import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "aiacademy_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export interface AdminSession {
  email: string;
  name: string;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  // Deterministic local dev fallback only when SESSION_SECRET isn't set
  return "dev-campuslands-ai-academy-local-secret-change-in-prod";
}

function sign(payloadBase64: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadBase64)
    .digest("base64url");
}

export function verifyAdminCredentials(
  emailInput: string,
  passwordInput: string
): { valid: true; email: string; name: string } | { valid: false } {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput;

  const primaryEmail = (process.env.ADMIN_EMAIL || "admin@campuslands.local")
    .trim()
    .toLowerCase();
  const primaryPass = process.env.ADMIN_PASSWORD || "";
  const primaryName = process.env.ADMIN_NAME || "Administrador Principal";

  const secondaryEmail = (process.env.ADMIN_SECONDARY_EMAIL || "")
    .trim()
    .toLowerCase();
  const secondaryPass = process.env.ADMIN_SECONDARY_PASSWORD || "";
  const secondaryName =
    process.env.ADMIN_SECONDARY_NAME || "Coordinación Académica";

  if (primaryPass && email === primaryEmail && safeCompare(password, primaryPass)) {
    return { valid: true, email: primaryEmail, name: primaryName };
  }

  if (
    secondaryEmail &&
    secondaryPass &&
    email === secondaryEmail &&
    safeCompare(password, secondaryPass)
  ) {
    return { valid: true, email: secondaryEmail, name: secondaryName };
  }

  return { valid: false };
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(email: string, name: string): string {
  const payload: AdminSession = {
    email,
    name,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  return `${encoded}.${sign(encoded)}`;
}

export function parseSessionToken(token: string | undefined): AdminSession | null {
  if (!token || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  if (!safeCompare(signature, expected)) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as AdminSession;
    if (!parsed.email || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies(): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(ADMIN_COOKIE_NAME)?.value;
  return parseSessionToken(raw);
}
