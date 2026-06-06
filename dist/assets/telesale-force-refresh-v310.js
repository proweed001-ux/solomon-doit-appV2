(()=>{'use strict';
const T=v=>String(v??'').trim();
const K=s=>T(s).toLowerCase().replace(/[^a-z0-9]+/g,'');
const TELE_KEYS=['tele','telesale','telesales','teleid','telesaleid','telesalesid','telecode','telesalecode','telesalescode','telename','telesalename','telesalesname','sotelesaleid','sotelesalesid'];
function teleValue(r){if(!r||typeof r!=='object')return'';for(const k of Object.keys(r)){const nk=K(k);if(!TELE_KEYS.includes(nk))continue;const v=T(r[k]);if(v)return v}return''}
function psValue(r){return T(r.ps||r.PS||r.SO_SalespersonID||r.SalespersonID||r.Salesperson_Name||r['Salesperson Name']||r.PSName||r['PS Code'])}
function same(a,b){return !!K(a)&&K(a)===K(b)}
function rowTypeTele(r){const v=K(r.type||r.SOTypeID||r.soTypeID||r.DocType||r.docType||'');return v==='tele'||v==='telesale'||v==='telesales'}
function enrichRow(r){if(!r||typeof r!=='object')return r;const tele=teleValue(r),next={...r};if(tele&&!same(tele,psValue(r))){next.tele=tele;next.isTele=true;return next}if(rowTypeTele(r)){next.tele=T(next.tele)||psValue(r)||'Telesale';next.isTele=true;return next}next.tele='';next.isTele=false;return next}
function enrichPayload(payload){try{const rows=payload?.rows||payload;if(!Array.isArray(rows))return payload;const out=rows.map(enrichRow);return Array.isArray(payload)?out:{...payload,rows:out}}catch{return payload}}
function patchJsonApp(){const app=window.DOIT_JSON_APP;if(!app||app.__teleStrict310||!app.load)return false;const old=app.load.bind(app);app.load=(payload,m={})=>old(enrichPayload(payload),m);app.__teleStrict310=true;return true}
function patchDrawer(){const d=window.DOIT_TELESALE_DRAWER;if(!d||d.__teleStrict310||!d.loadRows)return false;const old=d.loadRows.bind(d);d.loadRows=(data,ctx={})=>old((data||[]).map(enrichRow),ctx||{});d.__teleStrict310=true;return true}
function bestRows(){const c=[window.__doitRawRows304,window.__doitRawRows290,window.__doitPsRawRows295,window.__doitAllRows];for(const r of c){if(Array.isArray(r)&&r.length)return r}return[]}
function scope(){return{dates:window.DOIT_SELECTED_DATES||[],psList:window.DOIT_SELECTED_PS_LIST||[],psKey:window.DOIT_SELECTED_PS_KEY||'',start:T(document.querySelector('#startDate')?.value),end:T(document.querySelector('#endDate')?.value),ps:T(document.querySelector('#psSelect')?.value)}}
function refresh(){try{patchJsonApp();patchDrawer();const rows=bestRows().map(enrichRow);if(rows.length&&window.DOIT_TELESALE_DRAWER?.loadRows){window.DOIT_TELESALE_DRAWER.loadRows(rows,scope());window.DOIT_TELESALE_DRAWER.refresh?.()}}catch(e){console.warn('[telesale-strict-v310] refresh failed',e)}}
function boot(){refresh();let n=0;const tick=()=>{refresh();if(++n<60)setTimeout(tick,500)};setTimeout(tick,150)}
['doit:scopeRendered','doit:psChanged','doit:selectedDatesChanged'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(refresh,0)));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.DOIT_TELESALE_FORCE_REFRESH={version:'v310-strict',refresh,enrichRow,enrichPayload,health:()=>({rows:bestRows().length,drawer:!!window.DOIT_TELESALE_DRAWER,json:!!window.DOIT_JSON_APP})};
})();