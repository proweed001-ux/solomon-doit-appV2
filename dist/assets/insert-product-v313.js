(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const $=s=>document.querySelector(s);
const FAKE_STORE='__INSERT_PRODUCT_POOL__';
let basePayload=null,baseMeta={},patched=false;
function rowsOf(p){return p?.rows||p||[]}
function isInsertRow(r){return T(r?.store)===FAKE_STORE||T(r?.type)==='INSERT'||T(r?.inv).startsWith('INSERT-')}
function stripInsertedRows(rows){return (rows||[]).filter(r=>!isInsertRow(r))}
function cleanPayload(payload){const rows=stripInsertedRows(rowsOf(payload));return Array.isArray(payload)?rows:{...(payload||{}),rows}}
function appKey(){return T(baseMeta.id||basePayload?.version_id||baseMeta.file_name||'active')}
function customKey(){return 'doit-insert-products-v313:'+appKey()}
function oldCustomKey(){return 'doit-insert-products-v309:'+appKey()}
function stateKey(){return 'doit-json:'+appKey()}
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function currentScope(){const start=T($('#startDate')?.value),end=T($('#endDate')?.value);return{date:start||end,ps:cleanPs($('#psSelect')?.value)||'เพิ่มเอง'}}
function customRows(){const now=read(customKey(),[]),old=read(oldCustomKey(),[]);if(!now.length&&old.length){write(customKey(),old);return old.filter(x=>T(x.name)&&N(x.qty)>0)}return now.filter(x=>T(x.name)&&N(x.qty)>0)}
function toRow(x){return{date:T(x.date),inv:'INSERT-'+T(x.id),store:FAKE_STORE,tele:'',isTele:false,ps:T(x.ps)||'เพิ่มเอง',code:T(x.code),sku:T(x.name)||'สินค้าแทรก',brand:T(x.brand)||'แทรกสินค้า',size:T(x.size)||'เพิ่มเอง',type:'INSERT',qty:N(x.qty),unit:N(x.unit),amt:N(x.qty)*N(x.unit)}}
function augment(payload){const clean=cleanPayload(payload),extras=customRows().map(toRow);if(!extras.length)return clean;const rows=rowsOf(clean);return Array.isArray(clean)?rows.concat(extras):{...clean,rows:rows.concat(extras)}}
function saveVisibleInputs(){const st=read(stateKey(),null);if(!st||typeof st!=='object')return;document.querySelectorAll('.jdata[data-map][data-k]').forEach(inp=>{const map=inp.dataset.map,k=inp.dataset.k;if(!map||!k)return;st[map]=st[map]||{};st[map][k]=N(inp.value)});localStorage.setItem(stateKey(),JSON.stringify(st))}
function removeFakeStore(){const sel=$('#storeSelect');if(!sel)return;[...sel.options].forEach(o=>{if(o.value===FAKE_STORE||o.textContent===FAKE_STORE)o.remove()})}
function msg(s){const m=$('#msg');if(m)m.textContent=s}
function addButton(){const a=document.querySelector('.actions');if(!a)return;let b=$('#insertProductBtn309')||$('#insertProductBtn313');if(!b){b=document.createElement('button');b.id='insertProductBtn313';b.type='button';b.className='outline';b.textContent='+ แทรกสินค้า';a.prepend(b)}b.onclick=insertProduct;b.dataset.insertVersion='v313'}
function insertProduct(){if(!basePayload){alert('กรุณาโหลดไฟล์ DOIT ก่อน');return}const sc=currentScope();if(!sc.date){alert('กรุณาเลือกวันที่ก่อนแทรกสินค้า');return}const name=T(prompt('ชื่อสินค้าที่ต้องการแทรก'));if(!name)return;const qty=N(prompt('จำนวนออเดอร์รวม','1'));if(qty<=0){alert('จำนวนออเดอร์ต้องมากกว่า 0');return}const unit=N(prompt('ราคา/หน่วย ถ้าไม่รู้ใส่ 0','0'));const code=T(prompt('รหัสสินค้า ถ้ามี ไม่บังคับ',''));
const arr=customRows().filter(x=>T(x.id));arr.push({id:Date.now(),date:sc.date,ps:sc.ps,name,qty,unit,code,brand:'แทรกสินค้า',size:'เพิ่มเอง'});write(customKey(),arr);saveVisibleInputs();msg('แทรกสินค้าแล้ว: '+name+' จำนวน '+qty);rerender()}
function clearInsertedProducts(){if(!confirm('ล้างรายการสินค้าที่แทรกเองทั้งหมดหรือไม่?'))return;write(customKey(),[]);msg('ล้างสินค้าแทรกเองแล้ว');rerender()}
function rerender(){if(!basePayload||!window.DOIT_JSON_APP)return;try{window.DOIT_JSON_APP.load(basePayload,baseMeta)}catch(e){console.warn('[insert-product-v313] rerender failed',e)}setTimeout(removeFakeStore,120);setTimeout(addButton,150)}
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__insertProduct313)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{const clean=cleanPayload(payload);basePayload=clean;baseMeta=m||{};const res=old(augment(clean),m);setTimeout(addButton,80);setTimeout(removeFakeStore,120);setTimeout(removeFakeStore,700);return res};app.__insertProduct313=true;patched=true;return true}
function boot(){patch();addButton();removeFakeStore();let n=0;const tick=()=>{patch();addButton();removeFakeStore();if(++n<80)setTimeout(tick,400)};setTimeout(tick,300)}
window.DOIT_INSERT_PRODUCT={insertProduct,clearInsertedProducts,customRows,customKey,rerender,health:()=>({version:'v313',patched,customKey:customKey(),count:customRows().length,baseRows:rowsOf(basePayload).length})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();