(()=>{'use strict';
const TITLE='AYA By.พี่ฐาสั่งลุยย';
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function patchTitle(){
  document.title=TITLE;
  const t=document.querySelector('.topbar .title');
  if(!t)return false;
  let st=document.getElementById('ayaSeaWaveTitleCss');
  if(!st){st=document.createElement('style');st.id='ayaSeaWaveTitleCss';document.head.appendChild(st)}
  st.textContent=`
    @keyframes ayaLetterWave{0%,100%{transform:translateY(0)}25%{transform:translateY(-5px)}50%{transform:translateY(0)}75%{transform:translateY(4px)}}
    .ayaBrandTitle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:0!important;font-family:"Arial Black",Impact,system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif!important;font-size:21px!important;font-weight:1000!important;letter-spacing:.25px!important;line-height:1!important;color:#fff!important;-webkit-text-fill-color:#fff!important;background:none!important;-webkit-background-clip:initial!important;background-clip:initial!important;-webkit-text-stroke:0!important;text-shadow:0 2px 3px rgba(0,0,0,.55)!important;animation:none!important;white-space:nowrap!important;overflow:visible!important}
    .ayaBrandTitle::before,.ayaBrandTitle::after{display:none!important;content:none!important}
    .ayaBrandTitle .ayaChar{display:inline-block!important;color:#fff!important;-webkit-text-fill-color:#fff!important;background:none!important;animation:ayaLetterWave 2.2s ease-in-out infinite!important;animation-delay:calc(var(--i) * .075s)!important;will-change:transform}
    .topbar{overflow:hidden!important;background:linear-gradient(90deg,#075424,#087b34)!important}
    @media(max-width:720px){.ayaBrandTitle{font-size:16.2px!important;letter-spacing:.05px!important;text-shadow:0 1px 3px rgba(0,0,0,.62)!important}.ayaBrandTitle .ayaChar{animation-duration:2.35s!important;animation-delay:calc(var(--i) * .065s)!important}}
  `;
  t.classList.add('ayaBrandTitle');
  t.setAttribute('aria-label',TITLE);
  t.innerHTML=[...TITLE].map((ch,i)=>`<span class="ayaChar" style="--i:${i}">${ch===' '?'&nbsp;':esc(ch)}</span>`).join('');
  return true;
}
function cleanLabel(v){
  const s=String(v??'').trim().replace(/\s+/g,' ');
  const p=s.split(' ').filter(Boolean);
  return p.length===2&&p[0]===p[1]?p[0]:s;
}
function cleanPsPopupOnce(){
  const title=document.querySelector('#pickTitle');
  if(!title||title.textContent.trim()!=='PS')return;
  document.querySelectorAll('#pickList .pickItem').forEach(item=>{
    const label=item.querySelectorAll('span')[1];
    if(label)label.textContent=cleanLabel(label.textContent);
  });
}
function cleanPsTextOnce(){
  const el=document.querySelector('#psText');
  if(!el)return;
  el.textContent=el.textContent.replace(/^PS:\s*(.+)$/,(m,v)=>'PS: '+cleanLabel(v));
}
function bindPsClean(){
  if(window.__AYA_PS_CLEAN_CLICK__)return;
  window.__AYA_PS_CLEAN_CLICK__=true;
  document.addEventListener('click',e=>{
    const pick=e.target.closest?.('[data-pick="ps"],#pickOk');
    if(!pick)return;
    setTimeout(()=>{cleanPsPopupOnce();cleanPsTextOnce()},60);
    setTimeout(()=>{cleanPsPopupOnce();cleanPsTextOnce()},220);
  },true);
}
function boot(){
  if(!patchTitle())return setTimeout(boot,250);
  bindPsClean();
  cleanPsTextOnce();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();