import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chat, message, user } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
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
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, id))
    .orderBy(asc(message.createdAt));

  return NextResponse.json({ chat: selectedChat, messages });
}
