import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const snapshotPath='dist/assets/promo-product-master-snapshot-v1.js';
const overlayPath='dist/assets/promo-pdf-upload-v2-v3-6f.js';
const htmlPath='dist/promo-pdf-upload-v2.html';
const livePath='dist/promo-live.html';
const corePath='supabase/functions/promo-latest-upload-preview/promo-latest-core.ts';
const uploadPath='supabase/functions/promo-latest-upload-preview/promo-latest-upload.ts';
const masterSyncPath='supabase/functions/promo-latest-upload-preview/promo-product-master-sync.ts';

const context={
  window:{PromoDynamicV1:{recognizeMetadata:async()=>({})}},
  console,
  crypto:webcrypto,
  TextEncoder,
  navigator:{userAgent:'test',deviceMemory:8},
  thaiDigits:{'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'},
  detect:async()=>({timing_ms:{},class_counts:{}}),
  reportObject:()=>({cards:[]}),
  renderPreview:()=>{},
  postBatch:async()=>({}),
  items:[],
  crops:{children:[],textContent:'',lastElementChild:null},
  setSum:()=>{},
  st:()=>{},
  log:()=>{},
  requestJson:async()=>({}),
  sourceFile:null,
  performance:{now:()=>0},
  $:()=>({value:'auto',disabled:false}),
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(snapshotPath,'utf8'),context,{filename:snapshotPath});
vm.runInContext(fs.readFileSync(overlayPath,'utf8'),context,{filename:overlayPath});
const api=context.window.PromoV3MasterSafety;
assert(api,'PromoV3MasterSafety export missing');

const snapshot=context.window.PROMO_PRODUCT_MASTER_SNAPSHOT;
assert(snapshot.products.length>=32,'product master snapshot is incomplete');
assert.equal(new Set(snapshot.products.map(x=>x.id)).size,snapshot.products.length,'duplicate product master id');
for(const p of snapshot.products){assert.match(p.id,/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);assert(p.name.length>=3);assert(p.unit)}

assert.equal(api.normalizeTitle('แพนทีน แชมพู ทุกสูตร ขนาด 70 มล.'),'panteneแชมพู70ml');
let match=api.masterMatch(['แพนทีน แชมพู 70 มล.','แพนทีน แชมพู ทุกสูตร 70 มล.'],'ขวด');
assert(api.knownMatchValid(match));
assert.match(match.master.name,/แพนทีน แชมพู.*70/);
match=api.masterMatch(['โอเลย์ โททัลไวท์ ซอง มีฝา'],'ซอง');
assert(api.knownMatchValid(match));
assert.match(match.master.name,/มีฝา$/);
match=api.masterMatch(['โอเลย์ โททัลไวท์ ซอง ไม่มีฝา'],'ซอง');
assert(api.knownMatchValid(match));
assert.match(match.master.name,/ไม่มีฝา$/);
match=api.masterMatch(['วิคส์ VapoRub 25 กรัม'],'ชิ้น');
assert(api.knownMatchValid(match));
assert.match(match.master.name,/25 กรัม/);
match=api.masterMatch(['ยิลเลตต์ Super Thin ใบมีด'],'ชิ้น');
assert(api.knownMatchValid(match));
assert.match(match.master.name,/ใบมีด/);

const consensus=api.titleConsensus({promoTitle:'ผลิตภัณฑ์ใหม่ สูตรเอ ขนาด 100 มล.',titleOcr:{raw:'ผลิตภัณฑ์ใหม่ สูตรเอ 100 มล.'},titleConfidence:88});
assert.equal(consensus.ok,true);
const weakConsensus=api.titleConsensus({promoTitle:'ผลิตภัณฑ์ใหม่ 100 มล.',titleOcr:{raw:'สินค้าอื่น 200 มล.'},titleConfidence:88});
assert.equal(weakConsensus.ok,false);
const id1=await api.deterministicUuid('ผลิตภัณฑ์ใหม่100ml'),id2=await api.deterministicUuid('ผลิตภัณฑ์ใหม่100ml');
assert.equal(id1,id2);assert.match(id1,/^[0-9a-f-]{36}$/);
assert.equal(api.hamming('0000000000000000','0000000000000000'),0);
assert.equal(api.hamming('0000000000000000','0000000000000001'),1);
assert.equal(api.closePrice(16.60,16.65),true);
assert.equal(api.closePrice(16.60,17.50),false);

const html=fs.readFileSync(htmlPath,'utf8'),live=fs.readFileSync(livePath,'utf8'),core=fs.readFileSync(corePath,'utf8'),upload=fs.readFileSync(uploadPath,'utf8'),masterSync=fs.readFileSync(masterSyncPath,'utf8');
assert.match(html,/promo-product-master-snapshot-v1\.js/);
assert.match(html,/promo-pdf-upload-v2-v3-6f\.js/);
assert.match(core,/published_month_locked/);
assert.match(core,/finalize_month_not_draft/);
assert.match(core,/promo_card_product_groups/);
assert.match(core,/promo_group_prices/);
assert.match(core,/promo_product_groups/);
assert.match(core,/links_without_group_or_price/);
assert.match(core,/"ด้าม"/);
assert.match(upload,/resolveProductMasters/);
assert.match(upload,/master_status/);
assert.match(upload,/master_is_new/);
assert.match(upload,/promo_card_product_groups/);
assert.match(upload,/promo_group_prices/);
assert.match(masterSync,/novel_master_evidence_too_weak/);
assert.match(masterSync,/novel_master_identity_mismatch/);
assert.match(masterSync,/promo_product_master_aliases/);
assert.doesNotMatch(live,/if\(!rows\.length\)rows=await api\('promo_months\?select=/,'live page must never fall back to a draft month');

console.log('PASS product master + grouped price + strict publish safety');
