(async () => {
  const msg = document.getElementById("msg");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    msg.textContent = "Permitido. Esta aba vai fechar; volte ao painel e clique em gravar.";
    setTimeout(() => window.close(), 1500);
  } catch (err) {
    msg.textContent = `Permissão negada: ${err.message}`;
  }
})();
