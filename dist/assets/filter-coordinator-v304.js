(()=>{'use strict';
const T=v=>String(v??'').trim();
const $=s=>document.querySelector(s);
let rawPayload=null,rawRows=[],rawMeta={},patched=false;
function rowsOf(p){return p?.rows||p||[]}
function clone(p,rows){return Array.isArray(p)?rows:{...(p||{}),rows}}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(!parts.length)return'';if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function allDates(){return[...new Set(rawRows.map(r=>T(r.date)).filter(Boolean))].sort()}
function dateList(){return[...new Set((window.DOIT_SELECTED_DATES||[]).map(T).filter(Boolean))].sort()}
function psList(){return[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'))}
function dateOk(r,ds){return !ds.length||ds.includes(T(r.date))}
function psOk(r,ps){return !ps.length||ps.includes(cleanPs(r.ps))}
function scopedRows(){const ds=dateList(),ps=psList();return rawRows.filter(r=>dateOk(r,ds)&&psOk(r,ps))}
function remember(payload,meta){const arr=rowsOf(payload);if(!Array.isArray(arr)||!arr.length)return;if(!rawRows.length||arr.length>rawRows.length){rawPayload=payload;rawRows=arr;rawMeta=meta||{};window.__doitRawRows304=rawRows}}
function syncGlobals(){window.__doitAllRows=rawRows;window.DOIT_ALL_DATES=allDates();window.DOIT_AVAILABLE_DATES=window.DOIT_ALL_DATES;window.DOIT_SELECTED_DATES=dateList();window.DOIT_SELECTED_DATE_KEY=window.DOIT_SELECTED_DATES.join(',');window.DOIT_SELECTED_PS_LIST=psList();window.DOIT_SELECTED_PS_KEY=window.DOIT_SELECTED_PS_LIST.join('||')}
function thai(s){const p=T(s).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function updatePreview(){const p=$('#datePreview'),ds=dateList();if(!p)return;if(!ds.length)p.textContent='ทุกวัน';else if(ds.length===1)p.textContent=thai(ds[0]);else p.textContent=`เลือก ${ds.length} วัน: ${thai(ds[0])} - ${thai(ds[ds.length-1])}`}
function esc(s){return T(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function updateStoreOptions(){const el=$('#storeSelect');if(!el||!rawRows.length)return;const cur=T(el.value);const stores=[...new Set(scopedRows().map(r=>T(r.store)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'));el.innerHTML='<option value="">เลือกร้านจริง</option>'+stores.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if(cur&&stores.includes(cur))el.value=cur}
function scopeBadge(){let b=$('#scopeDebug304');if(!b){b=document.createElement('div');b.id='scopeDebug304';b.style.cssText='margin:8px 0;padding:8px 10px;border:1px solid #bae6fd;background:#f0f9ff;color:#075985;border-radius:10px;font-size:12px;font-weight:900;line-height:1.45';const host=document.querySelector('.dateCardFilters')||document.querySelector('.filters')||document.querySelector('.card');host?.appendChild(b)}const ds=dateList(),ps=psList(),rec=T($('#storeSelect')?.value);if(b)b.textContent=`Scope: วันที่ ${ds.length?ds.map(thai).join(', '):'ทุกวัน'} | PS ${ps.length?ps.join(', '):'ทั้งหมด'} | ร้านส่ง ${rec||'-'} | rows ${scopedRows().length.toLocaleString('th-TH')}/${rawRows.length.toLocaleString('th-TH')}`}
function afterRender(){syncGlobals();updatePreview();updateStoreOptions();scopeBadge()}
function patchApp(){const app=window.DOIT_JSON_APP;if(!app||app.__filterCoordinator304b)return false;const oldLoad=app.load.bind(app);app.load=(payload,m={})=>{remember(payload,m);syncGlobals();const next=rawRows.length?clone(rawPayload||payload,scopedRows()):payload;const res=oldLoad(next,m);setTimeout(afterRender,0);setTimeout(afterRender,120);setTimeout(afterRender,450);return res};app.rerender=()=>{if(!rawPayload)return;app.load(rawPayload,rawMeta)};app.__filterCoordinator304b=true;patched=true;return true}
function resetAllFilters(){window.DOIT_SELECTED_DATES=[];window.DOIT_SELECTED_DATE_KEY='';window.DOIT_SELECTED_PS_LIST=[];window.DOIT_SELECTED_PS_KEY='';['startDate','endDate','q','psSelect','brandSelect','typeSelect','storeSelect'].forEach(id=>{const el=$('#'+id);if(el)el.value=''});const pb=$('#psTickBtn289');if(pb)pb.textContent='PS: ทั้งหมด ▼';document.dispatchEvent(new CustomEvent('doit:selectedDatesChanged',{detail:{dates:[],all:true,reset:true}}));setTimeout(()=>window.DOIT_JSON_APP?.rerender?.(),0);setTimeout(afterRender,100)}
function bind(){if(document.__filterCoord304b)return;document.__filterCoord304b=true;document.addEventListener('click',e=>{if(e.target?.id==='clearFilter'){e.preventDefault();e.stopImmediatePropagation();resetAllFilters()}},true);document.addEventListener('doit:selectedDatesChanged',()=>setTimeout(()=>{syncGlobals();window.DOIT_JSON_APP?.rerender?.();afterRender()},0));document.addEventListener('change',e=>{if(['storeSelect','brandSelect','typeSelect','q'].includes(e.target?.id))setTimeout(afterRender,0)},true)}
function boot(){patchApp();bind();afterRender();let n=0;const tick=()=>{patchApp();bind();afterRender();if(++n<40)setTimeout(tick,300)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();