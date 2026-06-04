(()=>{'use strict';
const T=v=>String(v??'').trim();
const $=s=>document.querySelector(s);
function scopeHead(){return[T($('#startDate')?.value),T($('#endDate')?.value),T($('#psSelect')?.value)].join('|')+'|'}
function install(){window.DOIT_SCOPE_HEAD=scopeHead;window.DOIT_SCOPE_FILTERS=()=>({start:T($('#startDate')?.value),end:T($('#endDate')?.value),ps:T($('#psSelect')?.value),receiver:T($('#storeSelect')?.value),brand:T($('#brandSelect')?.value),type:T($('#typeSelect')?.value),q:T($('#q')?.value).toLowerCase(),scopeHead:scopeHead()})}
install();document.addEventListener('DOMContentLoaded',install);['change','input'].forEach(ev=>document.addEventListener(ev,e=>{if(['startDate','endDate','psSelect','storeSelect','brandSelect','typeSelect','q'].includes(e.target?.id))install()},true));
})();