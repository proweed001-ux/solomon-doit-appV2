(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const $=s=>document.querySelector(s);
function keys(){const out=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(k.startsWith('doit-json:'))out.push(k)}return out}
function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')||{}}catch{return{}}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||{}))}
function visibleInputs(){return[...document.querySelectorAll('.jdata[data-map][data-k]')].filter(inp=>inp.offsetParent!==null||document.body.contains(inp))}
function scoreState(st,ins){let score=0;['send','add','pull'].forEach(map=>{const obj=st[map]||{};ins.forEach(inp=>{if(inp.dataset.map===map&&Object.prototype.hasOwnProperty.call(obj,inp.dataset.k))score+=3})});const f=st.filters||{};if(f.start&&f.start===T($('#startDate')?.value))score++;if(f.end&&f.end===T($('#endDate')?.value))score++;if(f.ps&&f.ps===T($('#psSelect')?.value))score++;return score}
function targetStateKey(ins){const ks=keys();if(!ks.length)return'';let best=ks[0],bestScore=-1;ks.forEach(k=>{const s=scoreState(read(k),ins);if(s>bestScore){best=k;bestScore=s}});return best}
function saveVisible(reason='manual'){const ins=visibleInputs();if(!ins.length)return false;const k=targetStateKey(ins);if(!k)return false;const st=read(k);st.send=st.send||{};st.add=st.add||{};st.pull=st.pull||{};st.filters={...(st.filters||{}),start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:T($('#psSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),q:T($('#q')?.value)};
ins.forEach(inp=>{const map=inp.dataset.map,key=inp.dataset.k;if(!map||!key||!(map in st))return;const n=N(inp.value);if(n>0)st[map][key]=n;else delete st[map][key]});write(k,st);window.__DOIT_PRINT_SAFETY_LAST={version:'v317',reason,key:k,count:ins.length,at:new Date().toISOString()};return true}
function capture(e){const id=e.target?.id;if(['prepPrint','doitPrintNow','doitConfirmPrint','closeBillBtn','clearStoreBtn','exportCsv'].includes(id)){saveVisible(id)}}
function bind(){if(document.__printSafety317)return;document.__printSafety317=true;window.addEventListener('click',capture,true);document.addEventListener('input',e=>{if(e.target?.classList?.contains('jdata'))saveVisible('input')},true);document.addEventListener('change',e=>{if(e.target?.classList?.contains('jdata'))saveVisible('change')},true)}
window.DOIT_PRINT_SAFETY={version:'v317',saveVisible,debug:()=>window.__DOIT_PRINT_SAFETY_LAST||null};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();