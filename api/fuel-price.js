const TH_MONTHS = {
  'ม.ค.': 1,
  'ก.พ.': 2,
  'มี.ค.': 3,
  'เม.ย.': 4,
  'พ.ค.': 5,
  'มิ.ย.': 6,
  'ก.ค.': 7,
  'ส.ค.': 8,
  'ก.ย.': 9,
  'ต.ค.': 10,
  'พ.ย.': 11,
  'ธ.ค.': 12,
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

function htmlToLines(html) {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(tr|td|th|li|p|div|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .split(/\n+/)
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function parseGasohol95Records(html, requestYear) {
  const lines = htmlToLines(html);
  const start = Math.max(0, lines.findIndex(line => line === 'วันที่'));
  const header = lines.findIndex((line, index) => index > start && line.includes('เบนซิน'));
  if (start < 0 || header < 0) return [];

  const dates = [];
  let currentThaiYear = requestYear + 543;
  const dateRe = /^(\d{1,2})\s+(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)$/;

  for (let i = start + 1; i < header; i += 1) {
    const line = lines[i];
    if (/^25\d{2}$/.test(line)) {
      currentThaiYear = Number(line);
      continue;
    }
    const m = line.match(dateRe);
    if (m) {
      const day = Number(m[1]);
      const month = TH_MONTHS[m[2]];
      const year = currentThaiYear - 543;
      dates.push({
        day,
        month,
        year,
        dateText: `${day} ${m[2]} ${currentThaiYear}`,
        iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        ts: Date.UTC(year, month - 1, day),
      });
    }
  }

  const priceRows = [];
  for (let i = header + 1; i < lines.length; i += 1) {
    const nums = [...lines[i].matchAll(/\d{1,3}\.\d{2}/g)].map(m => Number(m[0]));
    if (nums.length >= 2) {
      priceRows.push(nums);
    }
  }

  const records = [];
  const count = Math.min(dates.length, priceRows.length);
  for (let i = 0; i < count; i += 1) {
    const gasohol95 = priceRows[i][1];
    if (Number.isFinite(gasohol95)) {
      records.push({
        ...dates[i],
        gasohol95,
        values: priceRows[i],
      });
    }
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
        'user-agent': 'Mozilla/5.0 gasohol95-price-sync/1.0',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_failed', status: upstream.status });
    }

    const html = await upstream.text();
    const records = parseGasohol95Records(html, year);
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

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
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
