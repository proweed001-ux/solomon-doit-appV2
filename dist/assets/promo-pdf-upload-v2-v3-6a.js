(function(P){
P.version='promo-dynamic-grid-price-v1';
P.units=['ขวด','ชิ้น','แพ็ค','กล่อง','ลัง','ซอง','ถุง','ชุด'];
P.suspiciousPctMax=50;
P.clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function uniqueTiers(tiers){const seen=new Set();for(const t of tiers){const k=JSON.stringify(t);if(seen.has(k))return false;seen.add(k)}return true}
P.exactTierEvidence=function(raw,label,lineCount){const rt=parseTiers(raw),lt=parseTiers(label),rp=pctSig(raw),lp=pctSig(label);return !!rt.length&&JSON.stringify(rt)===JSON.stringify(lt)&&uniqueTiers(rt)&&rp.length===lp.length&&JSON.stringify(rp)===JSON.stringify(lp)&&(!lineCount||rt.length===lineCount)&&lp.every(n=>n>0&&n<=P.suspiciousPctMax)};
function normalizeMetaText(s){return String(s||'').replace(/[๐-๙]/g,d=>thaiDigits[d]||d).replace(/[|_=~—–]+/g,' ').replace(/,/g,'.').replace(/\s+/g,' ').trim()}
P.normalizeUnit=function(s){let c=cleanOcr(s).replace(/(?:ขว[คดล]|ฆวด|ขว๓|ยขวด)/g,'ขวด').replace(/(?:๒อง|หซอง)/g,'ซอง').replace(/\s+/g,'');for(const u of P.units)if(c.includes(u))return u;return''};
P.numericTokens=s=>[...normalizeMetaText(s).matchAll(/\d{1,5}(?:\.\d{1,2})?/g)].map(m=>Number(m[0])).filter(Number.isFinite);
function cleanTitle(raw){let s=normalizeMetaText(raw).replace(/[•·]/g,' ').replace(/(?:ขนาด|size).*$/i,' ').replace(/ทุกสูตร/g,' ').replace(/\s+/g,' ').trim();s=s.replace(/^[^A-Za-zก-๙]+|[^A-Za-zก-๙.)]+$/g,'').trim();return s.slice(0,160)}
function firstPrice(raw){const m=normalizeMetaText(raw).match(/\d{1,5}(?:\.\d{1,2})?/);return m?Number(m[0]):null}
P.firstPrice=firstPrice;
P.parseMetadataText=function(raw,promoLabel=''){
  const title=cleanTitle(raw?.title_raw||raw?.title||''),normalPrice=firstPrice(raw?.normal_raw||''),baseUnitPrice=firstPrice(raw?.average_raw||'');
  let unitLabel=P.normalizeUnit(raw?.average_raw||'');
  if(!unitLabel){const t=parseTiers(promoLabel)[0];if(t){if(t[0]==='range')unitLabel=t[3]||'';else if(t[0]!=='simple')unitLabel=t[2]||''}}
  const ratio=Number.isFinite(normalPrice)&&Number.isFinite(baseUnitPrice)&&baseUnitPrice>0?normalPrice/baseUnitPrice:null,buyQty=ratio==null?null:Math.round(ratio),arithmeticOk=Number.isInteger(buyQty)&&buyQty>=1&&buyQty<=999&&Math.abs(ratio-buyQty)/buyQty<=.08,priceValid=arithmeticOk&&P.units.includes(unitLabel)&&baseUnitPrice>0&&normalPrice>0,titleValid=/[A-Za-zก-๙]/.test(title)&&title.length>=3&&!/(ราคาแนะนำ|ปกติ|เฉลี่ย|เมื่อซื้อ)/.test(title);
  return{raw,promoTitle:title,buyQty,normalPrice,baseUnitPrice,unitLabel,priceValid,titleValid,arithmeticOk,ratio};
};
P.findPriceBox=function(card){
  const w=card.width,h=card.height,roi={x:0,y:h*.35,w:w*.45,h:h*.64},arr=comps(card,(r,g,b)=>Math.max(r,g,b)>100&&Math.max(r,g,b)-Math.min(r,g,b)>55,roi,2,18).map(r=>({...r,fill:r.area/Math.max(1,(r.w/2)*(r.h/2)),cx:(r.x+r.w/2)/w,cy:(r.y+r.h/2)/h})).filter(r=>r.w>w*.10&&r.h>h*.12&&r.w<w*.42&&r.h<h*.58&&r.cx<.35&&r.cy>.58&&r.fill>.25).sort((a,b)=>(b.fill*4+b.area)-(a.fill*4+a.area));
  const r=arr[0];return r?clipR({x:r.x-8,y:r.y-8,w:r.w+16,h:r.h+16},w,h):null;
};
function parseTsvWords(tsv,scale){const out=[];for(const line of String(tsv||'').split(/\r?\n/).slice(1)){const c=line.split('\t');if(c.length<12)continue;const conf=Number(c[10]),text=String(c.slice(11).join('\t')||'').trim();if(!text||!Number.isFinite(conf)||conf<15)continue;const left=Number(c[6])/scale,top=Number(c[7])/scale,width=Number(c[8])/scale,height=Number(c[9])/scale;out.push({text,conf,left,top,width,height,cx:left+width/2,cy:top+height/2})}return out}
function wordsText(words){return [...words].sort((a,b)=>a.top-b.top||a.left-b.left).map(w=>w.text).join(' ')}
function avgConf(words){return words.length?words.reduce((s,w)=>s+w.conf,0)/words.length:0}
P.recognizePriceDigits=async function(worker,card,priceBox){
  const panel=crop(card,priceBox,0),o=prepForOcr(panel,6,1);freeCanvas(panel);await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1',tessedit_char_whitelist:'0123456789./'});const r=await worker.recognize(o);freeCanvas(o);const raw=String(r.data.text||'').trim(),lines=raw.split(/\r?\n+/).map(v=>v.trim()).filter(Boolean),values=lines.map(firstPrice).filter(Number.isFinite);await worker.setParameters({tessedit_pageseg_mode:'11',tessedit_char_whitelist:''});return{raw,normalPrice:values[0]??null,baseUnitPrice:values[1]??null,confidence:Number(r.data.confidence||0),lineCount:lines.length};
};
P.recognizeMetadata=async function(worker,card,promoLabel){
  const priceBox=P.findPriceBox(card);if(!priceBox)return{raw:{},promoTitle:'',buyQty:null,normalPrice:null,baseUnitPrice:null,unitLabel:'',priceValid:false,titleValid:false,arithmeticOk:false,confidence:0,valid:false,reason:'price_box_not_found'};
  const scale=3,c=prepForOcr(card,scale,1.35);await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1',tessedit_char_whitelist:''});const r=await worker.recognize(c,{}, {text:true,tsv:true,blocks:false,hocr:false});freeCanvas(c);const words=parseTsvWords(r.data.tsv,scale),titleWords=words.filter(w=>w.cx>=card.width*.42&&w.cy<=card.height*.34),normalWords=words.filter(w=>w.cx>=priceBox.x&&w.cx<=priceBox.x+priceBox.w&&w.cy>=card.height*.54&&w.cy<=card.height*.78),averageWords=words.filter(w=>w.cx>=priceBox.x&&w.cx<=priceBox.x+priceBox.w&&w.cy>=card.height*.76&&w.cy<=card.height*.99),priceDigits=await P.recognizePriceDigits(worker,card,priceBox);
  const raw={title_raw:wordsText(titleWords),normal_raw:wordsText(normalWords),average_raw:wordsText(averageWords),normal_price:priceDigits.normalPrice,base_unit_price:priceDigits.baseUnitPrice,price_digits_raw:priceDigits.raw},parsed=P.parseMetadataText({...raw,normal_raw:raw.normal_raw||String(priceDigits.normalPrice??''),average_raw:raw.average_raw||String(priceDigits.baseUnitPrice??'')},promoLabel);
  parsed.normalPrice=priceDigits.normalPrice;parsed.baseUnitPrice=priceDigits.baseUnitPrice;const ratio=Number.isFinite(parsed.normalPrice)&&Number.isFinite(parsed.baseUnitPrice)&&parsed.baseUnitPrice>0?parsed.normalPrice/parsed.baseUnitPrice:null,buyQty=ratio==null?null:Math.round(ratio),arithmeticOk=Number.isInteger(buyQty)&&buyQty>=1&&buyQty<=999&&Math.abs(ratio-buyQty)/buyQty<=.08,priceValid=arithmeticOk&&P.units.includes(parsed.unitLabel)&&parsed.baseUnitPrice>0&&parsed.normalPrice>0,confidence=Math.min(avgConf(titleWords),priceDigits.confidence,averageWords.length?avgConf(averageWords):100);
  await worker.setParameters({tessedit_pageseg_mode:'11',tessedit_char_whitelist:''});return{...parsed,raw,normalPrice:parsed.normalPrice,baseUnitPrice:parsed.baseUnitPrice,buyQty,ratio,arithmeticOk,priceValid,confidence,valid:priceValid&&parsed.titleValid&&confidence>=45,words_count:words.length,title_words:titleWords.length,normal_words:normalWords.length,average_words:averageWords.length,price_digits:priceDigits,priceBox};
};
P.detectPageClass=async function(worker,pg,pageNo){const h=crop(pg,{x:0,y:0,w:pg.width*.44,h:pg.height*.22},0),o=prepForOcr(h,3,1.35);freeCanvas(h);const r=await ocrCanvas(worker,o,6,'');freeCanvas(o);const s=String(r.raw||'').toUpperCase().replace(/\s+/g,'').replace(/[–—_]/g,'-'),rules=[['HFSWSL',/HFS-?WS-?L/],['HFSWSS',/HFS-?WS-?S/],['HFSXL',/HFS-?XL/],['HFSL',/HFS-?L/],['HFSM',/HFS-?M/],['HFSS',/HFS-?S/]];for(const [id,re] of rules)if(re.test(s))return{id,raw:r.raw,confidence:r.confidence,method:'header_ocr'};const fallback=PAGES[pageNo];return fallback?{id:fallback,raw:r.raw,confidence:r.confidence,method:'fixed_fallback'}:null};
})(window.PromoDynamicV1||(window.PromoDynamicV1={}));
