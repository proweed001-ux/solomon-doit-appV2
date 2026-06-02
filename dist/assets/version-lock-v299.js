(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.2';
function loadAppCoordinator(){
  try{
    if(!document.querySelector('script[data-app-coordinator-v290],script[src*="app-coordinator-v290.js"]')){
      const s=document.createElement('script');
      s.src='/assets/app-coordinator-v290.js?v=292';
      s.dataset.appCoordinatorV290='1';
      (document.body||document.documentElement).appendChild(s);
    }
    if(!document.querySelector('script[src*="remaining-coordinator-v291.js"]')){
      const r=document.createElement('script');
      r.src='/assets/remaining-coordinator-v291.js?v=292';
      (document.body||document.documentElement).appendChild(r);
    }
    if(!document.querySelector('script[src*="ps-scope-fix-v292.js"]')){
      const p=document.createElement('script');
      p.src='/assets/ps-scope-fix-v292.js?v=292';
      (document.body||document.documentElement).appendChild(p);
    }
  }catch(e){}
}
function lockVersion(){
  try{document.title=APP_VERSION}catch(e){}
  try{const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION}catch(e){}
  try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch(e){}
  try{const m=document.querySelector('#msg');if(m)m.textContent=(m.textContent||'').replace(/V2\.5\.9|V2\.7\.9|V2\.8\.0|V2\.8\.1|V2\.8\.2|V2\.8\.3|V2\.8\.4|V2\.8\.5|V2\.8\.6|V2\.9\.0|V2\.9\.1/g,'V2.9.2')}catch(e){}
  loadAppCoordinator();
}
lockVersion();
document.addEventListener('DOMContentLoaded',lockVersion,{once:true});
window.addEventListener('load',lockVersion,{once:true});
})();