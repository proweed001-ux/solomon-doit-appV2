(()=>{
'use strict';
const URL0='https://saodmeoilixfdqentofp.supabase.co';
const BUCKET='doit-files';
const JSON_MIME='application/json;charset=utf-8';
const CHUNK_ROWS=500;
const $=s=>document.querySelector(s);
const T=v=>String(v??'').trim();
let busy=false;

function N(v){
  if(v==null)return 0;
  if(typeof v==='number')return Number.isFinite(v)?v:0;
  const raw=T(v),negative=/^\(.*\)$/.test(raw);
  const clean=raw.replace(/,/g,'').replace(/[฿$]/g,'').replace(/[()]/g,'').trim();
  if(!clean||clean==='-'||clean==='—')return 0;
  const number=Number(clean);
  return Number.isFinite(number)?(negative?-Math.abs(number):number):0;
}
function hasValue(v){if(v==null)return false;const s=T(v);return s!==''&&s!=='-'&&s!=='—'}
function F(n){return N(n).toLocaleString('th-TH')}
function E(v){return T(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function nextTask(){return new Promise(resolve=>setTimeout(resolve,0))}

function cfg(){
  let saved={};
  try{saved=JSON.parse(localStorage.getItem('doit-cloud-cfg')||'{}')}catch{}
  const url=T($('#sbUrl')?.value||saved.url).replace(/\/$/,'')||URL0;
  const key=T($('#sbKey')?.value||saved.key||window.__ADMIN_SUPABASE_KEY__);
  return{u:url,k:key};
}
function headers(c,extra={}){
  return{...extra,apikey:c.k,authorization:'Bearer '+c.k};
}
function message(text,ok=false){
  const el=$('#cloudStatus');
  if(el)el.innerHTML=`<div class="${ok?'ok':'muted'}">${text}</div>`;
  console.log('[ADMIN JSON v267 memory-safe]',T(text).replace(/<[^>]+>/g,' '));
}
function stat(percent,text,done=false){
  const bar=$('#bar'),pct=$('#pct'),status=$('#status');
  if(bar&&typeof percent==='number')bar.style.width=Math.max(0,Math.min(100,percent))+'%';
  if(pct)pct.textContent=done?'100%':'กำลังทำงาน';
  if(status)status.textContent=text;
}
function failStat(text){
  const pct=$('#pct'),status=$('#status');
  if(pct)pct.textContent='ผิดพลาด';
  if(status)status.textContent=text;
}
function norm(s){return T(s).toLowerCase().replace(/[\s_\-./()[\]:]+/g,'')}
function realTele(tele,ps){
  tele=T(tele);ps=T(ps);
  if(!tele)return false;
  const kt=norm(tele),kp=norm(ps);
  if(kt&&kp&&(kt===kp||kp.includes(kt)||kt.includes(kp)))return false;
  return true;
}
function col(object,aliases){
  const keys=Object.keys(object||{}),map=new Map(keys.map(key=>[norm(key),key]));
  for(const alias of aliases){const key=map.get(norm(alias));if(key)return key}
  for(const key of keys)for(const alias of aliases){
    if(norm(key).includes(norm(alias))||norm(alias).includes(norm(key)))return key;
  }
  return'';
}
function val(object,aliases,fallback=''){const key=col(object,aliases);return key?T(object[key])||fallback:fallback}
function num(object,aliases){const key=col(object,aliases);return key?N(object[key]):0}
function iso(v){
  if(v==null||v==='')return'';
  if(typeof v==='number'&&v>30000&&window.XLSX){
    const date=XLSX.SSF.parse_date_code(v);
    if(date)return`${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
  }
  const text=T(v);
  if(/^\d{4}-\d{1,2}-\d{1,2}/.test(text)){
    const parts=text.split(/[ T]/)[0].split('-');
    return`${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
  }
  const match=text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if(match){
    const year=match[3].length===2?'20'+match[3]:match[3];
    return`${year}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
  }
  const date=new Date(text);
  return isNaN(date)?text.slice(0,10):date.toISOString().slice(0,10);
}

const AMT=[
  ['TotInvc',['TotInvc','TotalInvoice','Total Invoice']],
  ['Correct Amount',['Correct Amount','CorrectAmount','LineAmount','Line Amount','LineAmt']],
  ['LineAmtBeforeDisc',['LineAmtBeforeDisc','Line Amount Before Disc']],
  ['detailAmt',['detailAmt','DetailAmt']],
  ['row.amt',['row.amt','row_amt']],
  ['Amt',['Amt','amt']],
  ['Amount',['NetAmount','Net Amount','Amount']],
  ['InvoiceAmt',['InvoiceAmt','Invoice Amount','InvAmt']],
];
function pickAmount(object){
  for(const [source,aliases] of AMT){
    const key=col(object,aliases);
    if(!key||!hasValue(object[key]))continue;
    return{amount:N(object[key]),source,key};
  }
  return{amount:0,source:'missing',key:''};
}
function normalizeRow(object,index){
  const teleId=val(object,['TelesaleId','TelesalesID','TeleSaleID','TeleSaleCode']);
  const teleName=val(object,['TelesaleName','TelesalesName','TeleSaleName']);
  const psId=val(object,['SO_SalespersonID','SalespersonID','PS','PS Code']);
  const psName=val(object,['Salesperson_Name','Salesperson Name','SalesName','PSName']);
  const qty=Math.round(num(object,['ShipQtyPCS','ShipQtyPC','QtyShipPCS','Qty PCS','Qty','Quantity','PCS']));
  const sourceUnit=num(object,['SO_UnitPrice','UnitPrice','Unit Price','Price']);
  const picked=pickAmount(object);
  const rawAmount=num(object,['LineAmtBeforeDisc','Line Amount Before Disc','GrossAmount','Gross Amount','RawAmount','Raw Amount'])||picked.amount;
  const netAmount=picked.amount;
  const amount=netAmount!==0?netAmount:(picked.source==='missing'?sourceUnit*qty:0);
  const unit=picked.source==='missing'?(sourceUnit||(qty&&amount?amount/qty:0)):(qty&&amount?amount/qty:0);
  const rawUnit=qty&&rawAmount?rawAmount/qty:unit;
  const netUnit=qty&&netAmount?netAmount/qty:unit;
  const code=val(object,['SKU_Code','SKUCode','SKU Code','ItemCode','ProductCode']);
  const sku=val(object,['TAS_THName','SKU_Desc','SKU Desc','ProductName','Product','ItemName','Description'])||code||'ไม่ระบุสินค้า';
  const ps=[psId,psName].filter(Boolean).join(' ')||[teleId,teleName].filter(Boolean).join(' ')||'ไม่ระบุ PS';
  const tele=[teleId,teleName].filter(Boolean).join(' ');
  return{
    date:iso(val(object,['InvcDate','InvoiceDate','ShipDateAct','ShipDate','SO_Date','OrderDate','Date'])),
    inv:val(object,['InvcNbr','InvoiceNo','BillNo','DocNo','OrderNo','SONo'])||('NO-BILL-'+(index+1)),
    type:val(object,['SOTypeID','SO Type ID','Type','DocType'],'INVC'),
    ps,
    store:val(object,['Customer Name','CustomerName','ShipName','Ship To Name','c_Name','Store','BranchName'])||'ไม่ระบุร้าน',
    tele,
    isTele:realTele(tele,ps),
    code,
    sku,
    brand:val(object,['TAS_Brand','Brand','GroupBrand'],'ไม่ระบุแบรนด์'),
    size:val(object,['TAS_SizeGroup','SizeGroup','Size Group','SKU_Size','Size'],'ไม่ระบุไซซ์'),
    qty,
    unit,
    amt:amount,
    rawAmt:rawAmount,
    netAmt:netAmount,
    rawUnit,
    netUnit,
    amountSource:picked.source,
    amountField:picked.key,
  };
}
function scorePivot(fields,rowCount){
  const normalized=fields.map(norm),has=aliases=>aliases.some(alias=>normalized.includes(norm(alias)));
  let score=0;
  [
    ['ShipQtyPCS','QtyPCS'],
    ['TotInvc'],
    ['SOTypeID','Type'],
    ['SalespersonID','SO_SalespersonID','Salesperson_Name'],
    ['Customer Name','CustomerName','ShipName'],
    ['SKU_Code','TAS_THName','SKU_Desc'],
  ].forEach(aliases=>{if(has(aliases))score+=10});
  if(has(['TotInvc']))score+=15;
  else if(has(['Correct Amount','LineAmount','LineAmtBeforeDisc']))score+=10;
  return score+Math.min(N(rowCount),2000)/100;
}

function readCacheFields(documentNode){
  return[...documentNode.getElementsByTagName('cacheField')].map(field=>{
    const shared=[];
    const items=[...field.childNodes].find(node=>node.nodeType===1&&node.localName==='sharedItems');
    if(items)[...items.childNodes].forEach(child=>{
      if(child.nodeType!==1)return;
      let value=child.getAttribute('v')??'';
      if(child.localName==='n')value=N(value);
      if(child.localName==='d')value=T(value).slice(0,10);
      if(child.localName==='m')value='';
      shared.push(value);
    });
    return{name:field.getAttribute('name')||'',shared};
  });
}

function readFileBuffer(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onprogress=event=>{
      if(!event.lengthComputable)return;
      const percent=5+Math.round((event.loaded/Math.max(1,event.total))*5);
      stat(percent,`อ่าน Excel ${(event.loaded/1024/1024).toFixed(1)} / ${(event.total/1024/1024).toFixed(1)} MB`);
    };
    reader.onload=()=>resolve(reader.result);
    reader.onerror=()=>reject(reader.error||Error('อ่านไฟล์ Excel ไม่สำเร็จ'));
    reader.onabort=()=>reject(Error('การอ่านไฟล์ Excel ถูกยกเลิก'));
    reader.readAsArrayBuffer(file);
  });
}

function normalizePivotRecord(body,fields,recordIndex){
  const entryPattern=/<(x|n|s|d|b|m)(?:\s+[^>]*?v="([^"]*)")?[^>]*\/>/g;
  let entryMatch,fieldIndex=0,source={};
  while((entryMatch=entryPattern.exec(body))){
    const key=fields[fieldIndex]?.name;
    if(key){
      const tag=entryMatch[1],value=entryMatch[2];
      source[key]=tag==='x'
        ?(fields[fieldIndex]?.shared[N(value)]??'')
        :(tag==='n'?N(value):(tag==='m'?'':T(value)));
    }
    fieldIndex++;
  }
  return normalizeRow(source,recordIndex);
}

async function streamPivotRecords(recordsFile,fields,rowCount){
  const rows=[];
  let carry='',recordIndex=0;
  const stream=recordsFile.internalStream('string');
  let processing=Promise.resolve();

  await new Promise((resolve,reject)=>{
    stream.on('data',chunk=>{
      stream.pause();
      processing=processing.then(async()=>{
        carry+=chunk;
        let closeIndex=carry.indexOf('</r>');
        while(closeIndex>=0){
          const openIndex=carry.indexOf('<r');
          if(openIndex<0||openIndex>closeIndex){
            carry=carry.slice(closeIndex+4);
            closeIndex=carry.indexOf('</r>');
            continue;
          }
          const bodyStart=carry.indexOf('>',openIndex);
          if(bodyStart<0||bodyStart>closeIndex)break;
          const body=carry.slice(bodyStart+1,closeIndex);
          carry=carry.slice(closeIndex+4);
          const normalized=normalizePivotRecord(body,fields,recordIndex++);
          if(normalized.qty||normalized.amt||normalized.sku)rows.push(normalized);
          if(recordIndex%1000===0){
            const ratio=rowCount?recordIndex/rowCount:Math.min(1,recordIndex/120000);
            stat(16+Math.min(17,Math.round(ratio*17)),`อ่าน Pivot ${F(recordIndex)}${rowCount?' / '+F(rowCount):''} แถว`);
            await nextTask();
          }
          closeIndex=carry.indexOf('</r>');
        }
        stream.resume();
      }).catch(reject);
    });
    stream.on('error',reject);
    stream.on('end',()=>processing.then(resolve,reject));
    stream.resume();
  });
  return rows;
}

async function pivot(buffer){
  const zip=await JSZip.loadAsync(buffer);
  const definitions=Object.keys(zip.files)
    .filter(path=>/^xl\/pivotCache\/pivotCacheDefinition\d+\.xml$/.test(path))
    .sort();
  let best=null;
  for(const definitionPath of definitions){
    const definitionFile=zip.file(definitionPath);
    const recordsPath=definitionPath.replace('pivotCacheDefinition','pivotCacheRecords');
    if(!definitionFile||!zip.file(recordsPath))continue;
    const xml=await definitionFile.async('string');
    const documentNode=new DOMParser().parseFromString(xml,'text/xml');
    const fields=readCacheFields(documentNode);
    const rowCount=N(documentNode.documentElement?.getAttribute('recordCount'));
    const candidate={fields,recordsPath,rowCount,score:scorePivot(fields.map(field=>field.name),rowCount)};
    if(!best||candidate.score>best.score)best=candidate;
  }
  if(!best)return[];

  const recordsFile=zip.file(best.recordsPath);
  return await streamPivotRecords(recordsFile,best.fields,best.rowCount);
}

function sheets(buffer){
  const workbook=XLSX.read(buffer,{type:'array',cellDates:true,raw:false});
  let best=[];
  for(const name of workbook.SheetNames){
    const aoa=XLSX.utils.sheet_to_json(workbook.Sheets[name],{header:1,defval:'',raw:false});
    for(let index=0;index<Math.min(100,aoa.length);index++){
      const header=(aoa[index]||[]).map(T);
      const headerScore=header.filter(value=>/sku|qty|pcs|ship|customer|sales|tele|invc|invoice|brand|สินค้า|ร้าน|totinvc/i.test(value)).length;
      if(headerScore<3)continue;
      const rows=aoa.slice(index+1)
        .map(values=>Object.fromEntries(header.map((key,column)=>[key||('c'+column),values[column]])))
        .map(normalizeRow)
        .filter(row=>row.qty||row.amt||row.sku);
      if(rows.length>best.length)best=rows;
    }
  }
  return best;
}

async function buildPayloadBlob(metadata,rows,options={}){
  if(!Array.isArray(rows))throw Error('rows ต้องเป็น array');
  const chunkSize=Math.max(50,Math.min(2000,N(options.chunkSize)||CHUNK_ROWS));
  const onProgress=typeof options.onProgress==='function'?options.onProgress:()=>{};
  const total=rows.length;
  const metadataJson=JSON.stringify(metadata);
  const parts=[new Blob([metadataJson.slice(0,-1)+',"rows":['],{type:JSON_MIME})];
  let wrote=false;
  for(let start=0;start<total;start+=chunkSize){
    const end=Math.min(total,start+chunkSize);
    const chunk=rows.slice(start,end);
    const json=JSON.stringify(chunk).slice(1,-1);
    if(json){
      parts.push(new Blob([wrote?',':'',json],{type:JSON_MIME}));
      wrote=true;
    }
    for(let index=start;index<end;index++)rows[index]=null;
    chunk.length=0;
    onProgress(end,total);
    if((start/chunkSize)%8===0)await nextTask();
  }
  rows.length=0;
  parts.push(new Blob([']}'],{type:JSON_MIME}));
  return new Blob(parts,{type:JSON_MIME});
}

async function put(c,path,body,type){
  const response=await fetch(`${c.u}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g,'/')}`,{
    method:'POST',
    headers:headers(c,{'Content-Type':type,'x-upsert':'true'}),
    body,
  });
  const text=await response.text();
  if(!response.ok)throw Error(`Storage ${response.status}: ${text}`);
  return text;
}
async function removeObject(c,path){
  const response=await fetch(`${c.u}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g,'/')}`,{
    method:'DELETE',
    headers:headers(c),
  });
  if(!response.ok&&response.status!==404)throw Error(`ล้างไฟล์ไม่สำเร็จ ${response.status}: ${await response.text()}`);
}
async function rest(c,path,options={}){
  const response=await fetch(c.u+path,{...options,headers:headers(c,options.headers||{})});
  const text=await response.text();
  if(!response.ok)throw Error(`Database ${response.status}: ${text}`);
  try{return JSON.parse(text)}catch{return text}
}
async function markFailed(c,id){
  try{
    await rest(c,'/rest/v1/doit_versions?id=eq.'+encodeURIComponent(id),{
      method:'PATCH',
      headers:{'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({status:'failed',data_status:'failed',is_active:false}),
    });
  }catch{}
}
async function setActiveRpc(c,id){
  return await rest(c,'/rest/v1/rpc/set_doit_active_version',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({p_version_id:id}),
  });
}

function publishSummary(summary){
  if(typeof window.__setDoitAdminSummary==='function')window.__setDoitAdminSummary(summary);
}

async function run(){
  if(busy)return;
  busy=true;
  let c=null,id='',dataPath='',metadataInserted=false,dataUploaded=false;
  try{
    const file=$('#file')?.files?.[0];
    if(!file)throw Error('ต้องเลือกไฟล์ก่อน');
    c=cfg();
    if(!c.k)throw Error('ยังไม่ได้ตั้งค่า anon key');

    stat(5,'เริ่มอ่านไฟล์ DOIT');
    let buffer=await readFileBuffer(file);
    await nextTask();
    stat(12,'ค้นหา Pivot Cache ที่เป็นข้อมูล DOIT');
    let rows=await pivot(buffer).catch(()=>[]);
    if(!rows.length){
      stat(24,'ไม่พบ Pivot Cache กำลังอ่าน Worksheet');
      rows=sheets(buffer);
    }
    buffer=null;
    await nextTask();
    if(!rows.length)throw Error('ไม่พบข้อมูล DOIT');

    id=crypto.randomUUID();
    const day=new Date().toISOString().slice(0,10);
    dataPath=`parsed/${day}/${id}.json`;
    const rowCount=rows.length;
    const stores=new Set(rows.map(row=>row.store));
    const people=new Set(rows.map(row=>row.ps));
    const telesaleBills=new Set(rows.filter(row=>row.isTele).map(row=>[row.inv,row.store,row.tele].join('|')));
    const totalQty=rows.reduce((sum,row)=>sum+N(row.qty),0);
    const totalAmount=rows.reduce((sum,row)=>sum+N(row.amt),0);
    const rawAmount=rows.reduce((sum,row)=>sum+N(row.rawAmt),0);
    const netAmount=rows.reduce((sum,row)=>sum+N(row.netAmt),0);
    const summary={
      version_id:id,
      fileName:file.name,
      fileSize:file.size,
      checkedAt:new Date().toISOString(),
      rows:rowCount,
      stores:stores.size,
      ps:people.size,
      teleBills:telesaleBills.size,
      qty:totalQty,
      amount:totalAmount,
      storage_path:'',
      status:'local-ready',
    };
    publishSummary(summary);

    stat(35,'สร้าง JSON แบบแบ่งส่วนเพื่อลดหน่วยความจำ');
    const metadata={
      schema:'doit-json-v1',
      data_schema_version:4,
      version_id:id,
      created_at:new Date().toISOString(),
      source_file_name:file.name,
      source_file_size:file.size,
      source_file_stored:false,
      amount_fields:{
        priority:'first non-empty source: TotInvc > Correct Amount/LineAmount > LineAmtBeforeDisc > detailAmt > row.amt > Amt > Amount > InvoiceAmt',
        zero_values:'preserved_from_source',
        negative_values:'preserved',
      },
    };
    const payload=await buildPayloadBlob(metadata,rows,{
      onProgress:(done,total)=>stat(35+Math.round((done/Math.max(1,total))*22),`สร้าง JSON ${F(done)} / ${F(total)} แถว`),
    });
    await nextTask();

    stat(62,`อัปโหลด JSON ${(payload.size/1024/1024).toFixed(1)} MB (ไม่เก็บ Excel ต้นฉบับ)`);
    await put(c,dataPath,payload,JSON_MIME);
    dataUploaded=true;

    stat(82,'บันทึก metadata หลัง JSON สำเร็จ');
    await rest(c,'/rest/v1/doit_versions',{
      method:'POST',
      headers:{'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({
        id,
        file_name:file.name,
        file_size:file.size,
        storage_path:'',
        data_path:dataPath,
        data_status:'ready',
        data_schema_version:4,
        row_count:rowCount,
        store_count:stores.size,
        ps_count:people.size,
        telesale_bill_count:telesaleBills.size,
        total_qty:totalQty,
        total_amount:totalAmount,
        status:'uploaded',
        is_active:false,
        uploaded_at:new Date().toISOString(),
      }),
    });
    metadataInserted=true;

    stat(93,'ตั้ง JSON ใหม่เป็นไฟล์ล่าสุด');
    await setActiveRpc(c,id);
    summary.status='cloud-active';
    summary.storage_path=dataPath;
    publishSummary(summary);
    stat(100,'เสร็จ: Cloud JSON active',true);
    message(
      `สำเร็จ: อัปโหลด JSON และตั้งเป็นไฟล์ล่าสุดแล้ว โดยไม่เก็บ Excel ต้นฉบับ<br>`+
      `แถว ${F(rowCount)} · ร้าน ${F(stores.size)} · PS ${F(people.size)} · Telesale bills ${F(telesaleBills.size)}<br>`+
      `ยอดดิบ ${F(rawAmount)} · ยอดสุทธิ ${F(netAmount)}<br>`+
      `JSON ${(payload.size/1024/1024).toFixed(1)} MB · สูตรยอดใช้ field แรกที่มีค่า แม้ค่านั้นเป็น 0`,
      true,
    );
  }catch(error){
    if(c&&id&&metadataInserted)await markFailed(c,id);
    if(c&&dataPath&&dataUploaded)await removeObject(c,dataPath).catch(cleanupError=>console.error('[DOIT cleanup]',cleanupError));
    failStat('DOIT upload error');
    message('อัปโหลด DOIT ไม่สำเร็จ: '+E(error?.message||error));
  }finally{
    busy=false;
  }
}

function ui(){
  const upload=$('#uploadCloud');
  if(upload){
    upload.textContent='อัปโหลด JSON + ตั้งล่าสุด';
    upload.onclick=run;
    upload.title='อ่านครั้งเดียว ไม่เก็บ Excel ต้นฉบับ และสร้าง JSON แบบแบ่งส่วน';
  }
  const old=$('#setActive');
  if(old){
    old.textContent='ตั้งล่าสุดรวมในปุ่มอัปโหลดแล้ว';
    old.disabled=true;
    old.title='ป้องกันการตั้ง Active แยกจาก JSON';
  }
}

window.AdminDoitUploadCore={buildPayloadBlob,streamPivotRecords};
document.addEventListener('DOMContentLoaded',()=>{ui();setTimeout(ui,500);setTimeout(ui,1200)});
})();
