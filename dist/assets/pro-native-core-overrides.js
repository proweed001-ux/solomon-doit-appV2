(() => {
  'use strict';

  if (window.__DOIT_PRO_NATIVE_OVERRIDES__) return;
  window.__DOIT_PRO_NATIVE_OVERRIDES__ = true;

  const SEND_SELECTOR = '#table input.jdata[data-map="send"]';

  function sendInputs() {
    return [...document.querySelectorAll(SEND_SELECTOR)].filter(input => !input.disabled);
  }

  function refreshSendInputs() {
    sendInputs().forEach((input, index) => {
      input.enterKeyHint = 'next';
      input.tabIndex = 1000 + index;
    });
  }

  function focusSendAt(index) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        refreshSendInputs();
        const inputs = sendInputs();
        const next = inputs[index] || inputs[inputs.length - 1] || inputs[0];
        if (!next) return;
        next.focus({ preventScroll: true });
        next.scrollIntoView({ block: 'center', inline: 'nearest' });
        try { next.select(); } catch {}
      });
    }, 140);
  }

  function nextIndexFor(input) {
    const inputs = sendInputs();
    return Math.max(0, inputs.indexOf(input)) + 1;
  }

  document.addEventListener('change', event => {
    const input = event.target?.closest?.(SEND_SELECTOR);
    if (!input) return;
    focusSendAt(nextIndexFor(input));
  }, true);

  document.addEventListener('keydown', event => {
    const input = event.target?.closest?.(SEND_SELECTOR);
    if (!input || event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, true);

  document.addEventListener('focusin', event => {
    if (event.target?.matches?.(SEND_SELECTOR)) refreshSendInputs();
  }, true);

  const observer = new MutationObserver(refreshSendInputs);
  observer.observe(document.body, { childList: true, subtree: true });
  refreshSendInputs();

  window.DOIT_NATIVE_CORE_PREVIEW = {
    version: 'phase2',
    mode: 'native-core-file-plus-runtime-overrides',
    production: false
  };
})();
