(()=>{'use strict';
const $=s=>document.querySelector(s);
const LS='doit-table-detail-visible-v1';
function css(){if($('#mobileTableUi280Css'))return;const st=document.createElement('style');st.id='mobileTableUi280Css';st.textContent=`
.tableTools280{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#fff}
.receiverPick280{display:flex;align-items:center;gap:8px;flex:1;min-width:260px}
.receiverPick280 b{white-space:nowrap;color:#087b34;font-size:13px}
.receiverPick280 select{min-width:0;flex:1;height:38px;border:1px solid #16a34a;border-radius:9px;background:#f0fdf4;color:#065f46;font-weight:950;padding:0 9px}
.detailToggle280{height:38px;border:1px solid #94a3b8;background:#f8fafc;color:#334155;border-radius:9px;font-weight:950;padding:0 10px;white-space:nowrap}
body.doitCompactPick .tbl th:nth-child(1),body.doitCompactPick .tbl td:nth-child(1),
body.doitCompactPick .tbl th:nth-child(2),body.doitCompactPick .tbl td:nth-child(2),
body.doitCompactPick .tbl th:nth-child(3),body.doitCompactPick .tbl td:nth-child(3){display:none!important}
body.doitCompactPick .tbl{min-width:720px!important;font-size:14px}
body.doitCompactPick .tbl th,body.doitCompactPick .tbl td{padding:10px 8px}
body.doitCompactPick .tbl td:nth-child(4),body.doitCompactPick .tbl th:nth-child(4){min-width:230px}
body.doitCompactPick .tbl input.pick{width:92px;height:38px;font-size:15px}
@media(max-width:720px){.tableTools280{position:sticky;top:56px;z-index:18}.receiverPick280{min-width:100%}.detailToggle280{width:100%}body.doitCompactPick .tbl{min-width:650px!important;font-size:15px}body.doitCompactPick .p b{font-size:15px}.tbl input.pick{font-size:16px}}
`;document.head.appendChild(st)}
function detailVisible(){return localStorage.getItem(LS)==='1'}
function applyMode(){const show=detailVisible();document.body.classList.toggle('doitCompactPick',!show);const b=$('#detailToggle280');if(b)b.textContent=show?'ซ่อนรายละเอียด':'แสดงรายละเอียด'}
function syncInlineOptions(){const main=$('#storeSelect'),inline=$('#inlineStoreSelect280');if(!main||!inline)return;const sig=[...main.options].map(o=>o.value+'='+o.textContent).join('|');if(inline.dataset.sig!==sig){inline.innerHTML='';[...main.options].forEach(o=>inline.add(new Option(o.textContent,o.value,false,o.selected)));inline.dataset.sig=sig}if(inline.value!==main.value)inline.value=main.value}
function setMainStore(v){const main=$('#storeSelect');if(!main)return;main.value=v;main.dispatchEvent(new Event('change',{bubbles:true}));main.dispatchEvent(new Event('input',{bubbles:true}));setTimeout(syncInlineOptions,80)}
function install(){css();const tableTop=document.querySelector('.tableTop');if(tableTop&&!$('#tableTools280')){const bar=document.createElement('div');bar.id='tableTools280';bar.className='tableTools280';bar.innerHTML='<div class="receiverPick280"><b>ส่งให้ร้าน:</b><select id="inlineStoreSelect280" aria-label="เลือกร้านจริงตรงตาราง"></select></div><button id="detailToggle280" class="detailToggle280" type="button">แสดงรายละเอียด</button>';tableTop.insertAdjacentElement('afterend',bar);$('#inlineStoreSelect280').addEventListener('change',e=>setMainStore(e.target.value));$('#detailToggle280').onclick=()=>{localStorage.setItem(LS,detailVisible()?'0':'1');applyMode()}}
 const main=$('#storeSelect');if(main&&!main.dataset.inline280){main.dataset.inline280='1';main.addEventListener('change',syncInlineOptions)}
 syncInlineOptions();applyMode()}
function boot(){install();let n=0;const tick=()=>{install();if(++n<40)setTimeout(tick,400)};setTimeout(tick,400)}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();