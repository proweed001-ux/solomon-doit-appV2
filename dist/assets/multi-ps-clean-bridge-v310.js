(()=>{'use strict';
const T=v=>String(v??'').trim();
function rowsOf(p){return p?.rows||p||[]}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function selected(){return[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'))}
function payloadWithRows(payload,rows){return Array.isArray(payload)?rows:{...payload,rows}}
let allRows=[],rawPayload=null,rawMeta={};
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__multiPsBridge310)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const arr=rowsOf(payload);if(Array.isArray(arr)&&arr.length){rawPayload=payload;rawMeta=m||{};if(arr.length>=allRows.length)allRows=arr;window.__doitAllRows=allRows;window.__doitRawRows310=allRows}const ps=selected();let next=payload;if(ps.length){const set=new Set(ps);next=payloadWithRows(payload,rowsOf(payload).filter(r=>set.has(cleanPs(r.ps))))}if(ps.length>1){const sel=document.querySelector('#psSelect');if(sel&&sel.value){sel.value='';sel.dispatchEvent(new Event('change',{bubbles:true}))}}return old(next,m)};app.__multiPsBridge310=true;return true}
function rerender(){if(rawPayload)window.DOIT_JSON_APP?.load?.(rawPayload,rawMeta)}
function bind(){if(document.__multiPsBridge310)return;document.__multiPsBridge310=true;document.addEventListener('doit:psChanged',()=>setTimeout(rerender,0));document.addEventListener('doit:scopeRendered',()=>{if(allRows.length)window.__doitAllRows=allRows})}
function boot(){patch();bind();let n=0;const tick=()=>{patch();bind();if(++n<20)setTimeout(tick,300)};setTimeout(tick,100)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();