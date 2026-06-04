(()=>{'use strict';
const T=v=>String(v??'').trim(),N=v=>Number(String(v??'').replace(/,/g,''))||0,F=n=>N(n).toLocaleString('th-TH');
const $=s=>document.querySelector(s),sorter=new Intl.Collator('th-u-kn-true',{numeric:true,sensitivity:'base'});
let fullPayload=null,fullRows=[],meta={};
function norm(s){return T(s).toLowerCase().replace(/[\s_\-./()[\]:]+/g,'')}
function cleanPs(v){const p=T(v).split(/\s+/).filter(Boolean);if(p.length===2&&p[0]===p[1])return p[0];const out=[];p.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function psList(){const a=(window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean);if(a.length)return a;const p=cleanPs($('#psSelect')?.value);return p?[p]:[]}
function psOk(r){const a=psList();return !a.length||a.includes(cleanPs(r.ps))}
function filters(){return{start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:T($('#psSelect')?.value),receiver:T($('#storeSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),q:T($('#q')?.value).toLowerCase()}}
function scopeHead(){return window.DOIT_SCOPE_HEAD?.()||[T($('#startDate')?.value),T($('#endDate')?.value),T($('#psSelect')?.value)].join('|')+'|'}
function realTele(r){const tele=T(r.tele),ps=T(r.ps),a=norm(tele),b=norm(ps);return !!tele&&!(a&&b&&(a===b||a.includes(b)||b.includes(a)))}
function appKey(){return meta.id||fullPayload?.version_id||meta.file_name||''}
function state(){try{return JSON.parse(localStorage.getItem('doit-json:'+appKey())||'{}')}catch{return{}}}
function saveState(s){localStorage.setItem('doit-json:'+appKey(),JSON.stringify(s||{}))}
function hist(){try{return JSON.parse(localStorage.getItem('doit-print-history-v1:'+appKey())||'[]')}catch{return[]}}
function saveHist(h){localStorage.setItem('doit-print-history-v1:'+appKey(),JSON.stringify(h||[]))}
function pk(r){return[r.brand,r.size,r.code||r.sku,r.sku,r.type].join('|')}
function pkFromKey(k){return String(k).split('|').slice(4).join('|')}
function recFromKey(k){return String(k).split('|')[3]||''}
function scopeRows(){const f=filters();return fullRows.filter(r=>!realTele(r)&&psOk(r)&&(!f.start||r.date>=f.start)&&(!f.end||r.date<=f.end)&&(!f.brand||r.brand===f.brand)&&(!f.type||r.type===f.type)&&(!f.q||[r.date,r.inv,r.code,r.sku,r.store,r.ps,r.brand,r.size,r.type].join(' ').toLowerCase().includes(f.q)))}
function group(rows=scopeRows()){const m=new Map();rows.forEach(r=>{const k=pk(r);let g=m.get(k);if(!g){g={poolKey:k,brand:r.brand,size:r.size,code:r.code,sku:r.sku,type:r.type,qty:0,unit:r.unit||0};m.set(k,g)}g.qty+=N(r.qty);g.unit=g.unit||r.unit||0});return[...m.values()].sort((a,b)=>sorter.compare(a.brand,b.brand)||sorter.compare(a.size,b.size)||sorter.compare(a.sku,b.sku))}
function deliveryLines(){const st=state(),send=st.send||{},gm=new Map(group(scopeRows().filter(r=>!filters().q)).map(g=>[g.poolKey,g])),out=[];Object.keys(send).filter(k=>k.startsWith(scopeHead())).forEach(k=>{const q=N(send[k]);if(q<=0)return;const g=gm.get(pkFromKey(k)),rec=recFromKey(k);if(g&&rec)out.push({store:rec,code:g.code||'',name:g.sku,brand:g.brand,size:g.size,type:g.type,qty:q,unit:g.unit||0})});return out}
function refresh(){document.body.classList.remove('printMode');$('#doitPrintOverlay')?.remove();window.DOIT_JSON_APP?.rerender?.()||document.dispatchEvent(new CustomEvent('doit:stateChanged'))}
function closeStore(save){const f=filters();if(!f.receiver){alert('กรุณาเลือกร้านจริงก่อนปิดบิลหรือล้างร้าน');return}const st=state(),head=scopeHead()+f.receiver+'|',removed=[];['send','add','pull'].forEach(k=>{const obj=st[k]||{};Object.keys(obj).forEach(x=>{if(x.startsWith(head)){removed.push(x);delete obj[x]}});st[k]=obj});if(!removed.length){alert('ร้านนี้ไม่มีรายการค้างในช่วงวันที่/PS นี้');return}if(save){const h=hist();h.unshift({at:new Date().toISOString(),store:f.receiver,start:f.start,end:f.end,ps:f.ps,items:deliveryLines().filter(x=>x.store===f.receiver)});saveHist(h.slice(0,200))}saveState(st);alert(save?'ปิดบิลและเก็บเข้า History แล้ว':'ล้างรายการของร้านนี้แล้ว');refresh()}
function patchLoad(){const app=window.DOIT_JSON_APP;if(!app||app.__fieldLogic308)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{meta=m||{};fullPayload=payload;const arr=payload?.rows||payload||[];fullRows=Array.isArray(arr)?arr.map(r=>({date:T(r.date),inv:T(r.inv),store:T(r.store),tele:T(r.tele),isTele:!!r.isTele,ps:cleanPs(r.ps),code:T(r.code),sku:T(r.sku),brand:T(r.brand),size:T(r.size),type:T(r.type)||'INVC',qty:N(r.qty),unit:N(r.unit),amt:N(r.amt)})):[];window.__doitAllRows=fullRows;const list=psList(),set=new Set(list);const filtered=list.length?fullRows.filter(r=>set.has(cleanPs(r.ps))):fullRows;return old(Array.isArray(payload)?filtered:{...payload,rows:filtered},m)};app.rerender=()=>{if(fullPayload)app.load(fullPayload,meta)};app.__fieldLogic308=true;return true}
function patchTelesale(){const d=window.DOIT_TELESALE_DRAWER;if(!d||d.__fieldLogic308||!d.loadRows)return false;const old=d.loadRows.bind(d);d.loadRows=(data,ctx={})=>old(fullRows.length?fullRows:data,{...ctx,psList:psList(),psKey:psList().join('||')});d.__fieldLogic308=true;return true}
function bind(){if(document.__fieldLogic308Click)return;document.__fieldLogic308Click=true;document.addEventListener('click',e=>{const id=e.target?.id;if(id==='doitConfirmPrint'||id==='closeBillBtn'||id==='clearStoreBtn'){e.preventDefault();e.stopImmediatePropagation();closeStore(id!=='clearStoreBtn')}},true)}
function boot(){patchLoad();patchTelesale();bind();let n=0;const tick=()=>{patchLoad();patchTelesale();if(++n<30)setTimeout(tick,300)};setTimeout(tick,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();