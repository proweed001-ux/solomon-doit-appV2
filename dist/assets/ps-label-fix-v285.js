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
function boot(){patch();cleanSelect();let n=0;const tick=()=>{patch();cleanSelect();if(++n<30)setTimeout(tick,300)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();