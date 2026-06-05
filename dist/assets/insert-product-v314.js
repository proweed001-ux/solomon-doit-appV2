(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const $=s=>document.querySelector(s);
const FAKE_STORE='__INSERT_PRODUCT_POOL__';
let basePayload=null,baseMeta={},patched=false,lastKnownRows=[];
function rowsOf(p){return p?.rows||p||[]}
function isInsertRow(r){return T(r?.store)===FAKE_STORE||T(r?.type)==='INSERT'||T(r?.inv).startsWith('INSERT-')}
function stripInsertedRows(rows){return (rows||[]).filter(r=>!isInsertRow(r))}
function cleanPayload(payload){const rows=stripInsertedRows(rowsOf(payload));return Array.isArray(payload)?rows:{...(payload||{}),rows}}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function appKey(){return T(baseMeta.id||basePayload?.version_id||baseMeta.file_name||$('#fileLabel')?.textContent||'active')}
function customKey(){return 'doit-insert-products-v314:'+appKey()}
function legacyKeys(){return['doit-insert-products-v313:'+appKey(),'doit-insert-products-v309:'+appKey()]}
function stateKey(){return 'doit-json:'+appKey()}
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
function rememberScope(){return{start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:T($('#psSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),store:T($('#storeSelect')?.value),q:T($('#q')?.value)}}
function restoreScope(s){if(!s)return;setTimeout(()=>{try{if($('#startDate')&&s.start)$('#startDate').value=s.start;if($('#endDate')&&s.end)$('#endDate').value=s.end;if($('#psSelect'))$('#psSelect').value=s.ps||'';if($('#brandSelect'))$('#brandSelect').value=s.brand||'';if($('#typeSelect'))$('#typeSelect').value=s.type||'';if($('#storeSelect'))$('#storeSelect').value=s.store||'';if($('#q'))$('#q').value=s.q||''}catch(e){}},0)}
function currentScope(){const start=T($('#startDate')?.value),end=T($('#endDate')?.value),ps=cleanPs($('#psSelect')?.value);return{date:start||end,ps:ps||'เพิ่มเอง'}}
function customRows(){let arr=read(customKey(),[]);if(!arr.length){for(const k of legacyKeys()){const old=read(k,[]);if(old.length){arr=old;write(customKey(),arr);break}}}return arr.filter(x=>T(x.name)&&N(x.qty)>0)}
function toRow(x){return{date:T(x.date),inv:'INSERT-'+T(x.id),store:FAKE_STORE,tele:'',isTele:false,ps:T(x.ps)||'เพิ่มเอง',code:T(x.code),sku:T(x.name)||'สินค้าแทรก',brand:T(x.brand)||'แทรกสินค้า',size:T(x.size)||'เพิ่มเอง',type:'INSERT',qty:N(x.qty),unit:N(x.unit),amt:N(x.qty)*N(x.unit)}}
function augment(payload){const clean=cleanPayload(payload),extras=customRows().map(toRow);const rows=rowsOf(clean);const outRows=extras.length?rows.concat(extras):rows;return Array.isArray(clean)?outRows:{...clean,rows:outRows}}
function saveVisibleInputs(){const st=read(stateKey(),null);if(!st||typeof st!=='object')return;document.querySelectorAll('.jdata[data-map][data-k]').forEach(inp=>{const map=inp.dataset.map,k=inp.dataset.k;if(!map||!k)return;st[map]=st[map]||{};st[map][k]=N(inp.value)});localStorage.setItem(stateKey(),JSON.stringify(st))}
function removeFakeStore(){const sel=$('#storeSelect');if(!sel)return;[...sel.options].forEach(o=>{if(o.value===FAKE_STORE||o.textContent===FAKE_STORE)o.remove()})}
function msg(s){const m=$('#msg');if(m)m.textContent=s}
function addButton(){const a=document.querySelector('.actions');if(!a)return;let b=$('#insertProductBtn309')||$('#insertProductBtn313')||$('#insertProductBtn314');if(!b){b=document.createElement('button');b.id='insertProductBtn314';b.type='button';b.className='outline';b.textContent='+ แทรกสินค้า';a.prepend(b)}b.onclick=insertProduct;b.dataset.insertVersion='v314'}
function inferLoadedPayload(){if(basePayload&&rowsOf(basePayload).length)return true;if(Array.isArray(window.__doitAllRows)&&window.__doitAllRows.length){basePayload={rows:stripInsertedRows(window.__doitAllRows)};baseMeta={file_name:T($('#fileLabel')?.textContent).replace(/^JSON Cloud:\s*/,'')||'active-json'};lastKnownRows=rowsOf(basePayload);return true}if(window.DOIT_JSON_APP&&Array.isArray(window.DOIT_TELESALE_META_FIX?.debug?.()?.rawRows)){return true}return false}
function insertProduct(){patch();if(!inferLoadedPayload()){alert('กรุณาโหลดไฟล์ DOIT หรือกดโหลดไฟล์ล่าสุดจาก Cloud ก่อน');return}const sc=currentScope();if(!sc.date){alert('กรุณาเลือกวันที่ก่อนแทรกสินค้า');return}const name=T(prompt('ชื่อสินค้าที่ต้องการแทรก'));if(!name)return;const qty=N(prompt('จำนวนออเดอร์รวม','1'));if(qty<=0){alert('จำนวนออเดอร์ต้องมากกว่า 0');return}const unit=N(prompt('ราคา/หน่วย ถ้าไม่รู้ใส่ 0','0'));const code=T(prompt('รหัสสินค้า ถ้ามี ไม่บังคับ',''));
const arr=customRows().filter(x=>T(x.id));arr.push({id:Date.now(),date:sc.date,ps:sc.ps,name,qty,unit,code,brand:'แทรกสินค้า',size:'เพิ่มเอง'});write(customKey(),arr);saveVisibleInputs();msg('แทรกสินค้าแล้ว: '+name+' จำนวน '+qty);rerender({keepScope:true})}
function clearInsertedProducts(){if(!confirm('ล้างรายการสินค้าที่แทรกเองทั้งหมดหรือไม่?'))return;write(customKey(),[]);msg('ล้างสินค้าแทรกเองแล้ว');rerender({keepScope:true})}
function rerender(opt={}){patch();if(!basePayload||!window.DOIT_JSON_APP)return;const scope=opt.keepScope?rememberScope():null;try{window.DOIT_JSON_APP.load(basePayload,baseMeta)}catch(e){console.warn('[insert-product-v314] rerender failed',e)}restoreScope(scope);setTimeout(removeFakeStore,120);setTimeout(addButton,150);setTimeout(()=>{if(scope&&$('#psSelect')){const ev=new Event('change',{bubbles:true});$('#psSelect').dispatchEvent(ev)}},220)}
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__insertProduct314)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const clean=cleanPayload(payload);basePayload=clean;baseMeta=m||{};lastKnownRows=rowsOf(clean);const scope=rememberScope();const res=old(augment(clean),m);restoreScope(scope);setTimeout(addButton,80);setTimeout(removeFakeStore,120);setTimeout(removeFakeStore,700);return res};app.__insertProduct314=true;patched=true;return true}
function boot(){patch();addButton();removeFakeStore();let n=0;const tick=()=>{patch();addButton();inferLoadedPayload();removeFakeStore();if(++n<900)setTimeout(tick,1000)};setTimeout(tick,300);['change','input'].forEach(ev=>document.addEventListener(ev,e=>{if(['psSelect','startDate','endDate','brandSelect','typeSelect','q'].includes(e.target?.id)){setTimeout(removeFakeStore,80)}},true))}
window.DOIT_INSERT_PRODUCT={insertProduct,clearInsertedProducts,customRows,customKey,rerender,health:()=>({version:'v314',patched,customKey:customKey(),count:customRows().length,baseRows:rowsOf(basePayload).length,lastKnownRows:lastKnownRows.length,hasJsonApp:!!window.DOIT_JSON_APP,hasAllRows:Array.isArray(window.__doitAllRows)?window.__doitAllRows.length:0})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();