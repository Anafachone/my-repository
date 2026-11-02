# Transcritor de Áudio (extensão Chrome)

Transcreve o áudio da aba atual, o microfone ou arquivos de áudio. A transcrição usa Whisper rodando localmente no navegador (transformers.js), então o áudio não sai do computador.

## Instalar para testar

1. Abra `chrome://extensions` e ative o **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação** e escolha esta pasta (`chrome-transcritor`).
3. Abra a aba com o áudio, clique no ícone da extensão e use o painel lateral.

## Uso

- **Gravar áudio da aba**: clique no ícone da extensão na aba desejada e depois em "Gravar áudio da aba".
- **Gravar microfone**: se o navegador não mostrar o pedido de permissão, uma aba de permissão é aberta.
- **Arquivo**: mp3, wav, ogg, m4a, opus. O arquivo é decodificado no próprio navegador.
- Na gravação, a transcrição é feita em trechos de cerca de 25 segundos.
- Na primeira vez, o modelo escolhido (tiny, base ou small) é baixado do Hugging Face e fica em cache.

## Claude (opcional)

A API do Claude não recebe áudio, por isso não transcreve. Ela é usada apenas sobre o texto já transcrito, para corrigir pontuação ou resumir. Informe a chave no painel; ela fica salva só neste navegador (`chrome.storage.local`). O modelo padrão é `claude-opus-5-5` e pode ser trocado no painel.

## Limitações conhecidas

- Não testado ainda com a captura real de aba e microfone no Chrome. Foi verificado apenas que a extensão carrega, o painel abre e o worker inicia o carregamento do modelo.
- Transcrição em CPU (WASM, 1 thread): modelos maiores são lentos.
- Páginas internas do Chrome (`chrome://`) não podem ser capturadas.
- A pasta `vendor/` (cerca de 22 MB) contém o runtime do transformers.js e o WASM do ONNX.
