(function(P){
const snapshot=window.PROMO_PRODUCT_MASTER_SNAPSHOT||{products:[]};
const masters=Array.isArray(snapshot.products)?snapshot.products:[];
const masterById=new Map(masters.map(x=>[x.id,x]));
const baseMetadata=P.recognizeMetadata,baseDetect=detect,baseReport=reportObject,baseRenderPreview=renderPreview,basePostBatch=postBatch;

function normalizeTitle(value){
  let s=String(value||'').toLowerCase().replace(/[๐-๙]/g,d=>thaiDigits[d]||d);
  const aliases=[[/head\s*&?\s*shoulders|เฮด\s*แอนด์\s*โชว์\s*เดอร์/gi,'hs'],[/แพน\s*ทีน/gi,'pantene'],[/รี\s*จอยส์/gi,'rejoice'],[/ดาวน์\s*นี่/gi,'downy'],[/โอ\s*เลย์/gi,'olay'],[/ยิล\s*เลตต์/gi,'gillette'],[/ออ\s*รัล\s*บี/gi,'oralb'],[/แอม\s*บิ\s*เพอร์/gi,'ambipur'],[/วิคส์/gi,'vicks'],[/เซฟ\s*การ์ด/gi,'safeguard']];
  for(const [re,to] of aliases)s=s.replace(re,to);
  return s.replace(/ราคาแนะนําขายปลีก|ราคาแนะนำขายปลีก|ทุกสูตร|ขนาด|ปกติ|เฉลี่ย|เมื่อซื้อ|บาท|ชุด/gi,'').replace(/มล\.?/g,'ml').replace(/กรัม/g,'g').replace(/[^a-z0-9ก-๙]/g,'');
}
function bigrams(value){const s=normalizeTitle(value),m=new Map();for(let i=0;i<s.length-1;i++){const g=s.slice(i,i+2);m.set(g,(m.get(g)||0)+1)}return m}
function similarity(a,b){a=normalizeTitle(a);b=normalizeTitle(b);if(a.length<3||b.length<3)return 0;if(a===b||a.includes(b)||b.includes(a))return Math.min(a.length,b.length)/Math.max(a.length,b.length);const ga=bigrams(a),gb=bigrams(b);let hit=0,na=0,nb=0;for(const v of ga.values())na+=v;for(const v of gb.values())nb+=v;for(const [k,v] of ga)hit+=Math.min(v,gb.get(k)||0);return 2*hit/Math.max(1,na+nb)}
function numberSignature(value){return [...new Set((normalizeTitle(value).match(/\d+/g)||[]))].sort().join('|')}
function masterMatch(evidence,unit){
  const ev=evidence.filter(x=>normalizeTitle(x).length>=3),rank=[];
  for(const m of masters){let score=Math.max(0,...ev.map(x=>similarity(x,m.name)));const a=numberSignature(ev.join(' ')),b=numberSignature(m.name);if(a&&b)score+=a===b?.10:-.14;if(unit&&m.unit===unit)score+=.04;else if(unit&&m.unit&&m.unit!==unit)score-=.02;rank.push({master:m,score})}
  rank.sort((a,b)=>b.score-a.score||a.master.name.localeCompare(b.master.name));const first=rank[0],second=rank[1];return first?{master:first.master,score:first.score,margin:first.score-(second?.score||0),second:second?.master?.name||''}:null;
}
function knownMatchValid(match){return !!match?.master&&match.score>=.42&&match.margin>=.04}
function titleConsensus(result){
  const a=String(result?.promoTitle||''),b=String(result?.titleOcr?.raw||''),na=normalizeTitle(a),nb=normalizeTitle(b),score=similarity(a,b),numbersOk=numberSignature(a)===numberSignature(b);
  return{ok:na.length>=5&&nb.length>=5&&score>=.72&&numbersOk&&Number(result?.titleConfidence||0)>=55,score,a,b,canonical:a.length>=b.length?a:b,normalized:na.length>=nb.length?na:nb};
}
async function deterministicUuid(key){
  const bytes=new TextEncoder().encode(`promo-product-master|${key}`),digest=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),hex=[...digest].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,32).split('');hex[12]='5';hex[16]=((parseInt(hex[16],16)&3)|8).toString(16);const h=hex.join('');return`${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
function titleHash(card){
  try{const c=document.createElement('canvas');c.width=9;c.height=8;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(card,card.width*.34,0,card.width*.66,card.height*.38,0,0,9,8);const d=x.getImageData(0,0,9,8).data;let bits=0n,n=0n;for(let y=0;y<8;y++)for(let xx=0;xx<8;xx++){const i=(y*9+xx)*4,j=i+4,g1=(d[i]+d[i+1]+d[i+2])/3,g2=(d[j]+d[j+1]+d[j+2])/3;if(g1>g2)bits|=1n<<n;n++}return bits.toString(16).padStart(16,'0')}catch{return''}
}
function hamming(a,b){if(!a||!b)return 99;let x=BigInt(`0x${a}`)^BigInt(`0x${b}`),n=0;while(x){x&=x-1n;n++}return n}
function closePrice(a,b){a=Number(a);b=Number(b);return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=Math.max(.10,Math.max(a,b)*.008)}

P.recognizeMetadata=async function(worker,card,promoLabel){
  const result=await baseMetadata(worker,card,promoLabel),visualTitleHash=titleHash(card),evidence=[result.promoTitle,result.titleOcr?.raw,result.raw?.title_raw].filter(Boolean),match=masterMatch(evidence,result.unitLabel),consensus=titleConsensus(result);let master=null,isNew=false,masterId='',canonical='',normalized='';
  if(knownMatchValid(match)){master=match.master;masterId=master.id;canonical=master.name;normalized=normalizeTitle(master.name)}
  else if(consensus.ok&&result.priceValid){isNew=true;canonical=String(result.promoTitle||consensus.canonical).trim();normalized=normalizeTitle(canonical);masterId=await deterministicUuid(normalized)}
  const masterValid=!!masterId,titleValid=!!result.titleValid&&masterValid&&(isNew?consensus.ok:true),valid=!!result.priceValid&&titleValid;
  return{...result,promoTitle:canonical||result.promoTitle,titleValid,valid,visualTitleHash,masterValid,masterProductId:masterId,masterCanonicalName:canonical,masterNormalizedKey:normalized,masterIsNew:isNew,masterMatchScore:isNew?1:(match?.score||0),masterMatchMargin:isNew?1:(match?.margin||0),masterSecond:match?.second||'',titleConsensusScore:consensus.score,titleEvidence:evidence};
};

function propagateMasterByVisual(){
  const parent=items.map((_,i)=>i),find=i=>parent[i]===i?i:(parent[i]=find(parent[i])),join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a};
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],b=items[j],ha=a.metadata?.visualTitleHash,hb=b.metadata?.visualTitleHash;if(!ha||!hb||hamming(ha,hb)>3)continue;if(a.unitLabel&&b.unitLabel&&a.unitLabel!==b.unitLabel)continue;join(i,j)}
  const groups=new Map();for(let i=0;i<items.length;i++){const k=find(i);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(items[i])}
  let count=0;
  for(const group of groups.values()){
    const known=group.filter(x=>x.metadata?.masterValid),ids=[...new Set(known.map(x=>x.metadata.masterProductId))];if(ids.length!==1||known.length<2)continue;const exemplar=known[0].metadata;
    for(const it of group){const m=it.metadata;if(m.masterValid)continue;m.masterValid=true;m.masterProductId=exemplar.masterProductId;m.masterCanonicalName=exemplar.masterCanonicalName;m.masterNormalizedKey=exemplar.masterNormalizedKey;m.masterIsNew=exemplar.masterIsNew;m.masterMatchScore=Math.max(.42,exemplar.masterMatchScore||0);m.masterMatchMargin=Math.max(.04,exemplar.masterMatchMargin||0);m.masterPropagatedByVisual=true;m.promoTitle=exemplar.masterCanonicalName;m.titleValid=true;it.promoTitle=exemplar.masterCanonicalName;count++}
  }
  return count;
}
function priceConsensus(){
  const groups=new Map();for(const it of items){const id=it.metadata?.masterProductId;if(!id)continue;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(it)}let rescued=0,conflicts=0;
  for(const group of groups.values()){
    const good=group.filter(x=>x.metadata?.priceValid&&Number(x.baseUnitPrice)>0),clusters=[];
    for(const it of good){let c=clusters.find(x=>x.unit===it.unitLabel&&closePrice(x.mean,it.baseUnitPrice));if(!c){c={unit:it.unitLabel,mean:Number(it.baseUnitPrice),items:[]};clusters.push(c)}c.items.push(it);c.mean=c.items.reduce((s,x)=>s+Number(x.baseUnitPrice),0)/c.items.length}
    clusters.sort((a,b)=>b.items.length-a.items.length);const win=clusters[0];if(!win||win.items.length<2)continue;if(clusters[1]&&clusters[1].items.length===win.items.length){for(const it of group){it.metadata.priceGroupConflict=true;it.metadata.priceValid=false}conflicts+=group.length;continue}
    const price=Math.round(win.mean*100)/100;
    for(const it of group){const m=it.metadata;if(m.priceValid&&Number(it.baseUnitPrice)>0&&!closePrice(it.baseUnitPrice,price)){m.priceGroupConflict=true;m.priceValid=false;conflicts++;continue}if(!m.priceValid||!(Number(it.baseUnitPrice)>0)){it.baseUnitPrice=price;it.unitLabel=win.unit;m.baseUnitPrice=price;m.unitLabel=win.unit;m.priceValid=true;m.priceAgreement=true;m.priceGroupRescued=true;rescued++}m.priceGroupSupport=win.items.length}
  }
  return{rescued,conflicts};
}
function refreshStatuses(){for(const it of items){const m=it.metadata||{};if(m.masterValid&&m.masterCanonicalName){it.promoTitle=m.masterCanonicalName;m.promoTitle=m.masterCanonicalName}m.valid=!!m.priceValid&&!!m.titleValid&&!!m.masterValid&&!m.priceGroupConflict;it.detectionStatus=it.pass&&it.ocr?.valid&&m.valid?'auto_ok':'need_review';it.uploadable=it.detectionStatus==='auto_ok'}}

reportObject=function(timing,counts){const r=baseReport(timing,counts);r.product_master_version=snapshot.version||'';r.master_auto_ok=items.filter(x=>x.metadata?.masterValid).length;r.master_new=items.filter(x=>x.metadata?.masterIsNew).length;r.price_group_rescued=items.filter(x=>x.metadata?.priceGroupRescued).length;r.price_group_conflicts=items.filter(x=>x.metadata?.priceGroupConflict).length;for(const row of r.cards||[]){const it=items.find(x=>x.cardId===row.card_id);if(!it)continue;Object.assign(row,{master_status:it.metadata?.masterValid?'auto_ok':'need_review',master_product_id:it.metadata?.masterProductId||'',master_canonical_name:it.metadata?.masterCanonicalName||'',master_is_new:!!it.metadata?.masterIsNew,master_match_score:it.metadata?.masterMatchScore||0,master_match_margin:it.metadata?.masterMatchMargin||0,title_consensus_score:it.metadata?.titleConsensusScore||0,visual_title_hash:it.metadata?.visualTitleHash||'',price_group_support:it.metadata?.priceGroupSupport||0,price_group_rescued:!!it.metadata?.priceGroupRescued,price_group_conflict:!!it.metadata?.priceGroupConflict})}return r};
renderPreview=function(it){const before=crops.children.length;baseRenderPreview(it);if(crops.children.length===before)return;const meta=crops.lastElementChild?.querySelector('.meta');if(meta)meta.insertAdjacentHTML('beforeend',`<div class="ocr"><b>Product Master:</b> ${it.metadata?.masterValid?'✓ '+String(it.metadata.masterCanonicalName||''):'✗ ต้องตรวจ'}${it.metadata?.masterIsNew?' (สร้างใหม่)':''}</div><div class="ocr"><b>กลุ่มราคา:</b> ${it.metadata?.priceGroupSupport||0} หลักฐาน${it.metadata?.priceGroupConflict?' — ขัดแย้ง':''}</div>`)};

detect=async function(){
  const mobile=/Android|iPhone|iPad/i.test(navigator.userAgent),memory=Number(navigator.deviceMemory||0);if($('workers')&&(mobile||memory&&memory<=6))$('workers').value='1';
  const base=await baseDetect(),propagated=propagateMasterByVisual(),prices=priceConsensus();refreshStatuses();crops.textContent='';for(const it of items)renderPreview(it);setSum();const timing=base?.timing_ms||{},counts=base?.class_counts||{};lastReport=reportObject(timing,counts);lastReport.visual_master_propagated=propagated;lastReport.price_consensus_rescued=prices.rescued;lastReport.price_consensus_conflicts=prices.conflicts;$('upload').disabled=lastReport.need_review>0;st(`เสร็จ ${items.length} ใบ | AUTO OK ${lastReport.auto_ok} | ต้องตรวจ ${lastReport.need_review} | Master ${lastReport.master_auto_ok}/${items.length} | ช่วยราคา ${prices.rescued} ใบ`);return lastReport;
};

postBatch=async function(cards,key,month){
  const started=performance.now(),payload=cards.map(it=>({file_name:it.fileName,data_url:it.dataUrl,benefit_text:it.detectedFunctionLabel,detected_function_label:it.detectedFunctionLabel,benefit_confidence:it.ocr.selected?.confidence||0,benefit_box:it.benefitBox,detection_status:it.detectionStatus,detection_method:it.ocr.method,promo_title:it.promoTitle,base_unit_price:it.baseUnitPrice,unit_label:it.unitLabel,price_confidence:it.metadata?.confidence||0,price_status:it.metadata?.priceValid?'auto_ok':'need_review',title_status:it.metadata?.titleValid?'auto_ok':'need_review',master_status:it.metadata?.masterValid?'auto_ok':'need_review',master_product_id:it.metadata?.masterProductId||'',master_canonical_name:it.metadata?.masterCanonicalName||'',master_normalized_key:it.metadata?.masterNormalizedKey||'',master_is_new:!!it.metadata?.masterIsNew,master_match_score:(it.metadata?.masterMatchScore||0)*100,master_match_margin:(it.metadata?.masterMatchMargin||0)*100,title_consensus_score:(it.metadata?.titleConsensusScore||0)*100,price_group_support:it.metadata?.priceGroupSupport||0,visual_match_score:it.metadata?.masterPropagatedByVisual?100:0,visual_title_hash:it.metadata?.visualTitleHash||'',title_ocr:(it.metadata?.titleEvidence||[]).join(' | ')}));const j=await requestJson({action:'batch_upload',promo_month_id:month,source_file:sourceFile?.name||'',skip_existing_images:true,function_sync_version:'promo-dynamic-master-consensus-v3',cards:payload},key);return{...j,client_ms:Math.round(performance.now()-started)}};

window.PromoV3MasterSafety={version:'promo-dynamic-master-consensus-v3',normalizeTitle,similarity,masterMatch,knownMatchValid,titleConsensus,hamming,closePrice,deterministicUuid};
})(window.PromoDynamicV1||(window.PromoDynamicV1={}));
