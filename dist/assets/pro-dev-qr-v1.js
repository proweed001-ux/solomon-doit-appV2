(()=>{'use strict';
const URL0='https://saodmeoilixfdqentofp.supabase.co';
const BUCKET='doit-files';
const CFG_PATH='team/dev-qr-config.json';
const $=s=>document.querySelector(s);
function publicPath(path){return `${URL0}/storage/v1/object/public/${BUCKET}/${path}`}
async function loadQr(){try{const r=await fetch(publicPath(CFG_PATH)+'?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error(String(r.status));const c=await r.json();localStorage.setItem('doit-dev-qr-config-v1',JSON.stringify(c));return c}catch(e){try{return JSON.parse(localStorage.getItem('doit-dev-qr-config-v1')||'null')}catch{return null}}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function ensureStyle(){if($('#devQrStyle'))return;document.head.insertAdjacentHTML('beforeend',`<style id="devQrStyle">.devQrBlock{margin-top:14px;border:1px solid #bbf7d0;background:linear-gradient(180deg,#f0fdf4,#fff);border-radius:16px;padding:14px;text-align:center}.devQrBlock h3{margin:0 0 6px;color:#064e3b;font-size:18px}.devQrBlock p{margin:0 0 12px;color:#475569;font-weight:800}.devQrFrame{background:#fff;border:1px solid #d1d5db;border-radius:18px;padding:12px;display:inline-flex;align-items:center;justify-content:center;max-width:100%}.devQrFrame img{width:min(330px,78vw);height:min(330px,78vw);object-fit:contain;display:block}.devQrUpdated{display:block;color:#64748b;font-size:11px;margin-top:8px}@media(max-width:720px){.devQrBlock{padding:12px}.devQrBlock h3{font-size:16px}.devQrFrame img{width:min(270px,76vw);height:min(270px,76vw)}}</style>`)}
function imageUrl(c){if(c?.image_url)return c.image_url;if(c?.storage_path)return publicPath(c.storage_path)+'?t='+(c.updated_at||Date.now());return ''}
async function injectQr(){const body=$('.devBody');if(!body)return;ensureStyle();$('#devQrBlock')?.remove();const c=await loadQr();if(!c||c.enabled===false)return;const img=imageUrl(c);if(!img)return;body.insertAdjacentHTML('beforeend',`<div class="devQrBlock" id="devQrBlock"><h3>${esc(c.title||'QR Code')}</h3><p>${esc(c.note||'สแกนเพื่อเปิดข้อมูลเพิ่มเติม')}</p><div class="devQrFrame"><img src="${esc(img)}" alt="QR Code"></div>${c.updated_at?`<small class="devQrUpdated">อัปเดต ${esc(new Date(c.updated_at).toLocaleString('th-TH'))}</small>`:''}</div>`)}
function patch(){const old=window.openDevTeamModal;if(typeof old==='function'&&!old.__qrPatched){window.openDevTeamModal=function(){const out=old.apply(this,arguments);setTimeout(injectQr,250);return out};window.openDevTeamModal.__qrPatched=true}document.addEventListener('click',e=>{if(e.target?.closest?.('.devTeamBtn'))setTimeout(injectQr,350)},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else patch();
})();
