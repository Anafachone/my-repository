'use client'
import { useState } from 'react'

const DARK = '#253142'
const GOLD = '#B89B5E'
const CREAM = '#F6F1EC'
const GRAY = '#A5948A'

const FIELD_LABELS: Record<string, string> = {
  nome: 'Nome / Marca', segmento: 'Segmento', origem: 'Como começou', tentativas: 'O que não funcionou',
  desafios: 'Desafios', historia: 'História marcante', ex_atendimento: 'Atendimento diferenciado',
  indicacao: 'O que clientes dizem ao indicar', unico: 'O que faz de único', orgulho: 'Momento de orgulho',
  tom: 'Tom de voz', cliente_ideal: 'Cliente ideal', gatilho: 'Gatilho de compra',
  avalia: 'O que avalia antes de comprar', objecoes: 'Objeções', retorno: 'Por que volta / indica',
  redes: 'Redes sociais', melhor: 'Melhor plataforma', site: 'Site / e-commerce', trafego: 'Tráfego pago',
  problema: 'Problema digital', concorrentes: 'Concorrentes', eles_fazem: 'O que eles fazem',
  eu_faco: 'O que você faz', posicionamento: 'Posicionamento desejado', resultado_90d: 'Resultado em 90 dias',
  mes_sucesso: 'Mês bem-sucedido', agencia: 'Já trabalhou com agência', orcamento: 'Orçamento mensal', obs: 'Observações finais',
}

const SECTIONS = [
  { label: '01 · História', keys: ['nome','segmento','origem','tentativas','desafios','historia'] },
  { label: '02 · Diferencial', keys: ['ex_atendimento','indicacao','unico','orgulho','tom'] },
  { label: '03 · Público', keys: ['cliente_ideal','gatilho','avalia','objecoes','retorno'] },
  { label: '04 · Presença Digital', keys: ['redes','melhor','site','trafego','problema'] },
  { label: '05 · Concorrência', keys: ['concorrentes','eles_fazem','eu_faco','posicionamento'] },
  { label: '06 · Objetivos', keys: ['resultado_90d','mes_sucesso','agencia','orcamento','obs'] },
]

interface Entry { id: string; createdAt: string; data: Record<string, string> }
function formatDate(iso: string) { return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) }

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Entry | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function login() {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/responses?pw=${encodeURIComponent(password)}`)
      if (!res.ok) { setError('Senha incorreta.'); setLoading(false); return }
      setEntries(await res.json()); setLoggedIn(true)
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  async function deleteEntry(id: string) {
    if (!confirm('Excluir esse briefing?')) return
    setDeleting(id)
    await fetch(`/api/responses?pw=${encodeURIComponent(password)}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setEntries(prev => prev.filter(e => e.id !== id))
    if (selected?.id === id) setSelected(null)
    setDeleting(null)
  }

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: CREAM }}>
      <div style={{ background: DARK, borderRadius: 16, padding: '40px 36px', width: 340, border: `1px solid ${GOLD}44`, boxShadow: '0 8px 40px rgba(37,49,66,0.2)' }}>
        <div style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: GOLD, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>Ana Fachone</div>
        <div style={{ fontSize: 18, color: GOLD, fontFamily: 'Georgia,serif', marginBottom: 28 }}>Painel de Briefings</div>
        <div style={{ fontSize: 9, color: `${GOLD}88`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Senha</div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Digite a senha" style={{ width: '100%', background: '#1C2738', border: `1px solid ${GOLD}44`, borderRadius: 6, padding: '10px 12px', fontSize: 13, color: '#fff', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
        {error && <div style={{ fontSize: 11, color: '#e57373', marginBottom: 12 }}>{error}</div>}
        <button onClick={login} disabled={loading} style={{ width: '100%', background: GOLD, border: 'none', color: DARK, padding: 11, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6, fontFamily: 'sans-serif', fontWeight: 700 }}>{loading ? 'Entrando…' : 'Entrar'}</button>
      </div>
    </div>
  )

  if (selected) return (
    <div style={{ minHeight: '100vh', background: CREAM, padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: `1px solid ${GOLD}`, color: DARK, padding: '6px 14px', borderRadius: 4, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'sans-serif' }}>← Voltar</button>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: DARK }}>{selected.data.nome || 'Sem nome'}</div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: GRAY }}>{formatDate(selected.createdAt)}</div>
        </div>
        {SECTIONS.map(s => (<div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 16, border: `1px solid ${GOLD}22` }}><div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: GOLD, borderBottom: `1px solid ${GOLD}33`, paddingBottom: 8, marginBottom: 16 }}>{s.label}</div>{s.keys.map(k => selected.data[k] ? (<div key={k} style={{ marginBottom: 14 }}><div style={{ fontSize: 9, color: GRAY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{FIELD_LABELS[k]}</div><div style={{ fontSize: 13, color: DARK, lineHeight: 1.7, background: CREAM, borderLeft: `3px solid ${GOLD}`, padding: '8px 12px', borderRadius: '0 6px 6px 0' }}>{selected.data[k]}</div></div>) : null)}</div>))}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: CREAM, padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: DARK, borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div><div style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>Ana Fachone · Marketing Digital</div><div style={{ fontSize: 20, color: GOLD, fontFamily: 'Georgia,serif', marginTop: 4 }}>Painel de Briefings</div></div>
          <div style={{ marginLeft: 'auto', background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 20, padding: '4px 14px', color: GOLD, fontSize: 11 }}>{entries.length} {entries.length === 1 ? 'resposta' : 'respostas'}</div>
        </div>
        {entries.length === 0 ? (<div style={{ background: '#fff', borderRadius: 12, padding: '48px 24px', textAlign: 'center', border: `1px solid ${GOLD}22` }}><div style={{ fontSize: 32, marginBottom: 12 }}>📋</div><div style={{ color: GRAY, fontSize: 13 }}>Nenhum briefing recebido ainda.</div></div>) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {entries.map(entry => {
              const pct = Math.round(Object.values(entry.data).filter(v => v && v.trim()).length / Object.keys(FIELD_LABELS).length * 100)
              return (<div key={entry.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: `1px solid ${GOLD}22`, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, fontFamily: 'Georgia,serif', fontSize: 18, flexShrink: 0 }}>{(entry.data.nome || '?')[0].toUpperCase()}</div>
                <div style={{ flex: 1 }} onClick={() => setSelected(entry)}><div style={{ fontFamily: 'Georgia,serif', fontSize: 15, color: DARK, marginBottom: 2 }}>{entry.data.nome || 'Sem nome'}</div><div style={{ fontSize: 11, color: GRAY }}>{entry.data.segmento && <span style={{ marginRight: 12 }}>{entry.data.segmento}</span>}{formatDate(entry.createdAt)}</div></div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setSelected(entry)} style={{ background: DARK, border: 'none', color: GOLD, padding: '6px 12px', borderRadius: 4, fontSize: 9, cursor: 'pointer', fontFamily: 'sans-serif' }}>Ver →</button>
                  <button onClick={() => deleteEntry(entry.id)} disabled={deleting === entry.id} style={{ background: 'none', border: '1px solid #e5737344', color: '#e57373', padding: '6px 10px', borderRadius: 4, fontSize: 9, cursor: 'pointer', fontFamily: 'sans-serif' }}>{deleting === entry.id ? '…' : '✕'}</button>
                </div>
              </div>)
            })}
          </div>
        )}
      </div>
    </div>
  )
}
