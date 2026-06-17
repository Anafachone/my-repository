import "server-only";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { verifyAdminToken } from "@/lib/admin-auth";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chat, message, user } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import PrintButton from "../../print-button";

type MessagePart = { type: string; text?: string };

function extractText(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((p): p is MessagePart => p !== null && typeof p === "object" && p.type === "text")
    .map((p) => p.text ?? "")
    .join("\n");
}

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect("/admin");
  }

  const { id } = await params;

  const client = postgres(process.env.POSTGRES_URL ?? "");
  const db = drizzle(client);

  const [selectedChat] = await db
    .select({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      userEmail: user.email,
    })
    .from(chat)
    .leftJoin(user, eq(chat.userId, user.id))
    .where(eq(chat.id, id));

  if (!selectedChat) {
    notFound();
  }

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, id))
    .orderBy(asc(message.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header — hidden on print */}
        <div className="flex items-center gap-4 mb-6 print:hidden">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            ← Voltar
          </Link>
          <PrintButton />
        </div>

        {/* Printable content */}
        <div id="briefing-print">
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {selectedChat.title}
            </h1>
            <p className="text-sm text-gray-500">
              {selectedChat.userEmail ?? "convidado"} &middot;{" "}
              {new Date(selectedChat.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const text = extractText(msg.parts);
              if (!text.trim()) return null;

              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm"
                    }`}
                  >
                    <span className={`block text-xs font-semibold mb-1 ${isUser ? "text-blue-200" : "text-gray-400"}`}>
                      {isUser ? "Usuário" : "Assistente"}
                    </span>
                    {text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
