// Ao clicar no ícone: guarda a aba alvo, gera o ID do stream de áudio da aba
// (precisa do gesto do usuário) e abre o painel lateral.
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    let streamId = null;
    try {
      streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
    } catch (err) {
      // Páginas como chrome:// não podem ser capturadas; o painel ainda serve para microfone e arquivos.
      console.warn("Captura da aba indisponível:", err.message);
    }
    await chrome.storage.session.set({
      tabInfo: { tabId: tab.id, title: tab.title ?? "", streamId, createdAt: Date.now() },
    });
  } catch (err) {
    console.error("Falha ao abrir o painel:", err);
  }
});

// O painel pede um novo streamId quando o anterior expira (válido por poucos segundos).
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "novo-stream-id") return false;
  (async () => {
    try {
      const { tabInfo } = await chrome.storage.session.get("tabInfo");
      if (!tabInfo) throw new Error("Clique no ícone da extensão na aba que deseja capturar.");
      const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabInfo.tabId });
      sendResponse({ ok: true, streamId });
    } catch (err) {
      sendResponse({ ok: false, error: err.message });
    }
  })();
  return true;
});
