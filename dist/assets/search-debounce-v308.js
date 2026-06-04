(()=>{'use strict';
function boot(){const q=document.querySelector('#q'),btn=document.querySelector('#searchBtn');if(!q||q.dataset.debounce308)return;q.dataset.debounce308='1';let t;q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>btn?.click(),250)},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();setTimeout(boot,800);
})();