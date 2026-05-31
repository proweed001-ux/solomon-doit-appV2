(()=>{'use strict';
const T=v=>String(v??'').trim();
const $=s=>document.querySelector(s);
let rawPayload=null,rawMeta={},patched=false,loading=false,allDateCache=[];
function rowsOf(payload){return payload?.rows||payload||[]}
function uniqueDates(rows){return[...new Set((rows||[]).map(r=>T(r.date)).filter(Boolean))].sort()}
function rememberAllDates(payload){const rows=rowsOf(payload);if(Array.isArray(rows)){const ds=uniqueDates(rows);if(ds.length>=allDateCache.length)allDateCache=ds}if(allDateCache.length){window.DOIT_ALL_DATES=allDateCache;window.DOIT_AVAILABLE_DATES=allDateCache}}
function restoreAllDates(){if(allDateCache.length){window.DOIT_ALL_DATES=allDateCache;window.DOIT_AVAILABLE_DATES=allDateCache;document.dispatchEvent(new CustomEvent('doit:dates',{detail:{dates:allDateCache,full:true}}))}}
function selectedDates(){let arr=Array.isArray(window.DOIT_SELECTED_DATES)?window.DOIT_SELECTED_DATES.map(T).filter(Boolean):[];arr=[...new Set(arr)].sort();window.DOIT_SELECTED_DATES=arr;window.DOIT_SELECTED_DATE_KEY=arr.join(',');return arr}
function activeSet(){const arr=selectedDates();return arr.length?new Set(arr):null}
function cloneWithRows(payload,rows){return Array.isArray(payload)?rows:{...(payload||{}),rows}}
function filteredPayload(payload){const rows=rowsOf(payload);if(!Array.isArray(rows))return payload;rememberAllDates(payload);const set=activeSet();if(!set||!set.size)return payload;return cloneWithRows(payload,rows.filter(r=>set.has(T(r.date))))}
function thai(s){const p=T(s).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function updatePreview(){restoreAllDates();const arr=selectedDates(),p=$('#datePreview');if(!p)return;if(!arr.length){p.textContent='ทุกวัน';return}if(arr.length===1)p.textContent=thai(arr[0]);else p.textContent=`เลือก ${arr.length} วัน: ${thai(arr[0])} - ${thai(arr[arr.length-1])}`}
function resetCoreDateInputs(){const arr=selectedDates(),s=$('#startDate'),e=$('#endDate');if(!arr.length){if(s)s.value='';if(e)e.value=''}else{if(s)s.value=arr[0];if(e)e.value=arr[arr.length-1]}}
function patchApp(){const app=window.DOIT_JSON_APP;if(!app||app.__selectedDateScope302)return false;const oldLoad=app.load.bind(app);app.load=(payload,m={})=>{rememberAllDates(payload);if(!loading){rawPayload=payload;rawMeta=m||{}}const next=filteredPayload(payload);const result=oldLoad(next,m);restoreAllDates();resetCoreDateInputs();setTimeout(updatePreview,0);setTimeout(updatePreview,150);setTimeout(()=>{restoreAllDates();resetCoreDateInputs();updatePreview()},400);return result};app.rerender=()=>{if(!rawPayload)return;loading=true;try{app.load(rawPayload,rawMeta)}finally{loading=false}restoreAllDates();resetCoreDateInputs();setTimeout(updatePreview,0);setTimeout(updatePreview,150)};app.__selectedDateScope302=true;patched=true;return true}
function onDatesChanged(){selectedDates();restoreAllDates();if(!patched)patchApp();if(window.DOIT_JSON_APP?.rerender)window.DOIT_JSON_APP.rerender();else{resetCoreDateInputs();updatePreview()}}
function boot(){patchApp();restoreAllDates();resetCoreDateInputs();updatePreview();let n=0;const tick=()=>{patchApp();restoreAllDates();resetCoreDateInputs();updatePreview();if(++n<40)setTimeout(tick,300)};setTimeout(tick,300)}
document.addEventListener('doit:selectedDatesChanged',onDatesChanged);
document.addEventListener('DOMContentLoaded',boot);
if(document.readyState!=='loading')boot();
})();