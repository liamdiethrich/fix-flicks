import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearExpiredSessions, verifyAdminSession } from "./admin";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ff_admin")?.value;
  await clearExpiredSessions();
  const session = await verifyAdminSession(token);
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
