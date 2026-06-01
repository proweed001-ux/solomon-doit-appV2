(()=>{'use strict';
try{window.sshape=false}catch(e){}
try{document.__criticalFix282Click=true;document.__fieldLogic295Click=true}catch(e){}
function loadCloseOwner(){
  try{
    document.__criticalFix282Click=true;
    document.__fieldLogic295Click=true;
    if(document.querySelector('script[data-close-owner-v306]'))return;
    const s=document.createElement('script');
    s.src='/assets/close-owner-v306.js?v=306';
    s.dataset.closeOwnerV306='1';
    (document.body||document.documentElement).appendChild(s);
  }catch(e){console.warn('[critical-fixes-v282] close owner load failed',e)}
}
function boot(){
  try{window.sshape=false}catch(e){}
  try{document.__criticalFix282Click=true;document.__fieldLogic295Click=true}catch(e){}
  loadCloseOwner();
  let n=0;const tick=()=>{try{window.sshape=false;document.__criticalFix282Click=true;document.__fieldLogic295Click=true}catch(e){};loadCloseOwner();if(++n<12)setTimeout(tick,500)};setTimeout(tick,300);
}
document.addEventListener('DOMContentLoaded',boot);if(document.readyState!=='loading')boot();
})();