(()=>{'use strict';
const T=v=>String(v??'').trim();
const $=s=>document.querySelector(s);
let rawPayload=null,rawRows=[],rawMeta={};
function rowsOf(p){return p?.rows||p||[]}
function clone(p,rows){return Array.isArray(p)?rows:{...(p||{}),rows}}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(!parts.length)return'';if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function allDates(){return[...new Set(rawRows.map(r=>T(r.date)).filter(Boolean))].sort()}
function dateList(){return[...new Set((window.DOIT_SELECTED_DATES||[]).map(T).filter(Boolean))].sort()}
function psList(){return[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'))}
function excludedStores(){return new Set((window.DOIT_EXCLUDED_ORDER_STORES||[]).map(T).filter(Boolean))}
function dateOk(r,ds){return !ds.length||ds.includes(T(r.date))}
function psOk(r,ps){return !ps.length||ps.includes(cleanPs(r.ps))}
function orderStoreOk(r,ex){return !ex.has(T(r.store))}
function sourceScopeRows(){const ds=dateList(),ps=psList();return rawRows.filter(r=>dateOk(r,ds)&&psOk(r,ps))}
function scopedRows(){const ex=excludedStores();return sourceScopeRows().filter(r=>orderStoreOk(r,ex))}
function remember(payload,meta){const arr=rowsOf(payload);if(!Array.isArray(arr)||!arr.length)return;if(!rawRows.length||arr.length>rawRows.length){rawPayload=payload;rawRows=arr;rawMeta=meta||{};window.__doitRawRows304=rawRows}}
function syncGlobals(){window.__doitAllRows=rawRows;window.DOIT_ALL_DATES=allDates();window.DOIT_AVAILABLE_DATES=window.DOIT_ALL_DATES;window.DOIT_SELECTED_DATES=dateList();window.DOIT_SELECTED_DATE_KEY=window.DOIT_SELECTED_DATES.join(',');window.DOIT_SELECTED_PS_LIST=psList();window.DOIT_SELECTED_PS_KEY=window.DOIT_SELECTED_PS_LIST.join('||');window.DOIT_EXCLUDED_ORDER_STORES=[...excludedStores()]}
function thai(s){const p=T(s).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function updatePreview(){const p=$('#datePreview'),ds=dateList();if(!p)return;if(!ds.length)p.textContent='ทุกวัน';else if(ds.length===1)p.textContent=thai(ds[0]);else p.textContent=`เลือก ${ds.length} วัน: ${thai(ds[0])} - ${thai(ds[ds.length-1])}`}
function esc(s){return T(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function updateStoreOptions(){const el=$('#storeSelect');if(!el||!rawRows.length)return;const cur=T(el.value);const stores=[...new Set(sourceScopeRows().map(r=>T(r.store)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'));el.innerHTML='<option value="">เลือกร้านจริง</option>'+stores.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if(cur&&stores.includes(cur))el.value=cur}
function removeDebug(){const b=$('#scopeDebug304');if(b)b.remove()}
function afterRender(){syncGlobals();updatePreview();updateStoreOptions();removeDebug()}
function patchApp(){const app=window.DOIT_JSON_APP;if(!app||app.__filterCoordinator305c)return false;const oldLoad=app.load.bind(app);app.load=(payload,m={})=>{remember(payload,m);syncGlobals();const next=rawRows.length?clone(rawPayload||payload,scopedRows()):payload;const res=oldLoad(next,m);setTimeout(afterRender,0);setTimeout(afterRender,150);return res};app.rerender=()=>{if(!rawPayload)return;app.load(rawPayload,rawMeta)};app.__filterCoordinator305c=true;return true}
function resetAllFilters(){window.DOIT_SELECTED_DATES=[];window.DOIT_SELECTED_DATE_KEY='';window.DOIT_SELECTED_PS_LIST=[];window.DOIT_SELECTED_PS_KEY='';window.DOIT_EXCLUDED_ORDER_STORES=[];['startDate','endDate','q','psSelect','brandSelect','typeSelect','storeSelect'].forEach(id=>{const el=$('#'+id);if(el)el.value=''});const pb=$('#psTickBtn289');if(pb)pb.textContent='PS: ทั้งหมด ▼';document.dispatchEvent(new CustomEvent('doit:selectedDatesChanged',{detail:{dates:[],all:true,reset:true}}));document.dispatchEvent(new CustomEvent('doit:orderStoreFilterChanged',{detail:{excluded:[]}}));setTimeout(()=>window.DOIT_JSON_APP?.rerender?.(),0);setTimeout(afterRender,100)}
function bindHints(){const help=$('#helpBtn');if(help&&!help.dataset.help305c&&!help.onclick){help.dataset.help305c='1';help.addEventListener('click',()=>alert('วิธีใช้งานย่อ\n1) โหลดไฟล์ล่าสุดจาก Cloud\n2) เลือกวันที่/PS ที่ต้องการ\n3) ใช้กรองร้านออเดอร์เพื่อตัดร้านบางร้านออกจากยอดถอดของ\n4) เลือกร้านจริงที่จะส่งของ\n5) ใส่จำนวนส่งจริง แล้วเตรียมปริ้น'))}const auto=$('#autosaveBtn');if(auto&&!auto.dataset.auto305c){auto.dataset.auto305c='1';auto.addEventListener('click',()=>setTimeout(()=>{const m=$('#msg');if(m&&!/บันทึก/.test(m.textContent||''))m.textContent='บันทึกอัตโนมัติพร้อมใช้งาน · '+new Date().toLocaleTimeString('th-TH')},30))}}
function bind(){if(document.__filterCoord305c)return;document.__filterCoord305c=true;document.addEventListener('click',e=>{if(e.target?.id==='clearFilter'){e.preventDefault();e.stopImmediatePropagation();resetAllFilters()}},true);document.addEventListener('doit:selectedDatesChanged',()=>setTimeout(()=>{syncGlobals();window.DOIT_JSON_APP?.rerender?.();afterRender()},0));document.addEventListener('doit:orderStoreFilterChanged',()=>setTimeout(()=>{syncGlobals();window.DOIT_JSON_APP?.rerender?.();afterRender()},0));document.addEventListener('change',e=>{if(['storeSelect','brandSelect','typeSelect','q'].includes(e.target?.id))setTimeout(afterRender,0)},true)}
function boot(){patchApp();bind();bindHints();afterRender();let n=0;const tick=()=>{patchApp();bind();bindHints();afterRender();if(++n<12)setTimeout(tick,500)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();