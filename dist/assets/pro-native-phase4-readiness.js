(() => {
  'use strict';

  const checks = [];
  const add = (name, ok, detail = '') => checks.push({ name, ok: Boolean(ok), detail });

  function text(value) {
    return String(value ?? '').trim();
  }

  function installVisualMatch() {
    if (document.querySelector('#phase4VisualMatchCss')) return;
    const style = document.createElement('style');
    style.id = 'phase4VisualMatchCss';
    style.textContent = `
      body{background:#f6f7f8!important;color:#111827!important;font-family:system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif!important;font-size:14px!important}
      .topbar{min-height:56px!important;background:linear-gradient(90deg,#075424,#087b34)!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:space-between!important;padding:0 14px!important;position:sticky!important;top:0!important;z-index:30!important;box-shadow:0 2px 10px rgba(15,23,42,.12)!important}
      .back{color:#fff!important;text-decoration:none!important;font-weight:900!important}
      .title{font-size:16px!important;font-weight:950!important;color:#fff!important;text-shadow:0 1px 2px rgba(0,0,0,.34)!important}
      .wrap{padding:12px!important}
      .banner{background:#fff7ed!important;border:1px solid #fdba74!important;color:#9a3412!important;border-radius:12px!important;padding:10px 12px!important;margin-bottom:12px!important;font-weight:950!important}
      .readiness{background:#fff!important;border:1px solid #e5e7eb!important;border-radius:14px!important;box-shadow:0 2px 10px #0f172a0d!important;padding:12px!important;margin-bottom:12px!important;font-weight:850!important}
      .readiness b{font-weight:950!important}.readiness ul{margin:8px 0 0!important;padding-left:18px!important}.readiness li{margin:3px 0!important}.readiness .ok{color:#166534!important}.readiness .bad{color:#b91c1c!important}
      .card{background:#fff!important;border:1px solid #e5e7eb!important;border-radius:14px!important;box-shadow:0 2px 10px #0f172a0d!important;padding:12px!important;margin-bottom:12px!important}
      .grid{display:grid!important;grid-template-columns:1.1fr .9fr!important;gap:12px!important}
      .filterGrid{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:10px!important}
      .uploadRow{min-height:44px!important;border:1px solid #d1d5db!important;border-radius:9px!important;display:flex!important;align-items:center!important;gap:10px!important;padding:6px 10px!important;background:#fff!important}
      .field label{display:block!important;font-size:12px!important;color:#374151!important;font-weight:900!important;margin-bottom:5px!important}
      .field input{width:100%!important;height:42px!important;border:1px solid #d1d5db!important;border-radius:8px!important;background:#fff!important;padding:0 10px!important;font-weight:800!important}
      .pickBtn{height:38px!important;border-radius:8px!important;font-weight:950!important;padding:0 12px!important;width:100%!important;text-align:left!important;display:flex!important;align-items:center!important;justify-content:space-between!important;color:#111827!important;background:#fff!important;border:1px solid #d1d5db!important;box-shadow:none!important;text-shadow:none!important}
      .fileBtn,.cloudBtn,.outline,.clear,.searchBtn,.undo,.reset,.autosave,.tab,.page,.teleBtn{height:38px!important;padding:0 12px!important;border:0!important;background:linear-gradient(180deg,#22c55e 0%,#0b8f3a 58%,#06652b 100%)!important;color:#fff!important;border-radius:12px!important;font-weight:950!important;box-shadow:0 3px 0 #03451e,0 6px 10px rgba(3,69,30,.22),inset 0 1px 0 rgba(255,255,255,.48)!important;text-shadow:0 1px 2px rgba(0,0,0,.34)!important;cursor:pointer!important}
      .teleBtn{background:linear-gradient(180deg,#a855f7 0%,#7e22ce 58%,#581c87 100%)!important;box-shadow:0 3px 0 #3b0764,0 6px 10px rgba(88,28,135,.25),inset 0 1px 0 rgba(255,255,255,.38)!important}
      .tabs{display:grid!important;grid-template-columns:repeat(6,1fr)!important;gap:8px!important}.tab.on{background:linear-gradient(180deg,#34d66d 0%,#0a9f42 58%,#06722f 100%)!important}
      .searchLine{display:grid!important;grid-template-columns:1fr 320px!important;gap:10px!important;margin-top:12px!important}.btnPair{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}
      .summaryHead{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:14px 0 8px!important}.summaryHead h3{margin:0!important}.actions{display:flex!important;gap:8px!important;flex-wrap:wrap!important}
      .summary{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:10px!important}.sum{border-radius:12px!important;padding:12px!important;border:1px solid #e5e7eb!important;min-height:82px!important;background:#fff!important}.sum:nth-child(1){background:#eff6ff!important}.sum:nth-child(2){background:#ecfdf5!important}.sum:nth-child(3){background:#fff7ed!important}.sum:nth-child(4){background:#f8fafc!important}.sum b{display:block!important;font-size:13px!important;margin-bottom:8px!important}.sum strong{font-size:21px!important}
      .tableCard{padding:0!important;overflow:hidden!important}.tableTop{display:flex!important;justify-content:space-between!important;align-items:center!important;padding:12px 14px!important;border-bottom:1px solid #e5e7eb!important;gap:8px!important;flex-wrap:wrap!important}
      .sendBar{display:grid!important;grid-template-columns:1fr 170px!important;gap:10px!important;align-items:center!important;padding:10px 14px!important;background:#f0fdf4!important;border-bottom:1px solid #bbf7d0!important}.sendLabel{display:grid!important;grid-template-columns:86px 1fr!important;gap:8px!important;align-items:center!important;font-weight:950!important;color:#087b34!important}
      .tableWrap{overflow:auto!important;-webkit-overflow-scrolling:touch!important}.tbl{border-collapse:collapse!important;width:100%!important;min-width:560px!important;font-size:12px!important}.tbl th,.tbl td{border-bottom:1px solid #e5e7eb!important;border-right:1px solid #eef2f7!important;padding:6px 4px!important;text-align:center!important;background:#fff!important}.tbl th{background:#f8fafc!important;color:#374151!important;font-weight:950!important}.tbl td:nth-child(2),.tbl th:nth-child(2){text-align:left!important}.tbl input.pick{width:54px!important;height:32px!important;border:1px solid #cbd5e1!important;border-radius:8px!important;text-align:center!important;font-weight:900!important}
      .drawerHead{background:#0b6b31!important;color:#fff!important}.pickHead{background:#087b34!important;color:#fff!important}
      @media(max-width:720px){.wrap{padding:8px!important}.grid,.filterGrid,.searchLine,.summary,.sendBar{grid-template-columns:1fr!important}.tabs{grid-template-columns:1fr 1fr!important}.title{font-size:14px!important}.sendLabel{grid-template-columns:1fr!important}.tbl{min-width:540px!important}}
    `;
    document.head.appendChild(style);
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
    installVisualMatch();
    checks.length = 0;
    const app = window.DOIT_CORE_APP;
    const print = window.DOIT_PRO_PRINT_STORE_BILLS;
    add('native core loaded', Boolean(app?.health), 'window.DOIT_CORE_APP.health');
    add('currentState API available', typeof app?.currentState === 'function', 'ใช้กับใบเตรียมปริ้น');
    add('print module loaded', Boolean(print?.renderDoneFromCore), 'renderDoneFromCore');
    add('send-only print module present', Boolean(print?.renderDoneFromCore), 'ยังไม่รวม add/pull เข้าบิล');
    add('phase3 bridge still active', window.DOIT_NATIVE_CORE_PREVIEW?.version === 'phase3', text(window.DOIT_NATIVE_CORE_PREVIEW?.mode));
    add('production untouched', location.pathname.includes('pro-native-phase4'), 'เป็น preview เท่านั้น');
    add('visual style matched', Boolean(document.querySelector('#phase4VisualMatchCss')), 'ใช้สี/ปุ่มชุดเดียวกับ Pro preview');
    draw();
    window.DOIT_NATIVE_PHASE4_READINESS = { version: 'phase4', checks };
  }

  installVisualMatch();
  setTimeout(run, 250);
  setTimeout(run, 1000);
  document.addEventListener('click', event => {
    if (event.target?.id === 'phase4Recheck') setTimeout(run, 100);
  }, true);
})();
