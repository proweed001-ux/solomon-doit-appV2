(() => {
  'use strict';

  const SELF_SRC = document.currentScript?.src || location.href;
  const ASSET_BASE = new URL('.', SELF_SRC).href;
  const VERSION = '1028-native';
  const LEGACY_SAFE_VERSION = '1027';
  const IS_PERFORMANCE_ROUTE = location.pathname === '/performance';

  function assetUrl(fileName, version = VERSION) {
    return `${ASSET_BASE}${fileName}?v=${version}`;
  }

  function loadCss(href) {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === src);
      if (existing?.dataset.loaded === 'true') return resolve();
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error(`โหลด ${src} ไม่สำเร็จ`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.doitNativeStack = 'true';
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error(`โหลด ${src} ไม่สำเร็จ`));
      document.body.appendChild(script);
    });
  }

  function showBootError(error) {
    const message = String(error?.message || error || 'ไม่ทราบสาเหตุ');
    const box = document.createElement('div');
    box.style.cssText = 'margin:12px;padding:12px;border:1px solid #fecaca;background:#fef2f2;color:#991b1b;border-radius:12px;font-weight:900;white-space:pre-wrap';
    box.textContent = `โหลด Pro Native Core ไม่สำเร็จ\n${message}`;
    const main = document.querySelector('main') || document.body;
    main.prepend(box);
  }

  function installFuelBillExactHitGuard() {
    if (window.__fuelBillExactHitGuardInstalled) return;
    window.__fuelBillExactHitGuardInstalled = true;

    let exactUnlocked = false;
    let count = 0;
    let last = 0;

    function hide() {
      if (exactUnlocked) return;
      count = 0;
      last = 0;
      document.body.classList.remove('fuelSecretOn');
      const btn = document.getElementById('fuelBillBtn');
      if (btn) btn.style.display = 'none';
    }

    function show() {
      exactUnlocked = true;
      document.body.classList.add('fuelSecretOn');
      const btn = document.getElementById('fuelBillBtn');
      if (btn) btn.style.display = '';
    }

    function textOf(el) {
      return String(el?.innerText || el?.textContent || '').trim();
    }

    function getHitArea() {
      const card = document.querySelector('.uploadCard');
      if (!card) return null;
      const title = [...card.querySelectorAll('h1,h2,h3,h4')].find(el => {
        const t = textOf(el);
        return t.includes('☁') && t.includes('อัปโหลด') && t.includes('DOIT');
      });
      if (!title) return null;
      let hit = title.querySelector('#fuelSecretHitArea');
      if (!hit) {
        hit = document.createElement('span');
        hit.id = 'fuelSecretHitArea';
        hit.style.display = 'inline';
        hit.style.cursor = 'pointer';
        hit.textContent = title.textContent;
        title.textContent = '';
        title.appendChild(hit);
      }
      return hit;
    }

    function insideHitArea(event) {
      const hit = getHitArea();
      if (!hit) return false;
      const x = event.clientX;
      const y = event.clientY;
      return [...hit.getClientRects()].some(rect => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
    }

    function handleClick(event) {
      if (!insideHitArea(event)) {
        if (!exactUnlocked) setTimeout(hide, 0);
        return;
      }
      if (exactUnlocked) return;
      const now = Date.now();
      count = now - last < 2500 ? count + 1 : 1;
      last = now;
      if (count >= 5) show();
    }

    document.addEventListener('click', handleClick, true);
    document.addEventListener('click', () => {
      if (!exactUnlocked) setTimeout(hide, 0);
    }, false);

    const boot = () => {
      hide();
      getHitArea();
      if (document.body) {
        new MutationObserver(() => {
          if (!exactUnlocked && document.body.classList.contains('fuelSecretOn')) hide();
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
  }

  function boot() {
    window.DOIT_PRO_CORE_BOOT = {
      version: VERSION,
      mode: 'native-stack-bootstrap',
      productionCandidate: true,
      legacyWrapperRemoved: true,
      performanceRouteFastBoot: true
    };

    installFuelBillExactHitGuard();
    loadCss(assetUrl('pro-print.css', LEGACY_SAFE_VERSION));

    return loadScript(assetUrl('pro-results-mode.js'))
      .then(() => {
        if (IS_PERFORMANCE_ROUTE) return;
        const stack = [
          assetUrl('pro-print-store-bills.js', LEGACY_SAFE_VERSION),
          assetUrl('pro-native-core.js'),
          assetUrl('pro-native-core-overrides.js'),
          assetUrl('pro-print-mode-fixes.js', LEGACY_SAFE_VERSION),
          assetUrl('pro-print-column-widths.js', LEGACY_SAFE_VERSION),
          assetUrl('pro-print-a4-pro-fix.js', LEGACY_SAFE_VERSION)
        ];
        return stack.reduce((promise, src) => promise.then(() => loadScript(src)), Promise.resolve());
      });
  }

  boot().catch(showBootError);
})();
