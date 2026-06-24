(() => {
  'use strict';
  if (window.__DOIT_PRO_RESULTS_BUTTON_V2__) return;
  window.__DOIT_PRO_RESULTS_BUTTON_V2__ = true;

  const PERFORMANCE_URL = '/performance';

  function style() {
    if (document.querySelector('#doitResultsButtonStyle')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="doitResultsButtonStyle">
      .resultsModeBtn{position:absolute;right:154px;top:12px;width:112px;height:42px;border:0;background:linear-gradient(180deg,#22c55e 0%,#0b8f3a 58%,#06652b 100%);color:#fff;border-radius:12px;font-size:17px;font-weight:950;box-shadow:0 3px 0 #03451e,0 6px 10px rgba(3,69,30,.22),inset 0 1px 0 rgba(255,255,255,.48);text-shadow:0 1px 2px rgba(0,0,0,.34);cursor:pointer}.uploadCard h3{padding-right:258px}@media(max-width:720px){.resultsModeBtn{right:140px;top:10px;width:96px;height:38px;font-size:15.5px}.uploadCard h3{padding-right:226px}}@media(max-width:390px){.resultsModeBtn{position:static;width:100%;margin:4px 0 8px}.devTeamBtn{position:static!important;width:100%!important;margin-bottom:8px!important}.uploadCard h3{padding-right:0}.uploadCard{display:grid;gap:8px}}
    </style>`);
  }

  function openPerformancePage() {
    window.location.href = PERFORMANCE_URL;
  }

  function injectButton() {
    style();
    const card = document.querySelector('.uploadCard');
    if (!card || document.querySelector('#resultsModeBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'resultsModeBtn';
    btn.type = 'button';
    btn.className = 'resultsModeBtn';
    btn.textContent = 'ผลงาน';
    btn.setAttribute('aria-label', 'เปิดหน้าโหมดผลงาน');
    btn.addEventListener('click', openPerformancePage);
    const dev = card.querySelector('.devTeamBtn');
    if (dev) card.insertBefore(btn, dev);
    else card.prepend(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectButton);
  else injectButton();
  setTimeout(injectButton, 800);
})();
