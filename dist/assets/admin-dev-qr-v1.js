(()=>{'use strict';
const URL0='https://saodmeoilixfdqentofp.supabase.co';
const BUCKET='doit-files';
const QR_PATH='team/dev-qr.png';
const QR_CONFIG_PATH='team/dev-qr-config.json';
const $=s=>document.querySelector(s);
const T=v=>String(v??'').trim();
function cfg(){let c={};try{c=JSON.parse(localStorage.getItem('doit-cloud-cfg')||'{}')}catch{}return{u:T($('#sbUrl')?.value||c.url||URL0).replace(/\/$/,''),k:T($('#sbKey')?.value||c.key)}}
function H(c,x={}){return{apikey:c.k,authorization:'Bearer '+c.k,...x}}
function status(msg,ok=false){const el=$('#devQrStatus');if(el)el.innerHTML='<div class="'+(ok?'ok':'warn')+'">'+msg+'</div>'}
function publicUrl(c,path){return `${c.u}/storage/v1/object/public/${BUCKET}/${path}`}
async function put(c,path,blob,type){const url=`${c.u}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g,'/')}`;const r=await fetch(url,{method:'POST',headers:H(c,{'Content-Type':type,'x-upsert':'true'}),body:blob});const t=await r.text();if(!r.ok)throw Error(t||r.status);return t}
function fileToImage(file){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=()=>rej(Error('อ่านไฟล์ QR ไม่ได้: '+file.name));img.src=URL.createObjectURL(file)})}
function blobToDataUrl(blob){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(blob)})}
async function makeQr(file){const img=await fileToImage(file);const W=900,H=900,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);const pad=54,box=W-pad*2,scale=Math.min(box/img.naturalWidth,box/img.naturalHeight),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;ctx.drawImage(img,(W-dw)/2,(H-dh)/2,dw,dh);return await new Promise(res=>c.toBlob(res,'image/png'))}
async function preview(){try{const f=$('#devQrFile')?.files?.[0];if(!f)return;const blob=await makeQr(f);const data=await blobToDataUrl(blob);localStorage.setItem('doit-dev-qr-preview',data);const img=$('#devQrPreview');if(img)img.src=data;status('Preview QR พร้อมแล้ว',true)}catch(e){status(e.message||e)}}
async function upload(){try{const c=cfg();const f=$('#devQrFile')?.files?.[0];if(!f)throw Error('ยังไม่ได้เลือกรูป QR Code');if(!c.k)throw Error('ยังไม่ได้ใส่ Supabase anon key ในช่อง Cloud / Supabase');status('กำลังอัปโหลด QR Code...');const blob=await makeQr(f);await put(c,QR_PATH,blob,'image/png');const config={schema:'aya-dev-qr-v1',enabled:true,title:T($('#devQrTitle')?.value)||'QR Code',note:T($('#devQrNote')?.value)||'สแกนเพื่อเปิดข้อมูลเพิ่มเติม',image_url:publicUrl(c,QR_PATH)+'?t='+Date.now(),storage_path:QR_PATH,updated_at:new Date().toISOString()};await put(c,QR_CONFIG_PATH,new Blob([JSON.stringify(config)],{type:'application/json;charset=utf-8'}),'application/json;charset=utf-8');localStorage.setItem('doit-dev-qr-config-v1',JSON.stringify(config));const img=$('#devQrPreview');if(img)img.src=config.image_url;status('อัปโหลด QR Code แล้ว เปิดหน้า Pro แล้วกดทีมพัฒนาเพื่อตรวจ',true)}catch(e){status('อัปโหลด QR Code ไม่สำเร็จ: '+(e.message||e))}}
async function disableQr(){try{const c=cfg();if(!c.k)throw Error('ยังไม่ได้ใส่ Supabase anon key ในช่อง Cloud / Supabase');const config={schema:'aya-dev-qr-v1',enabled:false,updated_at:new Date().toISOString()};await put(c,QR_CONFIG_PATH,new Blob([JSON.stringify(config)],{type:'application/json;charset=utf-8'}),'application/json;charset=utf-8');localStorage.setItem('doit-dev-qr-config-v1',JSON.stringify(config));status('ปิดการแสดง QR Code แล้ว',true)}catch(e){status('ปิด QR ไม่สำเร็จ: '+(e.message||e))}}
function bind(){if(!$('#devQrAdminCard'))return;const old=localStorage.getItem('doit-dev-qr-preview');if(old&&$('#devQrPreview'))$('#devQrPreview').src=old;$('#devQrFile')?.addEventListener('change',preview);$('#uploadDevQr')&&($('#uploadDevQr').onclick=upload);$('#disableDevQr')&&($('#disableDevQr').onclick=disableQr);$('#openProAfterQr')&&($('#openProAfterQr').onclick=()=>location.href='/pro.html?v=19&t='+Date.now())}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
