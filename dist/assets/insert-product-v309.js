(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const $=s=>document.querySelector(s);
const FAKE_STORE='__INSERT_PRODUCT_POOL__';
let basePayload=null,baseMeta={},patched=false,busy=false;
function rowsOf(p){return p?.rows||p||[]}
function isInsertRow(r){return T(r?.store)===FAKE_STORE||T(r?.type)==='INSERT'||T(r?.inv).startsWith('INSERT-')}
function cleanRows(rows){return(rows||[]).filter(r=>!isInsertRow(r))}
function cleanPayload(payload){const rows=cleanRows(rowsOf(payload));return Array.isArray(payload)?rows:{...(payload||{}),rows}}
function appKey(){return T(baseMeta.id||basePayload?.version_id||baseMeta.file_name||$('#fileLabel')?.textContent||'active')}
function customKey(){return 'doit-insert-products-v309:'+appKey()}
function stateKey(){return 'doit-json:'+appKey()}
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function currentScope(){return{date:T($('#startDate')?.value)||T($('#endDate')?.value),ps:cleanPs($('#psSelect')?.value)||'เพิ่มเอง',brand:T($('#brandSelect')?.value)||'แทรกสินค้า',type:T($('#typeSelect')?.value)||'INVC'}}
function currentUi(){return{start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:T($('#psSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),store:T($('#storeSelect')?.value),q:T($('#q')?.value)}}
function restoreUi(s){setTimeout(()=>{try{if($('#startDate'))$('#startDate').value=s.start||$('#startDate').value;if($('#endDate'))$('#endDate').value=s.end||$('#endDate').value;if($('#psSelect'))$('#psSelect').value=s.ps||'';if($('#brandSelect'))$('#brandSelect').value=s.brand||'';if($('#typeSelect'))$('#typeSelect').value=s.type||'';if($('#storeSelect'))$('#storeSelect').value=s.store||'';if($('#q'))$('#q').value=s.q||''}catch(e){}},0)}
function customRows(){return read(customKey(),[]).filter(x=>T(x.name)&&N(x.qty)>0)}
function toRow(x){return{date:T(x.date),inv:'INSERT-'+T(x.id),store:FAKE_STORE,tele:'',isTele:false,ps:T(x.ps)||'เพิ่มเอง',code:T(x.code),sku:T(x.name)||'สินค้าแทรก',brand:T(x.brand)||'แทรกสินค้า',size:T(x.size)||'เพิ่มเอง',type:T(x.type)||'INVC',qty:N(x.qty),unit:N(x.unit),amt:N(x.qty)*N(x.unit)}}
function augment(payload){const clean=cleanPayload(payload);const extras=customRows().map(toRow);const rows=rowsOf(clean);const out=extras.length?rows.concat(extras):rows;return Array.isArray(clean)?out:{...clean,rows:out}}
function saveVisibleInputs(){const st=read(stateKey(),null);if(!st||typeof st!=='object')return;document.querySelectorAll('.jdata[data-map][data-k]').forEach(inp=>{const map=inp.dataset.map,k=inp.dataset.k;if(!map||!k)return;st[map]=st[map]||{};const n=N(inp.value);if(n>0)st[map][k]=n;else delete st[map][k]});localStorage.setItem(stateKey(),JSON.stringify(st))}
function removeFakeStore(){const sel=$('#storeSelect');if(!sel)return;[...sel.options].forEach(o=>{if(o.value===FAKE_STORE||o.textContent===FAKE_STORE)o.remove()})}
function msg(s){const m=$('#msg');if(m)m.textContent=s}
function addButton(){const a=document.querySelector('.actions');if(!a)return;let b=$('#insertProductBtn309');if(!b){b=document.createElement('button');b.id='insertProductBtn309';b.type='button';b.className='outline';b.textContent='+ แทรกสินค้า';a.prepend(b)}b.onclick=insertProduct}
function getRowsFromGlobals(){if(Array.isArray(window.__doitAllRows)&&window.__doitAllRows.length)return cleanRows(window.__doitAllRows);if(Array.isArray(window.__doitRawRows290)&&window.__doitRawRows290.length)return cleanRows(window.__doitRawRows290);return[]}
function ensurePayload(){if(basePayload&&rowsOf(basePayload).length)return true;const rows=getRowsFromGlobals();if(rows.length){basePayload={rows};baseMeta={file_name:T($('#fileLabel')?.textContent).replace(/^JSON Cloud:\s*/,'')||'active-json'};return true}return false}
function insertProduct(e){e?.preventDefault?.();e?.stopPropagation?.();if(busy)return;busy=true;setTimeout(()=>busy=false,700);if(!ensurePayload()){alert('กรุณาโหลดไฟล์ DOIT หรือกดโหลดไฟล์ล่าสุดจาก Cloud ก่อน');return}const sc=currentScope();if(!sc.date){alert('กรุณาเลือกวันที่ก่อนแทรกสินค้า');return}const name=T(prompt('ชื่อสินค้าที่ต้องการแทรก'));if(!name)return;const qty=N(prompt('จำนวนออเดอร์รวม','1'));if(qty<=0){alert('จำนวนออเดอร์ต้องมากกว่า 0');return}const unit=N(prompt('ราคา/หน่วย ถ้าไม่รู้ใส่ 0','0'));const code=T(prompt('รหัสสินค้า ถ้ามี ไม่บังคับ',''));
const arr=customRows();arr.push({id:Date.now(),date:sc.date,ps:sc.ps,name,qty,unit,code,brand:sc.brand,size:'เพิ่มเอง',type:sc.type});write(customKey(),arr);saveVisibleInputs();msg('แทรกสินค้าแล้ว: '+name+' จำนวน '+qty);rerender()}
function rerender(){if(!ensurePayload()||!window.DOIT_JSON_APP)return;const ui=currentUi();try{window.DOIT_JSON_APP.load(basePayload,baseMeta)}catch(e){console.warn('[insert-product-v309] rerender failed',e)}restoreUi(ui);setTimeout(removeFakeStore,120);setTimeout(addButton,150)}
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__insertProduct309)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const clean=cleanPayload(payload);basePayload=clean;baseMeta=m||{};const ui=currentUi();const res=old(augment(clean),m);restoreUi(ui);setTimeout(addButton,80);setTimeout(removeFakeStore,120);return res};app.__insertProduct309=true;patched=true;return true}
function boot(){patch();addButton();removeFakeStore();let n=0;const tick=()=>{patch();addButton();removeFakeStore();ensurePayload();if(++n<60)setTimeout(tick,500)};setTimeout(tick,300)}
window.DOIT_INSERT_PRODUCT={insertProduct,customRows,customKey,rerender,health:()=>({patched,customKey:customKey(),count:customRows().length,baseRows:rowsOf(basePayload).length,globalRows:getRowsFromGlobals().length})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();