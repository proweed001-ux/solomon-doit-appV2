(() => {
  'use strict';

  const CORE_URL = 'https://cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2@a5ab43603f9e6893c7958a85906f224594aee21d/dist/assets/pro-core-v4.js';
  const SELF_SRC = document.currentScript?.src || location.href;
  const ASSET_BASE = new URL('.', SELF_SRC).href;
  const VERSION = '1018';

  function assetUrl(fileName) {
    return `${ASSET_BASE}${fileName}?v=${VERSION}`;
  }

  function loadCss(href) {
    if ([...document.styleSheets].some(sheet => sheet.href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`โหลดสคริปต์ไม่สำเร็จ: ${src}`));
      document.head.appendChild(script);
    });
  }

  function patchLegacyCore(code) {
    const oldDoneBranch = "if(mode==='done'){const out=[];pool.forEach(g=>{const qty=manualSent(g);if(qty>0)out.push({name:g.sku,qty,rawAmt:qty*N(g.unit),netAmt:qty*N(g.netUnit)})});simpleTable('จัดแล้ว '+F(out.length)+' รายการ',['#','สินค้า','จำนวนที่คีย์','ยอดดิบ','ยอดสุทธิ','รวม VAT'],out.map((l,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(l.name)+'</td><td>'+F(l.qty)+'</td><td>'+B(l.rawAmt)+'</td><td>'+B(l.netAmt)+'</td><td>'+B((N(l.netAmt)||N(l.rawAmt))*1.07)+'</td></tr>').join(''));return}";
    const newDoneBranch = "if(mode==='done'){if(window.DOIT_PRO_PRINT_STORE_BILLS&&window.DOIT_PRO_PRINT_STORE_BILLS.renderDoneFromCore){window.DOIT_PRO_PRINT_STORE_BILLS.renderDoneFromCore();return}simpleTable('จัดแล้ว 0 รายการ',['#','สินค้า','จำนวนที่ส่งทั้งหมด','ราคารวมส่ง'],'<tr><td colspan=\"4\" class=\"empty\">ระบบบิลเตรียมปริ้นยังโหลดไม่เสร็จ</td></tr>');return}";
    const oldTeleRender = `function renderTele(){const bs=teleBills();$('#teleBtn').textContent='บิล Telesale ('+F(bs.length)+')';$('#drawerBody').innerHTML=bs.length?bs.map(b=>'<div class="teleBill"><div class="teleBillHead"><b>ร้าน: '+E(b.store)+'</b><br><small>บิล: '+E(b.inv)+' · วันที่ '+E(dlabel(b.date))+' · Tele: '+E(b.tele)+'</small></div><table class="teleTbl"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>'+b.lines.map(r=>'<tr><td>'+E(r.sku)+'</td><td>'+F(r.qty)+'</td><td>'+B(r.rawAmt)+'</td><td>'+B((N(r.netAmt)||N(r.rawAmt))*1.07)+'</td></tr>').join('')+'</tbody></table></div>').join(''):'<div class="empty">ไม่พบ Telesale ตามตัวเลือกที่ติ๊ก</div>'}`;
    const newTeleRender = `function renderTele(){const bs=teleBills();$('#teleBtn').textContent='บิล Telesale ('+F(bs.length)+')';$('#drawerBody').innerHTML=bs.length?bs.map(b=>{const rawTotal=N(b.amt),vatTotal=b.lines.reduce((s,r)=>s+(N(r.netAmt)||N(r.rawAmt))*1.07,0);return '<div class="teleBill"><div class="teleBillHead"><b>ร้าน: '+E(b.store)+'</b><br><small>บิล: '+E(b.inv)+' · วันที่ '+E(dlabel(b.date))+' · Tele: '+E(b.tele)+'</small></div><table class="teleTbl"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>'+b.lines.map(r=>'<tr><td>'+E(r.sku)+'</td><td>'+F(r.qty)+'</td><td>'+B(r.rawAmt)+'</td><td>'+B((N(r.netAmt)||N(r.rawAmt))*1.07)+'</td></tr>').join('')+'<tr class="totalRow"><td>รวมทั้งหมด</td><td>'+F(b.qty)+'</td><td>'+B(rawTotal)+'</td><td>'+B(vatTotal)+'</td></tr></tbody></table></div>'}).join(''):'<div class="empty">ไม่พบ Telesale ตามตัวเลือกที่ติ๊ก</div>'}`;

    let patched = code;
    if (patched.includes(oldDoneBranch)) patched = patched.replace(oldDoneBranch, newDoneBranch);
    else console.warn('ไม่พบ done-mode branch เดิม จึงไม่ได้ patch renderMode(done)');

    if (patched.includes(oldTeleRender)) patched = patched.replace(oldTeleRender, newTeleRender);
    else console.warn('ไม่พบ renderTele เดิม จึงไม่ได้ patch บิล Telesale');

    return patched;
  }

  async function loadLegacyCore() {
    const response = await fetch(CORE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`โหลด Pro core เดิมไม่ได้: ${response.status}`);
    const code = patchLegacyCore(await response.text());
    (0, eval)(code);
  }

  async function boot() {
    loadCss(assetUrl('pro-print.css'));
    await loadScript(assetUrl('pro-print-store-bills.js'));
    await loadLegacyCore();
    await loadScript(assetUrl('pro-print-mode-fixes.js'));
    await loadScript(assetUrl('pro-print-column-widths.js'));
    await loadScript(assetUrl('pro-print-a4-pro-fix.js'));
  }

  boot().catch(error => {
    console.error(error);
    document.body.innerHTML = '<div style="font-family:system-ui;padding:18px;color:#991b1b"><b>โหลดหน้า Pro ไม่สำเร็จ</b><br>' + String(error.message || error) + '</div>';
  });
})();
