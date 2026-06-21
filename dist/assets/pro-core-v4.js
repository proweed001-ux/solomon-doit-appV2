(() => {
  'use strict';

  const CORE_URL = 'https://cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2@a5ab43603f9e6893c7958a85906f224594aee21d/dist/assets/pro-core-v4.js';
  const SELF_SRC = document.currentScript?.src || location.href;
  const ASSET_BASE = new URL('.', SELF_SRC).href;
  const VERSION = '1027';

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
    const oldOrderBranch = "if(mode==='order'){const p=group(rows.filter(r=>okDate(r)&&okPs(r)&&okCut(r)&&okBrand(r)&&okType(r)&&okQ(r)));simpleTable('รวม order PS + Telesale '+F(p.length)+' รายการ',['#','สินค้า','จำนวนรวม','ยอดดิบ','ยอดสุทธิ','รวม VAT'],p.map((g,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(g.sku)+'</td><td>'+F(g.qty)+'</td><td>'+B(g.rawAmt)+'</td><td>'+B(g.netAmt)+'</td><td>'+B((N(g.netAmt)||N(g.rawAmt))*1.07)+'</td></tr>').join(''));return}";
    const newOrderBranch = "if(mode==='order'){const p=group(rows.filter(r=>okDate(r)&&okPs(r)&&okCut(r)&&okBrand(r)&&okType(r)&&okQ(r))),rawTotal=p.reduce((s,g)=>s+N(g.rawAmt),0),netTotal=p.reduce((s,g)=>s+N(g.netAmt),0),vatTotal=p.reduce((s,g)=>s+(N(g.netAmt)||N(g.rawAmt))*1.07,0),qtyTotal=p.reduce((s,g)=>s+N(g.qty),0);simpleTable('รวม order PS + Telesale '+F(p.length)+' รายการ · ราคารวม VAT ฿ '+B(vatTotal),['#','สินค้า','จำนวนรวม','ยอดดิบ','ยอดสุทธิ','รวม VAT'],p.map((g,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(g.sku)+'</td><td>'+F(g.qty)+'</td><td>'+B(g.rawAmt)+'</td><td>'+B(g.netAmt)+'</td><td>'+B((N(g.netAmt)||N(g.rawAmt))*1.07)+'</td></tr>').join('')+'<tr class=\"totalRow\"><td colspan=\"2\" class=\"r\">รวมทั้งหมด</td><td>'+F(qtyTotal)+'</td><td>'+B(rawTotal)+'</td><td>'+B(netTotal)+'</td><td>'+B(vatTotal)+'</td></tr>');return}";
    const oldTeleRender = `function renderTele(){const bs=teleBills();$('#teleBtn').textContent='บิล Telesale ('+F(bs.length)+')';$('#drawerBody').innerHTML=bs.length?bs.map(b=>'<div class="teleBill"><div class="teleBillHead"><b>ร้าน: '+E(b.store)+'</b><br><small>บิล: '+E(b.inv)+' · วันที่ '+E(dlabel(b.date))+' · Tele: '+E(b.tele)+'</small></div><table class="teleTbl"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>'+b.lines.map(r=>'<tr><td>'+E(r.sku)+'</td><td>'+F(r.qty)+'</td><td>'+B(r.rawAmt)+'</td><td>'+B((N(r.netAmt)||N(r.rawAmt))*1.07)+'</td></tr>').join('')+'</tbody></table></div>').join(''):'<div class="empty">ไม่พบ Telesale ตามตัวเลือกที่ติ๊ก</div>'}`;
    const newTeleRender = `function renderTele(){const bs=teleBills();$('#teleBtn').textContent='บิล Telesale ('+F(bs.length)+')';$('#drawerBody').innerHTML=bs.length?bs.map(b=>{const rawTotal=N(b.amt),vatTotal=b.lines.reduce((s,r)=>s+(N(r.netAmt)||N(r.rawAmt))*1.07,0);return '<div class="teleBill"><div class="teleBillHead"><b>ร้าน: '+E(b.store)+'</b><br><small>บิล: '+E(b.inv)+' · วันที่ '+E(dlabel(b.date))+' · Tele: '+E(b.tele)+'</small></div><table class="teleTbl"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>'+b.lines.map(r=>'<tr><td>'+E(r.sku)+'</td><td>'+F(r.qty)+'</td><td>'+B(r.rawAmt)+'</td><td>'+B((N(r.netAmt)||N(r.rawAmt))*1.07)+'</td></tr>').join('')+'<tr class="totalRow"><td>รวมทั้งหมด</td><td>'+F(b.qty)+'</td><td>'+B(rawTotal)+'</td><td>'+B(vatTotal)+'</td></tr></tbody></table></div>'}).join(''):'<div class="empty">ไม่พบ Telesale ตามตัวเลือกที่ติ๊ก</div>'}`;
    const oldCoreAppExport = "window.DOIT_CORE_APP={load:loadData,health:()=>({rows:rows.length,pickRows:sourceRows().length,shipRows:shipPool().length,distRows:sourceRows({ignoreDate:true}).length,teleRows:rows.filter(r=>r.isTele).length,teleBills:teleBills().length,receivers:sel.receivers,manualKeys:Object.keys(send).length,inserted:ins.length,mode,bound,flow:'single-core-raw-net-v2'})};window.DOIT_JSON_APP=window.DOIT_CORE_APP;bind();check();";
    const newCoreAppExport = "window.DOIT_CORE_APP={load:loadData,currentState:()=>JSON.parse(JSON.stringify({sel,q,send,add,pull,ins,key,page,pageSize,mode,showDetails,remainView})),health:()=>({rows:rows.length,pickRows:sourceRows().length,shipRows:shipPool().length,distRows:sourceRows({ignoreDate:true}).length,teleRows:rows.filter(r=>r.isTele).length,teleBills:teleBills().length,receivers:sel.receivers,manualKeys:Object.keys(send).length,inserted:ins.length,mode,bound,flow:'single-core-raw-net-v2'})};window.DOIT_JSON_APP=window.DOIT_CORE_APP;bind();check();";

    let patched = code;
    if (patched.includes(oldDoneBranch)) patched = patched.replace(oldDoneBranch, newDoneBranch);
    else console.warn('ไม่พบ done-mode branch เดิม จึงไม่ได้ patch renderMode(done)');

    if (patched.includes(oldOrderBranch)) patched = patched.replace(oldOrderBranch, newOrderBranch);
    else console.warn('ไม่พบ order-mode branch เดิม จึงไม่ได้ patch รวม order');

    if (patched.includes(oldTeleRender)) patched = patched.replace(oldTeleRender, newTeleRender);
    else console.warn('ไม่พบ renderTele เดิม จึงไม่ได้ patch บิล Telesale');

    if (patched.includes(oldCoreAppExport)) patched = patched.replace(oldCoreAppExport, newCoreAppExport);
    else console.warn('ไม่พบ DOIT_CORE_APP export เดิม จึงไม่ได้เพิ่ม currentState');

    return patched;
  }

  function installPickSendEnterNext() {
    if (window.__DOIT_PICK_SEND_ENTER_NEXT__) return;
    window.__DOIT_PICK_SEND_ENTER_NEXT__ = true;

    const SEND_SELECTOR = '#table input.jdata[data-map="send"]';

    const sendInputs = () => [...document.querySelectorAll(SEND_SELECTOR)]
      .filter(input => !input.disabled);

    const refreshSendInputs = () => {
      sendInputs().forEach((input, index) => {
        input.enterKeyHint = 'next';
        input.tabIndex = 1000 + index;
      });
    };

    const focusSendAt = index => {
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
    };

    const nextIndexFor = input => {
      const inputs = sendInputs();
      return Math.max(0, inputs.indexOf(input)) + 1;
    };

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
  }

  async function loadLegacyCore() {
    const response = await fetch(CORE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`โหลด Pro core เดิมไม่ได้: ${response.status}`);
    const code = patchLegacyCore(await response.text());
    (0, eval)(code);
    installPickSendEnterNext();
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
