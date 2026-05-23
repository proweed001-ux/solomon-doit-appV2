(function(){
  var VERSION='V2.5.5-mobile-check2';
  function $(s){return document.querySelector(s)}
  function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
  function show(t){var m=$('#msg'); if(m){m.style.display='block'; m.textContent=String(t||'');} console.log('[DOIT SAFE]',t)}
  function safe(fn,label){try{return fn()}catch(e){console.error(label||'error',e);show('ระบบกันพัง: '+(label?label+' - ':'')+(e&&e.message?e.message:e));return null}}
  function n(v){return Number(String(v==null?'':v).replace(/,/g,''))||0}
  function f(v){return n(v).toLocaleString('th-TH')}
  function m(v){return n(v).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function t(v){return String(v==null?'':v).trim()}
  function e(s){return t(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function u(a){return Array.from(new Set((a||[]).map(t).filter(Boolean)))}
  function dl(s){var p=t(s).split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:t(s||'ทั้งหมด')}
  window.__DOIT_SAFE_VERSION=VERSION;
  window.addEventListener('error',function(x){show('ระบบกันพัง: '+(x.message||'เกิดข้อผิดพลาด'))});
  window.addEventListener('unhandledrejection',function(x){var r=x.reason;show('ระบบกันพัง: '+((r&&r.message)||r||'โหลดข้อมูลไม่สำเร็จ'))});
  function rows(){return safe(function(){return (window.R||[]).filter(function(r){
    if(window.dateOn&&!dateOn(r))return false; if(window.cellOn&&!cellOn(r))return false;
    if(window.typeFilter&&r.type!==window.typeFilter)return false; if(window.store&&r.store!==window.store)return false; if(window.brand&&r.brand!==window.brand)return false;
    var q=t(window.query).toLowerCase(); if(q&&[r.date,r.sku,r.code,r.store,r.ps,r.inv,r.brand,r.size,r.type].join(' ').toLowerCase().indexOf(q)<0)return false; return true;
  })},'filter rows')||[]}
  function opts(id,vals,label,cur){var el=$('#'+id); if(!el)return; cur=cur==null?el.value:cur; el.innerHTML='<option value="">'+e(label||'ทั้งหมด')+'</option>'+vals.map(function(v){return '<option value="'+e(v)+'">'+e(v)+'</option>'}).join(''); if(vals.indexOf(cur)>=0)el.value=cur;}
  function draw(){safe(function(){
    if(!(window.R&&R.length))return;
    var up=$('#upload'), work=$('#work'), bill=$('#bill'); if(up){up.hidden=false;up.classList.remove('hidden')} if(work){work.hidden=false;work.classList.remove('hidden')} if(bill)bill.classList.add('hidden');
    var ds=window.allDates?allDates():u(R.map(function(r){return r.date})).sort(), dsel=window.datesSel?Array.from(datesSel):[];
    if($('#datePreview'))$('#datePreview').textContent=window.dateText?dateText():dl(dsel[0]||ds[ds.length-1]); if($('#startDate'))$('#startDate').value=dsel[0]||ds[0]||''; if($('#endDate'))$('#endDate').value=dsel[dsel.length-1]||ds[ds.length-1]||'';
    opts('psSelect',u(R.filter(function(r){return !window.dateOn||dateOn(r)}).map(function(r){return r.ps})).sort(function(a,b){return a.localeCompare(b,'th')}),'ทั้งหมด',window.cellMode==='single'&&window.cellsSel?Array.from(cellsSel)[0]:'');
    opts('typeSelect',u(R.filter(function(r){return (!window.dateOn||dateOn(r))&&(!window.cellOn||cellOn(r))}).map(function(r){return r.type})).sort(),'ทั้งหมด',window.typeFilter||'');
    opts('storeSelect',u(R.filter(function(r){return (!window.dateOn||dateOn(r))&&(!window.cellOn||cellOn(r))&&(!window.typeFilter||r.type===window.typeFilter)}).map(function(r){return r.store})).sort(function(a,b){return a.localeCompare(b,'th')}),'ทั้งหมด',window.store||'');
    opts('brandSelect',u(R.filter(function(r){return (!window.dateOn||dateOn(r))&&(!window.cellOn||cellOn(r))&&(!window.typeFilter||r.type===window.typeFilter)}).map(function(r){return r.brand})).sort(function(a,b){return a.localeCompare(b,'th')}),'ทั้งหมด',window.brand||'');
    var rs=rows(), done=window.done||{}, total=rs.reduce(function(s,r){return s+n(r.qty)},0), doneQty=Object.keys(done).reduce(function(s,k){return s+n(done[k])},0), remain=Math.max(0,total-doneQty), pct=total?Math.round(doneQty*1000/total)/10:0, amt=rs.reduce(function(s,r){return s+n(r.amt)},0);
    if($('#amount'))$('#amount').textContent='฿ '+(amt?m(amt):'—'); if($('#doneAmount'))$('#doneAmount').textContent=f(doneQty); if($('#remainAmount'))$('#remainAmount').textContent=f(remain); if($('#donePct'))$('#donePct').textContent=pct+'%'; if($('#doneBar'))$('#doneBar').style.width=Math.min(100,pct)+'%'; if($('#tableCount'))$('#tableCount').textContent='แสดง '+f(Math.min(60,rs.length))+' จาก '+f(rs.length)+' รายการ';
    var html='<thead><tr><th>#</th><th>วันที่</th><th>บิลเลขที่</th><th>SKU</th><th>สินค้า</th><th>ร้านค้า</th><th>PS</th><th>ยอดรวม</th><th>จัดแล้ว</th><th>คงเหลือ</th></tr></thead><tbody>';
    rs.slice(0,60).forEach(function(r,i){var k=[window.dateText?dateText():'',window.cellText?cellText():'',window.typeFilter||'ALLTYPE',window.store||'ALLSTORE',r.brand,r.size,r.code||r.sku,r.type].join('|'), d=n(done[k]), re=n(r.qty)-d; html+='<tr><td>'+(i+1)+'</td><td>'+e(dl(r.date))+'</td><td>'+e(r.inv||'-')+'</td><td>'+e(r.code||'-')+'</td><td class="p"><b>'+e(r.sku||'-')+'</b><small>'+e((r.brand||'')+' · '+(r.size||''))+'</small></td><td>'+e(r.store||'-')+'</td><td>'+e(r.ps||'-')+'</td><td>'+m(r.amt)+'</td><td><input class="pick" data-k="'+e(k)+'" type="number" inputmode="numeric" value="'+(d||'')+'"></td><td class="'+(re<0?'bad':'good')+'">'+f(re)+'</td></tr>';});
    if(!rs.length)html+='<tr><td colspan="10" class="empty">ไม่พบรายการตามตัวกรอง</td></tr>'; html+='</tbody>'; if($('#table'))$('#table').innerHTML=html;
    $$('.pick').forEach(function(i){i.onchange=function(x){window.done=window.done||{}; window.done[x.target.dataset.k]=n(x.target.value); if(window.saveState)saveState(); draw()}});
  },'draw dashboard')}
  function bind(){safe(function(){
    var old=window.render; if(typeof old==='function'&&!old.__safe2){window.render=function(){var out=safe(function(){return old.apply(this,arguments)},'core render'); draw(); return out}; window.render.__safe2=true;}
    var choose=$('#choose'), file=$('#file'); if(choose&&file&&!choose.dataset.safe2){choose.dataset.safe2='1'; choose.onclick=function(){file.click()}; file.addEventListener('change',function(){var x=file.files&&file.files[0]; if(x)show(x.size>70*1024*1024?'ไฟล์ใหญ่มาก อาจช้าบนมือถือ '+Math.round(x.size/1024/1024)+'MB':'กำลังอ่านไฟล์: '+x.name)})}
    var q=$('#q'), search=$('#searchBtn'), clear=$('#clearFilter'), reset=$('#resetDone'), ps=$('#psSelect'), st=$('#storeSelect'), br=$('#brandSelect'), ty=$('#typeSelect'), sd=$('#startDate'), ed=$('#endDate');
    if(ps)ps.onchange=function(){window.cellMode=this.value?'single':'multi'; window.cellsSel=this.value?new Set([this.value]):new Set(); window.store=''; draw()};
    if(st)st.onchange=function(){window.store=this.value; window.mode=this.value?'store':'all'; draw()}; if(br)br.onchange=function(){window.brand=this.value; draw()}; if(ty)ty.onchange=function(){window.typeFilter=this.value; window.store=''; window.brand=''; draw()};
    function dc(){window.dateMode='multi'; window.datesSel=new Set(); var a=window.allDates?allDates():u((window.R||[]).map(function(r){return r.date})).sort(); a.forEach(function(d){if((!sd.value||d>=sd.value)&&(!ed.value||d<=ed.value))datesSel.add(d)}); window.cellsSel=new Set(); window.store=''; draw()} if(sd)sd.onchange=dc; if(ed)ed.onchange=dc;
    if(search)search.onclick=function(){window.query=q?q.value:''; draw()}; if(q)q.onkeydown=function(ev){if(ev.key==='Enter'){window.query=q.value; draw()}}; if(clear)clear.onclick=function(){window.dateMode='single'; window.cellMode='single'; window.datesSel=new Set(); window.cellsSel=new Set(); window.store=''; window.brand=''; window.typeFilter=''; window.query=''; if(q)q.value=''; if(window.defaults)defaults(); draw(); show('ล้างตัวกรองแล้ว')}; if(reset)reset.onclick=function(){window.done={}; if(window.saveState)saveState(); draw(); show('รีเซ็ตจัดแล้ว')};
    if(!window.XLSX)show('โหลดตัวอ่าน Excel ไม่สำเร็จ กรุณารีเฟรชหน้า'); else show('ตรวจรอบ 2 พร้อมใช้งาน '+VERSION); draw();
  },'bind')}
  document.addEventListener('DOMContentLoaded',bind); if(document.readyState!=='loading')bind();
})();
