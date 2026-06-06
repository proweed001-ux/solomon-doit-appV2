(()=>{'use strict';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const $=s=>document.querySelector(s);
const FAKE_STORE='__INSERT_PRODUCT_POOL__';
let basePayload=null,baseMeta={},patched=false;
function rowsOf(p){return p?.rows||p||[]}
function todayIso(){return new Date().toISOString().slice(0,10)}
function appKey(){return T(baseMeta.id||basePayload?.version_id||baseMeta.file_name||'active')||'active'}
function customKey(k=appKey()){return 'doit-insert-products-v309:'+T(k||'active')}
function customKeys(){const preferred=customKey();const active=customKey('active');return preferred===active?[preferred]:[preferred,active]}
function stateKey(){return 'doit-json:'+appKey()}
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function currentScope(){return{date:T($('#startDate')?.value)||T($('#endDate')?.value)||todayIso(),ps:cleanPs($('#psSelect')?.value)||'เพิ่มเอง',store:T($('#storeSelect')?.value)||'ไม่ระบุร้าน'}}
function customRows(){const seen=new Set(),out=[];customKeys().forEach(k=>read(k,[]).forEach(x=>{const id=T(x.id)||[x.date,x.ps,x.store,x.name,x.qty,x.unit,x.code].join('|');if(!T(x.name)||N(x.qty)<0||seen.has(id))return;seen.add(id);out.push(x)}));return out.filter(x=>T(x.name)&&N(x.qty)>=0)}
function toRow(x){return{date:T(x.date)||todayIso(),inv:'INSERT-'+T(x.id),store:T(x.store)||T($('#storeSelect')?.value)||'ไม่ระบุร้าน',tele:'',isTele:false,ps:T(x.ps)||'เพิ่มเอง',code:T(x.code),sku:T(x.name)||'สินค้าแทรก',brand:T(x.brand)||'แทรกสินค้า',size:T(x.size)||'เพิ่มเอง',type:'INSERT',qty:N(x.qty),unit:N(x.unit),amt:N(x.qty)*N(x.unit),manual:true,inserted:true}}
function augment(payload){const extras=customRows().map(toRow);if(!extras.length)return payload;const rows=rowsOf(payload);return Array.isArray(payload)?rows.concat(extras):{...payload,rows:rows.concat(extras)}}
function saveVisibleInputs(){const st=read(stateKey(),null);if(!st||typeof st!=='object')return;document.querySelectorAll('.jdata[data-map][data-k]').forEach(inp=>{const map=inp.dataset.map,k=inp.dataset.k;if(!map||!k||!(map in st))return;st[map]=st[map]||{};st[map][k]=N(inp.value)});localStorage.setItem(stateKey(),JSON.stringify(st))}
function removeFakeStore(){const sel=$('#storeSelect');if(!sel)return;[...sel.options].forEach(o=>{if(o.value===FAKE_STORE||o.textContent===FAKE_STORE)o.remove()})}
function msg(s){const m=$('#msg');if(m)m.textContent=s}
function addButton(){const a=document.querySelector('.actions');if(!a||$('#insertProductBtn309'))return;const b=document.createElement('button');b.id='insertProductBtn309';b.type='button';b.className='outline';b.textContent='+ แทรกสินค้า';b.onclick=insertProduct;a.prepend(b)}
function rebindButton(){const b=$('#insertProductBtn309');if(b)b.onclick=insertProduct}
function insertProduct(){const sc=currentScope();const name=T(prompt('ชื่อสินค้าที่ต้องการแทรก'));if(!name)return;const qty=N(prompt('จำนวนออเดอร์รวม','0'));const unit=N(prompt('ราคา/หน่วย ถ้าไม่รู้ใส่ 0','0'));const code=T(prompt('รหัสสินค้า ถ้ามี ไม่บังคับ',''));const arr=read(customKey(),[]);arr.push({id:Date.now(),date:sc.date,ps:sc.ps,store:sc.store,name,qty,unit,code,brand:'แทรกสินค้า',size:'เพิ่มเอง',manual:true,inserted:true});write(customKey(),arr);saveVisibleInputs();msg('แทรกสินค้าแล้ว: '+name+' จำนวน '+qty);rerender();document.dispatchEvent(new CustomEvent('doit:insertProductChanged',{detail:{name,qty,unit,code,date:sc.date,ps:sc.ps,store:sc.store}}))}
function rerender(){try{if(basePayload&&window.DOIT_JSON_APP){window.DOIT_JSON_APP.load(basePayload,baseMeta)}else{document.dispatchEvent(new CustomEvent('doit:stateChanged'))}}catch(e){console.warn('[insert-product-v309] rerender failed',e)}setTimeout(removeFakeStore,120);setTimeout(addButton,150);setTimeout(rebindButton,180);if(window.DOIT_REMAINING_COORDINATOR?.refresh){setTimeout(()=>window.DOIT_REMAINING_COORDINATOR.refresh(),200)}}
function patch(){const app=window.DOIT_JSON_APP;if(!app||app.__insertProduct309)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{basePayload=payload;baseMeta=m||{};const res=old(augment(payload),m);setTimeout(addButton,80);setTimeout(removeFakeStore,120);setTimeout(rebindButton,150);return res};app.__insertProduct309=true;patched=true;return true}
function boot(){patch();addButton();rebindButton();removeFakeStore();let n=0;const tick=()=>{patch();addButton();rebindButton();removeFakeStore();if(++n<30)setTimeout(tick,400)};setTimeout(tick,300)}
window.DOIT_INSERT_PRODUCT={insertProduct,customRows,customKey,rerender,health:()=>({patched,customKey:customKey(),count:customRows().length})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();