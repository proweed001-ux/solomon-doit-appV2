(() => {
  'use strict';

  const checks = [];
  const add = (name, ok, detail = '') => checks.push({ name, ok: Boolean(ok), detail });

  function text(value) {
    return String(value ?? '').trim();
  }

  function draw() {
    const box = document.querySelector('#phase4Readiness');
    if (!box) return;
    const bad = checks.filter(item => !item.ok);
    box.innerHTML = [
      `<b>Phase 4 readiness: ${bad.length ? 'ต้องตรวจเพิ่ม' : 'ผ่านเบื้องต้น'}</b>`,
      '<ul>',
      ...checks.map(item => `<li class="${item.ok ? 'ok' : 'bad'}">${item.ok ? '✓' : '✕'} ${item.name}${item.detail ? ` — ${item.detail}` : ''}</li>`),
      '</ul>'
    ].join('');
  }

  function run() {
    checks.length = 0;
    const app = window.DOIT_CORE_APP;
    const print = window.DOIT_PRO_PRINT_STORE_BILLS;
    add('native core loaded', Boolean(app?.health), 'window.DOIT_CORE_APP.health');
    add('currentState API available', typeof app?.currentState === 'function', 'ใช้กับใบเตรียมปริ้น');
    add('print module loaded', Boolean(print?.renderDoneFromCore), 'renderDoneFromCore');
    add('send-only print module present', Boolean(print?.renderDoneFromCore), 'ยังไม่รวม add/pull เข้าบิล');
    add('phase3 bridge still active', window.DOIT_NATIVE_CORE_PREVIEW?.version === 'phase3', text(window.DOIT_NATIVE_CORE_PREVIEW?.mode));
    add('production untouched', location.pathname.includes('pro-native-phase4'), 'เป็น preview เท่านั้น');
    draw();
    window.DOIT_NATIVE_PHASE4_READINESS = { version: 'phase4', checks };
  }

  setTimeout(run, 250);
  setTimeout(run, 1000);
  document.addEventListener('click', event => {
    if (event.target?.id === 'phase4Recheck') setTimeout(run, 100);
  }, true);
})();
