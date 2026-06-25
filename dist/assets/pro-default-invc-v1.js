(()=>{
if(window.__PRO_DEFAULT_INVC__)return;window.__PRO_DEFAULT_INVC__=true;
const TYPE='INVC';
const n=v=>Number(String(v??'').replace(/,/g,'').replace(/[^0-9.\-]/g,''))||0;
const k=v=>String(v??'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const doc=r=>k(r&& (r.type||r.SOTypeID||r.soTypeID||(r.raw&&r.raw.SOTypeID)||''));
const rowsOf=p=>Array.isArray(p)?p:(Array.isArray(p&&p.rows)?p.rows:[]);
function onlyInvc(p){const a=rowsOf(p);if(!a.length)return p;const b=a.filter(r=>doc(r)===TYPE);if(!b.length)return p;if(Array.isArray(p))return b;return {...p,rows:b,__proDefaultType:TYPE,__proFilteredRows:b.length,__proOriginalRows:a.length};}
const oldGet=localStorage.getItem.bind(localStorage);
localStorage.getItem=(key)=>{const v=oldGet(key);if(!String(key).startsWith('doit-core-unified-v1:'))return v;try{const s=v?JSON.parse(v):{};s.sel=s.sel||{};s.sel.types=[TYPE];return JSON.stringify(s)}catch{return v}};
function patchApp(){const app=window.DOIT_CORE_APP;if(!app||app.__proInvcWrapped||typeof app.load!=='function')return;const oldLoad=app.load.bind(app);app.load=(payload,meta={})=>{const fixed=onlyInvc(payload);const r=rowsOf(fixed);oldLoad(fixed,{...meta,id:(meta.id||'active')+'-invc',file_name:(meta.file_name||'JSON Cloud')+' · INVC'});const m=document.querySelector('#msg');if(m&&r.length)m.textContent='ใช้เฉพาะ INVC '+r.length.toLocaleString('th-TH')+' แถว เพื่อกันยอดบวกซ้ำ';};app.__proInvcWrapped=true;}
function patchXlsx(){const x=window.XLSX&&window.XLSX.utils;if(!x||!x.sheet_to_json||x.sheet_to_json.__proInvcWrapped)return;const old=x.sheet_to_json.bind(x);x.sheet_to_json=(...args)=>onlyInvc(old(...args));x.sheet_to_json.__proInvcWrapped=true;}
setInterval(()=>{patchApp();patchXlsx()},300);
})();
