(()=>{'use strict';
const URL0='https://saodmeoilixfdqentofp.supabase.co';
const BUCKET='doit-files';
const $=s=>document.querySelector(s);
const T=v=>String(v??'').trim();
const N=v=>Number(v)||0;
const TEAM=[
  {key:'atthawit',input:'#teamAtthawitFile',preview:'#teamAtthawitPreview',name:'นาย อรรถวิทย์ ชัยชะนะ',code:'AYAADS01',role:'ที่ปรึกษา/แอดมิน',path:'team/team-atthawit.jpg'},
  {key:'chatchai',input:'#teamChatchaiFile',preview:'#teamChatchaiPreview',name:'นาย ฉัตรชัย จันทร์กลิ่น',code:'AYAPS062',role:'ผู้สร้าง/จัดทำ',path:'team/team-chatchai.jpg'}
];
function cfg(){let c={};try{c=JSON.parse(localStorage.getItem('doit-cloud-cfg')||'{}')}catch{}let u=T($('#sbUrl')?.value||c.url).replace(/\/$/,'')||URL0;let k=T($('#sbKey')?.value||c.key);return{u,k}}
function H(c,x={}){return{apikey:c.k,authorization:'Bearer '+c.k,...x}}
function status(s,ok=false){const el=$('#teamPhotoStatus');if(el)el.innerHTML='<div class="'+(ok?'ok':'warn')+'">'+s+'</div>';console.log('[TEAM PHOTO]',s)}
function publicUrl(c,path){return `${c.u}/storage/v1/object/public/${BUCKET}/${path}`}
async function put(c,path,blob,type){const url=`${c.u}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g,'/')}`;const r=await fetch(url,{method:'POST',headers:H(c,{'Content-Type':type,'x-upsert':'true'}),body:blob});const t=await r.text();if(!r.ok)throw Error(t||r.status);return t}
function fileToImage(file){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=()=>rej(Error('อ่านรูปไม่ได้: '+file.name));img.src=URL.createObjectURL(file)})}
function blobToDataUrl(blob){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(blob)})}
async function makePhoto(file){const img=await fileToImage(file);const W=800,H=540,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d');ctx.fillStyle='#ecfdf5';ctx.fillRect(0,0,W,H);const scale=Math.max(W/img.naturalWidth,H/img.naturalHeight),sw=W/scale,sh=H/scale,sx=(img.naturalWidth-sw)/2,sy=(img.naturalHeight-sh)/2;ctx.drawImage(img,Math.max(0,sx),Math.max(0,sy),Math.min(img.naturalWidth,sw),Math.min(img.naturalHeight,sh),0,0,W,H);return await new Promise(res=>c.toBlob(res,'image/jpeg',0.88))}
async function preview(member){const f=$(member.input)?.files?.[0];if(!f)return;const blob=await makePhoto(f);const data=await blobToDataUrl(blob);localStorage.setItem('doit-team-photo-'+member.key+'-dataurl',data);const img=$(member.preview);if(img)img.src=data}
async function upload(){try{const c=cfg();const chosen=TEAM.filter(m=>$(m.input)?.files?.[0]);if(!chosen.length)throw Error('ยังไม่ได้เลือกรูปทีมพัฒนา');status('กำลังปรับขนาดและอัปโหลดรูป...');const uploaded=[];for(const m of chosen){const file=$(m.input).files[0];const blob=await makePhoto(file);const data=await blobToDataUrl(blob);localStorage.setItem('doit-team-photo-'+m.key+'-dataurl',data);const img=$(m.preview);if(img)img.src=data;if(!c.k)throw Error('ยังไม่ได้ใส่ Supabase anon key จึงบันทึกได้เฉพาะเครื่องนี้ แต่ยังอัป Cloud ไม่ได้');await put(c,m.path,blob,'image/jpeg');uploaded.push(m.name)}const config={schema:'aya-team-config-v1',updated_at:new Date().toISOString(),members:TEAM.map(m=>({key:m.key,name:m.name,code:m.code,role:m.role,photo_url:publicUrl(c,m.path)}))};await put(c,'team/team-config.json',new Blob([JSON.stringify(config)],{type:'application/json;charset=utf-8'}),'application/json;charset=utf-8');localStorage.setItem('doit-team-config-v1',JSON.stringify(config));status('อัปโหลดรูปทีมพัฒนาแล้ว: '+uploaded.join(' / ')+'<br>หน้า Pro จะดึงรูปใหม่อัตโนมัติเมื่อเปิด popup ทีมพัฒนา',true)}catch(e){status('อัปโหลดรูปทีมพัฒนาไม่สำเร็จ: '+(e.message||e))}}
function bind(){TEAM.forEach(m=>{$(m.input)?.addEventListener('change',()=>preview(m).catch(e=>status(e.message||e)));const data=localStorage.getItem('doit-team-photo-'+m.key+'-dataurl');if(data&&$(m.preview))$(m.preview).src=data});const b=$('#uploadTeamPhotos');if(b)b.onclick=upload;const p=$('#openProAfterTeam');if(p)p.onclick=()=>location.href='/pro.html?v=12&t='+Date.now()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();