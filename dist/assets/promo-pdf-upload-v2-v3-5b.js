function exportReport(){if(!lastReport)return alert('รันตรวจกรอบ + อ่านโปรก่อน');const blob=new Blob([JSON.stringify(lastReport,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`promo-v2-dry-run-${Date.now()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function clearAll(){for(const w of ocrWorkers)try{await w.terminate()}catch{}ocrWorkers=[];pdf=null;sourceFile=null;items=[];lastReport=null;crops.textContent='';logEl.textContent='';bar(0,0);setSum();st('ล้างแล้ว')}

if($('batch')){$('batch').value=String(BATCH_SIZE);$('batch').disabled=true}if($('concurrency')){$('concurrency').value=String(BATCH_CONCURRENCY);$('concurrency').disabled=true}
if(!$('exportDryRun')){const b=document.createElement('button');b.id='exportDryRun';b.type='button';b.textContent='ดาวน์โหลดรายงาน Dry-run JSON';b.onclick=exportReport;$('detect').insertAdjacentElement('afterend',b)}
$('detect').onclick=async()=>{try{if(!pdf)await load();await detect()}catch(e){log('ERROR: '+(e.message||e),'bad');st('ตรวจไม่สำเร็จ');$('upload').disabled=true}};
$('upload').onclick=upload;$('clear').onclick=clearAll;setSum();
