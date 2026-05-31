(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.8.1';
const READY_TEXT='พร้อมใช้งาน V2.8.1';
function lockVersion(){
  try{document.title=APP_VERSION}catch{}
  try{const t=document.querySelector('.title');if(t&&t.textContent!==APP_VERSION)t.textContent=APP_VERSION}catch{}
  try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch{}
  try{const m=document.querySelector('#msg');if(m&&/V2\.5\.9|V2\.7\.9|V2\.8\.0|V2\.8\.1/.test(m.textContent||''))m.textContent=(m.textContent||READY_TEXT).replace(/V2\.5\.9|V2\.7\.9|V2\.8\.0/g,'V2.8.1')}catch{}
}
lockVersion();
[50,150,400,900,1600,3000].forEach(ms=>setTimeout(lockVersion,ms));
document.addEventListener('DOMContentLoaded',lockVersion);
window.addEventListener('load',lockVersion);
})();