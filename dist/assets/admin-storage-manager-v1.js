(()=>{
'use strict';
const MAX_DELETE=20;
const $=selector=>document.querySelector(selector);
const selected=new Set();
const collapsedFolders=new Set();
let files=[],modalFilter='all',activeGuardLoaded=false;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number=value=>Number(value||0)||0;
const size=value=>{let n=number(value);if(!n)return'—';const units=['B','KB','MB','GB'];let i=0;while(n>=1024&&i<units.length-1){n/=1024;i++}return(i?n.toFixed(2):Math.round(n))+' '+units[i]};
const days=()=>Math.max(1,Math.min(3650,Number($('#storageDays')?.value||30)||30));
function log(value){const box=$('#storageStatus');if(box)box.textContent=typeof value==='string'?value:JSON.stringify(value,null,2)}
function supabaseKey(){return String(window.__ADMIN_SUPABASE_KEY__||$('#sbKey')?.value||'').trim()}
function apiHeaders(extra={}){return{...window.AdminAuth.headers(),'x-supabase-anon-key':supabaseKey(),...extra}}
async function api(action,options={}){
  await window.AdminAuth.ready;
  const query=new URLSearchParams({action,days:String(days()),...(options.query||{})});
  const response=await fetch('/api/admin-storage?'+query,{...options,headers:apiHeaders(options.headers||{}),cache:'no-store'});
  if(response.status===401){window.AdminAuth.logout();throw Error('session_expired')}
  const type=response.headers.get('content-type')||'';
  if(options.raw)return response;
  const result=type.includes('application/json')?await response.json():{ok:false,error:await response.text()};
  if(!response.ok)throw result;
  return result;
}
function reasonLabel(reason){return({system_file:'ไฟล์ควบคุมระบบ',reserved_current_path:'ไฟล์ Current/Latest/Previous',active_reference:'ข้อมูลที่กำลังใช้งาน',path_traversal:'Path ไม่ปลอดภัย',invalid_path:'Path ไม่ถูกต้อง'}[reason]||reason)}
const FOLDER_INFO={
  doit:{title:'ไฟล์ Excel DOIT ต้นฉบับ',note:'ไฟล์ Excel ที่เคยอัปโหลดแบบเดิม'},
  parsed:{title:'ข้อมูลหน้า Pro (JSON)',note:'Manifest และไฟล์ JSON ส่วนย่อยของข้อมูล DOIT'},
  performance:{title:'ข้อมูล Performance',note:'ประวัติรายวัน ไฟล์เปรียบเทียบ และไฟล์ควบคุมล่าสุด'},
  team:{title:'รูปและข้อมูลทีมพัฒนา',note:'รูปภาพ QR และไฟล์ตั้งค่าทีม'},
  uploads:{title:'ไฟล์อัปโหลดชั่วคราว',note:'ไฟล์ที่รอประมวลผล'},
  raw:{title:'ข้อมูลต้นฉบับชั่วคราว',note:'ไฟล์ Raw จากกระบวนการเก่า'},
  root:{title:'ไฟล์ระดับหลักของ Storage',note:'ไฟล์ที่ไม่ได้อยู่ภายในโฟลเดอร์'}
};
function folderOf(path){const value=String(path||'');return value.includes('/')?(value.split('/')[0].toLowerCase()||'other'):'root'}
function folderInfo(folder){return FOLDER_INFO[folder]||{title:'โฟลเดอร์ '+folder,note:'ไฟล์ข้อมูลใน Storage'}}
function statusOf(file){
  if(file.deletable)return activeGuardLoaded?{type:'deletable',label:'ลบได้'}:{type:'waiting',label:'รอตรวจ Active'};
  const reasons=file.reasons||[];
  if(reasons.length)return{type:'protected',label:reasons.map(reasonLabel).join(', ')};
  return{type:'protected',label:'ล็อกเพื่อความปลอดภัย'};
}
function matches(file,query){
  const q=String(query||'').trim().toLowerCase(),status=statusOf(file);
  const filterOk=modalFilter==='all'||(modalFilter==='cleanup'&&status.type==='deletable')||(modalFilter==='protected'&&status.type==='protected')||(modalFilter==='selectable'&&status.type==='deletable');
  return filterOk&&(!q||file.path.toLowerCase().includes(q)||String(file.date||'').toLowerCase().includes(q));
}
function updateDeleteCount(){
  const button=$('#storageDeleteSelected');if(button){button.textContent=`ลบไฟล์ที่เลือกจริง (${selected.size}/${MAX_DELETE})`;button.disabled=!selected.size||!activeGuardLoaded}
}
function render(){
  const body=$('#storageFiles');if(!body)return;
  const query=$('#storageFilter')?.value||'';
  const rows=files.filter(file=>matches(file,query)).slice(0,500);
  const groups=new Map();
  rows.forEach(file=>{const folder=folderOf(file.path);if(!groups.has(folder))groups.set(folder,[]);groups.get(folder).push(file)});
  body.innerHTML=[...groups].map(([folder,items])=>{
    const info=folderInfo(folder),total=items.reduce((sum,file)=>sum+number(file.size),0);
    const collapsed=collapsedFolders.has(folder),header=`<tr class="storageFolderHead"><td colspan="7"><button type="button" class="storageFolderToggle" data-folder="${esc(folder)}" aria-expanded="${collapsed?'false':'true'}"><span class="storageFolderArrow" aria-hidden="true">${collapsed?'▶':'▼'}</span><span class="storageFolderTitle"><b>📁 ${esc(info.title)}</b><small>${esc(info.note)} · Path: ${esc(folder)}/</small></span><span class="storageFolderStats">${items.length.toLocaleString('th-TH')} ไฟล์ · ${size(total)}<small>${collapsed?'แตะเพื่อขยาย':'แตะเพื่อพับ'}</small></span></button></td></tr>`;
    const fileRows=collapsed?'':items.map(file=>{const status=statusOf(file),can=status.type==='deletable'&&activeGuardLoaded,relative=file.path.split('/').slice(1).join('/');return`<tr class="storageFileRow" data-folder="${esc(folder)}"><td><input class="storagePick" type="checkbox" data-path="${esc(file.path)}" ${selected.has(file.path)?'checked':''} ${can?'':'disabled'}></td><td><b class="${can?'storageCanDelete':'storageProtected'}">${esc(status.label)}</b></td><td><div class="storagePathMain">${esc(relative||file.path)}</div><small class="muted">${esc(file.path)}</small></td><td>${size(file.size)}</td><td>${esc(file.date||file.updated_at||file.created_at||'')}</td><td>${esc((file.reasons||[]).map(reasonLabel).join(', ')||(can?'ไฟล์ข้อมูล ไม่ได้ถูกใช้งาน':'กำลังตรวจ'))}</td><td><div class="row"><button class="btn2 storageDownload" data-path="${esc(file.path)}">ดาวน์โหลด</button>${can?`<button class="btn2 danger storageDeleteOne" data-path="${esc(file.path)}">ลบ</button>`:''}</div></td></tr>`}).join('');
    return header+fileRows;
  }).join('')||'<tr><td colspan="7" class="muted">ไม่พบไฟล์ตามตัวกรอง</td></tr>';
  document.querySelectorAll('.storageFolderToggle').forEach(button=>button.onclick=()=>{const folder=button.dataset.folder;if(collapsedFolders.has(folder))collapsedFolders.delete(folder);else collapsedFolders.add(folder);render()});
  document.querySelectorAll('.storagePick').forEach(input=>input.onchange=event=>{
    const path=event.target.dataset.path;
    if(event.target.checked){if(selected.size>=MAX_DELETE){event.target.checked=false;log({ok:false,error:'delete_limit',max:MAX_DELETE,note:'เลือกได้สูงสุด 20 ไฟล์ต่อครั้ง'});return}selected.add(path)}else selected.delete(path);
    updateDeleteCount();
  });
  document.querySelectorAll('.storageDownload').forEach(button=>button.onclick=()=>download(button.dataset.path));
  document.querySelectorAll('.storageDeleteOne').forEach(button=>button.onclick=()=>{selected.clear();selected.add(button.dataset.path);updateDeleteCount();deleteSelected()});
  updateDeleteCount();
}
async function refresh(filter='all'){
  try{
    log('กำลังทำ dry-run และตรวจ guard จาก Storage จริง...');
    const result=await api('dry-run');
    files=Array.isArray(result.files)?result.files:[];
    activeGuardLoaded=Boolean(result.activeGuardLoaded)&&!result.truncated;
    selected.clear();modalFilter=filter;
    $('#storageCount').textContent=number(result.total).toLocaleString('th-TH');
    $('#storageSize').textContent=size(files.reduce((sum,file)=>sum+number(file.size),0));
    $('#storageLatest').textContent=files[0]?.date||'—';
    $('#storageActive').textContent=activeGuardLoaded?'โหลด guard แล้ว':'ไม่พร้อมลบ';
    render();
    log({ok:true,dry_run:true,bucket:result.bucket,files:result.total,delete_candidates:result.candidateCount,protected:result.protectedCount,delete_limit:result.deleteLimit,performance_guard_loaded:result.performanceGuardLoaded,doit_guard_loaded:result.doitGuardLoaded,active_guard_loaded:result.activeGuardLoaded,truncated:result.truncated,note:activeGuardLoaded?'ลบได้ทุกไฟล์ข้อมูลที่ไม่ได้กำลังใช้งาน สูงสุด 20 ไฟล์ต่อครั้ง':'ปิดการลบ เพราะโหลด Active guard ไม่ครบ'});
  }catch(error){activeGuardLoaded=false;render();log(error)}
}
async function previewOld(){return refresh('cleanup')}
function selectOld(){
  selected.clear();
  files.filter(file=>statusOf(file).type==='deletable').slice(0,MAX_DELETE).forEach(file=>selected.add(file.path));
  modalFilter='cleanup';render();
  log({ok:true,dry_run:true,selected_count:selected.size,delete_limit:MAX_DELETE,paths:[...selected],note:'ยังไม่ได้ลบ กดปุ่มลบไฟล์ที่เลือกจริงเพื่อดำเนินการ'});
}
async function deleteSelected(){
  if(!selected.size)return log({ok:false,error:'no_file_selected'});
  if(selected.size>MAX_DELETE)return log({ok:false,error:'delete_limit',max:MAX_DELETE});
  const paths=[...selected];
  const preview=paths.slice(0,3).join('\n');
  if(!window.confirm('ยืนยันลบจริง '+paths.length+' ไฟล์?\n'+preview+(paths.length>3?'\n...':'')))return;
  try{
    log({ok:true,action:'delete_start',count:paths.length,paths});
    const result=await api('delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',days:days(),paths})});
    await refresh('cleanup');
    log(result);
  }catch(error){log(error);await refresh('cleanup').catch(()=>{})}
}
async function download(path){
  try{
    const response=await api('download',{query:{path},raw:true});
    if(!response.ok)throw Error('download_failed_'+response.status);
    const blob=await response.blob(),link=document.createElement('a');
    link.href=URL.createObjectURL(blob);link.download=path.split('/').pop()||'file';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1500);
  }catch(error){log({ok:false,error:String(error?.message||error),path})}
}
async function init(){
  if(!$('#adminStoragePanel'))return;
  await window.AdminAuth.ready;
  const hint=$('#adminStoragePanel .safeBox');if(hint)hint.innerHTML='<b>แยกไฟล์ตามโฟลเดอร์และลบได้ทุกไฟล์ข้อมูลที่ไม่ได้ใช้งาน</b><br>ไฟล์ควบคุมระบบและชุดข้อมูล Active จะล็อกอัตโนมัติ เพื่อไม่ให้หน้า Pro หรือ Performance เสีย · สูงสุด 20 ไฟล์ต่อครั้ง';
  const confirm=$('#storageConfirm');if(confirm)confirm.style.display='none';
  const old=$('#storageDeleteOld');if(old)old.textContent='เลือกไฟล์ที่ลบได้ (สูงสุด 20)';
  const preview=$('#storagePreviewOld');if(preview)preview.textContent='แสดงเฉพาะไฟล์ที่ลบได้';
  const dayLabel=$('#storageDays')?.closest('label');if(dayLabel)dayLabel.style.display='none';
  $('#storageRefresh').onclick=()=>refresh('all');
  $('#storageFilter').oninput=render;
  $('#storagePreviewOld').onclick=previewOld;
  $('#storageDeleteOld').onclick=selectOld;
  $('#storageDeleteSelected').onclick=deleteSelected;
  $('#storageDays').onchange=()=>refresh(modalFilter);
  $('#storageCheckAll').onchange=event=>{selected.clear();if(event.target.checked)files.filter(file=>statusOf(file).type==='deletable').slice(0,MAX_DELETE).forEach(file=>selected.add(file.path));render()};
  files=[];
  activeGuardLoaded=false;
  const body=$('#storageFiles');
  if(body)body.innerHTML='<tr><td colspan="7" class="muted">ยังไม่สแกน Storage · กด “รีเฟรช Storage” เมื่อต้องการจัดการไฟล์</td></tr>';
  log('ยังไม่สแกน Storage อัตโนมัติ เพื่อไม่ให้แย่งทรัพยากรระหว่างอ่านหรืออัปโหลด DOIT · กด “รีเฟรช Storage” เมื่อต้องการตรวจไฟล์');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
