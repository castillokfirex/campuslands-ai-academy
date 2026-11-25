import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getLeadStore } from "@/lib/leadStore";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  const store = getLeadStore();
  const initialLeads = await store.listLeads();

  return (
    <AdminDashboard
      admin={{ email: session.email, name: session.name }}
      initialLeads={initialLeads}
    />
  );
}
