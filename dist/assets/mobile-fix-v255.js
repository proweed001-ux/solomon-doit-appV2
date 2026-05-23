(function(){
  var VERSION='V2.5.5-mobile-safe-2';
  var busy=false;
  function $(s){return document.querySelector(s)}
  function msg(t){var m=$('#msg'); if(m){m.style.display='block'; m.textContent=String(t||'');} console.log('[DOIT]',t);}
  function safe(fn,label){try{return fn()}catch(e){console.error(label||'DOIT error',e);msg('ระบบกันพัง: '+(label?label+' - ':'')+(e&&e.message?e.message:e));return null}}
  window.__DOIT_SAFE_VERSION=VERSION;
  window.addEventListener('error',function(e){msg('ระบบกันพัง: '+(e.message||'เกิดข้อผิดพลาด'));});
  window.addEventListener('unhandledrejection',function(e){var r=e.reason;msg('ระบบกันพัง: '+((r&&r.message)||r||'โหลดข้อมูลไม่สำเร็จ'));});
  if(typeof window.render==='function'&&!window.render.__safeWrapped){
    var oldRender=window.render;
    window.render=function(){return safe(function(){return oldRender.apply(this,arguments)},'render')};
    window.render.__safeWrapped=true;
  }
  document.addEventListener('DOMContentLoaded',function(){safe(function(){
    var choose=$('#choose'), file=$('#file'), q=$('#q'), search=$('#searchBtn'), clear=$('#clearFilter');
    if(choose&&file&&!choose.dataset.safe){choose.dataset.safe='1';choose.addEventListener('click',function(){safe(function(){file.click()},'open file picker')});}
    if(file&&!file.dataset.safe){file.dataset.safe='1';file.addEventListener('change',function(){var f=file.files&&file.files[0]; if(!f)return; if(f.size>70*1024*1024)msg('ไฟล์ใหญ่มาก กำลังอ่าน อาจใช้เวลานานบนมือถือ: '+Math.round(f.size/1024/1024)+'MB'); else msg('กำลังเตรียมอ่านไฟล์: '+f.name);});}
    if(q&&search&&!q.dataset.enter){q.dataset.enter='1';q.addEventListener('keydown',function(e){if(e.key==='Enter')safe(function(){search.click()},'search')});}
    if(clear&&!clear.dataset.safe){clear.dataset.safe='1';clear.addEventListener('click',function(){msg('ล้างตัวกรองแล้ว');});}
    document.querySelectorAll('button').forEach(function(b){b.addEventListener('touchstart',function(){}, {passive:true});});
    var tw=$('.tableWrap'); if(tw&&!tw.dataset.safe){tw.dataset.safe='1';tw.addEventListener('scroll',function(){tw.classList.add('scrolled')},{passive:true});}
    if(!window.XLSX)msg('โหลดตัวอ่าน Excel ไม่สำเร็จ กรุณารีเฟรชหน้า');
    msg('Mobile safe พร้อมใช้งาน '+VERSION);
  },'init')});
  var oldAlert=window.alert;
  window.alert=function(x){msg(x); if(!$('#msg'))oldAlert(x);};
})();
