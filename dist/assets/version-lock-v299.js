(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.2';
function addScript(src,attr){try{if(attr&&document.querySelector('script['+attr+']'))return;if(document.querySelector('script[src*="'+src.split('?')[0].split('/').pop()+'"]'))return;const s=document.createElement('script');s.src=src;if(attr)s.setAttribute(attr,'1');(document.body||document.documentElement).appendChild(s)}catch(e){}}
function forceScript(src,attr){try{if(attr&&document.querySelector('script['+attr+']'))return;const s=document.createElement('script');s.src=src;if(attr)s.setAttribute(attr,'1');(document.body||document.documentElement).appendChild(s)}catch(e){}}
function loadHotfixes(){
  addScript('/assets/scope-helper-v308.js?v=308','data-scope-helper-v308');
  forceScript('/assets/pro-cloud-loader-v265.js?v=310','data-pro-cloud-loader-v310');
  forceScript('/assets/telesale-drawer-v262.js?v=310','data-telesale-drawer-v310');
  forceScript('/assets/telesale-force-refresh-v310.js?v=311','data-telesale-force-refresh-v311');
  forceScript('/assets/print-export-fix-v267.js?v=310','data-print-export-fix-v267-v310');
  forceScript('/assets/print-export-fix-v308.js?v=310','data-print-export-fix-v308-v310');
  forceScript('/assets/field-logic-fixes-v308.js?v=310','data-field-logic-fixes-v308-v310');
  addScript('/assets/search-debounce-v308.js?v=308','data-search-debounce-v308');
  forceScript('/assets/insert-product-v309.js?v=310','data-insert-product-v309-v310');
  forceScript('/assets/pro-stability-v311.js?v=311','data-pro-stability-v311');
}
function loadAppCoordinator(){try{
  loadHotfixes();
  forceScript('/assets/app-coordinator-v290.js?v=310','data-app-coordinator-v290-v310');
  forceScript('/assets/remaining-coordinator-v291.js?v=310','data-remaining-coordinator-v291-v310');
  if(!document.querySelector('script[src*="ps-scope-fix-v292.js"]'))addScript('/assets/ps-scope-fix-v292.js?v=292','data-ps-scope-fix-v292');
  if(!document.querySelector('script[src*="print-store-name-edit-v296.js"]'))addScript('/assets/print-store-name-edit-v296.js?v=296','data-print-store-name-edit-v296');
  if(!document.querySelector('script[src*="order-store-filter-v297.js"]'))addScript('/assets/order-store-filter-v297.js?v=297','data-order-store-filter-v297');
}catch(e){}}
function lockVersion(){
  try{document.title=APP_VERSION}catch(e){}
  try{const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION}catch(e){}
  try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch(e){}
  try{const m=document.querySelector('#msg');if(m)m.textContent=(m.textContent||'').replace(/V2\.5\.9|V2\.7\.9|V2\.8\.0|V2\.8\.1|V2\.8\.2|V2\.8\.3|V2\.8\.4|V2\.8\.5|V2\.8\.6|V2\.9\.0|V2\.9\.1/g,'V2.9.2')}catch(e){}
  loadAppCoordinator();
}
lockVersion();
setInterval(lockVersion,1200);
document.addEventListener('DOMContentLoaded',lockVersion,{once:true});
window.addEventListener('load',lockVersion,{once:true});
})();