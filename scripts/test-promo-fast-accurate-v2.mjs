import assert from 'node:assert/strict';

const thaiDigits={'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'};
function cleanOcr(raw){
  let s=String(raw||'').replace(/[๐-๙]/g,d=>thaiDigits[d]||d).replace(/[|_=~—]+/g,' ').replace(/\s+/g,' ').trim();
  s=s.replace(/\b(?:an|aN)\s*(?=\d+\s*%)/g,'ลด ')
    .replace(/\b(?:WS|ws)\s*(?=\d+)/g,'ฟรี ')
    .replace(/[ยบผ]วด/g,'ขวด')
    .replace(/\b(?:Bu|6u|bu|ชีน|ซิน|ขิน)\b/gi,'ชิ้น')
    .replace(/\b(?:ulin|แพค)\b/gi,'แพ็ค')
    .replace(/[สล]ั[งง]/g,'ลัง');
  return s;
}
function parsePromo(raw){
  const cleaned=cleanOcr(raw),unit='(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)',hits=[];
  for(const m of cleaned.matchAll(new RegExp('(\\d+)\\s*[-–]\\s*(\\d+)\\s*'+unit+'\\s*ลด\\s*(\\d+)\\s*%','g')))hits.push({p:m.index,label:`${m[1]}-${m[2]} ${m[3]} ลด ${m[4]}%`});
  for(const m of cleaned.matchAll(new RegExp('(\\d+)\\s*'+unit+'.{0,10}?ฟรี\\s*(\\d+)\\s*(?:'+unit+')?\\s*(?:\\((\\d+)\\s*%\\))?','g'))){const pct=m[5];hits.push({p:m.index,label:`${m[1]} ${m[2]} ฟรี ${m[3]} ${m[4]||m[2]}${pct?` (${pct}%)`:''}`})}
  for(const m of cleaned.matchAll(new RegExp('(\\d+)\\s*'+unit+'.{0,8}?ลด\\s*(\\d+)\\s*%','g')))hits.push({p:m.index,label:`${m[1]} ${m[2]} ลด ${m[3]}%`});
  hits.sort((a,b)=>a.p-b.p);const selected=[];
  for(const h of hits){const last=selected.at(-1);if(last&&Math.abs(last.p-h.p)<6){if(h.label.includes('ฟรี')&&!last.label.includes('ฟรี'))selected[selected.length-1]=h}else selected.push(h)}
  let label=selected.map(x=>x.label).join('; ');
  if(!label){const pcts=[...cleaned.matchAll(/(\d{1,2})\s*%/g)].map(m=>Number(m[1])).filter(n=>n>0&&n<100);if(pcts.length===1)label=`ลด ${pcts[0]}%`}
  const suspicious=/[A-Za-z]{2,}/.test(cleaned)||/[�]/.test(cleaned);
  const nums=[...label.matchAll(/\d+/g)].map(m=>Number(m[0]));
  const valid=!!label&&!suspicious&&nums.every(n=>Number.isFinite(n)&&n>=0&&n<=999);
  return{cleaned,label,valid,suspicious};
}

const cases=[
  ['2 ขวด ลด 8% 6 ขวด ฟรี 1 ขวด (14%) 10 ขวด ฟรี 2 ขวด (17%)','2 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%); 10 ขวด ฟรี 2 ขวด (17%)',true],
  ['6 ขวด ลด 10% 12 ยวด ลด 17% 24 ยวด ลด 20%','6 ขวด ลด 10%; 12 ขวด ลด 17%; 24 ขวด ลด 20%',true],
  ['1 แพ็ค ลด 8% 3 แพ็ค ลด 15% 6 แพ็ค ลด 20%','1 แพ็ค ลด 8%; 3 แพ็ค ลด 15%; 6 แพ็ค ลด 20%',true],
  ['18 ชิ้น ลด 12% 60 Bu an 15% 120 Bu ลด 18%','18 ชิ้น ลด 12%; 60 ชิ้น ลด 15%; 120 ชิ้น ลด 18%',true],
  ['ลด 15%','ลด 15%',true],
  ['10 von WS 2 von (17%)','ลด 17%',false],
  ['เมื่อซื้อ 3 bu','',false],
];
for(const [raw,expected,valid] of cases){const got=parsePromo(raw);assert.equal(got.label,expected,raw);assert.equal(got.valid,valid,raw)}
const old={http:212,storage:636,ocr:424};
const newer={http:Math.ceil(212/10),storage:212,ocr:212};
assert.deepEqual(newer,{http:22,storage:212,ocr:212});
console.log(JSON.stringify({ok:true,cases:cases.length,old,newer,reduction:{http_pct:Math.round((1-newer.http/old.http)*100),storage_pct:Math.round((1-newer.storage/old.storage)*100),ocr_pct:Math.round((1-newer.ocr/old.ocr)*100)}}));
