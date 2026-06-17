import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/admin-auth";
import AdminLoginForm from "./login-form";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token && verifyAdminToken(token)) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
