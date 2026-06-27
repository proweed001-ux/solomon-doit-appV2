(()=>{
  'use strict';
  if (window.__PRO_TEAM_SINGLE_LOADER__) return;
  window.__PRO_TEAM_SINGLE_LOADER__ = true;
  const ITEMS = [
    ['teamThakoonPro','teamThakoonNoPhoto','thakoon','team-thakoon.jpg'],
    ['teamAtthawitPro','teamAtthawitNoPhoto','atthawit','team-atthawit.jpg'],
    ['teamChatchaiPro','teamChatchaiNoPhoto','chatchai','team-chatchai.jpg'],
  ];
  const state = new Map();
  let booted = false;
  function sources(key,file){
    const out=[];
    try{const local=localStorage.getItem('doit-team-photo-'+key+'-dataurl');if(local&&local.startsWith('data:image/'))out.push(local)}catch{}
    out.push(TEAM_FN+key);
    out.push(TEAM_PUBLIC+file);
    return out;
  }
  function one(id,noId,key,file,force=false){
    const img=document.getElementById(id),no=document.getElementById(noId);
    if(!img)return Promise.resolve(false);
    const s=state.get(id)||{loaded:false,loading:false,token:0,promise:null};state.set(id,s);
    if(s.loaded&&!force)return Promise.resolve(true);
    if(s.loading&&s.promise)return s.promise;
    s.loading=true;s.token++;const token=s.token,srcs=sources(key,file);
    if(no)no.style.display='flex';img.style.display='none';
    s.promise=new Promise(resolve=>{let i=0;const next=()=>{if(token!==s.token)return resolve(false);if(i>=srcs.length){s.loading=false;s.loaded=false;img.style.display='none';if(no)no.style.display='flex';return resolve(false)}img.onload=()=>{if(token!==s.token)return;s.loading=false;s.loaded=true;img.style.display='block';if(no)no.style.display='none';resolve(true)};img.onerror=()=>{if(token!==s.token)return;i++;next()};img.src=srcs[i]};next()});
    return s.promise;
  }
  function all(force=false){return Promise.all(ITEMS.map(x=>one(...x,force)))}
  window.loadTeamPhotos=()=>all(false);
  window.openDevTeamModal=()=>{const m=document.getElementById('devTeamModal');if(m)m.classList.add('on');if(!booted){booted=true;all(false)}};
  document.addEventListener('DOMContentLoaded',()=>{if(!booted){booted=true;requestAnimationFrame(()=>all(false))}});
})();
