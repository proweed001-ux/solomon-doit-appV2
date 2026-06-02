(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.0';
function loadAppCoordinator(){
  try{
    if(document.querySelector('script[data-app-coordinator-v290],script[src*="app-coordinator-v290.js"]'))return;
    const s=document.createElement('script');
    s.src='/assets/app-coordinator-v290.js?v=290';
    s.dataset.appCoordinatorV290='1';
    (document.body||document.documentElement).appendChild(s);
  }catch(e){}
}
function lockVersion(){
  try{document.title=APP_VERSION}catch(e){}
  try{const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION}catch(e){}
  try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch(e){}
  try{const m=document.querySelector('#msg');if(m)m.textContent=(m.textContent||'').replace(/V2\.5\.9|V2\.7\.9|V2\.8\.0|V2\.8\.1|V2\.8\.2|V2\.8\.3|V2\.8\.4|V2\.8\.5|V2\.8\.6/g,'V2.9.0')}catch(e){}
  loadAppCoordinator();
}
lockVersion();
document.addEventListener('DOMContentLoaded',lockVersion,{once:true});
window.addEventListener('load',lockVersion,{once:true});
})();