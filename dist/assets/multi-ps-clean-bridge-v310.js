(()=>{'use strict';
const T=v=>String(v??'').trim();
function rowsOf(p){return p&&Array.isArray(p.rows)?p.rows:(Array.isArray(p)?p:[])}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function selected(){return[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'))}
function withRows(payload,rows){return Array.isArray(payload)?rows:{...payload,rows}}
function scopeKey(ps){return ps.length>1?'MULTI: '+ps.join(', '):(ps[0]||'')}
function setSelect(v){const el=document.querySelector('#psSelect');if(!el)return;if(v){let o=[...el.options].find(x=>x.value===v);if(!o){o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)}if(el.value!==v){el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}))}}else if(el.value){el.value='';el.dispatchEvent(new Event('change',{bubbles:true}))}}
let rawPayload=null,rawMeta={},rawRows=[];
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__multiPsBridge310)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const arr=rowsOf(payload);if(arr.length&&!String(arr[0]?.ps||'').startsWith('MULTI: ')){rawPayload=payload;rawMeta=m||{};rawRows=arr;window.__doitAllRows=arr;window.__doitRawRows310=arr}const ps=selected();let next=payload;if(ps.length){const set=new Set(ps),key=scopeKey(ps);const src=rowsOf(payload);next=withRows(payload,src.filter(r=>set.has(cleanPs(r.ps))).map(r=>({...r,ps:key})));setSelect(key)}else{setSelect('')}return old(next,m)};app.__multiPsBridge310=true;return true}
function rerender(){if(rawPayload)window.DOIT_JSON_APP?.load?.(rawPayload,rawMeta)}
function bind(){if(document.__multiPsBridge310)return;document.__multiPsBridge310=true;document.addEventListener('doit:psChanged',()=>setTimeout(rerender,0))}
function boot(){patch();bind();let n=0;const tick=()=>{patch();bind();if(++n<20)setTimeout(tick,300)};setTimeout(tick,100)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();