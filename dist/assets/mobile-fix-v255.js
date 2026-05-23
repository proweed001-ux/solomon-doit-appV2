(function(){
  const $=s=>document.querySelector(s);
  const safe=(fn,label)=>{try{return fn()}catch(e){console.error(label||'DOIT error',e); const m=$('#msg'); if(m)m.textContent='พบข้อผิดพลาด: '+(e.message||e);}};
  window.addEventListener('error',e=>{const m=$('#msg'); if(m)m.textContent='ระบบกันพัง: '+(e.message||'เกิดข้อผิดพลาด');});
  window.addEventListener('unhandledrejection',e=>{const m=$('#msg'); if(m)m.textContent='ระบบกันพัง: '+((e.reason&&e.reason.message)||e.reason||'โหลดไฟล์ไม่สำเร็จ');});
  document.addEventListener('DOMContentLoaded',()=>safe(()=>{
    const choose=$('#choose'), file=$('#file');
    if(choose&&file&&!choose.dataset.safe){choose.dataset.safe='1'; choose.addEventListener('click',()=>file.click());}
    const q=$('#q'), search=$('#searchBtn');
    if(q&&search&&!q.dataset.enter){q.dataset.enter='1'; q.addEventListener('keydown',e=>{if(e.key==='Enter')search.click();});}
    document.querySelectorAll('button').forEach(b=>b.addEventListener('touchstart',()=>{}, {passive:true}));
    const tw=document.querySelector('.tableWrap');
    if(tw&&!tw.dataset.hint){tw.dataset.hint='1'; tw.addEventListener('scroll',()=>{tw.classList.add('scrolled')},{passive:true});}
  },'init'));
  const oldAlert=window.alert;
  window.alert=function(msg){const m=$('#msg'); if(m)m.textContent=String(msg); else oldAlert(msg);};
})();
