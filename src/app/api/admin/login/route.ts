import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  verifyAdminCredentials,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo de solicitud inválido." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  const auth = verifyAdminCredentials(email, password);
  if (!auth.valid) {
    return NextResponse.json(
      { ok: false, error: "Credenciales inválidas. Verifica correo y contraseña." },
      { status: 401 }
    );
  }

  const token = createSessionToken(auth.email, auth.name);
  const response = NextResponse.json({
    ok: true,
    admin: { email: auth.email, name: auth.name },
  });

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
