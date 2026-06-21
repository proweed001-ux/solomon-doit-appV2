(() => {
  'use strict';

  function run() {
    const app = window.DOIT_CORE_APP;
    const print = window.DOIT_PRO_PRINT_STORE_BILLS;
    const title = document.querySelector('.topbar .title')?.textContent || document.title;
    window.DOIT_NATIVE_UI_PREVIEW = {
      version: 'phase4-ui',
      nativeCore: Boolean(app?.health),
      currentState: typeof app?.currentState === 'function',
      printModule: Boolean(print?.renderDoneFromCore),
      visualSource: 'dist/pro.html',
      title: String(title || '').trim(),
      production: false
    };
  }

  setTimeout(run, 250);
  setTimeout(run, 1000);
})();
