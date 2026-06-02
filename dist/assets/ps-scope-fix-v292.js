(()=>{'use strict';
const T=v=>String(v??'').trim();
const $=s=>document.querySelector(s);
let rawPayload=null,rawMeta={},rawRows=[],draft=null;
function rowsOf(p){return p?.rows||p||[]}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(!parts.length)return'';if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function sortList(a){return[...new Set((a||[]).map(cleanPs).filter(Boolean))].sort((x,y)=>x.localeCompare(y,'th'))}
function selected(){return sortList(window.DOIT_SELECTED_PS_LIST||[])}
function buttonValue(btn){return cleanPs(btn?.dataset?.v||btn?.textContent||'')}
function visibleValues(){return sortList([...document.querySelectorAll('.psItem289')].map(buttonValue))}
function allValues(){const rows=Array.isArray(window.__doitAllRows)?window.__doitAllRows:rawRows;const fromRows=Array.isArray(rows)?rows.map(r=>cleanPs(r.ps)).filter(Boolean):[];const fromOpt=$('#psSelect')?[...$('#psSelect').options].map(o=>cleanPs(o.value||o.textContent)).filter(Boolean):[];const fromDom=visibleValues();return sortList([...fromRows,...fromOpt,...fromDom])}
function ensureDraft(){if(!draft)draft=new Set(selected());return draft}
function publish(list){const final=sortList(list);window.DOIT_SELECTED_PS_LIST=final;window.DOIT_SELECTED_PS_KEY=final.join('||');const el=$('#psSelect');if(el)el.value=final.length===1?final[0]:'';const b=$('#psTickBtn289');if(b)b.textContent=final.length?`PS: ${final.length===1?final[0]:final.length+' คน'} ▼`:'PS: ทั้งหมด ▼';const c=$('#psCount289');if(c)c.textContent=final.length?`เลือกอยู่ ${final.length} คน: ${final.join(', ')}`:'เลือกอยู่: ทั้งหมด';window.DOIT_APP_SCOPE={...(window.DOIT_APP_SCOPE||{}),ps:final,psKey:window.DOIT_SELECTED_PS_KEY};return final}
function paint(){const d=ensureDraft();document.querySelectorAll('.psItem289').forEach(btn=>{const v=buttonValue(btn),on=d.has(v);btn.classList.toggle('on',on);const i=btn.querySelector('i');if(i)i.textContent=on?'✓':''});const c=$('#psCount289');if(c){const a=sortList([...d]);c.textContent=a.length?`เลือกอยู่ ${a.length} คน: ${a.join(', ')}`:'เลือกอยู่: ทั้งหมด'}}
function openSync(){draft=new Set(selected());setTimeout(paint,30);setTimeout(paint,120)}
function toggle(btn){const v=buttonValue(btn);if(!v)return;const d=ensureDraft();if(d.has(v))d.delete(v);else d.add(v);paint()}
let timer=0;
function rerender(reason){clearTimeout(timer);timer=setTimeout(()=>{const ps=publish(selected());document.dispatchEvent(new CustomEvent('doit:psChanged',{detail:{ps,psKey:window.DOIT_SELECTED_PS_KEY,reason}}));try{if(rawPayload)window.DOIT_JSON_APP?.load?.(rawPayload,rawMeta);else window.DOIT_JSON_APP?.rerender?.()}catch(e){console.warn('[ps-scope-owner] rerender failed',e)}},80)}
function commit(reason){const final=publish(draft?[...draft]:selected());draft=null;document.querySelector('.psOverlay289')?.classList.remove('on');rerender(reason||'ok');return final}
function clear(){draft=new Set();publish([]);paint();document.querySelector('.psOverlay289')?.classList.remove('on');rerender('clear')}
function selectAll(){draft=new Set(allValues());paint()}
function patchLoad(){const app=window.DOIT_JSON_APP;if(!app||app.__psScopeOwner294)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const arr=rowsOf(payload);if(Array.isArray(arr)&&arr.length&&arr.length>=rawRows.length){rawPayload=payload;rawMeta=m||{};rawRows=arr;window.__doitPsRawRows294=arr}return old(payload,m)};app.__psScopeOwner294=true;return true}
function bind(){if(document.__psScopeOwner294)return;document.__psScopeOwner294=true;document.addEventListener('click',e=>{const open=e.target?.closest?.('#psTickBtn289');const item=e.target?.closest?.('.psItem289');const ok=e.target?.closest?.('.psOk289');const cancel=e.target?.closest?.('.psClose289');const clearBtn=e.target?.closest?.('.psClear289');const allBtn=e.target?.closest?.('.psAll289');if(open){setTimeout(openSync,40);return}if(item){e.preventDefault();e.stopImmediatePropagation();toggle(item);return}if(ok){e.preventDefault();e.stopImmediatePropagation();commit('ok');return}if(clearBtn){e.preventDefault();e.stopImmediatePropagation();clear();return}if(allBtn){e.preventDefault();e.stopImmediatePropagation();selectAll();return}if(cancel){draft=null;return}},true);document.addEventListener('input',e=>{if(e.target?.id==='psSearch289')setTimeout(paint,50)},true);document.addEventListener('change',e=>{if(e.target?.id==='psSelect'){const v=cleanPs(e.target.value);publish(v?[v]:selected());rerender('legacy-select')}},true)}
function boot(){patchLoad();bind();publish(selected());let n=0;const tick=()=>{patchLoad();bind();if(!document.querySelector('.psOverlay289.on'))publish(selected());if(++n<8)setTimeout(tick,700)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();