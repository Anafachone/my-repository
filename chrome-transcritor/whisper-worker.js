import { pipeline, env } from "./vendor/transformers.min.js";

// Tudo roda localmente: os arquivos do runtime vêm da extensão e o modelo é baixado
// uma vez do Hugging Face e guardado no cache do navegador.
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.wasmPaths = new URL("./vendor/", import.meta.url).href;
env.backends.onnx.wasm.numThreads = 1; // sem cross-origin isolation, 1 thread é o seguro

let transcriber = null;
let loadedModel = null;

async function carregar(model) {
  if (transcriber && loadedModel === model) return;
  transcriber = null;
  postMessage({ type: "status", text: `Baixando/carregando modelo ${model}...` });
  transcriber = await pipeline("automatic-speech-recognition", model, {
    device: "wasm",
    dtype: "q8",
    progress_callback: (p) => {
      if (p.status === "progress" && p.total) {
        postMessage({ type: "progresso", file: p.file, pct: Math.round((p.loaded / p.total) * 100) });
      }
    },
  });
  loadedModel = model;
  postMessage({ type: "status", text: "Modelo pronto." });
}

self.onmessage = async (e) => {
  const { type, id, model, audio, language } = e.data;
  if (type !== "transcrever") return;
  try {
    await carregar(model);
    const opts = { chunk_length_s: 30, stride_length_s: 5, return_timestamps: false };
    if (language && language !== "auto") {
      opts.language = language;
      opts.task = "transcribe";
    }
    const out = await transcriber(audio, opts);
    postMessage({ type: "resultado", id, text: (out.text ?? "").trim() });
  } catch (err) {
    postMessage({ type: "erro", id, error: String(err?.message ?? err) });
  }
};
