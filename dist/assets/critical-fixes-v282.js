(()=>{'use strict';
const T=v=>String(v??'').trim(),N=v=>Number(String(v??'').replace(/,/g,''))||0;
const sorter=new Intl.Collator('th-u-kn-true',{numeric:true,sensitivity:'base'});
let lastPayload=null,lastMeta={},allRows=[];
const $=s=>document.querySelector(s);
function norm(s){return T(s).toLowerCase().replace(/[\s_\-./()[\]:]+/g,'')}
function realTele(r){const tele=T(r.tele),ps=T(r.ps);if(!tele)return false;const kt=norm(tele),kp=norm(ps);if(kt&&kp&&(kt===kp||kp.includes(kt)||kt.includes(kp)))return false;return !!(r.isTele||tele)}
function appKey(){return lastMeta.id||lastPayload?.version_id||lastMeta.file_name||''}
function stateKey(){return 'doit-json:'+appKey()}
function manualKey(){return 'doit-manual-v1:'+appKey()}
function historyKey(){return 'doit-print-history-v1:'+appKey()}
function filters(){return{start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:T($('#psSelect')?.value),receiver:T($('#storeSelect')?.value)}}
function state(){try{return JSON.parse(localStorage.getItem(stateKey())||'{}')}catch{return{}}}
function saveState(s){localStorage.setItem(stateKey(),JSON.stringify(s||{}))}
function manuals(){try{return JSON.parse(localStorage.getItem(manualKey())||'[]')}catch{return[]}}
function saveManual(a){localStorage.setItem(manualKey(),JSON.stringify(a||[]))}
function history(){try{return JSON.parse(localStorage.getItem(historyKey())||'[]')}catch{return[]}}
function saveHistory(a){localStorage.setItem(historyKey(),JSON.stringify(a||[]))}
function pk(r){return [r.brand,r.size,r.code||r.sku,r.sku,r.type].join('|')}
function pkFromKey(k){return String(k).split('|').slice(4).join('|')}
function recFromKey(k){return String(k).split('|')[3]||''}
function scopeHead(){const f=filters();return[f.start,f.end,f.ps].join('|')+'|'}
function scopedRows(){const f=filters();return allRows.filter(r=>!realTele(r)&&(!f.start||r.date>=f.start)&&(!f.end||r.date<=f.end)&&(!f.ps||r.ps===f.ps))}
function group(){const m=new Map();scopedRows().forEach(r=>{const k=pk(r);let g=m.get(k);if(!g){g={poolKey:k,brand:r.brand,size:r.size,code:r.code,sku:r.sku,type:r.type,qty:0,amt:0,unit:r.unit||0};m.set(k,g)}g.qty+=N(r.qty);g.amt+=N(r.amt);g.unit=g.qty&&g.amt?g.amt/g.qty:g.unit});return[...m.values()].sort((a,b)=>sorter.compare(a.brand,b.brand)||sorter.compare(a.size,b.size)||sorter.compare(a.sku,b.sku))}
function manualInScope(){const f=filters();return manuals().filter(x=>(!f.start||x.start===f.start)&&(!f.end||x.end===f.end)&&(!f.ps||x.ps===f.ps)&&(!f.receiver||x.store===f.receiver))}
function deliveryLines(){const f=filters(),st=state(),send=st.send||{},gmap=new Map(group().map(g=>[g.poolKey,g])),out=[];Object.keys(send).filter(k=>k.startsWith(scopeHead())).forEach(k=>{const qty=N(send[k]);if(qty<=0)return;const rec=recFromKey(k),g=gmap.get(pkFromKey(k));if(g&&rec)out.push({store:rec,code:g.code||'',name:g.sku,brand:g.brand,size:g.size,type:g.type,qty,unit:g.unit||0,manual:false})});manualInScope().forEach(x=>out.push({store:x.store,code:x.code||'',name:x.name,brand:x.brand||'เพิ่มเอง',size:x.size||'',type:x.type||'MANUAL',qty:N(x.qty),unit:N(x.unit),manual:true,id:x.id}));return out}
function refreshApp(){try{document.body.classList.remove('printMode');$('#doitPrintOverlay')?.remove();if(lastPayload&&window.DOIT_JSON_APP?.load){window.DOIT_JSON_APP.load(lastPayload,lastMeta)}else{document.dispatchEvent(new CustomEvent('doit:stateChanged'))}}catch(e){console.warn('[critical-fixes-v282] refresh failed',e)}}
function closeSelectedReceiverNoReload(saveHist){const f=filters();if(!f.receiver){alert('กรุณาเลือกร้านจริงก่อนปิดบิลหรือล้างร้าน');return}const st=state(),head=[f.start,f.end,f.ps,f.receiver].join('|')+'|',removed=[];['send','add','pull'].forEach(k=>{const obj=st[k]||{};Object.keys(obj).forEach(x=>{if(x.startsWith(head)){removed.push({map:k,key:x,qty:N(obj[x])});delete obj[x]}});st[k]=obj});const ms=manuals(),keep=[];ms.forEach(x=>{if(x.store===f.receiver&&x.start===f.start&&x.end===f.end&&x.ps===f.ps){removed.push({map:'manual',item:x})}else keep.push(x)});if(!removed.length){alert('ร้านนี้ไม่มีรายการค้างในช่วงวันที่/PS นี้');return}if(saveHist){const h=history();h.unshift({at:new Date().toISOString(),store:f.receiver,start:f.start,end:f.end,ps:f.ps,items:deliveryLines().filter(x=>x.store===f.receiver)});saveHistory(h.slice(0,200))}saveState(st);saveManual(keep);alert(saveHist?'ปิดบิลและเก็บเข้า History แล้ว':'ล้างรายการของร้านนี้แล้ว');refreshApp()}
function patchJsonApp(){const app=window.DOIT_JSON_APP;if(!app||app.__criticalFix282)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{lastPayload=payload;lastMeta=m||{};allRows=(payload.rows||payload||[]).map(r=>({date:T(r.date),inv:T(r.inv),store:T(r.store),tele:T(r.tele),isTele:!!r.isTele,ps:T(r.ps),code:T(r.code),sku:T(r.sku),brand:T(r.brand),size:T(r.size),type:T(r.type)||'INVC',qty:N(r.qty),unit:N(r.unit),amt:N(r.amt)}));window.__doitAllRows=allRows;return old(payload,m)};app.rerender=refreshApp;app.__criticalFix282=true;return true}
function patchTeleDrawer(){const d=window.DOIT_TELESALE_DRAWER;if(!d||d.__criticalFix282||!d.loadRows)return false;const old=d.loadRows.bind(d);d.loadRows=(data,ctx)=>{const source=(window.__doitAllRows&&window.__doitAllRows.length)?window.__doitAllRows:data;return old(source,ctx)};d.__criticalFix282=true;return true}
function bindCloseButtons(){if(document.__criticalFix282Click)return;document.__criticalFix282Click=true;document.addEventListener('click',e=>{const id=e.target?.id;if(id==='doitConfirmPrint'||id==='closeBillBtn'||id==='clearStoreBtn'){e.preventDefault();e.stopImmediatePropagation();closeSelectedReceiverNoReload(id!=='clearStoreBtn')}},true)}
function boot(){patchJsonApp();patchTeleDrawer();bindCloseButtons();let n=0;const tick=()=>{patchJsonApp();patchTeleDrawer();if(++n<30)setTimeout(tick,300)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();