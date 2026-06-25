(()=>{
'use strict';
if(window.__ADMIN_PERFORMANCE_ACTIVE_V2__)return;
window.__ADMIN_PERFORMANCE_ACTIVE_V2__=true;
const nativeFetch=window.fetch.bind(window);
let lastPayload=null;
function T(v){return String(v??'').trim()}
function reportDate(data,path){if(data&&data.reportDate)return data.reportDate;const fromPath=String(path||'').match(/performance\/(20\d{2}-\d{2}-\d{2})\//);if(fromPath)return fromPath[1];const dates=[];(data?.ps||[]).forEach(r=>{if(r.date)dates.push(T(r.date).slice(0,10));const sr=r.sellerReport||{};['Invoice Date','InvcDate','InvoiceDate','SO_Date','วันที่'].forEach(k=>{if(sr[k])dates.push(T(sr[k]).slice(0,10))})});const ok=dates.filter(x=>/^20\d{2}-\d{2}-\d{2}$/.test(x)).sort();return ok.pop()||new Date().toISOString().slice(0,10)}
async function digest(text){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}catch{return''}}
async function bodyText(body){if(!body)return'';if(typeof body==='string')return body;if(body instanceof Blob)return await body.text();return''}
function objectPath(url){const s=String(url||''),m=s.match(/\/storage\/v1\/object\/doit-files\/(.+)$/);return m?decodeURIComponent(m[1]).replace(/^\/+,''):''}
window.fetch=async(input,opt={})=>{
 const url=String(typeof input==='string'?input:input?.url||'');
 const method=String(opt?.method||'GET').toUpperCase();
 const path=objectPath(url);
 if(method==='POST'&&/^performance\/.test(path)&&/\.json$/.test(path)&&!/^performance\/(active|index)\.json$/.test(path)){
  const text=await bodyText(opt.body);
  try{const data=JSON.parse(text);const rd=reportDate(data,path);const hash=await digest(text);data.reportDate=rd;data.hash=hash;data.dataSchemaVersion=2;data.currentDataPath=path;lastPayload={path,reportDate:rd,hash,data};opt={...opt,body:new Blob([JSON.stringify(data)],{type:'application/json'})}}catch{}
 }
 if(method==='POST'&&path==='performance/active.json'){
  const text=await bodyText(opt.body);
  try{const incoming=JSON.parse(text),oldRes=await nativeFetch(url,{headers:opt.headers,cache:'no-store'}).catch(()=>null);let old=null;if(oldRes&&oldRes.ok)old=await oldRes.json().catch(()=>null);const currentPath=lastPayload?.path||incoming.dataPath||'',rd=lastPayload?.reportDate||reportDate(lastPayload?.data,currentPath),oldPath=old?.dataPath||old?.currentDataPath||'',oldDate=old?.reportDate||reportDate(null,oldPath),previousDataPath=oldPath&&oldDate!==rd?oldPath:(old?.previousDataPath||'');const history=[{reportDate:oldDate,dataPath:oldPath,versionId:old?.versionId||'',updatedAt:old?.updatedAt||''},...(old?.history||[])].filter(x=>x.dataPath).slice(0,30);const active={...incoming,schema:'performance-active-v2',reportDate:rd,revision:oldDate===rd?Number(old?.revision||1)+1:1,hash:lastPayload?.hash||'',dataPath:currentPath,currentDataPath:currentPath,latestPath:currentPath,previousDataPath,updatedAt:new Date().toISOString(),counts:{ads:incoming.adsCount||lastPayload?.data?.ads?.length||0,ps:incoming.psCount||lastPayload?.data?.ps?.length||0,ms:incoming.msCount||lastPayload?.data?.ms?.length||0},history};opt={...opt,body:new Blob([JSON.stringify(active)],{type:'application/json'})}}catch{}
 }
 return nativeFetch(input,opt);
};
})();
