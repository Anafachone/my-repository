import "server-only";
import { connection } from "next/server";
import AdminChatClient from "./client";

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  return <AdminChatClient id={id} />;
}
