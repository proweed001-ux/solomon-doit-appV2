import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const browserPaths = (process.argv[2] || 'dist/assets/promo-pdf-upload-v2-v3-6a.js,dist/assets/promo-pdf-upload-v2-v3-6b.js,dist/assets/promo-pdf-upload-v2-v3-6c.js,dist/assets/promo-pdf-upload-v2-v3-6d.js').split(',');
const htmlPath = process.argv[3] || 'dist/promo-pdf-upload-v2.html';
const backendPath = process.argv[4] || 'supabase/functions/promo-latest-upload-preview/promo-latest-core.ts';
const browser = browserPaths.map(p=>fs.readFileSync(p, 'utf8')).join('\n');
const html = fs.readFileSync(htmlPath, 'utf8');
const backend = fs.readFileSync(backendPath, 'utf8') + fs.readFileSync('supabase/functions/promo-latest-upload-preview/promo-latest-upload.ts','utf8');

function cleanOcr(raw) {
  return String(raw || '').replace(/[๐-๙]/g, d => ({'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'}[d] || d))
    .replace(/(?:ขว[คดล]|ฆวด|ขว๓|ยขวด)/g,'ขวด').replace(/(?:๒อง|หซอง)/g,'ซอง')
    .replace(/\s+/g, ' ').trim();
}
function parseTiers(raw) {
  const s = cleanOcr(raw), unit='(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง|ชุด)', hits=[];
  for (const m of s.matchAll(new RegExp('(?:ซื้อ\\s*)?(\\d{1,3})\\s*'+unit+'.{0,12}?ฟรี\\s*(\\d{1,3})\\s*(?:'+unit+')?\\s*(?:\\((\\d{1,2})\\s*%\\))?','g'))) hits.push(['free',Number(m[1]),m[2],Number(m[3]),m[4]||m[2],m[5]?Number(m[5]):null]);
  for (const m of s.matchAll(new RegExp('(\\d{1,3})\\s*-\\s*(\\d{1,3})\\s*'+unit+'.{0,8}?ลด\\s*(\\d{1,2})\\s*%','g'))) hits.push(['range',Number(m[1]),Number(m[2]),m[3],Number(m[4])]);
  for (const m of s.matchAll(new RegExp('(\\d{1,3})\\s*'+unit+'.{0,8}?ลด\\s*(\\d{1,2})\\s*%','g'))) hits.push(['discount',Number(m[1]),m[2],Number(m[3])]);
  if (!hits.length) { const p=[...s.matchAll(/(\d{1,2})\s*%/g)].map(m=>Number(m[1])); if(p.length===1) hits.push(['simple',p[0]]); }
  return hits.filter((x,i,a)=>a.findIndex(y=>JSON.stringify(x)===JSON.stringify(y))===i);
}
function pctSig(s) { return [...cleanOcr(s).matchAll(/(\d{1,2})\s*%/g)].map(m=>Number(m[1])); }

const context = {
  window: {}, console,
  thaiDigits:{'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'},
  parseTiers, pctSig, cleanOcr,
  PAGES:{}, FUNCTION_TEMPLATES:[],
  load:null, stableGridBoxes:null, recognizeBadge:null, recognizeGeneral:null, recognize:null, renderPreview:null, reportObject:null, detect:null, resumeKey:null, postBatch:null, upload:null,
};
vm.createContext(context);
for (const p of browserPaths) vm.runInContext(fs.readFileSync(p,'utf8'), context, {filename:p});
const api = context.window.PromoV3Safety;
assert(api, 'PromoV3Safety export missing');

const valid = api.parseMetadataText({title_raw:'แพนทีน แชมพู ทุกสูตร ขนาด 70 มล.', normal_raw:'ปกติ 33/ชุด', average_raw:'เฉลี่ย 16.6/ขวด'}, 'ลด 8%');
assert.equal(valid.promoTitle, 'แพนทีน แชมพู');
assert.equal(valid.baseUnitPrice, 16.6);
assert.equal(valid.unitLabel, 'ขวด');
assert.equal(valid.buyQty, 2);
assert.equal(valid.priceValid, true);
assert.equal(valid.titleValid, true);
const vatLike = api.parseMetadataText({title_raw:'เฮดแอนด์โชว์เดอร์ แชมพู', normal_raw:'42/ชุด', average_raw:'20.09/ขวด'}, '2 ขวด ลด 8%');
assert.equal(vatLike.priceValid, true);
const typoUnit = api.parseMetadataText({title_raw:'สินค้า ทดสอบ', normal_raw:'33/ชุด', average_raw:'16.6/ขวค'}, 'ลด 8%');
assert.equal(typoUnit.unitLabel, 'ขวด');
assert.equal(typoUnit.priceValid, true);
const rangeFallback = api.parseMetadataText({title_raw:'สินค้า ทดสอบ', normal_raw:'20/ชุด', average_raw:'10'}, '1-2 ขวด ลด 8%');
assert.equal(rangeFallback.unitLabel, 'ขวด');
assert.equal(rangeFallback.priceValid, true);
const badMath = api.parseMetadataText({title_raw:'สินค้า ทดสอบ', normal_raw:'33/ชุด', average_raw:'15/ขวด'}, 'ลด 8%');
assert.equal(badMath.priceValid, false);
const noTitle = api.parseMetadataText({title_raw:'', normal_raw:'33/ชุด', average_raw:'16.5/ขวด'}, 'ลด 8%');
assert.equal(noTitle.titleValid, false);

assert.equal(api.exactTierEvidence('3 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%)','3 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%)',2), true);
assert.equal(api.exactTierEvidence('6 ขวด ฟรี 1 ขวด (14%)','3 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%)',2), false);
assert.equal(api.exactTierEvidence('ลด 87%','ลด 87%',1), false);
const previousFalseAutos = [
  ['6 ขวด ฟรี 1 ขวด (14%)','3 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%)',2],
  ['6 ชิ้น ฟรี 1 ชิ้น (14%)','3 ชิ้น ลด 8%; 6 ชิ้น ฟรี 1 ชิ้น (14%)',2],
  ['1 ลัง ฟรี 3 แพ็ค (14%)','1 แพ็ค ลด 10%; 1 ลัง ฟรี 3 แพ็ค (14%)',2],
  ['1 ลัง ฟรี 8 ชิ้น (14%)','6 ชิ้น ลด 12%; 1 ลัง ฟรี 8 ชิ้น (14%)',2],
  ['ลด 87%','ลด 8%',1],
  ['1 กล่อง ลด 15%; 5 กล่อง ฟรี 1 กล่อง (17%); 5 กล่อง ฟรี 1 กล่อง (17%)','1 กล่อง ลด 15%; 5 กล่อง ฟรี 1 กล่อง (17%)',2],
  ['1 แพ็ค ลด 10%','1 แพ็ค ลด 10%; 1 ลัง ฟรี 3 แพ็ค (14%)',2],
  ['ลด 30%','ลด 20%',1],
  ['ลด 7%','ลด 30%',1],
  ['ลด 27%','ลด 12%',1],
  ['ลด 5%','ลด 15%',1],
  ['12 ถุง ลด 15%','6 ถุง ลด 12%; 12 ถุง ลด 15%',2],
];
for (const [raw,label,lines] of previousFalseAutos) assert.equal(api.exactTierEvidence(raw,label,lines), false, `${raw} must be rejected`);

assert.match(browser, /sig!==['"]%PDF-['"]/);
assert.match(browser, /for\(let n=Math\.max\(3,actual\);n<=8;n\+\+\)/);
assert.match(browser, /rowCell:ci\+1/);
assert.match(browser, /price_status/);
assert.match(browser, /title_status/);
assert.doesNotMatch(browser, /items\.length!==212|completed\.size!==212/);
assert.match(html, /id="sExpected"/);
for (const suffix of ['6a','6b','6c','6d']) assert.match(html, new RegExp(`promo-pdf-upload-v2-v3-${suffix}\\.js`));
assert.doesNotMatch(html, /ต้องครบ<b>212<\/b>/);
assert.match(backend, /const expected = Number\(body\.expected_cards\)/);
assert.match(backend, /base_unit_price: item\.baseUnitPrice/);
assert.match(backend, /unit_label: item\.unitLabel/);
assert.match(backend, /status: "ready"/);
assert.match(backend, /invalidCards/);
assert.doesNotMatch(backend, /EXPECTED_CARDS/);

console.log('PASS dynamic grid + price/title + promo safety regression');
