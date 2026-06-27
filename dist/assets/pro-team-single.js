(()=>{
  'use strict';
  if (window.__PRO_TEAM_SINGLE_LOADER__) return;
  window.__PRO_TEAM_SINGLE_LOADER__ = true;
  window.__PRO_TEAM_QR_SINGLE__ = true;

  const ITEMS = [
    ['teamThakoonPro','teamThakoonNoPhoto','thakoon','team-thakoon.jpg'],
    ['teamAtthawitPro','teamAtthawitNoPhoto','atthawit','team-atthawit.jpg'],
    ['teamChatchaiPro','teamChatchaiNoPhoto','chatchai','team-chatchai.jpg'],
  ];
  const IMG_STATE = new Map();
  let booted = false;
  let qrPromise = null;
  let qrCache = null;
  let qrRendered = false;
  const QR_CONFIG = 'https://saodmeoilixfdqentofp.supabase.co/functions/v1/dev-qr?action=config';
  const QR_IMAGE = 'https://saodmeoilixfdqentofp.supabase.co/functions/v1/dev-qr?action=image';

  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function sources(key,file){
    const out=[];
    try{const local=localStorage.getItem('doit-team-photo-'+key+'-dataurl');if(local&&local.startsWith('data:image/'))out.push(local)}catch{}
    out.push(TEAM_FN+key);
    out.push(TEAM_PUBLIC+file);
    return out;
  }
  function one(id,noId,key,file,force=false){
    const img=document.getElementById(id),no=document.getElementById(noId);
    if(!img)return Promise.resolve(false);
    const s=IMG_STATE.get(id)||{loaded:false,loading:false,token:0,promise:null};IMG_STATE.set(id,s);
    if(s.loaded&&!force)return Promise.resolve(true);
    if(s.loading&&s.promise)return s.promise;
    s.loading=true;s.token++;const token=s.token,srcs=sources(key,file);
    if(no)no.style.display='flex';img.style.display='none';
    s.promise=new Promise(resolve=>{let i=0;const next=()=>{if(token!==s.token)return resolve(false);if(i>=srcs.length){s.loading=false;s.loaded=false;img.style.display='none';if(no)no.style.display='flex';return resolve(false)}img.onload=()=>{if(token!==s.token)return;s.loading=false;s.loaded=true;img.style.display='block';if(no)no.style.display='none';resolve(true)};img.onerror=()=>{if(token!==s.token)return;i++;next()};img.src=srcs[i]};next()});
    return s.promise;
  }
  function all(force=false){return Promise.all(ITEMS.map(x=>one(...x,force)))}
  function qrStyle(){if(document.getElementById('proTeamSingleStyle'))return;document.head.insertAdjacentHTML('beforeend',"<style id='proTeamSingleStyle'>.devQrPoster{background:#fff;border:0;border-radius:0;box-shadow:none;margin:4px auto 0;padding:0 0 6px;text-align:center;width:100%}.devQrPosterTop{font-weight:950;font-size:18px;line-height:1;color:#0f3f55;letter-spacing:.7px;margin:0 auto 3px}.devQrPosterLine{width:168px;height:4px;background:linear-gradient(90deg,#0f3f55 0 42%,#22c55e 42% 58%,#0f3f55 58% 100%);border-radius:999px;margin:0 auto 6px}.devQrPosterFrame{display:inline-flex;align-items:center;justify-content:center;background:#fff;border:0;padding:0;margin:0 auto}.devQrPosterFrame img{width:min(160px,38vw);height:min(160px,38vw);object-fit:contain;display:block;background:#fff}.devQrPosterBrand{font-weight:950;font-size:34px;line-height:.9;color:#0f3f55;letter-spacing:1.2px;margin:3px auto 0}.devQrPosterScan{font-weight:900;font-size:12px;color:#087b34;line-height:1.1;margin-top:5px}.devQrPosterEmpty{width:min(160px,38vw);height:min(160px,38vw);display:flex;align-items:center;justify-content:center;text-align:center;border:1px dashed #86efac;color:#166534;font-weight:950;background:#fff}@media(max-width:720px){.devQrPosterTop{font-size:15px}.devQrPosterLine{width:136px;height:3px}.devQrPosterFrame img,.devQrPosterEmpty{width:min(132px,35vw);height:min(132px,35vw)}.devQrPosterBrand{font-size:27px}.devQrPosterScan{font-size:10.5px}}</style>")}
  function qrBlock(){qrStyle();let b=document.getElementById('devQrBlock');const body=document.querySelector('.devBody');if(!b&&body){body.insertAdjacentHTML('beforeend',"<div class='devQrPoster' id='devQrBlock'></div>");b=document.getElementById('devQrBlock')}return b}
  function renderQr(config){const b=qrBlock();if(!b)return;const top=esc(config?.top_text||config?.header||'CNR SDO HFSAYA'),brand=esc(config?.brand_text||'AYA DOIT'),scan=esc(config?.bottom_text||'Scan QR Code'),url=config?.image_url;if(!url||config?.enabled===false){b.innerHTML=`<div class='devQrPosterTop'>${top}</div><div class='devQrPosterLine'></div><div class='devQrPosterFrame'><div class='devQrPosterEmpty'>รอ QR Code</div></div><div class='devQrPosterBrand'>${brand}</div><div class='devQrPosterScan'>${scan}</div>`;return}b.innerHTML=`<div class='devQrPosterTop'>${top}</div><div class='devQrPosterLine'></div><div class='devQrPosterFrame'><img src='${esc(url)}' alt='QR Code'></div><div class='devQrPosterBrand'>${brand}</div><div class='devQrPosterScan'>${scan}</div>`;qrRendered=true}
  function normalize(c){if(!c)return null;const x={...c};if(x.enabled!==false)x.enabled=true;if(!x.image_url||String(x.image_url).includes('/storage/v1/object/public/doit-files/team/dev-qr.png'))x.image_url=QR_IMAGE+'&t='+encodeURIComponent(x.updated_at||Date.now());return x}
  async function loadQr(){if(qrCache)return qrCache;if(qrPromise)return qrPromise;qrPromise=(async()=>{try{const r=await fetch(QR_CONFIG,{cache:'no-store'});if(!r.ok)throw Error(String(r.status));qrCache=normalize(await r.json());try{localStorage.setItem('doit-dev-qr-config-v1',JSON.stringify(qrCache))}catch{}}catch{try{qrCache=normalize(JSON.parse(localStorage.getItem('doit-dev-qr-config-v1')||'null'))}catch{qrCache=null}}return qrCache})();return qrPromise}
  async function primeQr(){qrBlock();if(!qrRendered)renderQr(null);const cfg=await loadQr();renderQr(cfg)}
  window.loadTeamPhotos=()=>all(false);
  window.openDevTeamModal=()=>{const m=document.getElementById('devTeamModal');if(m)m.classList.add('on');if(!booted){booted=true;all(false)}primeQr()};
  document.addEventListener('DOMContentLoaded',()=>{if(!booted){booted=true;requestAnimationFrame(()=>{all(false);primeQr()})}});
})();
