(()=>{
'use strict';
const $=s=>document.querySelector(s);
const T=v=>String(v??'').trim();
const N=v=>Number(T(v).replace(/,/g,''))||0;
const F=n=>N(n).toLocaleString('th-TH');
const FORMULA='TotInvc > Correct Amount/LineAmount > LineAmtBeforeDisc > detailAmt > row.amt > Amt > Amount > InvoiceAmt';
let current=null;

function set(p,message,step){
  const bar=$('#bar'),pct=$('#pct'),status=$('#status');
  if(bar)bar.style.width=Math.max(0,Math.min(100,p))+'%';
  if(pct)pct.textContent=Math.round(p)+'%';
  if(status)status.textContent=message;
  document.querySelectorAll('.step').forEach(node=>node.classList.toggle('on',node.dataset.s===step));
}

function resetSummary(){
  ['rows','stores','ps','tele'].forEach(id=>{const el=$('#'+id);if(el)el.textContent='-'});
}

function show(summary){
  current=summary||null;
  if(!current)return;
  $('#rows').textContent=F(current.rows);
  $('#stores').textContent=F(current.stores);
  $('#ps').textContent=F(current.ps);
  $('#tele').textContent=F(current.teleBills);
  $('#result').innerHTML=
    `ไฟล์: <b>${current.fileName}</b><br>`+
    `แถว: ${F(current.rows)} · ร้าน: ${F(current.stores)} · PS: ${F(current.ps)} · Telesale bills: ${F(current.teleBills)}<br>`+
    `จำนวนรวม: ${F(current.qty)} ชิ้น · ยอดรวม: ${N(current.amount).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2})} บาท<br>`+
    `สูตรยอด: ${FORMULA}<br>`+
    '<span class="pill local">Excel ต้นฉบับใช้แค่อ่านในเครื่องและไม่บันทึกขึ้น Storage</span>';
}

function historyRows(){
  let items=[];
  try{items=JSON.parse(localStorage.getItem('doit-admin-history')||'[]')}catch{}
  const body=$('#hist');
  if(!body)return;
  body.innerHTML=items.length?items.map(item=>
    `<tr><td>${new Date(item.checkedAt).toLocaleString('th-TH')}</td>`+
    `<td>${item.fileName}</td><td>${F(item.rows)}</td><td>${F(item.stores)}</td>`+
    `<td>${F(item.ps)}</td><td>${F(item.teleBills)}</td>`+
    `<td><span class="pill ${item.status&&item.status.includes('cloud')?'cloud':'local'}">${item.status&&item.status.includes('cloud')?'cloud':'local'}</span></td></tr>`
  ).join(''):'<tr><td colspan="7" class="muted">ยังไม่มีประวัติ</td></tr>';
}

function saveHistory(silent=false){
  if(!current){if(!silent)alert('ยังไม่มีไฟล์ที่ตรวจสำเร็จ');return}
  let items=[];
  try{items=JSON.parse(localStorage.getItem('doit-admin-history')||'[]')}catch{}
  items.unshift(current);
  localStorage.setItem('doit-admin-history',JSON.stringify(items.slice(0,20)));
  historyRows();
  if(!silent)alert('บันทึกประวัติ preview ในเครื่องแล้ว');
}

function selectFile(file){
  current=null;
  resetSummary();
  $('#fileName').textContent=file?`${file.name} · ${(file.size/1024/1024).toFixed(2)} MB`:'ยังไม่ได้เลือกไฟล์';
  $('#result').innerHTML=file
    ?`เลือก <b>${file.name}</b> แล้ว<br>กด “อัปโหลด JSON + ตั้งล่าสุด” ระบบจะอ่านและแปลงไฟล์เพียงรอบเดียว`
    :'ยังไม่มีผลตรวจ';
  set(file?5:0,file?'เลือกไฟล์แล้ว กดอัปโหลดเพื่อเริ่มตรวจ':'รอเลือกไฟล์',file?'pick':'');
}

function cloudMessage(message){
  const el=$('#cloudStatus');
  if(el)el.innerHTML=`<div class="muted">${message}</div>`;
}

function bind(){
  $('#choose').onclick=()=>$('#file').click();
  $('#file').onchange=event=>selectFile(event.target.files?.[0]||null);
  $('#clear').onclick=()=>{
    $('#file').value='';
    selectFile(null);
  };
  $('#saveVersion').onclick=()=>saveHistory(false);
  $('#clearHistory').onclick=()=>{
    localStorage.removeItem('doit-admin-history');
    historyRows();
  };
  const upload=$('#uploadCloud');
  if(upload){
    upload.textContent='อัปโหลด JSON + ตั้งล่าสุด';
    upload.onclick=()=>cloudMessage('ปุ่มนี้ถูกโอนให้ admin-json-v265.js จัดการแล้ว');
  }
  const old=$('#setActive');
  if(old){
    old.textContent='ตั้งล่าสุดรวมในปุ่มอัปโหลดแล้ว';
    old.disabled=true;
  }
  const test=$('#testCloud');
  if(test)test.onclick=()=>cloudMessage('Cloud พร้อมตรวจจริงเมื่อกดอัปโหลด JSON + ตั้งล่าสุด');
  historyRows();
}

window.__setDoitAdminSummary=show;
document.addEventListener('DOMContentLoaded',bind);
})();