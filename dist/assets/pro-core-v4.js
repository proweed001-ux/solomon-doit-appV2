(()=>{
'use strict';
const CORE_URL='https://cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2@a5ab43603f9e6893c7958a85906f224594aee21d/dist/assets/pro-core-v4.js';
function T(v){return String(v??'').trim()}
function N(v){return Number(String(v??'').replace(/,/g,'').replace(/[^0-9.\-]/g,''))||0}
function B(n){return N(n).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2})}
function patchPrintMax12(){
  const btn=document.querySelector('#prepPrint');
  if(!btn||btn.dataset.max12Patch==='1')return false;
  btn.dataset.max12Patch='1';
  btn.addEventListener('click',()=>setTimeout(splitLatestPrintOverlay,80));
  return true;
}
function splitLatestPrintOverlay(){
  const overlays=[...document.querySelectorAll('.printOverlay')];
  const ov=overlays[overlays.length-1];
  if(!ov||ov.dataset.max12Done==='1')return;
  const page=ov.querySelector('.receiptPage');
  if(!page)return;
  const rows=[...page.querySelectorAll('tr[data-line]')];
  if(rows.length<=12){ov.dataset.max12Done='1';return;}
  ov.dataset.max12Done='1';
  const pages=[];
  for(let i=0;i<rows.length;i+=12)pages.push(rows.slice(i,i+12));
  const originalPages=[...ov.querySelectorAll('.receiptPage')];
  const printBar=ov.querySelector('.printBar');
  originalPages.forEach(x=>x.remove());
  pages.forEach((chunk)=>{
    const clone=page.cloneNode(true);
    const body=clone.querySelector('tbody');
    if(!body)return;
    const oldData=[...clone.querySelectorAll('tr[data-line]')];
    oldData.forEach(x=>x.remove());
    const foot=[...body.querySelectorAll('tr')].find(tr=>!tr.matches('[data-line]'));
    chunk.forEach((r,idx)=>{
      const nr=r.cloneNode(true);
      const first=nr.children&&nr.children[0];
      if(first)first.textContent=String(idx+1);
      if(foot)body.insertBefore(nr,foot);else body.appendChild(nr);
    });
    if(printBar)printBar.insertAdjacentElement('afterend',clone);else ov.appendChild(clone);
    recalcReceiptPage(clone);
  });
  ov.addEventListener('input',e=>{if(e.target.closest('.receiptTable'))ov.querySelectorAll('.receiptPage').forEach(recalcReceiptPage)});
  ov.addEventListener('blur',e=>{if(e.target.closest('.receiptTable'))ov.querySelectorAll('.receiptPage').forEach(recalcReceiptPage)},true);
}
function recalcReceiptPage(pg){
  let total=0;
  pg.querySelectorAll('tr[data-line]').forEach(tr=>{
    const q=N(tr.querySelector('.rq')?.textContent);
    const u=N(tr.querySelector('.ru')?.textContent);
    const t=q*u;
    total+=t;
    const rt=tr.querySelector('.rt');
    if(rt)rt.textContent=B(t);
  });
  const tt=pg.querySelector('#ctxTotal,[data-page-total]');
  const hh=pg.querySelector('#ctxHeaderTotal,[data-header-total]');
  if(tt)tt.textContent=B(total);
  if(hh)hh.textContent=B(total)+' บาท';
}
function install(){
  let tries=0;
  const tick=()=>{
    tries++;
    patchPrintMax12();
    if(tries<80)setTimeout(tick,250);
  };
  tick();
}
async function boot(){
  const r=await fetch(CORE_URL,{cache:'no-store'});
  if(!r.ok)throw new Error('โหลด Pro core เดิมไม่ได้: '+r.status);
  const code=await r.text();
  (0,eval)(code);
  install();
}
boot().catch(e=>{
  console.error(e);
  document.body.innerHTML='<div style="font-family:system-ui;padding:18px;color:#991b1b"><b>โหลดหน้า Pro ไม่สำเร็จ</b><br>'+String(e.message||e)+'</div>';
});
})();
