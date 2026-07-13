function canonicalTierPart(t){
  if(t[0]==='simple')return`ลด ${t[1]}%`;
  if(t[0]==='discount')return`${t[1]} ${t[2]} ลด ${t[3]}%`;
  if(t[0]==='range')return`${t[1]}-${t[2]} ${t[3]} ลด ${t[4]}%`;
  if(t[0]==='free')return`ซื้อ ${t[1]} ${t[2]} ฟรี ${t[3]} ${t[4]}${t[5]!=null?` (${t[5]}%)`:''}`;
  return'';
}
function structuredFunctionCandidate(raw,confidence,lineCount,source){
  const tiers=parseTiers(raw);if(!tiers.length)return null;
  if(lineCount&&tiers.length!==lineCount)return null;
  const label=tiers.map(canonicalTierPart).filter(Boolean).join('; ');if(!label)return null;
  const completePct=pctSig(raw).length>=tiers.filter(t=>t[0]!=='free'||t[5]!=null).length;
  if(!completePct)return null;
  return{raw,confidence,psm:11,label,score:9.7,margin:1,source,structuredNew:true,tierCount:tiers.length};
}
function parseBadgePercent(raw){
  const nums=String(raw||'').match(/\d{1,4}/g)||[],cand=[];
  for(const token of nums){if(Number(token)>=1&&Number(token)<=99)cand.push({v:Number(token),known:ALLOWED_PCT.has(Number(token)),len:token.length,pos:0});for(let i=0;i<token.length;i++)for(let j=i+1;j<=Math.min(token.length,i+2);j++){const v=Number(token.slice(i,j));if(v>=1&&v<=99)cand.push({v,known:ALLOWED_PCT.has(v),len:j-i,pos:i})}}
  cand.sort((a,b)=>Number(b.known)-Number(a.known)||b.len-a.len||a.pos-b.pos);return cand[0]?.v??null;
}
async function recognizeBadge(worker,info){
  let calls=0,firstCanvas=prepBadgeRegion(info.badge,.12),first=await ocrCanvas(worker,firstCanvas,8,'0123456789%');freeCanvas(firstCanvas);calls++;
  let pct=parseBadgePercent(first.raw),second=null;if(pct===null){const c=prepBadgeRegion(info.badge,.18);second=await ocrCanvas(worker,c,8,'0123456789%');freeCanvas(c);calls++;pct=parseBadgePercent(second.raw)}
  let top=null,topNumbers=[];if(info.topInk>.22){const c=crop(info.badge,{x:0,y:0,w:info.badge.width,h:info.badge.height*.38},0),o=prepForOcr(c,8,1);freeCanvas(c);top=await ocrCanvas(worker,o,11,'0123456789-');freeCanvas(o);calls++;topNumbers=[...top.raw.matchAll(/\d+/g)].map(m=>Number(m[0]))}
  await worker.setParameters({tessedit_pageseg_mode:'11',tessedit_char_whitelist:''});if(pct===null)return{first,second,top,selected:second||first,label:'',valid:false,calls,method:'badge'};
  const same=FUNCTION_TEMPLATES.filter(t=>pctSig(t).at(-1)===pct);let label='';
  if(info.topInk<=.22||!topNumbers.length)label=`ลด ${pct}%`;
  else{const score=t=>{const q=quantitySig(t),tiers=parseTiers(t);let s=0;if(top.raw.includes('-')&&tiers[0]?.[0]==='range')s+=3;s+=2*lcs(topNumbers,q)/Math.max(1,topNumbers.length,q.length)-.2*Math.abs(topNumbers.length-q.length);if(pctSig(t).length===1)s+=1;return s};label=[...same].sort((a,b)=>score(b)-score(a))[0]||''}
  const confidence=Math.max(first.confidence,second?.confidence||0,top?.confidence||0),valid=!!label&&confidence>=50;return{first,second,top,selected:second||first,label,valid,calls,method:'badge',topInk:info.topInk,novelSimple:!FUNCTION_TEMPLATES.includes(label)};
}
async function recognizeGeneral(worker,benefit,card){
  const lineCount=estimatePromoLines(benefit),firstCanvas=prepForOcr(benefit,4,1.45),firstOcr=await ocrCanvas(worker,firstCanvas,11,''),firstMatch=bestTemplate(firstOcr.raw);freeCanvas(firstCanvas);
  const first={...firstOcr,...firstMatch,source:'benefit_first'};let second=null,calls=1,rescueSource='';
  const firstRawTiers=parseTiers(first.raw),firstLabelTiers=parseTiers(first.label),firstCompletePct=JSON.stringify(pctSig(first.raw))===JSON.stringify(pctSig(first.label)),structuredObserved=firstRawTiers.some(t=>t[0]!=='simple'),selectedSimple=firstLabelTiers.length===1&&firstLabelTiers[0][0]==='simple';
  if(first.confidence<78||first.score<.80||first.margin<.05||lineCount&&firstRawTiers.length!==lineCount){const useCardRescue=!!card&&(selectedSimple&&structuredObserved||firstRawTiers.length<firstLabelTiers.length||!firstCompletePct),psm=useCardRescue?6:(pctSig(first.raw).length?6:13),source=useCardRescue?card:benefit,c=prepForOcr(source,4,useCardRescue?1.45:1.7),o=await ocrCanvas(worker,c,psm,'');freeCanvas(c);second={...o,...bestTemplate(o.raw),source:useCardRescue?'full_card_rescue':'benefit_fallback'};rescueSource=second.source;calls++}
  const evidence=[first.raw,...(second?[second.raw]:[])],combinedRaw=evidence.join(' '),combined=second?{...second,...bestTemplate(combinedRaw),raw:combinedRaw,source:'combined_evidence'}:null,completion=second?completePartialTemplate(evidence,lineCount):null;
  const completionCandidate=completion?{raw:combinedRaw,confidence:Math.max(first.confidence,second?.confidence||0),psm:second?.psm||first.psm,label:completion.label,score:10,margin:1,source:completion.method,completion:true}:null;
  const structured=[structuredFunctionCandidate(first.raw,first.confidence,lineCount,'structured_first'),...(second?[structuredFunctionCandidate(second.raw,second.confidence,lineCount,'structured_second')]:[]),...(combined?[structuredFunctionCandidate(combinedRaw,Math.max(first.confidence,second?.confidence||0),lineCount,'structured_combined')]:[])].filter(Boolean);
  const candidates=[first,...(second?[second]:[]),...(combined?[combined]:[]),...(completionCandidate?[completionCandidate]:[]),...structured],selected=[...candidates].sort((a,b)=>b.score-a.score||b.margin-a.margin||b.confidence-a.confidence)[0];
  const exact=parseTiers(selected.raw).length&&JSON.stringify(parseTiers(selected.raw))===JSON.stringify(parseTiers(selected.label)),completePct=JSON.stringify(pctSig(selected.raw))===JSON.stringify(pctSig(selected.label)),strong=selected.score>=.90&&selected.margin>=.08&&selected.confidence>=72,completedSafely=!!(selected.completion&&completion&&completion.lineCount>0&&completion.missingHints.length&&selected.confidence>=60),structuredSafely=!!(selected.structuredNew&&selected.confidence>=78&&(!lineCount||selected.tierCount===lineCount));
  await worker.setParameters({tessedit_pageseg_mode:'11',tessedit_char_whitelist:''});return{first,second,top:null,selected,label:selected.label,valid:!!(structuredSafely||completedSafely||completePct&&(exact||strong)),calls,method:'general',rescueSource,lineCount,completion,structuredNew:structuredSafely};
}
async function recognize(worker,benefit,card){
  const badge=denseBadgeInfo(benefit);if(badge){const b=await recognizeBadge(worker,badge);freeCanvas(badge.badge);if(b.valid)return b;const g=await recognizeGeneral(worker,benefit,card);g.calls+=b.calls;g.badgeFallback=b;return g}return recognizeGeneral(worker,benefit,card);
}
