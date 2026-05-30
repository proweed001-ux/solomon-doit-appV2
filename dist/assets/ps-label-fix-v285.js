(()=>{'use strict';
const T=v=>String(v??'').trim();
function cleanPs(v){
  const parts=T(v).split(/\s+/).filter(Boolean);
  if(!parts.length)return '';
  if(parts.length===2&&parts[0]===parts[1])return parts[0];
  const seen=[];parts.forEach(p=>{if(!seen.includes(p))seen.push(p)});
  return seen.join(' ');
}
function normalizePayload(payload){
  const arr=payload?.rows||payload;
  if(!Array.isArray(arr))return payload;
  const rows=arr.map(r=>({...r,ps:cleanPs(r.ps)}));
  return Array.isArray(payload)?rows:{...payload,rows};
}
function patch(){
  const app=window.DOIT_JSON_APP;
  if(!app||app.__psLabelFix285)return false;
  const old=app.load.bind(app);
  app.load=(payload,m={})=>old(normalizePayload(payload),m);
  app.__psLabelFix285=true;
  return true;
}
function cleanSelect(){
  const el=document.querySelector('#psSelect');
  if(!el)return;
  [...el.options].forEach(o=>{const c=cleanPs(o.textContent||o.value);if(c){o.textContent=c;o.value=c}});
}
function restoreNativePsSelect(){
  const el=document.querySelector('#psSelect');
  if(!el)return;
  document.querySelector('#psPickBtn286')?.remove();
  document.querySelector('#psPickBtn285')?.remove();
  document.querySelector('.psOverlay286')?.remove();
  document.querySelector('.psOverlay285')?.remove();
  el.style.position='';
  el.style.left='';
  el.style.width='100%';
  el.style.height='42px';
  el.style.opacity='';
  el.style.pointerEvents='';
  el.style.display='';
  el.hidden=false;
}
function forceCenteredDate(){
  if(document.querySelector('#forceCenterDate285'))return;
  const st=document.createElement('style');
  st.id='forceCenterDate285';
  st.textContent='.dateOverlay{align-items:center!important;justify-content:center!important;padding:18px!important}.dateSheet{width:min(92vw,720px)!important;max-height:86vh!important;border-radius:18px!important;box-shadow:0 22px 80px rgba(0,0,0,.38)!important}@media(max-width:520px){.dateOverlay{padding:10px!important}.dateSheet{width:96vw!important;max-height:88vh!important}.dateGrid{grid-template-columns:repeat(2,1fr)!important}}';
  document.head.appendChild(st);
}
function boot(){patch();cleanSelect();restoreNativePsSelect();forceCenteredDate();let n=0;const tick=()=>{patch();cleanSelect();restoreNativePsSelect();forceCenteredDate();if(++n<30)setTimeout(tick,300)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();