import assert from 'node:assert/strict';

const dates = 'เดือน 23 ก.ค. 22 ก.ค. 8 ก.ค. 3 ก.ค. 25 มิ.ย. 24 มิ.ย. 19 มิ.ย.';
const rows = [
  [45.68,36.69,36.32,31.69,null,50.05,36.69,31.69,null,16.66],
  [44.78,35.79,35.42,30.79,null,50.05,35.79,30.79,null,16.66],
  [43.93,34.94,34.57,29.94,null,50.05,34.94,29.94,null,16.66],
  [46.44,37.45,37.08,32.45,null,50.05,37.50,32.50,null,16.66],
  [47.64,38.05,37.68,33.05,null,50.05,37.50,32.50,null,16.66],
  [48.44,38.85,38.48,33.85,null,50.05,37.50,32.50,null,16.66],
  [48.44,38.85,38.48,33.85,null,50.05,37.50,32.50,null,16.66],
];
const priceCells = rows
  .flat()
  .map(value => `<span>${value == null ? '-' : value.toFixed(2)}</span>`)
  .join('');
const html = `
  <html><body>
    <p>ราคาน้ำมันย้อนหลังประจำปี 2569</p>
    <div>${dates}</div>
    <span>เบนซิน</span><span>95 แก๊สโซฮอล์</span><span>91</span>
    <span>E20</span><span>E85</span><span>ดีเซล</span><span>NGV</span>
    ${priceCells}
  </body></html>
`;

const originalFetch = globalThis.fetch;
globalThis.fetch = async () => ({
  status: 200,
  text: async () => html,
});

try {
  const { default: handler } = await import(`../api/fuel-price.js?test=${Date.now()}`);
  const makeResponse = () => {
    const result = { statusCode: 0, payload: undefined };
    result.response = {
      setHeader() {},
      status(code) {
        result.statusCode = code;
        return this;
      },
      json(value) {
        result.payload = value;
        return value;
      },
    };
    return result;
  };

  const live = makeResponse();
  await handler({ query: { year: '2026', month: '7', debug: '1' } }, live.response);
  const { statusCode, payload } = live;

  assert.equal(statusCode, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.source, 'ราคาน้ำมันย้อนหลัง.com');
  assert.equal(payload.liveRecords, 7);
  assert.equal(payload.debug.diagnostics.parseMode, 'flat-cells');
  assert.equal(payload.daily[0].price, 38.05);
  assert.equal(payload.daily[0].sourceIso, '2026-06-25');
  assert.equal(payload.daily[2].price, 37.45);
  assert.equal(payload.daily[7].price, 34.94);
  assert.equal(payload.daily[21].price, 35.79);
  assert.equal(payload.daily[22].price, 36.69);
  assert.equal(payload.daily[30].price, 36.69);

  globalThis.fetch = async () => {
    throw new Error('upstream unavailable');
  };
  const fallback = makeResponse();
  await handler({ query: { year: '2026', month: '7' } }, fallback.response);
  assert.equal(fallback.statusCode, 200);
  assert.equal(fallback.payload.source, 'ราคาน้ำมันย้อนหลัง.com fallback snapshot');
  assert.equal(fallback.payload.daily[22].price, 36.69);
  assert.equal(fallback.payload.daily[22].sourceIso, '2026-07-23');

  console.log('Fuel live parser handles split price cells and July effective dates');
  console.log('Fuel fallback snapshot is current through 23 July 2026');
} finally {
  globalThis.fetch = originalFetch;
}
