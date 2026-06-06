(()=>{'use strict';
const T=v=>String(v??'').trim();
const K=s=>T(s).toLowerCase().replace(/[\s_\-./()[\]:]+/g,'');
function pick(o,names){for(const n of names){if(o&&Object.prototype.hasOwnProperty.call(o,n)){const v=T(o[n]);if(v)return v}}const keys=Object.keys(o||{});for(const k of keys){const nk=K(k);for(const n of names){const nn=K(n);if(nk===nn||nk.includes(nn)||nn.includes(nk)){const v=T(o[k]);if(v)return v}}}return''}
function teleOf(r){const id=pick(r,['tele','Tele','telesale','Telesale','TeleSale','Telesales','TelesaleId','TelesaleID','TelesalesID','TeleSaleID','SO_TelesaleID','SO_TelesalesID','Telesale Code','Telesale_Code','TeleSale Code','TeleSale_Code']);const name=pick(r,['teleName','tele_name','TelesaleName','TelesalesName','TeleSaleName','TeleSalesName','Telesale Name','TeleSale Name','Telesale_Name','TeleSale_Name']);return [id,name].filter(Boolean).join(' ')||id||name}
function typeTele(r){return /tele|telesale|telesales|tsale|t-sale/i.test(T(r.type||r.SOTypeID||r.soTypeID||r.DocType||r.docType||''))}
function psOf(r){return T(r.ps||r.PS||r.SO_SalespersonID||r.SalespersonID||r.Salesperson_Name||r['Salesperson Name']||r.PSName||r['PS Code'])}
function enrichRow(r){if(!r||typeof r!=='object')return r;const tele=teleOf(r);const next={...r};if(tele&&!T(next.tele))next.tele=tele;if((tele||typeTele(r)||r.isTele===true)&&!next.isTele)next.isTele=true;if(!T(next.tele)&&typeTele(r))next.tele=psOf(r)||'Telesale';return next}
function enrichPayload(payload){try{const rows=payload?.rows||payload;if(!Array.isArray(rows))return payload;const nextRows=rows.map(enrichRow);return Array.isArray(payload)?nextRows:{...payload,rows:nextRows}}catch{return payload}}
function patchJsonApp(){const app=window.DOIT_JSON_APP;if(!app||app.__teleForceRefresh310||!app.load)return false;const old=app.load.bind(app);app.load=(payload,m={})=>old(enrichPayload(payload),m);app.__teleForceRefresh310=true;return true}
function patchDrawer(){const d=window.DOIT_TELESALE_DRAWER;if(!d||d.__forceRefresh310||!d.loadRows)return false;const old=d.loadRows.bind(d);d.loadRows=(data,ctx={})=>old((data||[]).map(enrichRow),ctx||{});d.__forceRefresh310=true;return true}
function bestRows(){const candidates=[window.__doitAllRows,window.__doitRawRows304,window.__doitRawRows290,window.__doitPsRawRows295];for(const r of candidates){if(Array.isArray(r)&&r.length)return r}return[]}
function ctx(){return{dates:window.DOIT_SELECTED_DATES||[],psList:window.DOIT_SELECTED_PS_LIST||[],psKey:window.DOIT_SELECTED_PS_KEY||'',start:T(document.querySelector('#startDate')?.value),end:T(document.querySelector('#endDate')?.value),ps:T(document.querySelector('#psSelect')?.value)}}
function refresh(){try{patchJsonApp();patchDrawer();const rows=bestRows().map(enrichRow);if(rows.length&&window.DOIT_TELESALE_DRAWER?.loadRows){window.DOIT_TELESALE_DRAWER.loadRows(rows,ctx());window.DOIT_TELESALE_DRAWER.refresh?.()}}catch(e){console.warn('[telesale-force-refresh-v310] refresh failed',e)}}
function boot(){refresh();let n=0;const tick=()=>{refresh();if(++n<60)setTimeout(tick,500)};setTimeout(tick,150)}
['doit:scopeRendered','doit:psChanged','doit:selectedDatesChanged','doit:insertProductChanged'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(refresh,0)));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.DOIT_TELESALE_FORCE_REFRESH={version:'v310',refresh,enrichRow,enrichPayload,health:()=>({rows:bestRows().length,drawer:!!window.DOIT_TELESALE_DRAWER,json:!!window.DOIT_JSON_APP})};
})();