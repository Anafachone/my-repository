import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAdminToken } from "@/lib/admin-auth";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chat, user } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import LogoutButton from "../logout-button";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect("/admin");
  }

  const client = postgres(process.env.POSTGRES_URL ?? "");
  const db = drizzle(client);

  const chats = await db
    .select({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      userEmail: user.email,
    })
    .from(chat)
    .leftJoin(user, eq(chat.userId, user.id))
    .orderBy(desc(chat.createdAt))
    .limit(200);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Briefings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {chats.length} conversa{chats.length !== 1 ? "s" : ""} encontrada{chats.length !== 1 ? "s" : ""}
            </p>
          </div>
          <LogoutButton />
        </div>

        {chats.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Nenhum briefing encontrado ainda.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chats.map((c) => (
              <Link
                key={c.id}
                href={`/admin/chat/${c.id}`}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-sm transition-all group"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600">
                    {c.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.userEmail ?? "convidado"} &middot;{" "}
                    {new Date(c.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <span className="ml-4 text-gray-400 group-hover:text-blue-500 text-lg flex-shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
