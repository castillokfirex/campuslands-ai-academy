import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getLeadStore } from "@/lib/leadStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Acceso no autorizado." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const store = getLeadStore();
  const leads = await store.listLeads(status, search);

  return NextResponse.json({
    ok: true,
    admin: { email: session.email, name: session.name },
    leads,
  });
}
