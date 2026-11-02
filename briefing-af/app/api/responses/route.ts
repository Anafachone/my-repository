import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const KV_KEY = "briefings";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const entry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), data };
  await kv.lpush(KV_KEY, JSON.stringify(entry));
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw");
  if (pw !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await kv.lrange<string>(KV_KEY, 0, -1);
  const parsed = items.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
  return NextResponse.json(parsed);
}

export async function DELETE(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw");
  if (pw !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
