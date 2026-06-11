(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,'').replace(/[^0-9.\-]/g,''))||0;
const B=n=>N(n).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
function idx(ths,label){return ths.findIndex(th=>T(th.textContent).replace(/\s+/g,'')===label)}
function patch(){
  const table=document.querySelector('#table');
  if(!table)return false;
  const hr=table.querySelector('thead tr'), tb=table.querySelector('tbody');
  if(!hr||!tb)return false;
  const ths=[...hr.children];
  const rawIdx=idx(ths,'ยอดดิบ');
  const netIdx=idx(ths,'ยอดสุทธิ');
  if(rawIdx<0||netIdx<0)return false;
  if(!ths.some(th=>T(th.textContent).replace(/\s+/g,'')==='รวมVAT')){
    const th=document.createElement('th');
    th.textContent='รวม VAT';
    hr.appendChild(th);
  }
  [...tb.rows].forEach(row=>{
    if(row.querySelector('.empty')){
      const c=row.querySelector('td[colspan]');
      if(c)c.colSpan=Math.max(N(c.colSpan),ths.length+1);
      return;
    }
    const cells=[...row.children];
    if(!cells[rawIdx]||!cells[netIdx])return;
    const raw=N(cells[rawIdx].innerText), net=N(cells[netIdx].innerText), base=net>0?net:raw;
    let last=row.lastElementChild;
    if(!last||last.dataset.grossVat!=='1'){
      last=document.createElement('td');
      last.dataset.grossVat='1';
      row.appendChild(last);
    }
    last.textContent=B(base*1.07);
  });
  const amount=document.querySelector('#amount');
  if(amount){
    const s=T(amount.textContent);
    if(/สุทธิ\s*฿/.test(s)&&!/รวม VAT/.test(s)){
      const m=s.match(/สุทธิ\s*฿\s*([0-9,]+(?:\.\d+)?)/);
      const base=m?N(m[1]):0;
      if(base)amount.textContent=s+' / รวม VAT ฿ '+B(base*1.07);
    }
  }
  return true;
}
function boot(){patch();document.addEventListener('click',()=>setTimeout(patch,80),true);document.addEventListener('input',()=>setTimeout(patch,80),true);try{new MutationObserver(()=>setTimeout(patch,0)).observe(document.body,{childList:true,subtree:true})}catch{}let n=0;(function tick(){patch();if(++n<60)setTimeout(tick,300)})()}
window.DOIT_GROSS_VAT_PATCH={version:'v334',patch};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();