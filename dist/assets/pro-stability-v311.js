(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.2';
const T=v=>String(v??'').trim();
const K=s=>T(s).toLowerCase().replace(/[^a-z0-9]+/g,'');
const TELE_KEYS=['tele','telesale','telesales','teleid','telesaleid','telesalesid','telecode','telesalecode','telesalescode','telename','telesalename','telesalesname','sotelesaleid','sotelesalesid','telesaleperson','telesalepersonid','telesalepersonname'];
const TELE_FLAG_KEYS=['istele','isteleline','istelesale','istelesales','telesaleflag','teleflag','isfromtele','isfromtelesale'];
let appRef=null,stableRows=[];
function lockTitle(){try{document.title=APP_VERSION}catch{};try{const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION}catch{};try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch{}}
function truthy(v){const s=T(v).toLowerCase();return !!s&&!['0','false','no','n','ไม่',''].includes(s)}
function objects(r){const a=[];if(r&&typeof r==='object')a.push(r);['raw','original','source','sourceRow','row','data'].forEach(k=>{const x=r?.[k];if(x&&typeof x==='object'&&!Array.isArray(x))a.push(x)});return a}
function readByKeys(r,keys){for(const o of objects(r)){for(const k of Object.keys(o)){if(!keys.includes(K(k)))continue;const v=T(o[k]);if(v)return v}}return''}
function teleValue(r){const direct=readByKeys(r,TELE_KEYS);if(direct)return direct;const id=readByKeys(r,['telesaleid','telesalesid','sotelesaleid','sotelesalesid']);const name=readByKeys(r,['telesalename','telesalesname','telename']);return [id,name].filter(Boolean).join(' ')}
function teleFlag(r){for(const o of objects(r)){for(const k of Object.keys(o)){if(TELE_FLAG_KEYS.includes(K(k))&&truthy(o[k]))return true}}return false}
function psValue(r){return T(r?.ps||r?.PS||r?.salespersonId||r?.salespersonID||r?.SO_SalespersonID||r?.SalespersonID||r?.salespersonName||r?.Salesperson_Name||r?.['Salesperson Name']||r?.PSName||r?.['PS Code']||r?.raw?.SalespersonID||r?.raw?.SO_SalespersonID||r?.raw?.Salesperson_Name||r?.raw?.['Salesperson Name'])}
function same(a,b){return !!K(a)&&K(a)===K(b)}
function typeTele(r){for(const o of objects(r)){const v=K(o.type||o.SOTypeID||o.soTypeID||o.DocType||o.docType||o.orderType||o.sourceType||'');if(v==='tele'||v==='telesale'||v==='telesales'||v==='tsale')return true}return false}
function enrichRow(r){if(!r||typeof r!=='object')return r;const n={...r},tv=teleValue(r),ps=psValue(r);if(tv&&!same(tv,ps)){n.tele=tv;n.isTele=true;return n}if(teleFlag(r)||typeTele(r)){n.tele=T(n.tele)||tv||ps||'Telesale';n.isTele=true;return n}n.tele='';n.isTele=false;return n}
function enrichPayload(p){try{const rows=p?.rows||p;if(!Array.isArray(rows))return p;const out=rows.map(enrichRow);stableRows=out;window.__doitStableRows311=out;return Array.isArray(p)?out:{...p,rows:out}}catch{return p}}
function markOwner(app){try{app.__fieldLogic295=true;app.__fieldLogic308=true;app.__teleForceRefresh310=true;app.__teleStrict310=true;app.__stableOwner311=true}catch{}return app}
function patchApp(app){if(!app||!app.load)return app;markOwner(app);if(app.__stable311)return app;const old=app.load.bind(app);app.load=(payload,m={})=>{const clean=enrichPayload(payload);const res=old(clean,m);setTimeout(refreshTele,80);setTimeout(refreshTele,450);return res};app.__stable311=true;return app}
function installAppOwner(){try{const desc=Object.getOwnPropertyDescriptor(window,'DOIT_JSON_APP');if(desc?.set&&window.DOIT_JSON_APP?.__stable311)return;appRef=window.DOIT_JSON_APP||appRef;Object.defineProperty(window,'DOIT_JSON_APP',{configurable:true,get(){return appRef},set(v){appRef=patchApp(v)}});if(appRef)appRef=patchApp(appRef)}catch{if(window.DOIT_JSON_APP)patchApp(window.DOIT_JSON_APP)}}
function scope(){return{dates:window.DOIT_SELECTED_DATES||[],psList:window.DOIT_SELECTED_PS_LIST||[],psKey:window.DOIT_SELECTED_PS_KEY||'',start:T(document.querySelector('#startDate')?.value),end:T(document.querySelector('#endDate')?.value),ps:T(document.querySelector('#psSelect')?.value)}}
function rows(){const c=[stableRows,window.__doitStableRows311,window.__doitRawRows304,window.__doitRawRows290,window.__doitPsRawRows295,window.__doitAllRows];for(const r of c){if(Array.isArray(r)&&r.length)return r.map(enrichRow)}return[]}
function refreshTele(){try{const r=rows();const d=window.DOIT_TELESALE_DRAWER;if(r.length&&d?.loadRows){d.loadRows(r,scope());d.refresh?.()}}catch(e){console.warn('[pro-stability-v311] tele refresh failed',e)}}
function teleStats(){const r=rows();let top=0,flag=0,type=0;for(const x of r){if(teleValue(x))top++;if(teleFlag(x))flag++;if(typeTele(x))type++}return{rows:r.length,teleValue:top,teleFlag:flag,typeTele:type}}
function bindEvents(){if(document.__stable311Events)return;document.__stable311Events=true;['doit:scopeRendered','doit:psChanged','doit:selectedDatesChanged'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(refreshTele,0)));document.addEventListener('click',e=>{if(e.target?.id==='cloudLoadBtn')setTimeout(()=>{installAppOwner();refreshTele()},1200)},true)}
function boot(){lockTitle();installAppOwner();bindEvents();refreshTele();let n=0;const tick=()=>{lockTitle();installAppOwner();refreshTele();if(++n<20)setTimeout(tick,350)};setTimeout(tick,150)}
window.DOIT_PRO_STABILITY={version:'v315',enrichRow,enrichPayload,refreshTele,teleStats,health:()=>({stableRows:stableRows.length,rows:rows().length,drawer:!!window.DOIT_TELESALE_DRAWER,json:!!window.DOIT_JSON_APP,appPatched:!!window.DOIT_JSON_APP?.__stable311,owner:!!window.DOIT_JSON_APP?.__stableOwner311,tele:teleStats()})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();