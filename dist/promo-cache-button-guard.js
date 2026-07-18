(() => {
  'use strict';

  const BUILD_ID = 'WORKER-AUTH-20260718-0630';
  const STATUS_ID = 'promo-cache-click-status';
  const BADGE_ID = 'promo-cache-build-badge';
  const HELPER_ID = 'promo-cache-direct-button';
  let activeUntil = 0;
  let activeSince = 0;
  let lastButton = null;

  const cacheButton = () => [...document.querySelectorAll('button')].find(button => {
    const text = String(button.textContent || '').trim();
    return text.includes('จัดกลุ่มใหม่จากแคช') || text.includes('ใช้ไฟล์ทดสอบล่าสุด');
  }) || null;

  const progressOverlay = () => {
    const overlay = document.getElementById('promo-cache-progress-overlay');
    return overlay && getComputedStyle(overlay).display !== 'none' ? overlay : null;
  };

  const progressText = () => {
    const overlay = progressOverlay();
    if (overlay) return String(overlay.textContent || '').replace(/\s+/g, ' ').trim();
    const meta = document.querySelector('.progress-meta');
    return String(meta?.textContent || '').replace(/\s+/g, ' ').trim();
  };

  const visibleWorkerError = () => {
    const text = String(document.body?.innerText || '');
    return text.match(/\b(grouping_worker_[a-z0-9_:./-]+)/i)?.[1] || '';
  };

  const showStatus = (message, tone = 'info') => {
    let element = document.getElementById(STATUS_ID);
    if (!element) {
      element = document.createElement('div');
      element.id = STATUS_ID;
      Object.assign(element.style, {
        position: 'fixed',
        left: '10px',
        right: '10px',
        top: '10px',
        zIndex: '2147483647',
        padding: '11px 13px',
        borderRadius: '12px',
        fontFamily: 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        fontSize: '13px',
        fontWeight: '800',
        lineHeight: '1.45',
        boxShadow: '0 12px 38px rgba(15,23,42,.25)',
        pointerEvents: 'none',
      });
      document.body.appendChild(element);
    }
    const palette = tone === 'error'
      ? { background: '#fff1f2', color: '#9f1239', border: '#fda4af' }
      : tone === 'ok'
        ? { background: '#ecfdf5', color: '#166534', border: '#86efac' }
        : { background: '#eff6ff', color: '#1e40af', border: '#93c5fd' };
    element.style.background = palette.background;
    element.style.color = palette.color;
    element.style.border = `1px solid ${palette.border}`;
    element.textContent = `${BUILD_ID} · ${message}`;
  };

  const releaseActive = (message, tone = 'ok') => {
    activeUntil = 0;
    activeSince = 0;
    if (lastButton) lastButton.disabled = false;
    if (message) showStatus(message, tone);
  };

  const installBadge = button => {
    let badge = document.getElementById(BADGE_ID);
    if (!badge) {
      badge = document.createElement('small');
      badge.id = BADGE_ID;
      Object.assign(badge.style, {
        display: 'block',
        marginTop: '7px',
        color: '#0f766e',
        fontWeight: '850',
      });
      const container = button.closest('div[style*="flex-wrap"]')?.parentElement || button.parentElement;
      container?.appendChild(badge);
    }
    badge.textContent = `Build ${BUILD_ID} · ตรวจ click และ Worker load`;
  };

  const installHelper = button => {
    if (document.getElementById(HELPER_ID)) return;
    const helper = document.createElement('button');
    helper.id = HELPER_ID;
    helper.type = 'button';
    helper.className = 'btn soft';
    helper.textContent = 'เปิดแคชโดยตรง (ตรวจปุ่ม)';
    helper.style.border = '1px solid #0f766e';
    helper.addEventListener('click', () => {
      const target = cacheButton();
      if (!target) {
        showStatus('ไม่พบปุ่มแคชใน React UI', 'error');
        return;
      }
      if (Date.now() < activeUntil) {
        const error = visibleWorkerError();
        if (error && !progressOverlay() && !target.disabled) {
          releaseActive(`งานก่อนหน้าจบด้วยข้อผิดพลาด · ${error} · ปลดล็อกแล้ว`, 'error');
        } else {
          showStatus('ระบบรับคำสั่งก่อนหน้าแล้ว กำลังรอผล', 'info');
          return;
        }
      }
      target.disabled = false;
      target.click();
    });
    button.parentElement?.appendChild(helper);
  };

  const inspect = () => {
    const button = cacheButton();
    if (!button) return;
    lastButton = button;
    button.dataset.promoCacheAction = '1';
    button.type = 'button';
    installBadge(button);
    installHelper(button);

    const now = Date.now();
    const running = now < activeUntil;
    const elapsed = activeSince ? now - activeSince : 0;
    const overlay = progressOverlay();
    const error = visibleWorkerError();
    if (running && elapsed > 1200 && !button.disabled && !overlay) {
      releaseActive(error ? `งานจบด้วยข้อผิดพลาด · ${error} · กดใหม่ได้ทันที` : 'งานก่อนหน้าจบแล้ว · กดใหม่ได้ทันที', error ? 'error' : 'ok');
      return;
    }
    if (button.disabled && !running) {
      button.disabled = false;
      button.dataset.guardUnlocked = '1';
      button.title = 'ตัวตรวจปุ่มปลดล็อกแล้ว ระบบจะตรวจ IndexedDB จริงหลังคลิก';
    }
  };

  document.addEventListener('pointerdown', event => {
    const button = event.target instanceof Element ? event.target.closest('button[data-promo-cache-action="1"]') : null;
    if (!button) return;
    showStatus(`ตรวจพบการแตะปุ่ม · disabled=${button.disabled ? 'yes' : 'no'} · กำลังส่งเข้า React`, 'info');
  }, true);

  document.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest('button[data-promo-cache-action="1"]') : null;
    if (!button) return;
    activeSince = Date.now();
    activeUntil = activeSince + 130000;
    const before = progressText();
    showStatus('รับ click แล้ว · รอ React เปิด IndexedDB', 'info');
    window.setTimeout(() => {
      const after = progressText();
      const changed = after && after !== before;
      if (changed || progressOverlay()) {
        showStatus(`React เริ่มทำงานแล้ว · ${after || 'กำลังเปิดแคช'}`, 'ok');
      } else {
        releaseActive('React ไม่เปลี่ยนสถานะภายใน 0.5 วินาที · ปุ่มถูกปลดล็อกให้ลองอีกครั้ง', 'error');
      }
    }, 500);
  }, true);

  const observer = new MutationObserver(inspect);
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled'] });
  inspect();
  window.setInterval(inspect, 1000);
})();
