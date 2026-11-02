// Acumula amostras do canal 0 e as envia ao painel em blocos de ~1 s.
class PcmCollector extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.count = 0;
  }
  process(inputs) {
    const ch = inputs[0]?.[0];
    if (ch) {
      this.buffer.push(new Float32Array(ch));
      this.count += ch.length;
      if (this.count >= sampleRate) {
        const out = new Float32Array(this.count);
        let off = 0;
        for (const b of this.buffer) {
          out.set(b, off);
          off += b.length;
        }
        this.port.postMessage(out, [out.buffer]);
        this.buffer = [];
        this.count = 0;
      }
    }
    return true;
  }
}
registerProcessor("pcm-collector", PcmCollector);
