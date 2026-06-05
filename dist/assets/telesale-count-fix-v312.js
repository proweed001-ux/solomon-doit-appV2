(()=>{'use strict';
const PUBLIC_ACTIVE_ENDPOINT='https://saodmeoilixfdqentofp.supabase.co/functions/v1/doit-active';
const $=s=>document.querySelector(s);
const T=v=>String(v??'').trim();
const N=v=>Number(String(v??'').replace(/,/g,''))||0;
const F=n=>N(n).toLocaleString('th-TH');
const E=s=>T(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const K=s=>T(s).toLowerCase().replace(/[\s_\-./()[\]:]+/g,'');
let rawRows=[],metaCount=0,patched=false,lastCount=0,lastMode='none';
function keyLooksTele(k){return /tele|telesale|telesales|telesalesperson|tele_sale|tele_sales|โทร|เทเล/i.test(T(k))}
function valLooksTele(v){return /tele|telesale|telesales|โทร|เทเล/i.test(T(v))}
function col(o,names){const ks=Object.keys(o||{}),mp=new Map(ks.map(k=>[K(k),k]));for(const x of names){const k=mp.get(K(x));if(k)return k}for(const k of ks)for(const x of names)if(K(k).includes(K(x))||K(x).includes(K(k)))return k}
function val(o,names,d=''){const k=col(o,names);return k?T(o[k])||d:d}
function teleValue(o){return val(o,['tele','isTele','is_tele','telesale','telesales','teleSale','teleSales','telesaleName','telesalesName','teleSaleName','teleSalesName','telesale_id','telesaleId','TelesaleId','TelesalesID','TeleSaleID','TeleSalesID'])}
function invValue(o){return val(o,['inv','invoice','invoiceNo','InvoiceNo','InvcNbr','bill','billNo','orderNo','SO No','SONo'])||'-'}
function storeValue(o){return val(o,['store','customer','customerName','CustomerName','ShipName','Ship To Name','c_Name','BranchName'])||'-'}
function dateValue(o){return val(o,['date','InvcDate','InvoiceDate','invoiceDate','ShipDate','OrderDate'])||'-'}
function looksTeleRow(o){if(!o||typeof o!=='object')return false;const direct=teleValue(o);if(direct&&String(direct).toLowerCase()!=='false'&&String(direct)!=='0')return true;if(o.isTele===true||o.is_tele===true||o.is_telesale===true)return true;if(valLooksTele(val(o,['type','SOTypeID','DocType','OrderType'])))return true;return Object.keys(o).some(k=>keyLooksTele(k)&&T(o[k])&&String(o[k]).toLowerCase()!=='false'&&String(o[k])!=='0')}
function computedBills(){const rows=(rawRows||[]).filter(looksTeleRow);const set=new Set(rows.map(r=>[invValue(r),storeValue(r),teleValue(r)||'Telesale',dateValue(r)].join('|')));return{rows:rows.length,bills:set.size}}
async function fetchMeta(){try{const r=await fetch(PUBLIC_ACTIVE_ENDPOINT+'?mode=meta',{headers:{Accept:'application/json'}});if(!r.ok)return;const p=await r.json();const a=p.active||p;metaCount=N(a.telesale_bill_count||a.telesale_bills||a.tele_bill_count||0);updateBtn()}catch(e){}}
function patchJsonApp(){const app=window.DOIT_JSON_APP;if(!app||app.__tele312)return false;const old=app.load.bind(app);app.load=(payload,m={})=>{try{const arr=payload?.rows||payload||[];if(Array.isArray(arr))rawRows=arr;metaCount=N(m.telesale_bill_count||m.telesale_bills||payload?.meta?.telesale_bill_count||metaCount);setTimeout(updateBtn,0);setTimeout(updateBtn,300);setTimeout(updateBtn,1200)}catch(e){}return old(payload,m)};app.__tele312=true;patched=true;return true}
function ensureBtn(){const a=document.querySelector('.actions');let b=$('#teleBillsBtn');if(!b&&a){b=document.createElement('button');b.id='teleBillsBtn';b.className='teleBtn';b.type='button';a.prepend(b)}return b}
function updateBtn(){const b=ensureBtn();if(!b)return;const c=computedBills();let n=c.bills;if(!n&&metaCount){n=metaCount;lastMode='cloud-meta'}else if(n){lastMode='json-rows'}else{lastMode='zero'}lastCount=n;const txt=`บิล Telesale (${F(n)})`;if(b.textContent!==txt)b.textContent=txt;b.onclick=openDebug;b.dataset.tele312=lastMode}
function openDebug(){let body=$('#teleBody');if(!body){document.querySelector('#teleBillsBtn')?.click;return alert(`Telesale fix v312\nจำนวนบิล: ${F(lastCount)}\nแหล่งข้อมูล: ${lastMode}`)}const c=computedBills();body.innerHTML=`<div class="teleScope">Telesale fix v312<div class="teleScopeDebug">จำนวนจาก JSON rows: ${F(c.bills)} บิล / ${F(c.rows)} แถว<br>จำนวนจาก Cloud metadata: ${F(metaCount)} บิล<br>ใช้แสดงปุ่มจาก: ${E(lastMode)}<br>Raw JSON rows ที่จับได้: ${F(rawRows.length)}</div></div>`+(c.bills?'<div class="teleEmpty">พบจำนวนจาก JSON rows แล้ว แต่รายละเอียดบิลยังใช้ drawer เดิม</div>':'<div class="teleEmpty">Cloud มีจำนวนบิล Telesale แต่ JSON rows ที่หน้าเว็บได้รับไม่มีรายละเอียด tele พอให้แตกบิลได้</div>');$('#teleShade')?.classList.add('on');$('#teleDrawer')?.classList.add('on');updateBtn()}
function boot(){fetchMeta();patchJsonApp();updateBtn();let n=0;const tick=()=>{patchJsonApp();updateBtn();if(++n<180)setTimeout(tick,1000)};setTimeout(tick,300)}
window.DOIT_TELESALE_META_FIX={version:'v312',debug:()=>({rawRows:rawRows.length,metaCount,computed:computedBills(),lastCount,lastMode,patched})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();