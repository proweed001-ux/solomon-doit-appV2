import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../dist/assets/promo-packing-master.js';

const P=globalThis.PromoPacking;
assert.ok(P);

const olay=P.resolveRule({promo_title:'โอเลย์ โททัลเอฟเฟ็คส์ ซอง'});
assert.equal(olay.rule_id,'OLAY_SACHET');
assert.equal(P.convert(1,'ลัง','กล่อง',olay),24);
assert.equal(P.convert(1,'ลัง','ชิ้น',olay),144);
assert.equal(P.convert(3,'กล่อง','ชิ้น',olay),18);

const shampooSmall=P.resolveRule({promo_title:'แพนทีน แชมพู 65 ml'});
assert.equal(shampooSmall.rule_id,'SHAMPOO_CONDITIONER_60_70');
assert.equal(P.convert(1,'ลัง','ขวด',shampooSmall),48);

const shampooMedium=P.resolveRule({promo_title:'รีจอยส์ ครีมนวด 120ML'});
assert.equal(shampooMedium.rule_id,'SHAMPOO_CONDITIONER_105_140');
assert.equal(P.convert(1,'ลัง','ขวด',shampooMedium),24);

const softener20=P.resolveRule({promo_title:'ดาวน์นี่ ปรับผ้านุ่ม 20 มล.'});
assert.equal(softener20.rule_id,'FABRIC_SOFTENER_20');
assert.equal(P.convert(1,'แพ็ค','ซอง',softener20),24);
assert.equal(P.convert(1,'ลัง','แพ็ค',softener20),20);
assert.equal(P.convert(1,'ลัง','ซอง',softener20),480);

const softener100=P.resolveRule({promo_title:'ดาวน์นี่ 100มล'});
assert.equal(softener100.rule_id,'FABRIC_SOFTENER_100');
assert.equal(P.convert(1,'ลัง','ถุง',softener100),60);

assert.equal(P.resolveRule({promo_title:'แชมพู 90 มล.'}),null);
assert.equal(P.resolveRule({promo_title:'สินค้าไม่ทราบขนาด'}),null);
assert.equal(P.convert(1,'ลัง','ขวด',null),null);

const html=fs.readFileSync(new URL('../dist/promo-live.html',import.meta.url),'utf8');
assert.match(html,/promo-packing-master\.js\?v=20260713-2/);
assert.match(html,/function normalizedTier/);
assert.match(html,/ยอดสุทธิหลังโปร/);
const inlineScripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
for(const code of inlineScripts)new Function(code);

console.log(JSON.stringify({ok:true,rules:Object.keys(P.RULES).length,cases:16,livePageSyntax:true},null,2));
