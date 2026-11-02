import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

const KV_KEY = "briefings";

async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function GET() {
  if (!(await authenticate())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const items = await kv.lrange<string>(KV_KEY, 0, -1);
  const parsed = items.map((item) =>
    typeof item === "string" ? JSON.parse(item) : item
  );
  return NextResponse.json(parsed);
}

export async function DELETE(req: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await req.json();
  const items = await kv.lrange<string>(KV_KEY, 0, -1);
  const kept = items.filter((item) => {
    const parsed = typeof item === "string" ? JSON.parse(item) : item;
    return parsed.id !== id;
  });
  await kv.del(KV_KEY);
  if (kept.length > 0) await kv.rpush(KV_KEY, ...kept);
  return NextResponse.json({ success: true });
}
