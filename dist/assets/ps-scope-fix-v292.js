(()=>{'use strict';
// Clean runtime v310 keeps PS filtering in multi-ps-clean-bridge-v310.js.
// This file remains as a compatibility stub because production-ui-parity-v310 may load it for UI parity.
function cleanPs(v){const parts=String(v??'').trim().split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function publish(){const list=[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'));window.DOIT_SELECTED_PS_LIST=list;window.DOIT_SELECTED_PS_KEY=list.join('||');window.DOIT_APP_SCOPE={...(window.DOIT_APP_SCOPE||{}),ps:list,psKey:window.DOIT_SELECTED_PS_KEY};const b=document.querySelector('#psTickBtn289');if(b)b.textContent=list.length?`PS: ${list.length===1?list[0]:list.length+' คน'} ▼`:'PS: ทั้งหมด ▼'}
function boot(){publish();document.addEventListener('doit:psChanged',publish);document.addEventListener('doit:psPopupOpened',publish)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();