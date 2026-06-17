"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrintButton from "../../print-button";

type MessagePart = { type: string; text?: string };

type ChatMessage = {
  id: string;
  role: string;
  parts: unknown;
  createdAt: string;
};

type ChatData = {
  chat: { id: string; title: string; createdAt: string; userEmail: string | null };
  messages: ChatMessage[];
};

function extractText(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  return (parts as MessagePart[])
    .filter((p) => p?.type === "text")
    .map((p) => p.text ?? "")
    .join("\n");
}

export default function AdminChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/chat/${id}`)
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin");
          return null;
        }
        if (res.status === 404) {
          router.push("/admin/dashboard");
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6 print:hidden">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            ← Voltar
          </Link>
          <PrintButton />
        </div>

        <div id="briefing-print">
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {data.chat.title}
            </h1>
            <p className="text-sm text-gray-500">
              {data.chat.userEmail ?? "convidado"} &middot;{" "}
              {new Date(data.chat.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {data.messages.map((msg) => {
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
