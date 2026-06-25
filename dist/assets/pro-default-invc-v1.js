(()=>{
if(window.__PRO_DEFAULT_INVC__)return;window.__PRO_DEFAULT_INVC__=true;
const old=localStorage.getItem.bind(localStorage);
localStorage.getItem=(k)=>{const v=old(k);if(!String(k).startsWith('doit-core-unified-v1:'))return v;try{const s=v?JSON.parse(v):{};s.sel=s.sel||{};if(!Array.isArray(s.sel.types)||!s.sel.types.length)s.sel.types=['INVC'];return JSON.stringify(s)}catch{return v}};
function invcRows(){return Array.isArray(window.__doitCoreRows)?window.__doitCoreRows.filter(r=>String(r&&r.type||'').toUpperCase().replace(/[^A-Z0-9]/g,'')==='INVC'):[]}
function state(){try{return window.DOIT_CORE_APP&&window.DOIT_CORE_APP.currentState&&window.DOIT_CORE_APP.currentState()}catch{return null}}
function enforce(){const app=window.DOIT_CORE_APP,s=state(),all=Array.isArray(window.__doitCoreRows)?window.__doitCoreRows:[],invc=invcRows();if(!app||!s||!all.length||!invc.length)return;if(Array.isArray(s.sel&&s.sel.types)&&s.sel.types.length)return;if(invc.length===all.length)return;try{app.load(invc,{id:'active-invc-only',file_name:'JSON Cloud · INVC'});const m=document.querySelector('#msg');if(m)m.textContent='ใช้เฉพาะ INVC เพื่อกันยอดบวกซ้ำ'}catch{}}
setInterval(enforce,1200);
document.addEventListener('click',e=>{if(e.target&&e.target.id==='clearFilter')setTimeout(enforce,50)},true);
})();
