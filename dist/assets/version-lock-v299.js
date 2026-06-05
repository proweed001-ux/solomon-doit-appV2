(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.2';
function addScript(src,attr){try{if(attr&&document.querySelector('script['+attr+']'))return;if(document.querySelector('script[src*="'+src.split('?')[0].split('/').pop()+'"]'))return;const s=document.createElement('script');s.src=src;if(attr)s.setAttribute(attr,'1');(document.body||document.documentElement).appendChild(s)}catch(e){}}
function loadHotfixes(){
  addScript('/assets/scope-helper-v308.js?v=308','data-scope-helper-v308');
  addScript('/assets/print-export-fix-v308.js?v=308','data-print-export-fix-v308');
  addScript('/assets/field-logic-fixes-v308.js?v=308','data-field-logic-fixes-v308');
  addScript('/assets/search-debounce-v308.js?v=308','data-search-debounce-v308');
  addScript('/assets/insert-product-v309.js?v=309','data-insert-product-v309');
  addScript('/assets/telesale-count-fix-v311.js?v=311','data-telesale-count-fix-v311');
}
function loadAppCoordinator(){try{
  loadHotfixes();
  if(!document.querySelector('script[data-app-coordinator-v290],script[src*="app-coordinator-v290.js"]'))addScript('/assets/app-coordinator-v290.js?v=292','data-app-coordinator-v290');
  if(!document.querySelector('script[src*="remaining-coordinator-v291.js"]'))addScript('/assets/remaining-coordinator-v291.js?v=292','data-remaining-coordinator-v291');
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
document.addEventListener('DOMContentLoaded',lockVersion,{once:true});
window.addEventListener('load',lockVersion,{once:true});
})();