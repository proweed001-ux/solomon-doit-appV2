(()=>{
'use strict';
if(window.__ADMIN_PERFORMANCE_ACTIVE_V2__)return;
window.__ADMIN_PERFORMANCE_ACTIVE_V2__=true;
const nativeFetch=window.fetch.bind(window);
let lastPayload=null;
const T=value=>String(value??'').trim();
const K=value=>T(value).replace(/[\s._\-–—/\\]+/g,'').toLowerCase();
const N=value=>typeof value==='number'?(Number.isFinite(value)?value:0):(Number(T(value).replace(/,/g,'').replace(/%/g,'').replace(/[^0-9.\-]/g,''))||0);
const P=value=>{const number=N(value);return number&&number<=1.5?number*100:number};
const MKEYS=['sales','giv','moq','dc1','dc2','dc3','cd13','cd123','bills','gps','dgp'];
const THAI_MONTHS=[['มกราคม','01'],['มกรา','01'],['jan','01'],['กุมภาพันธ์','02'],['กุมภา','02'],['feb','02'],['มีนาคม','03'],['มีนา','03'],['mar','03'],['เมษายน','04'],['เมษา','04'],['apr','04'],['พฤษภาคม','05'],['พฤษภา','05'],['may','05'],['มิถุนายน','06'],['มิถุนา','06'],['jun','06'],['กรกฎาคม','07'],['กรกฎา','07'],['jul','07'],['สิงหาคม','08'],['สิงหา','08'],['aug','08'],['กันยายน','09'],['กันยา','09'],['sep','09'],['ตุลาคม','10'],['ตุลา','10'],['oct','10'],['พฤศจิกายน','11'],['พฤศจิกา','11'],['nov','11'],['ธันวาคม','12'],['ธันวา','12'],['dec','12']];
function normalizeYear(value){let year=Number(value);if(year>2400)year-=543;return year>=2000&&year<=2200?year:0}
function monthYear(value,reportDate=''){
  const text=T(value),compact=K(text);
  let month='';
  let year=0;
  const numeric=text.match(/(?:^|\D)((?:20|25)\d{2})[-_\/ ]?(0?[1-9]|1[0-2])(?:\D|$)/);
  if(numeric){year=normalizeYear(numeric[1]);month=String(Number(numeric[2])).padStart(2,'0')}
  if(!month)month=(THAI_MONTHS.find(([name])=>compact.includes(K(name)))||[])[1]||'';
  if(!year){const hit=text.match(/(?:^|\D)((?:20|25)\d{2})(?:\D|$)/);if(hit)year=normalizeYear(hit[1])}
  const report=T(reportDate).match(/(20\d{2})-(\d{2})/);
  if(!year&&report)year=Number(report[1]);
  if(!month&&report)month=report[2];
  return{month,year,period:month&&year?String(year)+month:''};
}
function workbookMeta(reportDate=''){
  try{
    const sheet=window.__PERF_LAST_WB?.Sheets?.['Seller Report'];
    const value=cell=>sheet?.[cell]?.v??sheet?.[cell]?.w??'';
    const reportMonthText=T(value('D3'));
    const totalWorkdays=N(value('D4'));
    const workdayNo=N(value('D5'));
    const info=monthYear(reportMonthText,reportDate);
    return{reportMonthText,reportMonthNo:info.month,reportYear:info.year,period:info.period,totalWorkdays,workdayNo,daysLeft:Math.max(totalWorkdays-workdayNo,0)};
  }catch{return{}}
}
function periodOf(source,reportDate,workbook){
  if(workbook?.period)return workbook.period;
  const sourceMatch=T(source).match(/(20\d{2})[-_ ]?(0[1-9]|1[0-2])/);
  if(sourceMatch)return sourceMatch[1]+sourceMatch[2];
  const reportMatch=T(reportDate).match(/(20\d{2})-(\d{2})/);
  return reportMatch?reportMatch[1]+reportMatch[2]:new Date().toISOString().slice(0,7).replace('-','');
}
function pickKey(object,names,contains=[]){
  const keys=Object.keys(object||{}),exact=names.map(K),parts=contains.map(K);
  let key=keys.find(candidate=>exact.includes(K(candidate)));
  if(!key)key=keys.find(candidate=>parts.some(part=>K(candidate).includes(part)));
  return key||'';
}
function pick(object,names){
  const keys=Object.keys(object||{});
  for(const name of names){const key=keys.find(candidate=>K(candidate)===K(name));if(key)return object[key]}
  for(const name of names){const key=keys.find(candidate=>K(candidate).includes(K(name)));if(key)return object[key]}
  return'';
}
function metric(object,targetNames,actualNames,indexNames){
  const target=N(pick(object,targetNames));
  const actual=N(pick(object,actualNames));
  return{target,actual,index:P(N(pick(object,indexNames)))||(target?actual/target*100:0)};
}
function moqMetric(o){
  const target=N(pick(o,['เป้าหมายการกระจาย SBD']));
  const actual=N(pick(o,['การกระจาย SBD MOQ']));
  return{target,actual,index:target?actual/target*100:P(N(pick(o,['Index MOQ 75%','Index MOQ'])))};
}
function cd123Metric(o){
  const target=N(pick(o,['Target CD1+2+3','Target CD1+CD2+CD3','Target CD123','เป้าหมาย CD1+2+3','เป้าหมาย CD123']));
  const actual=N(pick(o,['การกระจาย CD1+2+3','การกระจาย CD1+CD2+CD3','การกระจาย CD123']));
  return{target,actual,index:target?actual/target*100:P(N(pick(o,['Index CD1+2+3','Index CD1+CD2+CD3','Index CD123'])))};
}
function cd4OlKeys(o){
  const target=pickKey(o,['เป้าหมาย CD4 OL','Target CD4 OL'],['เป้าหมายCD4OL','TARGETCD4OL']);
  const actual=pickKey(o,['การกระจาย CD4 OL','Actual CD4 OL'],['การกระจายCD4OL','ACTUALCD4OL']);
  return{target,actual,enabled:!!(target&&actual)};
}
function hasCd4OlMonth(rows){return(rows||[]).some(row=>cd4OlKeys(row?.sellerReport||{}).enabled)}
function cd3Metric(o,includeCd4Ol=false){
  const base=metric(o,['เป้าหมาย CD3 GL Blue2 Flexi'],['การกระจาย CD3 GL Blue2 Flexi'],['Index CD3 GL Blue2 Flexi']);
  if(!includeCd4Ol)return base;
  const keys=cd4OlKeys(o),target=N(base.target)+(keys.target?N(o[keys.target]):0),actual=N(base.actual)+(keys.actual?N(o[keys.actual]):0);
  return{target,actual,index:target?actual/target*100:0};
}
function adsNameMap(data){
  const names=new Map();
  (data?.ads||[]).forEach(row=>{
    const code=T(row?.adsCode||row?.ads||row?.code);
    const name=T(row?.adsName||row?.name);
    if(code)names.set(code,name||code);
  });
  return names;
}
function minRow(row,includeCd4Ol=false,adsName=''){
  const o=row.sellerReport||{};
  return{
    ads:row.adsCode,
    adsName:T(adsName)||T(row.adsName)||row.adsCode,
    ps:row.psCode,
    name:row.psName,
    branch:row.branch,
    type:pick(o,['Type']),
    sales:metric(o,['เป้าหมายยอดขาย'],['ยอดขายใน Doit'],['Index']),
    giv:metric(o,['Target Volume GIV'],['Volume GIV'],['Index Volume GIV']),
    moq:moqMetric(o),
    dc1:metric(o,['เป้าหมาย CD1 RJ SH RH JJ 70ML'],['การกระจาย CD1 RJ SH RH JJ 70ML'],['Index CD1 RJ SH RH JJ 70ML']),
    dc2:metric(o,['เป้าหมาย CD2 DN FE SF 450ML'],['การกระจาย CD2 DN FE SF 450ML'],['Index CD2 DN FE SF 450ML']),
    dc3:cd3Metric(o,includeCd4Ol),
    cd13:metric(o,['Target CD1+CD3'],['การกระจาย CD1+CD3'],['Index CD1+CD3']),
    cd123:cd123Metric(o),
    bills:metric(o,['เป้าหมายบิลซื้อทั้งหมด'],['จำนวนบิลซื้อทั้งหมด'],[]),
    gps:{target:0,actual:P(N(pick(o,['% GPS Compliance เฉลี่ยทั้งเดือน']))),index:P(N(pick(o,['% GPS Compliance เฉลี่ยทั้งเดือน'])))},
    dgp:metric(o,['เป้าหมาย Golden Point'],['Golden Point'],['Index'])
  };
}
function addPace(row,daysLeft){
  MKEYS.forEach(key=>{
    const value=row?.[key];
    if(!value)return;
    const remaining=Math.max(N(value.target)-N(value.actual),0);
    value.remaining=remaining;
    value.daysLeft=daysLeft;
    value.perDay=daysLeft>0?remaining/daysLeft:remaining;
  });
}
function aggregate(rows,key){
  let target=0,actual=0,indexTotal=0,indexCount=0;
  (rows||[]).forEach(row=>{
    const value=row?.[key]||{};
    const rowTarget=N(value.target);
    if(key==='cd123'&&rowTarget<=0)return;
    target+=rowTarget;
    actual+=N(value.actual);
    const rowIndex=N(value.index);
    if(value&&typeof value==='object'&&('target'in value||'actual'in value||'index'in value)){indexTotal+=rowIndex;indexCount+=1}
  });
  if(target>0)return{target,actual,index:actual/target*100};
  const average=indexCount?indexTotal/indexCount:0;
  return{target,actual:key==='gps'?average:actual,index:average};
}
function sum(rows,code,name){
  const result={code,name:name||code};
  MKEYS.forEach(key=>result[key]=aggregate(rows,key));
  return result;
}
function ranks(rows){
  const result={};
  MKEYS.forEach(key=>{
    result[key]=[...(rows||[])]
      .filter(row=>key!=='cd123'||N(row?.cd123?.target)>0)
      .sort((left,right)=>N(right[key]?.index)-N(left[key]?.index)||N(right[key]?.actual)-N(left[key]?.actual)||T(left.ps||left.ads||left.code).localeCompare(T(right.ps||right.ads||right.code),'en'))
      .map(row=>({ads:row.ads||row.code,ps:row.ps||row.code,name:row.name,target:N(row[key]?.target),actual:N(row[key]?.actual),index:N(row[key]?.index),remaining:N(row[key]?.remaining),perDay:N(row[key]?.perDay),daysLeft:N(row[key]?.daysLeft)}));
  });
  return result;
}
function buildMin(data){
  const reportDate=data.reportDate||data.meta?.reportDate||'';
  const workbook=workbookMeta(reportDate);
  const includeCd4Ol=hasCd4OlMonth(data.ps||[]);
  const names=adsNameMap(data);
  const ps=(data.ps||[]).map(row=>minRow(row,includeCd4Ol,names.get(T(row.adsCode))||T(row.adsName)||T(row.adsCode)));
  const codes=[...new Set(ps.map(row=>row.ads).filter(Boolean))].sort();
  const ads=codes.map(code=>{const name=names.get(code)||code;return{...sum(ps.filter(row=>row.ads===code),code,name),ads:code,adsName:name,ps:code}});
  const ds=sum(ps,'DS','DS');
  const period=periodOf(data.source||'',reportDate,workbook);
  const workday=N(data.workdayNo||data.meta?.workdayNo)||workbook.workdayNo||new Date().getDate();
  const total=N(data.totalWorkdays||data.meta?.totalWorkdays)||workbook.totalWorkdays;
  const daysLeft=Math.max(total-workday,0);
  const reportKey=period+'-WD'+String(workday).padStart(2,'0');
  const comparePath='performance/compare/'+reportKey+'.json';
  [ds,...ads,...ps].forEach(row=>addPace(row,daysLeft));
  return{
    meta:{schema:'performance-min-v5',source:data.source||'',updatedAt:new Date().toISOString(),reportDate,reportMonthText:workbook.reportMonthText||'',reportMonthNo:workbook.reportMonthNo||'',reportYear:workbook.reportYear||0,period,workdayNo:workday,totalWorkdays:total,daysLeft,reportKey,comparePath,cd4OlCombinedIntoDc3:includeCd4Ol},
    labels:includeCd4Ol?{dc3:'CD3 + CD4 OL'}:{},
    ds,ads,ps,ms:data.ms||[],rank:{ads:ranks(ads),ps:ranks(ps)}
  };
}
function reportDate(data,path){
  if(data&&data.reportDate)return data.reportDate;
  const fromPath=T(path).match(/performance\/(20\d{2}-\d{2}-\d{2})\//);
  return fromPath?fromPath[1]:new Date().toISOString().slice(0,10);
}
async function digest(text){
  try{const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(bytes)).map(value=>value.toString(16).padStart(2,'0')).join('')}catch{return''}
}
async function bodyText(body){if(!body)return'';if(typeof body==='string')return body;if(body instanceof Blob)return await body.text();return''}
function objectPath(url){const match=T(url).match(/\/storage\/v1\/object\/doit-files\/(.+)$/);return match?decodeURIComponent(match[1]).replace(/^\/+/, ''):''}
async function putLike(activeUrl,headers,path,object){
  const url=T(activeUrl).replace(/performance\/active\.json.*$/,'')+path;
  return nativeFetch(url,{method:'POST',headers:{...headers,'Content-Type':'application/json','x-upsert':'true'},body:new Blob([JSON.stringify(object)],{type:'application/json'}),cache:'no-store'}).catch(()=>null);
}
async function extraFiles(url,headers,data){
  try{
    const min=buildMin(data);
    const comparePath=min.meta.comparePath;
    let current=null;
    try{const response=await nativeFetch(T(url).replace(/performance\/active\.json.*$/,'')+'performance/current.min.json',{headers,cache:'no-store'});if(response.ok)current=await response.json()}catch{}
    await putLike(url,headers,comparePath,min);
    let history=[];
    try{const response=await nativeFetch(T(url).replace(/performance\/active\.json.*$/,'')+'performance/history-index.json',{headers,cache:'no-store'});if(response.ok)history=await response.json()}catch{}
    history=[{period:min.meta.period,workdayNo:min.meta.workdayNo,totalWorkdays:min.meta.totalWorkdays,daysLeft:min.meta.daysLeft,reportKey:min.meta.reportKey,reportDate:min.meta.reportDate,path:comparePath,updatedAt:min.meta.updatedAt,totalActual:min.ds.sales.actual,totalTarget:min.ds.sales.target,totalRemaining:min.ds.sales.remaining,totalPerDay:min.ds.sales.perDay},...(Array.isArray(history)?history:[]).filter(item=>item.path!==comparePath&&item.reportKey!==min.meta.reportKey)].slice(0,31);
    await putLike(url,headers,'performance/history-index.json',history);
    if(!current?.meta?.reportKey||T(min.meta.reportKey)>=T(current.meta.reportKey))await putLike(url,headers,'performance/current.min.json',min);
    return min;
  }catch(error){console.warn('performance min skipped',error)}
}
window.fetch=async(input,options={})=>{
  const url=T(typeof input==='string'?input:input?.url||'');
  const method=T(options?.method||'GET').toUpperCase();
  const path=objectPath(url);
  if(method==='POST'&&/^performance\//.test(path)&&/\.json$/.test(path)&&!/^performance\/(active|index|current\.min|history-index)\.json$/.test(path)){
    const text=await bodyText(options.body);
    try{
      const data=JSON.parse(text);
      const date=reportDate(data,path);
      const hash=await digest(text);
      data.reportDate=date;
      data.hash=hash;
      data.dataSchemaVersion=2;
      data.currentDataPath=path;
      lastPayload={path,reportDate:date,hash,data};
      options={...options,body:new Blob([JSON.stringify(data)],{type:'application/json'})};
    }catch{}
  }
  if(method==='POST'&&path==='performance/active.json'){
    const text=await bodyText(options.body);
    try{
      const incoming=JSON.parse(text);
      const oldResponse=await nativeFetch(url,{headers:options.headers,cache:'no-store'}).catch(()=>null);
      const old=oldResponse&&oldResponse.ok?await oldResponse.json().catch(()=>null):null;
      const min=lastPayload?.data?await extraFiles(url,options.headers,lastPayload.data):null;
      const currentPath=lastPayload?.path||incoming.dataPath||'';
      const date=lastPayload?.reportDate||reportDate(lastPayload?.data,currentPath);
      const currentKey=min?.meta?.reportKey||'';
      const oldKey=old?.reportKey||old?.currentReportKey||'';
      const oldPath=old?.dataPath||old?.currentDataPath||'';
      const previousDataPath=oldPath&&oldKey!==currentKey?oldPath:(old?.previousDataPath||'');
      const history=[{reportKey:oldKey,reportDate:old?.reportDate||'',dataPath:oldPath,versionId:old?.versionId||'',updatedAt:old?.updatedAt||''},...(old?.history||[])].filter(item=>item.dataPath).slice(0,30);
      const active={...incoming,schema:'performance-active-v5',reportDate:date,reportKey:currentKey,currentReportKey:currentKey,revision:oldKey===currentKey?Number(old?.revision||1)+1:1,hash:lastPayload?.hash||'',dataPath:currentPath,currentDataPath:currentPath,latestPath:currentPath,previousDataPath,updatedAt:new Date().toISOString(),counts:{ads:incoming.adsCount||lastPayload?.data?.ads?.length||0,ps:incoming.psCount||lastPayload?.data?.ps?.length||0,ms:incoming.msCount||lastPayload?.data?.ms?.length||0},history};
      if(oldKey&&currentKey&&currentKey<oldKey)active.note='Older workday uploaded: compare/history updated, current.min.json kept at newer workday';
      options={...options,body:new Blob([JSON.stringify(active)],{type:'application/json'})};
    }catch{}
  }
  return nativeFetch(input,options);
};
})();