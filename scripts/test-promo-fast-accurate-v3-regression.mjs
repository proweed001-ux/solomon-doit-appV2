import assert from 'node:assert/strict';

const templates=[
 '2 ชิ้น ลด 8%; 4 ชิ้น ลด 11%',
 '2 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%); 10 ขวด ฟรี 2 ขวด (17%)',
 '6 ขวด ลด 10%; 12 ขวด ลด 17%; 1 ลัง ลด 20%',
 '6 ขวด ลด 10%; 12 ขวด ลด 17%; 24 ขวด ลด 20%',
 '12 ขวด ลด 12%; 1 ลัง ลด 17%',
 '12 ขวด ลด 12%; 1 ลัง ลด 17%; 3 ลัง ลด 25%',
 '3 กล่อง ลด 12%; 1 ลัง ลด 17%',
 '3 กล่อง ลด 15%; 1 ลัง ลด 17%',
 '6 กล่อง ลด 15%; 1 ลัง ลด 17%',
 '3 ชิ้น ลด 12%; 5 ชิ้น ฟรี 1 ชิ้น (17%)',
 '60 ชิ้น ลด 15%; 120 ชิ้น ลด 18%',
 '1-2 ชิ้น ลด 24%',
 '12 ชิ้น ลด 25%',
 'ลด 24%','ลด 25%','ลด 12%','ลด 17%','ลด 27%'
];
const allowed=new Set([5,7,8,10,12,14,15,16,17,18,19,20,21,22,23,24,25,27,28,30,33,37]);
const thaiDigits={'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'};
function cleanOcr(raw){let s=String(raw||'').replace(/[๐-๙]/g,d=>thaiDigits[d]||d).replace(/[|_=~—–]+/g,' ').replace(/ล\s*ด/g,'ลด').replace(/ฟ\s*รี/g,'ฟรี').replace(/ซื\s*้\s*อ/g,'ซื้อ');s=s.replace(/\b(?:an|aN|aA|AA|A4|4A|a4)\s*(?=\d+\s*%)/gi,'ลด ').replace(/\b(?:WS|ws)\s*(?=\d+)/g,'ฟรี ').replace(/(?:ข\s*บ?\s*วด|[ยบผ]วด|\b(?:UOA|UDA|UIA|YOA|YOM|von)\b)/gi,'ขวด').replace(/(?:ช\s*ิ?\s*้?\s*น|\b(?:Bu|GU|Gu|6u|bu|ชีน|ซิน|ขิน|ชน)\b)/gi,'ชิ้น').replace(/(?:แพ\s*็?\s*ค|\b(?:แพค|เเพ็ค|ulin)\b)/gi,'แพ็ค').replace(/(?:ล|ส)\s*ั?\s*ง/g,'ลัง').replace(/ก\s*ล\s*่?\s*อ\s*ง/g,'กล่อง').replace(/\b(?:av|a0)\b/gi,'ลัง').replace(/(\d{1,2})\s*[°º]/g,'$1%').replace(/\bB%/gi,'8%').replace(/ลด\s*(\d{1,2})9\b/g,'ลด $1%').replace(/ลด\s*(\d{1,2})(?=\s*$)/g,(m,n)=>allowed.has(Number(n))?`ลด ${n}%`:m);return s.replace(/\s+/g,' ').trim()}
function pctSig(s){return[...cleanOcr(s).matchAll(/(\d{1,2})\s*%/g)].map(m=>Number(m[1])).filter(n=>n>0&&n<100)}
function quantitySig(s){const c=cleanOcr(s),q=[...c.matchAll(/(\d{1,3})\s*(?:ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)/g)].map(m=>Number(m[1])),p=pctSig(c);if(q.length<p.length)for(const m of c.matchAll(/(\d{1,3})\s+.{0,8}?ลด\s*\d{1,2}\s*%/g)){if(q.length>=p.length)break;q.push(Number(m[1]))}return q}
function parseTiers(raw){const s=cleanOcr(raw),unit='(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)',hits=[];for(const m of s.matchAll(new RegExp('(?:ซื้อ\\s*)?(\\d{1,3})\\s*'+unit+'.{0,12}?ฟรี\\s*(\\d{1,3})\\s*(?:'+unit+')?\\s*(?:\\((\\d{1,2})\\s*%\\))?','g')))hits.push({p:m.index,v:['free',Number(m[1]),m[2],Number(m[3]),m[4]||m[2],m[5]?Number(m[5]):null]});for(const m of s.matchAll(new RegExp('(\\d{1,3})\\s*-\\s*(\\d{1,3})\\s*'+unit+'.{0,8}?ลด\\s*(\\d{1,2})\\s*%','g')))hits.push({p:m.index,v:['range',Number(m[1]),Number(m[2]),m[3],Number(m[4])]});for(const m of s.matchAll(new RegExp('(\\d{1,3})\\s*'+unit+'.{0,8}?ลด\\s*(\\d{1,2})\\s*%','g'))){if(!hits.some(h=>Math.abs(h.p-m.index)<5&&(h.v[0]==='free'||h.v[0]==='range')))hits.push({p:m.index,v:['discount',Number(m[1]),m[2],Number(m[3])]})}hits.sort((a,b)=>a.p-b.p);const out=[];for(const h of hits)if(!out.some(x=>JSON.stringify(x)===JSON.stringify(h.v)))out.push(h.v);if(!out.length){const p=pctSig(s);if(p.length===1)out.push(['simple',p[0]])}return out}
function lcs(a,b){const dp=Array(b.length+1).fill(0);for(const x of a){let prev=0;for(let j=1;j<=b.length;j++){const old=dp[j];dp[j]=x===b[j-1]?prev+1:Math.max(dp[j],dp[j-1]);prev=old}}return dp.at(-1)}
function score(raw,label){const rt=parseTiers(raw),lt=parseTiers(label);if(rt.length&&JSON.stringify(rt)===JSON.stringify(lt))return 10;const rp=pctSig(raw),lp=pctSig(label),rq=quantitySig(raw),lq=quantitySig(label),ps=lcs(rp,lp)/Math.max(1,rp.length,lp.length)-.25*Math.abs(rp.length-lp.length),qs=lcs(rq,lq)/Math.max(1,rq.length,lq.length)-.18*Math.abs(rq.length-lq.length);return .62*ps+.33*qs+.05*(rt.length===lt.length?1:0)}
function best(raw){return [...templates].sort((a,b)=>score(raw,b)-score(raw,a))[0]}
function autoValid(raw,label,confidence=90,margin=.2){const exact=parseTiers(raw).length&&JSON.stringify(parseTiers(raw))===JSON.stringify(parseTiers(label));const complete=JSON.stringify(pctSig(raw))===JSON.stringify(pctSig(label));const strong=score(raw,label)>=.90&&margin>=.08&&confidence>=72;return !!(complete&&(exact||strong))}
function parseBadgePercent(raw){const nums=String(raw||'').match(/\d{1,4}/g)||[];if(!nums.length)return null;const n=nums[0],cand=[];for(let i=0;i<n.length;i++)for(let j=i+1;j<=Math.min(n.length,i+2);j++){const v=Number(n.slice(i,j));if(allowed.has(v))cand.push({len:j-i,pos:i,v})}cand.sort((a,b)=>b.len-a.len||a.pos-b.pos);return cand[0]?.v??null}
function badgePick(pct,topRaw){const same=templates.filter(t=>pctSig(t).at(-1)===pct),top=[...topRaw.matchAll(/\d+/g)].map(m=>Number(m[0]));if(!top.length){const s=`ลด ${pct}%`;return templates.includes(s)?s:''}const sc=t=>{const q=quantitySig(t),tiers=parseTiers(t);let n=0;if(topRaw.includes('-')&&tiers[0]?.[0]==='range')n+=3;n+=2*lcs(top,q)/Math.max(1,top.length,q.length)-.2*Math.abs(top.length-q.length);if(pctSig(t).length===1)n++;return n};return same.sort((a,b)=>sc(b)-sc(a))[0]||''}
function tierSame(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function orderedTierSubset(observed,full){let i=0;for(const tier of full)if(i<observed.length&&tierSame(observed[i],tier))i++;return i===observed.length}
function promoPairSig(s){return[...cleanOcr(s).matchAll(/(\d{1,3})\s*(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)/g)].map(m=>[Number(m[1]),m[2]])}
function completePartialTemplate(raws,lineCount){const cleaned=raws.map(cleanOcr).filter(Boolean),observed=[];for(const raw of cleaned)for(const tier of parseTiers(raw))if(tier[0]!=='simple'&&!observed.some(x=>tierSame(x,tier)))observed.push(tier);if(!observed.length)return null;const observedPairs=observed.map(t=>[t[1],t[2]]),hints=[];for(const raw of cleaned)for(const pair of promoPairSig(raw))if(!hints.some(x=>tierSame(x,pair)))hints.push(pair);const missingHints=hints.filter(h=>!observedPairs.some(x=>tierSame(x,h)));if(!missingHints.length)return null;const candidates=templates.filter(label=>{const tiers=parseTiers(label);if(!tiers.length||tiers.length<=observed.length)return false;if(lineCount&&tiers.length!==lineCount)return false;if(!orderedTierSubset(observed,tiers))return false;const pairs=promoPairSig(label);return missingHints.some(h=>pairs.some(p=>tierSame(p,h)))});return candidates.length===1?candidates[0]:null}

assert.deepEqual(parseTiers('2 Bu aA 8% ๒ 4 BU aA 11%'),[['discount',2,'ชิ้น',8],['discount',4,'ชิ้น',11]]);
assert.equal(best('6 ขวด ล ด 10% 12 UOA aA 17% 1 a0 aA 20%'),'6 ขวด ลด 10%; 12 ขวด ลด 17%; 1 ลัง ลด 20%');
assert.equal(best('12 UDA aA 12% 1 av aA 17%'),'12 ขวด ลด 12%; 1 ลัง ลด 17%');
assert.equal(best('60 GU aA 15% 120 GU aA 18%'),'60 ชิ้น ลด 15%; 120 ชิ้น ลด 18%');
assert.equal(best('2 UIA aA 8% 6 ขวด ฟรี 1 ขวด (14%) 10 von ฟรี 2 ขวด (17%)'),'2 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%); 10 ขวด ฟรี 2 ขวด (17%)');
assert.equal(best('6 ขวด ลด 10% 12 ขวด ลด 17% 1 av ลด 20%'),'6 ขวด ลด 10%; 12 ขวด ลด 17%; 1 ลัง ลด 20%');
assert.equal(cleanOcr('6 ขวด ลด 10° 24 ขวด ลด 14'),'6 ขวด ลด 10% 24 ขวด ลด 14%');
assert.equal(autoValid('2 ขวด ลด 8% 6 ขวด ฟรี 1 ขวด (14%) 10 von ฟรี 2 ขวด (17%)','2 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%)'),false);
assert.equal(parseBadgePercent('112%'),12);
assert.equal(parseBadgePercent('271%'),27);
assert.equal(parseBadgePercent('24%'),24);
assert.equal(badgePick(24,'1-2-'),'1-2 ชิ้น ลด 24%');
assert.equal(badgePick(25,'12'),'12 ชิ้น ลด 25%');
assert.equal(badgePick(25,''),'ลด 25%');
assert.equal(completePartialTemplate(['เพ 4: 1 ลัง ลด 17%','เมื่อซื้อ 12 ขวด'],2),'12 ขวด ลด 12%; 1 ลัง ลด 17%');
assert.equal(completePartialTemplate(['1 ลัง ลด 17%','เมื่อซื้อ 12 ขวด'],3),'12 ขวด ลด 12%; 1 ลัง ลด 17%; 3 ลัง ลด 25%');
assert.equal(completePartialTemplate(['1 ลัง ลด 17%','เมื่อซื้อ 3 กล่อง'],2),null);
assert.equal(completePartialTemplate(['1 ลัง ลด 17%','เมื่อซื้อ 6 กล่อง'],2),'6 กล่อง ลด 15%; 1 ลัง ลด 17%');

async function retryResumeMock(){const batches=Array.from({length:22},(_,i)=>i),failOnce=new Set([3,11]),attempts=new Map(),completed=new Set();async function run(batch){const n=(attempts.get(batch)||0)+1;attempts.set(batch,n);if(failOnce.has(batch)&&n===1)throw Error('planned');completed.add(batch)}let pending=[...batches];for(let round=0;round<3&&pending.length;round++){const next=[];for(let i=0;i<pending.length;i+=2){const pair=pending.slice(i,i+2),results=await Promise.allSettled(pair.map(run));results.forEach((r,j)=>{if(r.status==='rejected')next.push(pair[j])})}pending=next}assert.equal(completed.size,22);assert.deepEqual(pending,[]);assert.equal(attempts.get(3),2);assert.equal(attempts.get(11),2);for(const batch of batches)if(batch!==3&&batch!==11)assert.equal(attempts.get(batch),1);return[...attempts.values()].reduce((a,b)=>a+b,0)}
assert.equal(await retryResumeMock(),24);
console.log(JSON.stringify({ok:true,parserBadgeAndCompletionCases:18,retryRequests:24},null,2));
