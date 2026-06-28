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

    const url = `https://www.bangchak.co.th/th/oilprice/historical?year=${year}`;
    const upstream = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 fuel-price-sync/1.0',
        'accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_failed', status: upstream.status });
    }

    const html = await upstream.text();
    const records = [];
    const rowRe = /(\d{2})\/(\d{2})\/(\d{4})\s+((?:-|\d+(?:\.\d+)?)(?:\s+(?:-|\d+(?:\.\d+)?)){7})/g;
    let match;

    while ((match = rowRe.exec(html))) {
      const dd = Number(match[1]);
      const mm = Number(match[2]);
      const yyyy = Number(match[3]);
      const values = match[4].trim().split(/\s+/).map(v => (v === '-' ? null : Number(v)));
      const date = new Date(Date.UTC(yyyy, mm - 1, dd));
      records.push({
        dateText: `${match[1]}/${match[2]}/${match[3]}`,
        iso: `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`,
        ts: date.getTime(),
        premiumDiesel: values[0],
        diesel: values[1],
        dieselB20: values[2],
        values,
      });
    }

    records.sort((a, b) => b.ts - a.ts);
    const days = new Date(year, month, 0).getDate();
    const daily = [];

    for (let day = 1; day <= days; day += 1) {
      const targetTs = Date.UTC(year, month - 1, day);
      const found = records.find(r => r.ts <= targetTs && typeof r.diesel === 'number');
      daily.push({
        day,
        price: found ? found.diesel : null,
        sourceDate: found ? found.dateText : '',
        sourceIso: found ? found.iso : '',
      });
    }

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({
      ok: true,
      source: 'Bangchak historical retail oil prices',
      product: 'Diesel / Hi Diesel S',
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
