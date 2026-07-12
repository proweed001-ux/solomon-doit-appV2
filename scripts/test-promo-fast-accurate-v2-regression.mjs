import assert from 'node:assert/strict';

const thaiDigits={'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'};
function cleanOcr(raw){let s=String(raw||'').replace(/[๐-๙]/g,d=>thaiDigits[d]||d).replace(/[|_=~—–]+/g,' ').replace(/ล\s*ด/g,'ลด').replace(/ฟ\s*รี/g,'ฟรี').replace(/ซื\s*้\s*อ/g,'ซื้อ');s=s.replace(/\b(?:an|aN)\s*(?=\d+\s*%)/g,'ลด ').replace(/\b(?:WS|ws)\s*(?=\d+)/g,'ฟรี ').replace(/(?:ข\s*บ?\s*วด|[ยบผ]วด)/g,'ขวด').replace(/(?:ช\s*ิ?\s*้?\s*น|\b(?:Bu|GU|Gu|6u|bu|ชีน|ซิน|ขิน|ชน)\b)/gi,'ชิ้น').replace(/(?:แพ\s*็?\s*ค|\b(?:แพค|เเพ็ค|ulin)\b)/gi,'แพ็ค').replace(/(?:ล|ส)\s*ั?\s*ง/g,'ลัง').replace(/ก\s*ล\s*่?\s*อ\s*ง/g,'กล่อง').replace(/(\d{1,2})\s*[°º]/g,'$1%').replace(/\bB%/gi,'8%').replace(/ลด\s*(\d{1,2})9\b/g,'ลด $1%').replace(/ลด\s*(\d{1,2})(?=\s+\d{1,3}\s*(?:ขวด|ชิ้น|แพ็ค|กล่อง|ลัง))/g,'ลด $1%').replace(/ล\s*[ลต]\s*(?=\d{1,2}\s*%)/g,'ลด ');return s.replace(/\s+/g,' ').trim()}
function parseTiers(raw){const s=cleanOcr(raw),unit='(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)',hits=[];for(const m of s.matchAll(new RegExp('(?:ซื้อ\\s*)?(\\d{1,3})\\s*'+unit+'.{0,12}?ฟรี\\s*(\\d{1,3})\\s*(?:'+unit+')?\\s*(?:\\((\\d{1,2})\\s*%\\))?','g')))hits.push({p:m.index,v:['free',Number(m[1]),m[2],Number(m[3]),m[4]||m[2],m[5]?Number(m[5]):null]});for(const m of s.matchAll(new RegExp('(\\d{1,3})\\s*-\\s*(\\d{1,3})\\s*'+unit+'.{0,8}?ลด\\s*(\\d{1,2})\\s*%','g')))hits.push({p:m.index,v:['range',Number(m[1]),Number(m[2]),m[3],Number(m[4])]});for(const m of s.matchAll(new RegExp('(\\d{1,3})\\s*'+unit+'.{0,8}?ลด\\s*(\\d{1,2})\\s*%','g'))){if(!hits.some(h=>Math.abs(h.p-m.index)<5&&(h.v[0]==='free'||h.v[0]==='range')))hits.push({p:m.index,v:['discount',Number(m[1]),m[2],Number(m[3])]})}hits.sort((a,b)=>a.p-b.p);const out=[];for(const h of hits)if(!out.some(x=>JSON.stringify(x)===JSON.stringify(h.v)))out.push(h.v);if(!out.length){const p=[...s.matchAll(/(\d{1,2})\s*%/g)].map(m=>Number(m[1])).filter(n=>n>0&&n<100);if(p.length===1)out.push(['simple',p[0]])}return out}
function pctSig(s){return [...cleanOcr(s).matchAll(/(\d{1,2})\s*%/g)].map(m=>Number(m[1])).filter(n=>n>0&&n<100)}

const cases=[
 ['2 BU ล ด B% 4 Bu ล ด 11 36 Gu ล ด 189', [['discount',2,'ชิ้น',8],['discount',4,'ชิ้น',11],['discount',36,'ชิ้น',18]]],
 ['1 ก ล ่ อ ง ล ด 10% 3 ก ล ่ อ ง ล ด 17%', [['discount',1,'กล่อง',10],['discount',3,'กล่อง',17]]],
 ['6 ชิ ้ น ฟรี 2 ชิ ้ น (25%)', [['free',6,'ชิ้น',2,'ชิ้น',25]]],
 ['36 ขบวด ลด 16% 2 สัง ลด 20% 6 ลัง ลด 25%', [['discount',36,'ขวด',16],['discount',2,'ลัง',20],['discount',6,'ลัง',25]]],
 ['1-2 ชิ้น ลด 24%', [['range',1,2,'ชิ้น',24]]],
 ['ซื้อ 6 ชิ้น WS 1 ชิ้น (14%)', [['free',6,'ชิ้น',1,'ชิ้น',14]]],
 ['ลด 15°', [['simple',15]]],
];
for(const [raw,expected] of cases)assert.deepEqual(parseTiers(raw),expected,raw);
assert.deepEqual(pctSig('ลด 8 4 ชิ้น ลด 11%'),[8,11]);

async function retryResumeMock(){
 const batches=Array.from({length:22},(_,i)=>i),failOnce=new Set([3,11]),attempts=new Map(),completed=new Set();
 async function run(batch){const n=(attempts.get(batch)||0)+1;attempts.set(batch,n);if(failOnce.has(batch)&&n===1)throw new Error('planned');completed.add(batch)}
 let pending=[...batches];
 for(let round=0;round<3&&pending.length;round++){
  const next=[];
  for(let i=0;i<pending.length;i+=2){const pair=pending.slice(i,i+2);const results=await Promise.allSettled(pair.map(run));results.forEach((r,j)=>{if(r.status==='rejected')next.push(pair[j])})}
  pending=next;
 }
 assert.equal(completed.size,22);assert.deepEqual(pending,[]);assert.equal(attempts.get(3),2);assert.equal(attempts.get(11),2);
 for(const batch of batches)if(batch!==3&&batch!==11)assert.equal(attempts.get(batch),1,`batch ${batch} repeated`);
 return {batches:22,totalAttempts:[...attempts.values()].reduce((a,b)=>a+b,0),retried:[3,11]};
}
const retry=await retryResumeMock();
console.log(JSON.stringify({parserCases:cases.length,retry},null,2));
