"use client";

import { useState, useCallback } from "react";

const C = {
  navy: "#253142",
  ouro: "#b89b5e",
  ouro2: "#ac8540",
  nude: "#a5948a",
  creme: "#f6f1ec",
  off: "#1d1d1b",
};

interface Entry {
  id: string;
  createdAt: string;
  data: Record<string, unknown>;
}

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const login = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/responses?pw=${encodeURIComponent(pw)}`);
      if (!res.ok) {
        setError("Senha incorreta.");
        return;
      }
      const data: Entry[] = await res.json();
      setEntries(data);
      setAuthed(true);
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }, [pw]);

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!confirm("Excluir este briefing?")) return;
      try {
        const res = await fetch(`/api/responses?pw=${encodeURIComponent(pw)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setEntries((prev) => prev.filter((e) => e.id !== id));
        }
      } catch {
        alert("Erro ao excluir.");
      }
    },
    [pw]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/responses?pw=${encodeURIComponent(pw)}`);
      const data: Entry[] = await res.json();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, [pw]);

  const hPad = "clamp(16px, 5vw, 48px)";

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.navy,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            background: C.creme,
            borderRadius: 12,
            padding: "40px 32px",
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              color: C.navy,
              marginBottom: 8,
            }}
          >
            AF Admin
          </div>
          <div style={{ color: C.nude, fontSize: 13, marginBottom: 28 }}>
            Painel de Briefings
          </div>
          <input
            type="password"
            placeholder="Senha"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: `1px solid ${C.nude}`,
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              boxSizing: "border-box",
              marginBottom: 12,
            }}
          />
          {error && (
            <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 12 }}>{error}</div>
          )}
          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: C.ouro,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {loading ? "Carregando…" : "Entrar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.creme,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: C.navy,
          padding: `20px ${hPad}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            color: C.ouro,
          }}
        >
          AF Admin — Briefings
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={refresh}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: C.creme,
              border: `1px solid ${C.nude}`,
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Atualizar
          </button>
          <button
            onClick={() => setAuthed(false)}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: C.nude,
              border: `1px solid ${C.nude}`,
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: `24px ${hPad}`, maxWidth: 900, margin: "0 auto" }}>
        {loading && (
          <div style={{ textAlign: "center", color: C.nude, padding: 40 }}>
            Carregando…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: C.nude,
              padding: 60,
              background: "#fff",
              borderRadius: 12,
            }}
          >
            Nenhum briefing enviado ainda.
          </div>
        )}

        {entries.map((entry) => {
          const isOpen = expanded === entry.id;
          const date = new Date(entry.createdAt).toLocaleString("pt-BR");
          const tipo = (entry.data as Record<string, unknown>)?._type as string | undefined;

          return (
            <div
              key={entry.id}
              style={{
                background: "#fff",
                borderRadius: 10,
                marginBottom: 12,
                border: `1px solid #e8e0d8`,
                overflow: "hidden",
              }}
            >
              {/* Row header */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(isOpen ? null : entry.id)}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.off }}>
                    {(entry.data as Record<string, string>)?.nome ||
                      (entry.data as Record<string, string>)?.s1_nome ||
                      "—"}
                  </div>
                  <div style={{ fontSize: 12, color: C.nude, marginTop: 2 }}>
                    {tipo ? `[${tipo}] · ` : ""}
                    {date}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 13,
                      color: C.ouro,
                      fontWeight: 500,
                    }}
                  >
                    {isOpen ? "▲ Fechar" : "▼ Ver"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEntry(entry.id);
                    }}
                    style={{
                      padding: "6px 12px",
                      background: "#fef2f2",
                      color: "#c0392b",
                      border: "1px solid #f5c6cb",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {/* Expanded data */}
              {isOpen && (
                <div
                  style={{
                    borderTop: `1px solid #e8e0d8`,
                    padding: "20px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
                    gap: "12px 20px",
                  }}
                >
                  {Object.entries(entry.data as Record<string, unknown>)
                    .filter(([k]) => k !== "_type")
                    .map(([key, val]) => (
                      <div key={key}>
                        <div
                          style={{
                            fontSize: 11,
                            color: C.nude,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 4,
                          }}
                        >
                          {key.replace(/_/g, " ")}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: C.off,
                            background: "#f9f6f2",
                            padding: "8px 12px",
                            borderRadius: 6,
                            wordBreak: "break-word",
                            minHeight: 32,
                          }}
                        >
                          {String(val ?? "—")}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
