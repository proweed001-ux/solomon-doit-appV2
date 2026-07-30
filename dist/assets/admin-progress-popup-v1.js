(()=>{
'use strict';
const $=selector=>document.querySelector(selector);
let modal,fill,title,detail,pct,note,closeButton;
let running=false,dismissed=false,latestCloudMessage='';

function css(){
  if($('#adminProgressPopupCss'))return;
  const style=document.createElement('style');
  style.id='adminProgressPopupCss';
  style.textContent=`.adminPopMask{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.58);backdrop-filter:blur(8px);display:none;place-items:center;padding:18px}.adminPopMask.on{display:grid}.adminPop{width:min(440px,100%);background:#fff;border-radius:22px;border:1px solid #d1fae5;box-shadow:0 28px 100px rgba(2,6,23,.28);padding:20px;color:#111827;text-align:center}.adminPopIcon{width:62px;height:62px;border-radius:20px;margin:0 auto 12px;display:grid;place-items:center;background:linear-gradient(135deg,#087b34,#22c55e);color:#fff;font-weight:950;font-size:28px}.adminPop h3{margin:0;font-size:20px;letter-spacing:-.03em;color:#064e3b}.adminPop p{margin:8px 0 14px;color:#4b5563;line-height:1.45;word-break:break-word}.adminPopHead{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:950;color:#087b34;margin-bottom:7px}.adminPopTrack{height:14px;border-radius:999px;background:#e5e7eb;overflow:hidden;border:1px solid #d1d5db}.adminPopFill{height:100%;width:0;background:linear-gradient(90deg,#087b34,#22c55e);transition:.18s ease}.adminPopFill.error{background:linear-gradient(90deg,#dc2626,#ef4444)}.adminPopNote{margin-top:10px;font-size:12px;color:#6b7280;line-height:1.45}.adminPopClose{width:100%;height:42px;margin-top:14px;border:1px solid #d1d5db;border-radius:10px;background:#fff;color:#374151;font-weight:950}.adminLatestBadge{margin-top:10px;display:inline-block;border-radius:999px;padding:7px 11px;background:#dcfce7;color:#166534;font-size:12px;font-weight:950;border:1px solid #bbf7d0}`;
  document.head.appendChild(style);
}
function ensure(){
  css();
  if(modal)return;
  modal=document.createElement('div');
  modal.className='adminPopMask';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.innerHTML=`<div class="adminPop"><div class="adminPopIcon">⇧</div><h3 id="adminPopTitle">กำลังทำงาน</h3><p id="adminPopDetail">รอสถานะ</p><div class="adminPopHead"><span>สถานะจริง</span><b id="adminPopPct">0%</b></div><div class="adminPopTrack"><div class="adminPopFill" id="adminPopFill"></div></div><div class="adminPopNote" id="adminPopNote">ระบบจะแสดงข้อมูลที่กำลังส่งจริง</div><button class="adminPopClose" id="adminPopClose" type="button">ซ่อนหน้าต่าง</button></div>`;
  document.body.appendChild(modal);
  fill=$('#adminPopFill');title=$('#adminPopTitle');detail=$('#adminPopDetail');pct=$('#adminPopPct');note=$('#adminPopNote');closeButton=$('#adminPopClose');
  closeButton.onclick=()=>{
    dismissed=running;
    modal.classList.remove('on');
  };
}
function percentFromBar(){
  const width=$('#bar')?.style?.width||'';
  const match=width.match(/([0-9.]+)/);
  return match?Math.max(0,Math.min(100,Number(match[1])||0)):0;
}
function mainStatus(){return String($('#status')?.textContent||'').trim()}
function render(message='',forceOpen=false){
  ensure();
  const percent=Math.round(percentFromBar());
  const main=mainStatus();
  const text=String(message||main||'กำลังทำงาน').trim();
  const pctText=String($('#pct')?.textContent||'');
  const isError=/ผิดพลาด|ไม่สำเร็จ|timeout|error|fail/i.test(text+' '+pctText);
  const isSuccess=percent>=100&&/เสร็จ:s*Cloud JSON active|Cloud JSON active/i.test(text+' '+latestCloudMessage);
  if(isError||isSuccess)running=false;
  fill.style.width=percent+'%';
  fill.classList.toggle('error',isError);
  pct.textContent=isError?'ไม่สำเร็จ':percent+'%';
  detail.textContent=text;
  if(isError){
    title.textContent='อัปโหลดหรือแปลงไฟล์ไม่สำเร็จ';
    note.textContent='อ่านรายละเอียดด้านบน แล้วกดปิดเพื่อเลือกไฟล์หรือทดลองใหม่';
    closeButton.textContent='ปิด';
  }else if(isSuccess){
    title.textContent='อัปโหลดและตั้งข้อมูลล่าสุดสำเร็จ';
    note.textContent='JSON ถูกอัปโหลดและขั้นตอนตั้ง Active ยืนยันเสร็จแล้ว';
    closeButton.textContent='ปิด';
  }else if(/อัปโหลด|Cloud/i.test(text)){
    title.textContent='กำลังอัปโหลดขึ้น Cloud';
    note.textContent=/เครือข่ายยังไม่ส่งข้อมูลเพิ่ม/.test(text)?'ระบบยังรอการเชื่อมต่ออยู่ ไม่ต้องกดซ้ำ':'ตัวเลข MB และเปอร์เซ็นต์มาจากข้อมูลที่ส่งจริง';
    closeButton.textContent='ซ่อนหน้าต่าง (ระบบยังทำงาน)';
  }else{
    title.textContent=/อ่าน|แปลง|Pivot|Worksheet|JSON/i.test(text)?'กำลังอ่านและแปลงไฟล์ DOIT':'กำลังทำงาน';
    note.textContent='ห้ามปิดหรือรีเฟรชหน้านี้จนกว่าจะสำเร็จหรือแจ้งข้อผิดพลาด';
    closeButton.textContent='ซ่อนหน้าต่าง (ระบบยังทำงาน)';
  }
  const terminal=isError||isSuccess;
  if(forceOpen||terminal||(running&&!dismissed))modal.classList.add('on');
}
function begin(){
  running=true;
  dismissed=false;
  latestCloudMessage='';
  render('กำลังเริ่มอ่านและแปลงไฟล์ DOIT',true);
}
function refresh(){render()}
function cloudChanged(){
  const cloud=$('#cloudStatus');
  latestCloudMessage=String(cloud?.textContent||'').trim();
  if(/ไม่สำเร็จ|ผิดพลาด|timeout|error/i.test(latestCloudMessage))render(latestCloudMessage,true);
  else if(/Cloud JSON active|ตั้งเป็นข้อมูลล่าสุดแล้ว/i.test(latestCloudMessage))render(latestCloudMessage,true);
}
function bind(){
  ensure();
  ['bar','pct','status'].forEach(id=>{
    const element=$('#'+id);
    if(element)new MutationObserver(refresh).observe(element,{attributes:true,childList:true,subtree:true,characterData:true,attributeFilter:['style']});
  });
  const cloud=$('#cloudStatus');
  if(cloud)new MutationObserver(cloudChanged).observe(cloud,{childList:true,subtree:true,characterData:true});
  const upload=$('#uploadCloud');
  if(upload)upload.addEventListener('click',()=>{
    const file=$('#file')?.files?.[0];
    if(file&&!upload.disabled)begin();
  },true);
}
window.AdminProgressPopup={begin,render,close:()=>modal?.classList.remove('on')};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
