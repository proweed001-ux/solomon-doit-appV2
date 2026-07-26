(()=>{
'use strict';
const MAX_DELETE=20;
const $=selector=>document.querySelector(selector);
const selected=new Set();
let files=[],modalFilter='all',folderFilter='all',deleteReady=false;
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
function reasonLabel(reason){return({system_file:'ไฟล์ระบบ',reserved_current_path:'ชื่อไฟล์ Current/Latest/Previous',active_reference:'ไฟล์ Active/Current',latest_two_doit_dates:'DOIT 2 วันล่าสุด',current_performance_month:'Performance เดือนปัจจุบัน',folder_locked:'Folder ล็อก',not_older_than_cutoff:'ยังไม่เก่าตามกำหนด',path_traversal:'Path ไม่ปลอดภัย',invalid_path:'Path ไม่ถูกต้อง'}[reason]||reason)}
function statusOf(file){
  const warnings=(file.reasons||[]).map(reasonLabel);
  if(file.deletable&&deleteReady)return{type:'deletable',label:warnings.length?'ลบได้ · ระวัง: '+warnings.join(', '):'ลบได้'};
  return{type:'protected',label:'รายการยังโหลดไม่ครบ'};
}
const FOLDERS=[
  {id:'all',icon:'📦',label:'ไฟล์ทั้งหมด',desc:'รวมทุกหมวด'},
  {id:'performance',icon:'📊',label:'Performance',desc:'ข้อมูลผลงานและไฟล์ล่าสุด'},
  {id:'doit-ready',icon:'✅',label:'DOIT พร้อมใช้',desc:'ข้อมูลที่แปลงให้หน้าเว็บอ่าน'},
  {id:'doit-source',icon:'📄',label:'DOIT ต้นทาง',desc:'ไฟล์นำเข้าและไฟล์ดิบ'},
  {id:'team',icon:'👥',label:'รูปทีมและ QR',desc:'รูปบุคคล โลโก้ และคิวอาร์'},
  {id:'other',icon:'🗂️',label:'ไฟล์อื่น',desc:'ไฟล์ที่ไม่อยู่ในหมวดด้านบน'}
];
function folderOf(file){
  const path=String(file.path||'').toLowerCase();
  if(path.includes('qr'))return'team';
  if(path.startsWith('performance/'))return'performance';
  if(path.startsWith('parsed/'))return'doit-ready';
  if(/^(doit|uploads|raw)\//.test(path))return'doit-source';
  if(path.startsWith('team/'))return'team';
  return'other';
}
function folderDef(file){return FOLDERS.find(item=>item.id===folderOf(file))||FOLDERS[FOLDERS.length-1]}
function purposeOf(file){
  const path=String(file.path||''),lower=path.toLowerCase(),name=lower.split('/').pop()||lower;
  if(lower==='performance/active.json')return'ตัวบอกว่า Performance ชุดไหนกำลังใช้งาน';
  if(lower==='performance/index.json'||name.includes('history-index'))return'รายการและประวัติของ Performance';
  if(lower.startsWith('performance/'))return'ข้อมูลผลงาน Performance ของวันที่หรือรอบนั้น';
  if(lower.startsWith('parsed/'))return'ข้อมูล DOIT ที่แปลงแล้วและหน้าเว็บนำไปใช้งาน';
  if(/^(doit|uploads|raw)\//.test(lower))return'ไฟล์ต้นฉบับหรือไฟล์ระหว่างนำเข้า DOIT';
  if(lower.includes('qr'))return'รูป QR Code ที่หน้าเว็บนำไปแสดง';
  if(lower.startsWith('team/'))return'รูปทีมงานหรือรูปประกอบที่หน้าเว็บนำไปแสดง';
  return'ไฟล์อื่นในที่เก็บข้อมูล';
}
function matches(file,query){
  const q=String(query||'').trim().toLowerCase(),status=statusOf(file);
  const statusOk=modalFilter==='all'||(modalFilter==='cleanup'&&status.type==='deletable')||(modalFilter==='protected'&&status.type==='protected')||(modalFilter==='selectable'&&status.type==='deletable');
  const folderOk=folderFilter==='all'||folderOf(file)===folderFilter;
  return statusOk&&folderOk&&(!q||file.path.toLowerCase().includes(q)||purposeOf(file).toLowerCase().includes(q)||String(file.date||'').toLowerCase().includes(q));
}
function renderFolders(){
  const box=$('#storageFolders');if(!box)return;
  box.innerHTML=FOLDERS.map(folder=>{
    const rows=folder.id==='all'?files:files.filter(file=>folderOf(file)===folder.id);
    const total=rows.reduce((sum,file)=>sum+number(file.size),0);
    return`<button type="button" class="storageFolder ${folderFilter===folder.id?'active':''}" data-folder="${folder.id}" aria-pressed="${folderFilter===folder.id}"><span class="storageFolderIcon">${folder.icon}</span><span><b>${esc(folder.label)}</b><small>${esc(folder.desc)}</small><strong>${rows.length.toLocaleString('th-TH')} ไฟล์ · ${size(total)}</strong></span></button>`;
  }).join('');
  document.querySelectorAll('.storageFolder').forEach(button=>button.onclick=()=>{folderFilter=button.dataset.folder||'all';render()});
}
function updateDeleteCount(){
  const button=$('#storageDeleteSelected');if(button){button.textContent=`ลบไฟล์ที่เลือกจริง (${selected.size}/${MAX_DELETE})`;button.disabled=!selected.size||!deleteReady}
}
function render(){
  renderFolders();
  const body=$('#storageFiles');if(!body)return;
  const query=$('#storageFilter')?.value||'';
  const rows=files.filter(file=>matches(file,query)).slice(0,500);
  body.innerHTML=rows.map(file=>{
    const status=statusOf(file),can=status.type==='deletable'&&deleteReady,folder=folderDef(file),name=String(file.path||'').split('/').pop()||file.path;
    return`<tr><td><input class="storagePick" type="checkbox" data-path="${esc(file.path)}" ${selected.has(file.path)?'checked':''} ${can?'':'disabled'}></td><td>${esc(status.label)}${can?' · เลือกได้':' · ล็อก'}</td><td><span class="storageFolderTag">${folder.icon} ${esc(folder.label)}</span></td><td><b>${esc(name)}</b><div class="storagePath">${esc(file.path)}</div></td><td>${size(file.size)}</td><td>${esc(file.date||file.updated_at||file.created_at||'')}</td><td>${esc(purposeOf(file))}</td><td><button class="btn2 storageDownload" data-path="${esc(file.path)}">ดาวน์โหลด</button></td></tr>`;
  }).join('')||'<tr><td colspan="8" class="muted">ไม่พบไฟล์ในหมวดนี้</td></tr>';
  document.querySelectorAll('.storagePick').forEach(input=>input.onchange=event=>{
    const path=event.target.dataset.path;
    if(event.target.checked){if(selected.size>=MAX_DELETE){event.target.checked=false;log({ok:false,error:'delete_limit',max:MAX_DELETE,note:'เลือกได้สูงสุด 20 ไฟล์ต่อครั้ง'});return}selected.add(path)}else selected.delete(path);
    updateDeleteCount();
  });
  document.querySelectorAll('.storageDownload').forEach(button=>button.onclick=()=>download(button.dataset.path));
  updateDeleteCount();
}
async function refresh(filter='all'){
  try{
    log('กำลังตรวจรายการไฟล์ทั้งหมดจาก Storage จริง...');
    const result=await api('dry-run');
    files=Array.isArray(result.files)?result.files:[];
    deleteReady=Boolean(result.deleteAllFilesEnabled)&&!result.truncated;
    selected.clear();modalFilter=filter;
    $('#storageCount').textContent=number(result.total).toLocaleString('th-TH');
    $('#storageSize').textContent=size(files.reduce((sum,file)=>sum+number(file.size),0));
    $('#storageLatest').textContent=files[0]?.date||'—';
    $('#storageActive').textContent=deleteReady?'ลบได้ทุกไฟล์':'รายการยังโหลดไม่ครบ';
    render();
    log({ok:true,dry_run:true,bucket:result.bucket,files:result.total,delete_candidates:result.candidateCount,warnings:result.protectedCount,delete_limit:result.deleteLimit,delete_all_files_enabled:result.deleteAllFilesEnabled,truncated:result.truncated,note:deleteReady?'เลือกและลบได้ทุกไฟล์ สูงสุด 20 ไฟล์ต่อครั้ง':'ปิดการลบ เพราะรายการโหลดไม่ครบ'});
  }catch(error){deleteReady=false;render();log(error)}
}
async function previewOld(){return refresh('cleanup')}
function selectOld(){
  selected.clear();
  files.filter(file=>matches(file,$('#storageFilter')?.value||'')).filter(file=>statusOf(file).type==='deletable').slice(0,MAX_DELETE).forEach(file=>selected.add(file.path));
  modalFilter='cleanup';render();
  log({ok:true,dry_run:true,selected_count:selected.size,delete_limit:MAX_DELETE,paths:[...selected],note:'ยังไม่ได้ลบ กดปุ่มลบไฟล์ที่เลือกจริงเพื่อดำเนินการ'});
}
async function deleteSelected(){
  if(!selected.size)return log({ok:false,error:'no_file_selected'});
  if(selected.size>MAX_DELETE)return log({ok:false,error:'delete_limit',max:MAX_DELETE});
  const paths=[...selected];
  if(!window.confirm(`ยืนยันลบจริง ${paths.length} ไฟล์?\nไฟล์ที่ระบบกำลังใช้อยู่ก็ลบได้ และอาจทำให้หน้าเว็บบางส่วนใช้งานไม่ได้`))return log({ok:false,cancelled:true,note:'ยกเลิกการลบแล้ว'});
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
  const hint=$('#adminStoragePanel .safeBox');if(hint)hint.innerHTML='<b>ลบได้ทุกไฟล์ใน Storage</b><br>รวมไฟล์ Active/Current, Performance, DOIT, Team และ QR · ถ้าลบไฟล์ที่กำลังใช้อยู่ หน้าเว็บบางส่วนอาจหยุดทำงาน · สูงสุด 20 ไฟล์ต่อครั้ง';
  const confirm=$('#storageConfirm');if(confirm)confirm.style.display='none';
  const old=$('#storageDeleteOld');if(old)old.textContent='เลือกทั้งหมด (สูงสุด 20)';
  $('#storageRefresh').onclick=()=>refresh('all');
  $('#storageFilter').oninput=render;
  $('#storagePreviewOld').onclick=previewOld;
  $('#storageDeleteOld').onclick=selectOld;
  $('#storageDeleteSelected').onclick=deleteSelected;
  $('#storageDays').onchange=()=>refresh(modalFilter);
  $('#storageCheckAll').onchange=event=>{selected.clear();if(event.target.checked)files.filter(file=>matches(file,$('#storageFilter')?.value||'')).filter(file=>statusOf(file).type==='deletable').slice(0,MAX_DELETE).forEach(file=>selected.add(file.path));render()};
  await refresh('all');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
