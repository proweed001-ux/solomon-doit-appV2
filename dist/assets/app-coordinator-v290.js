(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.0';
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
let sourcePayload=null,sourceMeta={},rawRows=[],patched=false,coreLoad=null,cleaned=false;
const $=s=>document.querySelector(s);
function rowsOf(p){return p?.rows||p||[]}
function dates(){return[...new Set(rawRows.map(r=>T(r.date)).filter(Boolean))].sort()}
function cleanPs(v){const parts=T(v).split(/\s+/).filter(Boolean);if(!parts.length)return'';if(parts.length===2&&parts[0]===parts[1])return parts[0];const out=[];parts.forEach(x=>{if(!out.includes(x))out.push(x)});return out.join(' ')}
function selectedDates(){return[...new Set((window.DOIT_SELECTED_DATES||[]).map(T).filter(Boolean))].sort()}
function selectedPs(){return[...new Set((window.DOIT_SELECTED_PS_LIST||[]).map(cleanPs).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'))}
function getScope(){return{dates:selectedDates(),dateKey:T(window.DOIT_SELECTED_DATE_KEY),ps:selectedPs(),psKey:T(window.DOIT_SELECTED_PS_KEY),receiver:T($('#storeSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),q:T($('#q')?.value).toLowerCase(),start:T($('#startDate')?.value),end:T($('#endDate')?.value),psValue:T($('#psSelect')?.value)}}
function appKey(){return T(sourceMeta.id||sourcePayload?.version_id||sourceMeta.file_name||'active')}
function customKey(){return 'doit-custom-products-v1:'+appKey()}
function keys(prefix){const out=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(k.startsWith(prefix))out.push(k)}return out}
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
function oldCleanup(){if(cleaned)return;cleaned=true;keys('doit-manual-v1:').forEach(k=>localStorage.removeItem(k));keys('doit-insert-rows-v1:').forEach(k=>localStorage.removeItem(k));document.querySelector('#manualAddBtn')?.remove();document.querySelector('#insertRowBtn290')?.remove();document.querySelectorAll('.manualOrderRow290,.insertRow290').forEach(x=>x.remove())}
function customRows(){return read(customKey(),[]).filter(x=>T(x.name)&&N(x.qty)>0)}
function activeDate(sc=getScope()){return T(sc.start||sc.end||sc.dates?.[0]||'')}
function activePs(sc=getScope()){return cleanPs(sc.psValue||sc.psKey||sc.ps?.[0]||'เพิ่มเอง')||'เพิ่มเอง'}
function toPayloadRow(x){return{date:T(x.date),inv:'ADD-'+T(x.id),type:'MANUAL',ps:T(x.ps)||'เพิ่มเอง',store:'__CUSTOM_POOL__',tele:'',isTele:false,code:T(x.code),sku:T(x.name)||'รายการเพิ่มเอง',brand:T(x.brand)||'เพิ่มเอง',size:T(x.size)||'เพิ่มเอง',qty:N(x.qty),unit:N(x.unit),amt:N(x.qty)*N(x.unit)}}
function augmentPayload(payload){const extra=customRows().map(toPayloadRow);const base=rowsOf(payload);if(!extra.length)return payload;if(Array.isArray(payload))return base.concat(extra);return{...payload,rows:base.concat(extra)}}
function lockTitle(){try{document.title=APP_VERSION}catch{}const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION;const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}
function thai(s){const p=T(s).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function setMsg(s){const m=$('#msg');if(m)m.textContent=s}
function removeFakeStoreOption(){const sel=$('#storeSelect');if(!sel)return;[...sel.options].forEach(o=>{if(o.value==='__CUSTOM_POOL__'||o.textContent==='__CUSTOM_POOL__')o.remove()})}
function syncUi(){lockTitle();oldCleanup();ensureButton();removeFakeStoreOption();const ds=selectedDates();const p=$('#datePreview');if(p){if(!ds.length)p.textContent='ทุกวัน';else if(ds.length===1)p.textContent=thai(ds[0]);else p.textContent=`เลือก ${ds.length} วัน: ${thai(ds[0])} - ${thai(ds[ds.length-1])}`}const pb=$('#psTickBtn289');if(pb){const ps=selectedPs();pb.textContent=ps.length?`PS: ${ps.length===1?ps[0]:ps.length+' คน'} ▼`:'PS: ทั้งหมด ▼'}window.DOIT_APP_SCOPE=getScope()}
function reloadWithCustom(){if(!sourcePayload||!coreLoad)return;const augmented=augmentPayload(sourcePayload);coreLoad(augmented,sourceMeta);setTimeout(syncUi,50)}
function addCustomProduct(){if(!sourcePayload){alert('กรุณาโหลดไฟล์ DOIT ก่อน');return}const sc=getScope();const date=activeDate(sc);const ps=activePs(sc);if(!date){alert('กรุณาเลือกวันที่ก่อนเพิ่มรายการเอง');return}const name=T(prompt('ชื่อสินค้า/รายการที่ต้องการเพิ่ม'));if(!name)return;const qty=N(prompt('จำนวนออเดอร์รวม','1'));if(qty<=0){alert('จำนวนออเดอร์ต้องมากกว่า 0');return}const unit=N(prompt('ราคา/หน่วย ถ้าไม่รู้ใส่ 0','0'));const code=T(prompt('รหัสสินค้า ถ้ามี ไม่บังคับ',''));
const arr=customRows();arr.push({id:Date.now(),date,ps,name,qty,unit,code,brand:'เพิ่มเอง',size:'เพิ่มเอง'});write(customKey(),arr);setMsg('เพิ่มรายการเองแล้ว: '+name+' จำนวน '+qty);reloadWithCustom()}
function ensureButton(){document.querySelector('#manualAddBtn')?.remove();document.querySelector('#insertRowBtn290')?.remove();const a=document.querySelector('.actions');if(a&&!$('#customProductBtn290')){const b=document.createElement('button');b.id='customProductBtn290';b.type='button';b.className='outline';b.textContent='+ เพิ่มรายการเอง';b.onclick=addCustomProduct;a.prepend(b)}}
function patchLoad(){const app=window.DOIT_JSON_APP;if(!app||app.__appCoordinator290)return false;coreLoad=app.load.bind(app);app.load=(payload,m={})=>{sourcePayload=payload;sourceMeta=m||{};oldCleanup();const base=rowsOf(payload);if(Array.isArray(base)&&base.length){rawRows=base;window.__doitRawRows290=base;window.DOIT_ALL_DATES=dates();window.DOIT_AVAILABLE_DATES=window.DOIT_ALL_DATES}const res=coreLoad(augmentPayload(payload),m);setTimeout(syncUi,0);setTimeout(syncUi,250);return res};app.__appCoordinator290=true;patched=true;return true}
function bindCleanup(){if(document.__customProducts290)return;document.__customProducts290=true;['doit:scopeRendered','doit:selectedDatesChanged','doit:psChanged'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(syncUi,60)))}
function health(){return{version:APP_VERSION,patched,customProducts:customRows().length,rows:rawRows.length,scope:getScope(),customKey:customKey()}}
function expose(){window.DOIT_APP_COORDINATOR={version:APP_VERSION,getScope,health,addCustomProduct,reloadWithCustom,rerender:reloadWithCustom}}
function boot(){oldCleanup();patchLoad();bindCleanup();expose();syncUi();let n=0;const tick=()=>{patchLoad();bindCleanup();expose();syncUi();if(++n<10)setTimeout(tick,600)};setTimeout(tick,300)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();