(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.8.4';
function loadCoordinator(){
  try{
    if(document.querySelector('script[data-filter-coordinator-v304]'))return;
    const s=document.createElement('script');
    s.src='/assets/filter-coordinator-v304.js?v=304';
    s.dataset.filterCoordinatorV304='1';
    document.body.appendChild(s);
  }catch(e){}
}
function lockVersion(){
  try{document.title=APP_VERSION}catch(e){}
  try{const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION}catch(e){}
  try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch(e){}
  try{const m=document.querySelector('#msg');if(m)m.textContent=(m.textContent||'').replace(/V2\.5\.9|V2\.7\.9|V2\.8\.0|V2\.8\.1|V2\.8\.2|V2\.8\.3/g,'V2.8.4')}catch(e){}
  loadCoordinator();
}
lockVersion();
[50,150,400,900,1600,3000].forEach(ms=>setTimeout(lockVersion,ms));
document.addEventListener('DOMContentLoaded',lockVersion);
window.addEventListener('load',lockVersion);
})();