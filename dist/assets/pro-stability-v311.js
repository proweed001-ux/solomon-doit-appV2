(()=>{'use strict';
const APP_VERSION='Solomon DOIT Pro V2.9.2';
const T=v=>String(v??'').trim();
const K=s=>T(s).toLowerCase().replace(/[^a-z0-9]+/g,'');
const TELE_KEYS=['tele','telesale','telesales','teleid','telesaleid','telesalesid','telecode','telesalecode','telesalescode','telename','telesalename','telesalesname','sotelesaleid','sotelesalesid'];
let appRef=null,stableRows=[];
function lockTitle(){try{document.title=APP_VERSION}catch{};try{const t=document.querySelector('.title');if(t)t.textContent=APP_VERSION}catch{};try{const f=document.querySelector('footer');if(f&&/Solomon DOIT Pro/i.test(f.textContent||''))f.textContent=APP_VERSION}catch{}}
function teleValue(r){if(!r||typeof r!=='object')return'';for(const k of Object.keys(r)){if(!TELE_KEYS.includes(K(k)))continue;const v=T(r[k]);if(v)return v}return''}
function psValue(r){return T(r?.ps||r?.PS||r?.SO_SalespersonID||r?.SalespersonID||r?.Salesperson_Name||r?.['Salesperson Name']||r?.PSName||r?.['PS Code'])}
function same(a,b){return !!K(a)&&K(a)===K(b)}
function typeTele(r){const v=K(r?.type||r?.SOTypeID||r?.soTypeID||r?.DocType||r?.docType||'');return v==='tele'||v==='telesale'||v==='telesales'}
function enrichRow(r){if(!r||typeof r!=='object')return r;const n={...r},tv=teleValue(r);if(tv&&!same(tv,psValue(r))){n.tele=tv;n.isTele=true;return n}if(typeTele(r)){n.tele=T(n.tele)||psValue(r)||'Telesale';n.isTele=true;return n}n.tele='';n.isTele=false;return n}
function enrichPayload(p){try{const rows=p?.rows||p;if(!Array.isArray(rows))return p;const out=rows.map(enrichRow);stableRows=out;window.__doitStableRows311=out;return Array.isArray(p)?out:{...p,rows:out}}catch{return p}}
function markOwner(app){try{app.__fieldLogic295=true;app.__fieldLogic308=true;app.__teleForceRefresh310=true;app.__teleStrict310=true;app.__stableOwner311=true}catch{}return app}
function patchApp(app){if(!app||!app.load)return app;markOwner(app);if(app.__stable311)return app;const old=app.load.bind(app);app.load=(payload,m={})=>{const clean=enrichPayload(payload);const res=old(clean,m);setTimeout(refreshTele,80);setTimeout(refreshTele,450);return res};app.__stable311=true;return app}
function installAppOwner(){try{const desc=Object.getOwnPropertyDescriptor(window,'DOIT_JSON_APP');if(desc?.set&&window.DOIT_JSON_APP?.__stable311)return;appRef=window.DOIT_JSON_APP||appRef;Object.defineProperty(window,'DOIT_JSON_APP',{configurable:true,get(){return appRef},set(v){appRef=patchApp(v)}});if(appRef)appRef=patchApp(appRef)}catch{if(window.DOIT_JSON_APP)patchApp(window.DOIT_JSON_APP)}}
function scope(){return{dates:window.DOIT_SELECTED_DATES||[],psList:window.DOIT_SELECTED_PS_LIST||[],psKey:window.DOIT_SELECTED_PS_KEY||'',start:T(document.querySelector('#startDate')?.value),end:T(document.querySelector('#endDate')?.value),ps:T(document.querySelector('#psSelect')?.value)}}
function rows(){const c=[stableRows,window.__doitStableRows311,window.__doitRawRows304,window.__doitRawRows290,window.__doitPsRawRows295,window.__doitAllRows];for(const r of c){if(Array.isArray(r)&&r.length)return r.map(enrichRow)}return[]}
function refreshTele(){try{const r=rows();const d=window.DOIT_TELESALE_DRAWER;if(r.length&&d?.loadRows){d.loadRows(r,scope());d.refresh?.()}}catch(e){console.warn('[pro-stability-v311] tele refresh failed',e)}}
function bindEvents(){if(document.__stable311Events)return;document.__stable311Events=true;['doit:scopeRendered','doit:psChanged','doit:selectedDatesChanged'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(refreshTele,0)));document.addEventListener('click',e=>{if(e.target?.id==='cloudLoadBtn')setTimeout(()=>{installAppOwner();refreshTele()},1200)},true)}
function boot(){lockTitle();installAppOwner();bindEvents();refreshTele();let n=0;const tick=()=>{lockTitle();installAppOwner();refreshTele();if(++n<20)setTimeout(tick,350)};setTimeout(tick,150)}
window.DOIT_PRO_STABILITY={version:'v311.1',enrichRow,enrichPayload,refreshTele,health:()=>({stableRows:stableRows.length,rows:rows().length,drawer:!!window.DOIT_TELESALE_DRAWER,json:!!window.DOIT_JSON_APP,appPatched:!!window.DOIT_JSON_APP?.__stable311,owner:!!window.DOIT_JSON_APP?.__stableOwner311})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();