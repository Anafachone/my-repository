'use client'
import { useState } from 'react'

const DARK = '#253142'
const GOLD = '#B89B5E'
const CREAM = '#F6F1EC'
const GRAY = '#A5948A'

type QuestionType = 'input' | 'textarea' | 'chips'

interface Question {
  key: string
  label: string
  type: QuestionType
  placeholder?: string
  options?: string[]
}

interface Section {
  id: string
  tab: string
  questions: Question[]
}

const SECTIONS: Section[] = [
  {
    id: 's1',
    tab: '01 · História',
    questions: [
      { key: 'nome', label: 'Nome do cliente / marca', type: 'input', placeholder: 'Nome completo ou nome fantasia' },
      { key: 'segmento', label: 'Segmento / nicho', type: 'input', placeholder: 'Ex: clínica estética, moda feminina...' },
      { key: 'origem', label: 'Como o negócio começou e por quê?', type: 'textarea' },
      { key: 'tentativas', label: 'O que já foi tentado e não funcionou?', type: 'textarea' },
      { key: 'desafios', label: 'Quais desafios enfrentaram para chegar onde estão?', type: 'textarea' },
      { key: 'historia', label: 'Existe alguma história marcante por trás da marca?', type: 'textarea' },
    ],
  },
  {
    id: 's2',
    tab: '02 · Diferencial',
    questions: [
      { key: 'ex_atendimento', label: 'Exemplo de atendimento que um concorrente nunca faria', type: 'textarea' },
      { key: 'indicacao', label: 'O que clientes mencionam quando te indicam?', type: 'textarea' },
      { key: 'unico', label: 'O que você faz que nunca viu no seu nicho?', type: 'textarea' },
      { key: 'orgulho', label: 'Momento que mais se orgulha com um cliente', type: 'textarea' },
      { key: 'tom', label: 'Tom de voz da marca', type: 'chips', options: ['Sofisticado', 'Próximo', 'Educativo', 'Descontraído', 'Inspirador', 'Direto', 'Emocional', 'Técnico'] },
    ],
  },
  {
    id: 's3',
    tab: '03 · Público',
    questions: [
      { key: 'cliente_ideal', label: 'Descreva seu cliente ideal como uma pessoa real', type: 'textarea', placeholder: 'Nome fictício, idade, rotina, fim de semana.' },
      { key: 'gatilho', label: 'O que leva alguém a buscar seu produto/serviço?', type: 'textarea' },
      { key: 'avalia', label: 'O que avalia antes de comprar de você?', type: 'textarea' },
      { key: 'objecoes', label: 'Frases que usam para justificar o NÃO', type: 'textarea' },
      { key: 'retorno', label: 'O que faz esse cliente voltar ou indicar?', type: 'textarea' },
    ],
  },
  {
    id: 's4',
    tab: '04 · Presença Digital',
    questions: [
      { key: 'redes', label: 'Redes sociais que usa hoje', type: 'chips', options: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Pinterest', 'YouTube', 'WhatsApp', 'Google Meu Negócio'] },
      { key: 'melhor', label: 'Plataforma que traz mais resultado hoje', type: 'input', placeholder: 'Instagram, indicação, Google...' },
      { key: 'site', label: 'Tem site ou e-commerce?', type: 'input', placeholder: 'URL ou "não tem"' },
      { key: 'trafego', label: 'Já investiu em tráfego pago? Como foi?', type: 'textarea' },
      { key: 'problema', label: 'Maior problema da presença digital atual', type: 'textarea' },
    ],
  },
  {
    id: 's5',
    tab: '05 · Concorrência',
    questions: [
      { key: 'concorrentes', label: '2 ou 3 concorrentes que admira', type: 'textarea' },
      { key: 'eles_fazem', label: 'O que eles fazem que você não faz?', type: 'textarea' },
      { key: 'eu_faco', label: 'O que você faz que eles não fazem?', type: 'textarea' },
      { key: 'posicionamento', label: 'Como quer ser percebido no mercado?', type: 'chips', options: ['Mais premium', 'Mais acessível', 'Mais especializado', 'Mais humano', 'Pioneiro', 'Mais confiável', 'Mais moderno'] },
    ],
  },
  {
    id: 's6',
    tab: '06 · Objetivos',
    questions: [
      { key: 'resultado_90d', label: 'Resultado concreto nos próximos 90 dias', type: 'textarea' },
      { key: 'mes_sucesso', label: 'O que seria um mês bem-sucedido?', type: 'textarea' },
      { key: 'agencia', label: 'Já trabalhou com social media ou agência?', type: 'input', placeholder: 'Sim / Não — se sim, por que saiu?' },
      { key: 'orcamento', label: 'Investimento disponível por mês (mídia paga)', type: 'input', placeholder: 'R$ ___' },
      { key: 'obs', label: 'Observações finais', type: 'textarea' },
    ],
  },
  {
    id: 's7',
    tab: '07 · Tom e Estética',
    questions: [
      { key: 'tres_palavras', label: 'Descreva a sua marca em 3 palavras', type: 'input', placeholder: 'Ex: elegante, acolhedora, moderna' },
      { key: 'tom_voz', label: 'Como a sua marca fala?', type: 'textarea', placeholder: 'Formal, descontraído, inspirador, direto, poético?' },
      { key: 'cores_ama', label: 'Quais cores representam a marca?', type: 'input', placeholder: 'Cores que você usaria em tudo...' },
      { key: 'cores_odeia', label: 'Quais cores você nunca usaria?', type: 'input', placeholder: 'As que parecem genéricas ou que não combinam...' },
      { key: 'perfis_ref', label: 'Quais perfis ou marcas você admira esteticamente?', type: 'textarea', placeholder: '@perfis, marcas — pelo visual, conteúdo ou posicionamento' },
      { key: 'nao_quer', label: 'O que você absolutamente NÃO quer ver no conteúdo?', type: 'textarea', placeholder: 'Fotos muito editadas, texto genérico, tom corporativo...' },
      { key: 'palavras_pode', label: 'Palavras e frases que a marca pode usar', type: 'textarea', placeholder: 'Expressões, gírias, termos que combinam...' },
      { key: 'palavras_nunca', label: 'Palavras que a marca NUNCA deve usar', type: 'textarea', placeholder: 'O que soa errado ou forçado para a sua marca...' },
    ],
  },
  {
    id: 's8',
    tab: '08 · Experiência',
    questions: [
      { key: 'ja_trabalhou', label: 'Já trabalhou com social media ou agência antes?', type: 'input', placeholder: 'Sim / Não — se sim, como foi?' },
      { key: 'funcionou', label: 'O que funcionou nessa experiência anterior?', type: 'textarea', placeholder: 'Mesmo que tenha sido pouco — o que deu certo?' },
      { key: 'frustrou', label: 'O que te frustrou ou não funcionou?', type: 'textarea', placeholder: 'Falta de comunicação, conteúdo genérico, sem resultado...' },
      { key: 'expectativa', label: 'O que você espera dessa parceria?', type: 'textarea', placeholder: 'O que você mais precisa que funcione nessa parceria...' },
      { key: 'feedbacks', label: 'Como você prefere dar feedbacks no conteúdo?', type: 'input', placeholder: 'Áudio no WhatsApp, comentário escrito, reunião ao vivo...' },
      { key: 'disponibilidade', label: 'Com que frequência consegue enviar fotos e vídeos novos?', type: 'input', placeholder: 'Toda semana, quinzenal, mensal...' },
    ],
  },
]

function openPdf(answers: Record<string, string>) {
  const win = window.open('', '_blank')
  if (!win) return
  const date = new Date().toLocaleDateString('pt-BR')
  const name = answers.nome || 'Cliente'
  let body = ''
  SECTIONS.forEach(section => {
    body += `<div class="section-block"><div class="section-title">${section.tab}</div>`
    section.questions.forEach(q => {
      const val = answers[q.key] || ''
      body += `<div class="q-wrap">
        <div class="q-label">${q.label}</div>
        <div class="q-answer">${val || '—'}</div>
      </div>`
    })
    body += '</div>'
  })
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Briefing — ${name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:#F6F1EC;color:#1D1D1B}
.page{max-width:780px;margin:0 auto;padding:48px}
.header{background:#253142;border-radius:12px;padding:28px 32px;margin-bottom:36px;display:flex;align-items:center;gap:20px}
.header h1{font-size:22px;color:#B89B5E;letter-spacing:3px;text-transform:uppercase}
.header p{font-size:10px;letter-spacing:4px;color:#B89B5E88;text-transform:uppercase;margin-top:4px}
.header-badge{margin-left:auto;background:#B89B5E22;border:1px solid #B89B5E44;border-radius:20px;padding:6px 16px;color:#B89B5E;font-size:10px;letter-spacing:2px;text-transform:uppercase;white-space:nowrap}
.meta{display:flex;justify-content:space-between;font-size:11px;color:#A5948A;margin-bottom:32px;letter-spacing:1px}
.section-block{margin-bottom:36px;break-inside:avoid}
.section-title{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B89B5E;border-bottom:1px solid #B89B5E44;padding-bottom:8px;margin-bottom:20px}
.q-wrap{margin-bottom:18px}
.q-label{font-size:10px;color:#B89B5E;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.q-answer{font-size:12px;color:#253142;background:#fff;border-left:3px solid #B89B5E;padding:10px 14px;border-radius:0 6px 6px 0;line-height:1.7;min-height:36px}
.footer{border-top:1px solid #B89B5E44;padding-top:16px;text-align:center;font-size:10px;color:#A5948A;letter-spacing:2px;text-transform:uppercase;margin-top:48px}
@media print{body{background:white}.page{padding:24px}}
</style></head><body>
<div class="page">
  <div class="header">
    <div><h1>Ana Fachone</h1><p>Marketing Digital</p></div>
    <div class="header-badge">Briefing de Cliente</div>
  </div>
  <div class="meta">
    <span>Cliente: <strong style="color:#253142">${name}</strong></span>
    <span>Data: ${date}</span>
  </div>
  ${body}
  <div class="footer">Ana Fachone Marketing Digital</div>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`)
  win.document.close()
}

export default function Page() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [chips, setChips] = useState<Record<string, string[]>>({})
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function setAnswer(key: string, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function toggleChip(key: string, option: string) {
    setChips(prev => {
      const current = prev[key] || []
      const next = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option]
      setAnswer(key, next.join(', '))
      return { ...prev, [key]: next }
    })
  }

  const totalFields = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0)
  const filledCount = Object.values(answers).filter(v => v && v.trim()).length

  async function submit() {
    if (!answers.nome) {
      setMessage('Preencha ao menos o nome do cliente antes de enviar.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setMessage('Salvando…')
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('success')
        setMessage('Briefing salvo com sucesso!')
        setSubmitted(true)
      } else {
        setStatus('error')
        setMessage('Erro ao salvar. Tente novamente.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  const section = SECTIONS[currentIdx]

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: CREAM, padding: '20px clamp(12px, 4vw, 20px)' }}>
        <div style={{ maxWidth: 480, width: '100%', background: DARK, borderRadius: 16, padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)', textAlign: 'center', border: `1px solid ${GOLD}44` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Briefing Enviado!</div>
          <p style={{ color: `${GOLD}99`, fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
            Obrigado por preencher o briefing. As informações foram salvas e Ana Fachone entrará em contato em breve.
          </p>
          <button
            onClick={() => openPdf(answers)}
            style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}`, color: GOLD, padding: '10px 20px', borderRadius: 6, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'sans-serif' }}
          >
            Baixar PDF ↗
          </button>
        </div>
      </div>
    )
  }

  const hPad = 'clamp(12px, 4vw, 20px)'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: CREAM, padding: `24px ${hPad}` }}>
      <div style={{ width: '100%', maxWidth: 680, background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${GOLD}44`, boxShadow: '0 4px 32px rgba(37,49,66,0.08)' }}>

        {/* Header */}
        <div style={{ background: DARK, padding: `16px ${hPad}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
            <path d="M74 18 A34 34 0 1 0 88 64" stroke="#B89B5E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <text x="10" y="76" fontFamily="Georgia,serif" fontSize="62" fill="#B89B5E">A</text>
            <text x="46" y="71" fontFamily="Georgia,serif" fontSize="48" fill="#B89B5E">F</text>
            <circle cx="38" cy="75" r="3.5" fill="#B89B5E" />
          </svg>
          <div style={{ width: 1, height: 28, background: GOLD, opacity: 0.4 }} />
          <div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>Ana Fachone</div>
            <div style={{ fontSize: 8, letterSpacing: 3, color: `${GOLD}77`, textTransform: 'uppercase', marginTop: 1 }}>Marketing Digital</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 20, padding: '3px 10px', color: GOLD, fontSize: 9, letterSpacing: 1 }}>
              {filledCount}/{totalFields} campos
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: DARK, padding: `0 ${hPad} 12px`, display: 'flex', gap: 3 }}>
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIdx(i)}
              style={{
                flex: 1, height: 3, borderRadius: 2, cursor: 'pointer',
                background: i < currentIdx ? GOLD : i === currentIdx ? `${GOLD}88` : `${GOLD}22`,
                transition: 'background .3s',
              }}
            />
          ))}
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', background: '#EDE8E0', borderBottom: `1px solid ${GOLD}33`, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              style={{
                padding: '9px 11px', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase',
                color: currentIdx === i ? DARK : GRAY, cursor: 'pointer', background: 'none', border: 'none',
                borderBottom: currentIdx === i ? `2px solid ${GOLD}` : '2px solid transparent',
                fontWeight: currentIdx === i ? 700 : 400, whiteSpace: 'nowrap', fontFamily: 'sans-serif',
              }}
            >
              {s.tab}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ padding: `18px ${hPad} 20px` }}>
          {section.questions.map((q, i) => (
            <div key={i}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ background: DARK, color: GOLD, width: 15, height: 15, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  {q.label}
                </div>

                {q.type === 'input' && (
                  <input
                    value={answers[q.key] || ''}
                    onChange={e => setAnswer(q.key, e.target.value)}
                    placeholder={q.placeholder || ''}
                    style={{ width: '100%', background: '#fff', border: `1px solid ${GOLD}44`, borderRadius: 6, padding: '7px 10px', fontSize: 12, color: DARK, fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                )}

                {q.type === 'textarea' && (
                  <textarea
                    value={answers[q.key] || ''}
                    onChange={e => setAnswer(q.key, e.target.value)}
                    placeholder={q.placeholder || ''}
                    rows={3}
                    style={{ width: '100%', background: '#fff', border: `1px solid ${GOLD}44`, borderRadius: 6, padding: '7px 10px', fontSize: 12, color: DARK, fontFamily: 'sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                )}

                {q.type === 'chips' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {(q.options || []).map(option => {
                      const active = (chips[q.key] || []).includes(option)
                      return (
                        <button
                          key={option}
                          onClick={() => toggleChip(q.key, option)}
                          style={{
                            padding: '5px 11px', border: `1px solid ${active ? DARK : GOLD}44`,
                            borderRadius: 20, fontSize: 10, color: active ? GOLD : GRAY,
                            background: active ? DARK : '#fff', cursor: 'pointer', fontFamily: 'sans-serif',
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              {i < section.questions.length - 1 && (
                <div style={{ borderTop: `1px solid ${GOLD}22`, marginBottom: 14 }} />
              )}
            </div>
          ))}
        </div>

        {/* Status message */}
        {status && (
          <div style={{
            margin: `0 ${hPad} 12px`, padding: '10px 14px', borderRadius: 8,
            background: status === 'success' ? '#1a3a2a' : status === 'error' ? '#3a1a1a' : '#1C2738',
            border: `1px solid ${status === 'success' ? '#4CAF50' : status === 'error' ? '#e57373' : GOLD}44`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {status === 'loading' && (
              <div style={{ width: 14, height: 14, border: `2px solid ${GOLD}44`, borderTop: `2px solid ${GOLD}`, borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            )}
            {status === 'success' && <span style={{ color: '#4CAF50', fontSize: 14 }}>✓</span>}
            {status === 'error' && <span style={{ color: '#e57373', fontSize: 14 }}>✕</span>}
            <div style={{ fontSize: 11, color: status === 'success' ? '#4CAF50' : status === 'error' ? '#e57373' : GOLD }}>
              {message}
            </div>
          </div>
        )}

        {/* Footer navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `10px ${hPad}`, borderTop: `1px solid ${GOLD}22`, background: '#EDE8E0', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            style={{ background: 'none', border: `1px solid ${GOLD}`, color: DARK, padding: '7px 12px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', cursor: currentIdx === 0 ? 'default' : 'pointer', borderRadius: 4, opacity: currentIdx === 0 ? 0.3 : 1, fontFamily: 'sans-serif' }}
          >
            ← Anterior
          </button>
          <button
            onClick={() => openPdf(answers)}
            style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}`, color: DARK, padding: '7px 12px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, fontFamily: 'sans-serif' }}
          >
            PDF ↗
          </button>
          {currentIdx < SECTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(i => i + 1)}
              style={{ background: DARK, border: `1px solid ${GOLD}44`, color: GOLD, padding: '7px 12px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, fontFamily: 'sans-serif' }}
            >
              Próxima →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={status === 'loading'}
              style={{ background: GOLD, border: 'none', color: DARK, padding: '8px 18px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'pointer', borderRadius: 4, fontFamily: 'sans-serif', fontWeight: 700 }}
            >
              {status === 'loading' ? 'Salvando…' : 'Finalizar ✓'}
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
