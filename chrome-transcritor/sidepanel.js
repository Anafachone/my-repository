const $ = (id) => document.getElementById(id);
const SAMPLE_RATE = 16000;
const SEGMENTO_SEG = 25; // a cada ~25 s de áudio gravado, transcreve um trecho

const worker = new Worker("whisper-worker.js", { type: "module" });
const pendentes = new Map();
let proximoId = 1;

worker.onmessage = (e) => {
  const m = e.data;
  if (m.type === "status") setStatus(m.text);
  else if (m.type === "progresso") {
    $("barra").hidden = false;
    $("barra").value = m.pct;
    setStatus(`Baixando modelo (${m.file.split("/").pop()}): ${m.pct}%`);
  } else if (m.type === "resultado") {
    pendentes.get(m.id)?.resolve(m.text);
    pendentes.delete(m.id);
  } else if (m.type === "erro") {
    pendentes.get(m.id)?.reject(new Error(m.error));
    pendentes.delete(m.id);
  }
};

function setStatus(t) {
  $("status").textContent = t;
}

function transcrever(audio) {
  const id = proximoId++;
  return new Promise((resolve, reject) => {
    pendentes.set(id, { resolve, reject });
    worker.postMessage({ type: "transcrever", id, audio, model: $("modelo").value, language: $("idioma").value }, [audio.buffer]);
  });
}

function anexarTexto(t) {
  if (!t) return;
  const ta = $("texto");
  ta.value = ta.value ? `${ta.value}\n${t}` : t;
}

// ---------- Arquivo de áudio ----------
async function decodificarArquivo(file) {
  const bytes = await file.arrayBuffer();
  const ctx = new AudioContext();
  const buf = await ctx.decodeAudioData(bytes);
  await ctx.close();
  const frames = Math.ceil(buf.duration * SAMPLE_RATE);
  const off = new OfflineAudioContext(1, frames, SAMPLE_RATE);
  const src = off.createBufferSource();
  src.buffer = buf;
  src.connect(off.destination);
  src.start();
  const rendered = await off.startRendering();
  return rendered.getChannelData(0).slice();
}

$("arquivo").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  travar(true);
  try {
    setStatus(`Lendo ${file.name}...`);
    const audio = await decodificarArquivo(file);
    setStatus("Transcrevendo (pode demorar em áudios longos)...");
    anexarTexto(await transcrever(audio));
    setStatus("Concluído.");
  } catch (err) {
    setStatus(`Erro: ${err.message}`);
  } finally {
    $("barra").hidden = true;
    e.target.value = "";
    travar(false);
  }
});

// ---------- Gravação (aba ou microfone) ----------
let sessao = null;

function travar(ocupado) {
  for (const id of ["btn-aba", "btn-mic", "arquivo"]) $(id).disabled = ocupado;
}

async function obterStream(origem) {
  if (origem === "mic") {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDismissedError") {
        await chrome.tabs.create({ url: chrome.runtime.getURL("mic-permission.html") });
        throw new Error("Permita o microfone na aba que foi aberta e clique em gravar de novo.");
      }
      throw err;
    }
  }
  const r = await chrome.runtime.sendMessage({ type: "novo-stream-id" });
  if (!r?.ok) throw new Error(r?.error ?? "Não foi possível capturar a aba.");
  return navigator.mediaDevices.getUserMedia({
    audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: r.streamId } },
    video: false,
  });
}

async function iniciar(origem) {
  travar(true);
  try {
    const stream = await obterStream(origem);
    const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
    await ctx.audioWorklet.addModule("pcm-worklet.js");
    const fonte = ctx.createMediaStreamSource(stream);
    const coletor = new AudioWorkletNode(ctx, "pcm-collector");
    fonte.connect(coletor);
    // A captura de aba silencia a aba; religa o som para o usuário continuar ouvindo.
    if (origem === "aba") fonte.connect(ctx.destination);

    sessao = { stream, ctx, blocos: [], amostras: 0, fila: Promise.resolve(), parando: false };
    coletor.port.onmessage = (e) => {
      sessao.blocos.push(e.data);
      sessao.amostras += e.data.length;
      if (sessao.amostras >= SEGMENTO_SEG * SAMPLE_RATE) enviarSegmento();
    };
    $("btn-parar").disabled = false;
    setStatus(origem === "aba" ? "Gravando o áudio da aba..." : "Gravando o microfone...");
  } catch (err) {
    setStatus(`Erro: ${err.message}`);
    travar(false);
  }
}

function enviarSegmento() {
  const s = sessao;
  if (!s || s.amostras < SAMPLE_RATE) return; // ignora menos de 1 s
  const audio = new Float32Array(s.amostras);
  let off = 0;
  for (const b of s.blocos) {
    audio.set(b, off);
    off += b.length;
  }
  s.blocos = [];
  s.amostras = 0;
  s.fila = s.fila
    .then(() => transcrever(audio))
    .then(anexarTexto)
    .catch((err) => setStatus(`Erro: ${err.message}`));
}

async function parar() {
  const s = sessao;
  if (!s) return;
  $("btn-parar").disabled = true;
  setStatus("Finalizando...");
  s.stream.getTracks().forEach((t) => t.stop());
  enviarSegmento();
  await s.fila;
  await s.ctx.close();
  sessao = null;
  $("barra").hidden = true;
  setStatus("Concluído.");
  travar(false);
}

$("btn-aba").addEventListener("click", () => iniciar("aba"));
$("btn-mic").addEventListener("click", () => iniciar("mic"));
$("btn-parar").addEventListener("click", parar);

// ---------- Texto ----------
$("btn-copiar").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("texto").value);
  setStatus("Copiado.");
});
$("btn-baixar").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([$("texto").value], { type: "text/plain;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "transcricao.txt" });
  a.click();
  URL.revokeObjectURL(url);
});
$("btn-limpar").addEventListener("click", () => {
  $("texto").value = "";
  $("resultado-claude").value = "";
});

// ---------- Claude (opcional, só texto) ----------
const PROMPTS = {
  corrigir:
    "Você recebe a transcrição automática de um áudio. Corrija pontuação, acentuação e erros evidentes de reconhecimento. Não resuma, não acrescente informações e não altere o sentido. Responda apenas com o texto corrigido.",
  resumir:
    "Você recebe a transcrição automática de um áudio. Resuma em tópicos curtos, apenas com o que foi dito, sem acrescentar informações. Responda apenas com os tópicos.",
};

chrome.storage.local.get(["chaveClaude", "modeloClaude"]).then((v) => {
  if (v.chaveClaude) $("chave").value = v.chaveClaude;
  if (v.modeloClaude) $("claude-modelo").value = v.modeloClaude;
});

$("btn-claude").addEventListener("click", async () => {
  const texto = $("texto").value.trim();
  const chave = $("chave").value.trim();
  const modelo = $("claude-modelo").value.trim();
  if (!texto) return setStatus("Não há texto para enviar.");
  if (!chave) return setStatus("Informe a chave da API.");
  await chrome.storage.local.set({ chaveClaude: chave, modeloClaude: modelo });

  $("btn-claude").disabled = true;
  setStatus("Enviando ao Claude...");
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": chave,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: modelo,
        max_tokens: 16000,
        output_config: { effort: "low" },
        system: PROMPTS[$("acao").value],
        messages: [{ role: "user", content: texto }],
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
    if (data.stop_reason === "refusal") throw new Error("O Claude recusou este conteúdo.");
    $("resultado-claude").value = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    setStatus("Concluído.");
  } catch (err) {
    setStatus(`Erro: ${err.message}`);
  } finally {
    $("btn-claude").disabled = false;
  }
});
