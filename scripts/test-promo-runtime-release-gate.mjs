import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const strict=read('dist/assets/promo-pdf-upload-v2-v3-6g.js');
const runtime=read('dist/assets/promo-pdf-upload-v2-v3-6h.js');
const html=read('dist/promo-pdf-upload-v2.html');
new Function(strict);new Function(runtime);
assert(html.indexOf('v3-6f.js')<html.indexOf('v3-6g.js'));
assert(html.indexOf('v3-6g.js')<html.indexOf('v3-6h.js'));
assert(html.indexOf('v3-6h.js')<html.indexOf('v3-5b.js'));
assert.match(strict,/group\.length>=2/);
assert.match(strict,/strict_known_mismatch/);
assert.match(strict,/group_price_conflict/);
assert.match(runtime,/source_fingerprint/);
assert.match(runtime,/Release Gate/);
assert.match(runtime,/master_status/);
assert.match(runtime,/price_group_conflict/);
assert.match(runtime,/memory_samples/);
assert.match(runtime,/OCR Worker มีปัญหา/);

const node=()=>({value:'',disabled:false,textContent:'',style:{},appendChild(){},insertAdjacentElement(){}});
const nodes=new Map();
const context={
  window:{PROMO_PRODUCT_MASTER_SNAPSHOT:{products:[{id:'11111111-1111-4111-8111-111111111111',name:'แพนทีน แชมพู 70 มล.',unit:'ขวด'}]},PromoV3MasterSafety:{normalizeTitle:v=>String(v||'').toLowerCase().replace(/\s+/g,''),similarity:(a,b)=>a===b?1:0,hamming:()=>0,closePrice:(a,b)=>Math.abs(Number(a)-Number(b))<.1},PromoDynamicV1:{}},
  document:{createElement:()=>node(),querySelector:()=>node()},
  navigator:{userAgent:'Android test',deviceMemory:4,hardwareConcurrency:8,wakeLock:null},
  performance:{now:()=>100,memory:{usedJSHeapSize:10,totalJSHeapSize:20,jsHeapSizeLimit:30}},
  crypto:webcrypto,TextEncoder,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},
  setInterval:()=>1,clearInterval(){},setTimeout,alert(){},
  detect:async()=>({}),upload:async()=>({}),reportObject:(t,c)=>({timing_ms:t,class_counts:c,cards:[],total:0,need_review:0,auto_ok:0}),renderPreview(){},setSum(){},st(){},log(){},
  items:[],crops:{textContent:'',children:[]},ocrWorkers:[],sourceFile:null,lastReport:null,
  $:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)}
};
context.window.window=context.window;
vm.createContext(context);
vm.runInContext(strict,context,{filename:'6g.js'});
context.items=[{unitLabel:'ขวด',metadata:{masterValid:true,masterIsNew:false,masterProductId:'11111111-1111-4111-8111-111111111111',titleEvidence:['สินค้าอื่น 100 มล.']},ocr:{valid:true},pass:true}];
assert.equal(context.window.PromoStrictCrossCardGate.strictKnown(),1);
assert.equal(context.items[0].uploadable,false);

vm.runInContext(runtime,context,{filename:'6h.js'});
const goodCard={card_id:'SEP25-HFSS-001',grid_pass:true,detection_status:'auto_ok',detected_function_label:'ลด 10%',promo_title:'แพนทีน แชมพู 70 มล.',base_unit_price:16.6,unit_label:'ขวด',price_status:'auto_ok',title_status:'auto_ok',master_status:'auto_ok',master_product_id:'11111111-1111-4111-8111-111111111111',master_provisional:false,price_group_conflict:false};
context.items=[{}];
let gate=context.window.PromoRuntimeGate.gate({cards:[goodCard],total:1,auto_ok:1,need_review:0,class_counts:{HFSS:1}});
assert.equal(gate.pass,true);
gate=context.window.PromoRuntimeGate.gate({cards:[{...goodCard,base_unit_price:0}],total:1,auto_ok:1,need_review:0,class_counts:{HFSS:1}});
assert.equal(gate.pass,false);
assert(gate.errors.some(x=>x.includes(':price')));
console.log('PASS strict Product Master, runtime recovery and objective release gate');