const MONTHS = {
  'ม.ค.': 1, 'มค': 1, 'มกราคม': 1,
  'ก.พ.': 2, 'กพ': 2, 'กุมภาพันธ์': 2,
  'มี.ค.': 3, 'มีค': 3, 'มีนาคม': 3,
  'เม.ย.': 4, 'เมย': 4, 'เมษายน': 4,
  'พ.ค.': 5, 'พค': 5, 'พฤษภาคม': 5,
  'มิ.ย.': 6, 'มิย': 6, 'มิถุนายน': 6,
  'ก.ค.': 7, 'กค': 7, 'กรกฎาคม': 7,
  'ส.ค.': 8, 'สค': 8, 'สิงหาคม': 8,
  'ก.ย.': 9, 'กย': 9, 'กันยายน': 9,
  'ต.ค.': 10, 'ตค': 10, 'ตุลาคม': 10,
  'พ.ย.': 11, 'พย': 11, 'พฤศจิกายน': 11,
  'ธ.ค.': 12, 'ธค': 12, 'ธันวาคม': 12,
};

function decodeHtml(text) {
  return String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function toLines(html) {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(tr|td|th|li|p|div|h\d|span)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .split(/\n+/)
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function normMonth(raw) {
  const compact = String(raw || '').replace(/\s+/g, '').replace(/\./g, '');
  return MONTHS[raw] || MONTHS[compact] || null;
}

function parseDates(lines, requestYear) {
  let currentThaiYear = requestYear + 543;
  const dates = [];
  const monthPattern = '(ม\\.?\\s*ค\\.?|ก\\.?\\s*พ\\.?|มี\\.?\\s*ค\\.?|เม\\.?\\s*ย\\.?|พ\\.?\\s*ค\\.?|มิ\\.?\\s*ย\\.?|ก\\.?\\s*ค\\.?|ส\\.?\\s*ค\\.?|ก\\.?\\s*ย\\.?|ต\\.?\\s*ค\\.?|พ\\.?\\s*ย\\.?|ธ\\.?\\s*ค\\.?|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)';
  const re = new RegExp(`(25\\d{2})|(\\d{1,2})\\s*${monthPattern}`, 'g');

  for (const line of lines) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line))) {
      if (m[1]) {
        currentThaiYear = Number(m[1]);
        continue;
      }
      const day = Number(m[2]);
      const monthText = m[3];
      const month = normMonth(monthText);
      if (!day || !month) continue;
      const year = currentThaiYear - 543;
      dates.push({
        day,
        month,
        year,
        dateText: `${day} ${monthText.replace(/\s+/g, '')} ${currentThaiYear}`,
        iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        ts: Date.UTC(year, month - 1, day),
      });
    }
  }
  return dates;
}

function parsePriceRows(lines) {
  const rows = [];
  for (const line of lines) {
    const nums = [...line.matchAll(/\d{1,3}\.\d{2}/g)].map(m => Number(m[0]));
    if (nums.length >= 5) rows.push(nums);
  }
  return rows;
}

function parseGasohol95Records(html, requestYear) {
  const lines = toLines(html);
  const firstPriceLine = lines.findIndex(line => (line.match(/\d{1,3}\.\d{2}/g) || []).length >= 5);
  if (firstPriceLine < 0) return [];

  const dates = parseDates(lines.slice(0, firstPriceLine), requestYear);
  const priceRows = parsePriceRows(lines.slice(firstPriceLine));
  const records = [];
  const count = Math.min(dates.length, priceRows.length);

  for (let i = 0; i < count; i += 1) {
    const price = priceRows[i][1];
    if (!Number.isFinite(price)) continue;
    records.push({ ...dates[i], gasohol95: price, values: priceRows[i] });
  }

  records.sort((a, b) => b.ts - a.ts);
  return records;
}

export default async function handler(req, res) {
  try {
    const year = Number(req.query.year || new Date().getFullYear());
    const month = Number(req.query.month || (new Date().getMonth() + 1));
    if (!Number.isFinite(year) || year < 2017 || year > 2100) {
      return res.status(400).json({ ok: false, error: 'invalid_year' });
    }
    if (!Number.isFinite(month) || month < 1 || month > 12) {
      return res.status(400).json({ ok: false, error: 'invalid_month' });
    }

    const url = 'https://xn--42cah7d0cxcvbbb9x.com/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%A2%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87/';
    const upstream = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 gasohol95-price-sync/2.0',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_failed', status: upstream.status });
    }

    const html = await upstream.text();
    const records = parseGasohol95Records(html, year);
    if (!records.length) {
      return res.status(422).json({ ok: false, error: 'no_price_records_found' });
    }

    const days = new Date(year, month, 0).getDate();
    const daily = [];
    for (let day = 1; day <= days; day += 1) {
      const targetTs = Date.UTC(year, month - 1, day);
      const found = records.find(r => r.ts <= targetTs && typeof r.gasohol95 === 'number');
      daily.push({
        day,
        price: found ? found.gasohol95 : null,
        sourceDate: found ? found.dateText : '',
        sourceIso: found ? found.iso : '',
      });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      source: 'ราคาน้ำมันย้อนหลัง.com',
      product: 'แก๊สโซฮอล์ 95',
      year,
      month,
      url,
      records: records.length,
      daily,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error?.message || 'unknown_error' });
  }
}
