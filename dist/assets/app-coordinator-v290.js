(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.0';
const T=v=>String(v??'').trim();
let rawRows=[],patched=false;
const $=s=>document.querySelector(s);
function rowsOf(p){return p?.rows||p||[]}
function dates(){return[...new Set(rawRows.map(r=>T(r.date)).filter(Boolean))].sort()}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(!parts.length)return'';if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function selectedDates(){return[...new Set((window.DOIT_SELECTED_DATES||[]).map(T).filter(Boolean))].sort()}
function selectedPs(){return[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'))}
function scopeHead(){return[T($('#startDate')?.value),T($('#endDate')?.value),T($('#psSelect')?.value)].join('|')+'|'}
function getScope(){return{dates:selectedDates(),dateKey:T(window.DOIT_SELECTED_DATE_KEY),ps:selectedPs(),psKey:T(window.DOIT_SELECTED_PS_KEY),receiver:T($('#storeSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),q:T($('#q')?.value).toLowerCase(),start:T($('#startDate')?.value),end:T($('#endDate')?.value),psValue:T($('#psSelect')?.value),scopeHead:scopeHead()}}
function lockTitle(){try{document.title=APP_VERSION}catch{}const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION;const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}
function thai(s){const p=T(s).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function removeOnlyBrokenRows(){document.querySelectorAll('.manualOrderRow290,.insertRow290').forEach(x=>x.remove())}
function patchLoad(){const app=window.DOIT_JSON_APP;if(!app||app.__appCoordinator290)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const arr=rowsOf(payload);if(Array.isArray(arr)&&arr.length){rawRows=arr;window.__doitRawRows290=arr;window.DOIT_ALL_DATES=dates();window.DOIT_AVAILABLE_DATES=window.DOIT_ALL_DATES}removeOnlyBrokenRows();const res=old(payload,m);setTimeout(syncUi,0);setTimeout(syncUi,250);return res};app.__appCoordinator290=true;patched=true;return true}
function syncUi(){lockTitle();window.DOIT_SCOPE_HEAD=scopeHead;removeOnlyBrokenRows();const ds=selectedDates();const p=$('#datePreview');if(p){if(!ds.length)p.textContent='ทุกวัน';else if(ds.length===1)p.textContent=thai(ds[0]);else p.textContent=`เลือก ${ds.length} วัน: ${thai(ds[0])} - ${thai(ds[ds.length-1])}`}const pb=$('#psTickBtn289');if(pb){const ps=selectedPs();pb.textContent=ps.length?`PS: ${ps.length===1?ps[0]:ps.length+' คน'} ▼`:'PS: ทั้งหมด ▼'}window.DOIT_APP_SCOPE=getScope()}
function bind(){if(document.__appCoordRestore290)return;document.__appCoordRestore290=true;['doit:scopeRendered','doit:selectedDatesChanged','doit:psChanged'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(syncUi,80)))}
function health(){return{version:APP_VERSION,patched,buttonCleanupDisabled:true,rows:rawRows.length,scope:getScope()}}
function expose(){window.DOIT_SCOPE_HEAD=scopeHead;window.DOIT_APP_COORDINATOR={version:APP_VERSION,getScope,health,scopeHead,rerender:()=>window.DOIT_JSON_APP?.rerender?.()}}
function boot(){patchLoad();bind();expose();syncUi();let n=0;const tick=()=>{patchLoad();bind();expose();syncUi();if(++n<10)setTimeout(tick,600)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();