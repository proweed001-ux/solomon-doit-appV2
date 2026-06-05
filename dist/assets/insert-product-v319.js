(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const $=s=>document.querySelector(s);
const FAKE_STORE='__INSERT_PRODUCT_POOL__';
let basePayload=null,baseMeta={},patched=false,inserting=false;
function rowsOf(p){return p?.rows||p||[]}
function isInsertRow(r){return T(r?.store)===FAKE_STORE||T(r?.type)==='INSERT'||T(r?.inv).startsWith('INSERT-')}
function cleanRows(rows){return(rows||[]).filter(r=>!isInsertRow(r))}
function cleanPayload(payload){const rows=cleanRows(rowsOf(payload));return Array.isArray(payload)?rows:{...(payload||{}),rows}}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function appKey(){return T(baseMeta.id||basePayload?.version_id||baseMeta.file_name||$('#fileLabel')?.textContent||'active')}
function customKey(){return 'doit-insert-products-v319:'+appKey()}
function legacyKeys(){return['doit-insert-products-v318:'+appKey(),'doit-insert-products-v316:'+appKey(),'doit-insert-products-v315:'+appKey(),'doit-insert-products-v314:'+appKey(),'doit-insert-products-v313:'+appKey(),'doit-insert-products-v309:'+appKey()]}
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
function getRowsFromGlobals(){if(Array.isArray(window.__doitAllRows)&&window.__doitAllRows.length)return cleanRows(window.__doitAllRows);if(Array.isArray(window.__doitRawRows290)&&window.__doitRawRows290.length)return cleanRows(window.__doitRawRows290);if(Array.isArray(window.__doitTeleRows316)&&window.__doitTeleRows316.length)return cleanRows(window.__doitTeleRows316);return[]}
function ensurePayload(){if(basePayload&&rowsOf(basePayload).length)return true;const gr=getRowsFromGlobals();if(gr.length){basePayload={rows:gr};baseMeta={file_name:T($('#fileLabel')?.textContent).replace(/^JSON Cloud:\s*/,'')||'active-json'};return true}return false}
function currentFilters(){return{start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:cleanPs($('#psSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),store:T($('#storeSelect')?.value),q:T($('#q')?.value)}}
function rememberScope(){return currentFilters()}
function restoreScope(s){if(!s)return;setTimeout(()=>{try{if($('#startDate'))$('#startDate').value=s.start||$('#startDate').value;if($('#endDate'))$('#endDate').value=s.end||$('#endDate').value;if($('#psSelect'))$('#psSelect').value=s.ps||'';if($('#brandSelect'))$('#brandSelect').value=s.brand||'';if($('#typeSelect'))$('#typeSelect').value=s.type||'';if($('#storeSelect'))$('#storeSelect').value=s.store||'';if($('#q'))$('#q').value=s.q||''}catch(e){}},0)}
function customRows(){let arr=read(customKey(),[]);if(!arr.length){for(const k of legacyKeys()){const old=read(k,[]);if(old.length){arr=old;write(customKey(),arr);break}}}return arr.filter(x=>T(x.name)&&N(x.qty)>0)}
function toRow(x){return{date:T(x.date),inv:'INSERT-'+T(x.id),store:FAKE_STORE,tele:'',isTele:false,ps:T(x.ps)||'เพิ่มเอง',code:T(x.code),sku:T(x.name)||'สินค้าแทรก',brand:T(x.brand)||'แทรกสินค้า',size:T(x.size)||'เพิ่มเอง',type:T(x.type)||'INVC',qty:N(x.qty),unit:N(x.unit),amt:N(x.qty)*N(x.unit)}}
function augment(payload){const clean=cleanPayload(payload),extras=customRows().map(toRow),rows=rowsOf(clean);const out=extras.length?rows.concat(extras):rows;return Array.isArray(clean)?out:{...clean,rows:out}}
function scopeForNewRow(){const f=currentFilters();return{date:f.start||f.end,ps:f.ps||'เพิ่มเอง',brand:f.brand||'แทรกสินค้า',type:f.type||'INVC',q:f.q}}
function removeFakeStore(){const sel=$('#storeSelect');if(!sel)return;[...sel.options].forEach(o=>{if(o.value===FAKE_STORE||o.textContent===FAKE_STORE)o.remove()})}
function msg(s){const m=$('#msg');if(m)m.textContent=s}
function addButton(){const a=document.querySelector('.actions');if(!a)return;let b=$('#insertProductBtn319')||$('#insertProductBtn318')||$('#insertProductBtn316')||$('#insertProductBtn315')||$('#insertProductBtn314')||$('#insertProductBtn313')||$('#insertProductBtn309');if(!b){b=document.createElement('button');b.id='insertProductBtn319';b.type='button';b.className='outline';b.textContent='+ แทรกสินค้า';a.prepend(b)}b.id='insertProductBtn319';b.onclick=null;b.dataset.insertVersion='v319'}
function dispatchFilters(){setTimeout(()=>{try{['psSelect','startDate','endDate','brandSelect','typeSelect'].forEach(id=>{const el=$('#'+id);if(el)el.dispatchEvent(new Event('change',{bubbles:true}))});const q=$('#q');if(q)q.dispatchEvent(new Event('input',{bubbles:true}));document.dispatchEvent(new CustomEvent('doit:stateChanged'))}catch(e){}},260)}
function insertProduct(){if(inserting)return;inserting=true;const keep=rememberScope();try{patch();if(!ensurePayload()){alert('กรุณากดโหลดไฟล์ล่าสุดจาก Cloud ก่อน');return}const sc=scopeForNewRow();if(!sc.date){alert('กรุณาเลือกวันที่ก่อนแทรกสินค้า');return}const name=T(prompt('ชื่อสินค้าที่ต้องการแทรก'));if(!name)return;const qty=N(prompt('จำนวนออเดอร์รวม','1'));if(qty<=0){alert('จำนวนออเดอร์ต้องมากกว่า 0');return}const unit=N(prompt('ราคา/หน่วย ถ้าไม่รู้ใส่ 0','0'));const code=T(prompt('รหัสสินค้า ถ้ามี ไม่บังคับ',''));
const arr=customRows().filter(x=>T(x.id));arr.push({id:Date.now(),date:sc.date,ps:sc.ps,name,qty,unit,code,brand:sc.brand,size:'เพิ่มเอง',type:sc.type});write(customKey(),arr);msg('แทรกสินค้าแล้ว: '+name+' จำนวน '+qty);rerender(keep);dispatchFilters()}finally{setTimeout(()=>{inserting=false},700)}}
function rerender(scope){if(!ensurePayload()||!window.DOIT_JSON_APP)return;const keep=scope||rememberScope();try{window.DOIT_JSON_APP.load(basePayload,baseMeta)}catch(e){console.warn('[insert-product-v319] rerender failed',e)}restoreScope(keep);setTimeout(removeFakeStore,120);setTimeout(addButton,150)}
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__insertProduct319)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const clean=cleanPayload(payload);basePayload=clean;baseMeta=m||{};const scope=rememberScope();const res=old(augment(clean),m);restoreScope(scope);setTimeout(addButton,80);setTimeout(removeFakeStore,120);return res};app.__insertProduct319=true;patched=true;return true}
function captureClick(e){const b=e.target&&e.target.closest&&e.target.closest('#insertProductBtn319,#insertProductBtn318,#insertProductBtn316,#insertProductBtn315,#insertProductBtn314,#insertProductBtn313,#insertProductBtn309');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();insertProduct()}
function boot(){patch();addButton();removeFakeStore();if(!document.__insertProduct319Capture){document.__insertProduct319Capture=true;document.addEventListener('click',captureClick,true)}let n=0;const tick=()=>{patch();addButton();ensurePayload();removeFakeStore();if(++n<900)setTimeout(tick,1000)};setTimeout(tick,300)}
window.DOIT_INSERT_PRODUCT={insertProduct,customRows,customKey,rerender,health:()=>({version:'v319',patched,customKey:customKey(),count:customRows().length,baseRows:rowsOf(basePayload).length,globalRows:getRowsFromGlobals().length,filters:currentFilters()})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();