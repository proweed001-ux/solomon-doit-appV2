import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

function decodeXmlAttr(value) {
  return String(value || '').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function getXmlAttr(attrs, name) {
  const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return m ? decodeXmlAttr(m[1]) : '';
}
function normKey(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '').replace(/[_\-./()]/g, '').trim();
}
function safeNum(v) {
  const n = Number(String(v ?? '').replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
}
function safeQty(v) {
  const n = safeNum(v);
  return n > 0 ? Math.round(n) : 0;
}
function money(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/check-doit.mjs <file.xlsx>');
const abs = path.resolve(process.cwd(), input);
const buf = fs.readFileSync(abs);
const zip = await JSZip.loadAsync(buf);
const defName = Object.keys(zip.files).find(name => name.startsWith('xl/pivotCache/pivotCacheDefinition') && name.endsWith('.xml'));
if (!defName) throw new Error('No pivot cache definition found');
const recName = defName.replace('pivotCacheDefinition', 'pivotCacheRecords');
const defXml = await zip.file(defName).async('string');
const recXml = await zip.file(recName).async('string');

const fieldNames = [];
const sharedItems = [];
const fieldRegex = /<cacheField\b([^>]*)>([\s\S]*?)<\/cacheField>/g;
let fm;
while ((fm = fieldRegex.exec(defXml))) {
  fieldNames.push(getXmlAttr(fm[1], 'name'));
  const vals = [];
  const sm = fm[2].match(/<sharedItems\b[^>]*>([\s\S]*?)<\/sharedItems>/);
  if (sm) {
    const ir = /<(s|n|d|b|e|m)\b([^>]*)\/>/g;
    let im;
    while ((im = ir.exec(sm[1]))) vals.push(im[1] === 'm' ? '' : getXmlAttr(im[2], 'v'));
  }
  sharedItems.push(vals);
}
const indexOf = aliases => {
  const normalized = fieldNames.map(normKey);
  for (const a of aliases) {
    const n = normKey(a);
    const idx = normalized.findIndex(f => f === n);
    if (idx >= 0) return idx;
  }
  return -1;
};
const idx = {
  store: indexOf(['ShipName', 'c_Name']),
  person: indexOf(['Salesperson_Name']),
  personId: indexOf(['SalespersonID', 'SO_SalespersonID']),
  area: indexOf(['Area']),
  sku: indexOf(['SKU_Code']),
  qty: indexOf(['ShipQtyPCS']),
  amount: indexOf(['TotInvc']),
  type: indexOf(['SOTypeID']),
  invoice: indexOf(['InvcNbr']),
  cancelled: indexOf(['Cancelled']),
};
for (const [k, v] of Object.entries(idx)) {
  if (v < 0 && !['cancelled','area','person','personId','invoice'].includes(k)) throw new Error(`Missing field: ${k}`);
}
const wanted = new Set(Object.values(idx).filter(v => v >= 0));
let rows = 0, qty = 0, amount = 0;
const stores = new Set(), people = new Set(), skus = new Set(), invoices = new Set(), types = new Set();
const recordRegex = /<r>([\s\S]*?)<\/r>/g;
let rm;
while ((rm = recordRegex.exec(recXml))) {
  const values = {};
  const cellRegex = /<(x|n|s|d|b|e|m)\b([^>]*)\/>/g;
  let cm, col = 0;
  while ((cm = cellRegex.exec(rm[1]))) {
    if (wanted.has(col)) {
      const tag = cm[1], attrs = cm[2] || '', raw = getXmlAttr(attrs, 'v');
      values[col] = tag === 'x' ? (sharedItems[col]?.[Number(raw)] ?? '') : (tag === 'm' ? '' : raw);
    }
    col += 1;
  }
  const cancel = String(values[idx.cancelled] ?? '').toLowerCase();
  if (cancel && cancel !== '0' && cancel !== 'false') continue;
  const q = safeQty(values[idx.qty]);
  const a = safeNum(values[idx.amount]);
  if (q <= 0 || a <= 0) continue;
  rows += 1; qty += q; amount += a;
  stores.add(values[idx.store] || 'ไม่ระบุร้าน');
  people.add(values[idx.person] || values[idx.personId] || 'ไม่ระบุบุคคล');
  skus.add(values[idx.sku] || 'ไม่ระบุสินค้า');
  if (idx.invoice >= 0 && values[idx.invoice]) invoices.add(values[idx.invoice]);
  if (values[idx.type]) types.add(values[idx.type]);
}
const result = {
  rows,
  qty,
  amount: money(amount),
  stores: stores.size,
  people: people.size,
  skus: skus.size,
  invoices: invoices.size,
  types: [...types].sort(),
  amountSource: 'TotInvc',
};
console.log(JSON.stringify(result, null, 2));
if (rows < 1000 || qty <= 0 || amount <= 0 || stores.size <= 0) throw new Error('DOIT parse check failed');
