import { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Clipboard,
  Download,
  FileSpreadsheet,
  Filter,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  UploadCloud,
  Users,
} from 'lucide-react';
import type { AggregateRow, AppMode, BillLine, Filters, ParsedRow } from './types';
import { parseDataFile } from './lib/parser';
import { fmt, money } from './lib/format';
import { lineTotal, roundMoney, safeNum, unitPriceFromAmount } from './lib/pricing';
import {
  aggregateBy,
  aggregateToExport,
  applyFilters,
  buildBillLines,
  downloadCsv,
  emptyFilters,
  rowToExport,
  toCsv,
  uniqueSorted,
} from './lib/analytics';
import './upload-progress.css';

type UploadProgressState = {
  percent: number;
  title: string;
  detail: string;
  state: 'uploading' | 'parsing' | 'activating' | 'done' | 'error';
};

function Header({
  mode,
  rows,
  title,
  subtitle,
  onBack,
  onMode,
}: {
  mode: AppMode;
  rows: ParsedRow[];
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMode: (mode: AppMode) => void;
}) {
  const tabs: Array<[AppMode, string]> = [
    ['dashboard', 'ภาครวม'],
    ['people', 'รายบุคคล'],
    ['stores', 'ร้าน'],
    ['skus', 'SKU'],
    ['tod', 'TOD'],
    ['bill', 'ถอดบิล'],
    ['issues', 'ตรวจผิดปกติ'],
  ];

  return (
    <header className="app-header">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="back">
          <ArrowLeft size={20} />
        </button>
      ) : (
        <div className="header-logo">V2.1</div>
      )}
      <div className="header-text">
        <div className="header-title">{title}</div>
        {subtitle && <div className="header-subtitle">{subtitle}</div>}
      </div>
      {rows.length > 0 && (
        <nav className="top-tabs">
          {tabs.map(([key, label]) => (
            <button key={key} className={mode === key ? 'top-tab active' : 'top-tab'} onClick={() => onMode(key)}>
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function SelectBox({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <label className="select-box">
      <span>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">ทั้งหมด</option>
        {values.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </label>
  );
}

function FilterBar({ rows, filters, setFilters, onExport }: {
  rows: ParsedRow[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onExport: () => void;
}) {
  const options = useMemo(() => ({
    people: uniqueSorted(rows.map(r => r.personKey)),
    stores: uniqueSorted(rows.map(r => r.store)),
    types: uniqueSorted(rows.map(r => r.type)),
    areas: uniqueSorted(rows.map(r => r.area)),
    channels: uniqueSorted(rows.map(r => r.channel)),
    categories: uniqueSorted(rows.map(r => r.category)),
    brands: uniqueSorted(rows.map(r => r.brand)),
  }), [rows]);

  const update = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  return (
    <section className="filter-card">
      <div className="filter-title">
        <Filter size={16} /> ตัวกรอง / Drill-down
      </div>
      <div className="filter-grid">
        <SelectBox label="บุคคล / PS" value={filters.person} values={options.people} onChange={v => update({ person: v })} />
        <SelectBox label="ร้าน" value={filters.store} values={options.stores} onChange={v => update({ store: v })} />
        <SelectBox label="ประเภท" value={filters.type} values={options.types} onChange={v => update({ type: v })} />
        <SelectBox label="พื้นที่" value={filters.area} values={options.areas} onChange={v => update({ area: v })} />
        <SelectBox label="ช่องทาง" value={filters.channel} values={options.channels} onChange={v => update({ channel: v })} />
        <SelectBox label="หมวด" value={filters.category} values={options.categories} onChange={v => update({ category: v })} />
        <SelectBox label="แบรนด์" value={filters.brand} values={options.brands} onChange={v => update({ brand: v })} />
        <label className="search-box">
          <span>ค้นหา</span>
          <div>
            <Search size={15} />
            <input value={filters.search} onChange={e => update({ search: e.target.value })} placeholder="ชื่อร้าน / SKU / invoice / คน" />
          </div>
        </label>
      </div>
      <div className="button-row">
        <button className="secondary-btn" onClick={() => setFilters(emptyFilters)}>
          <RefreshCw size={16} /> ล้างตัวกรอง
        </button>
        <button className="secondary-btn" onClick={onExport}>
          <Download size={16} /> Export แถวที่กรอง
        </button>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <b>{value}</b>
      {sub && <small>{sub}</small>}
    </div>
  );
}

function SummaryCards({ rows }: { rows: ParsedRow[] }) {
  const totalQty = rows.reduce((s, r) => s + r.qtyPcs, 0);
  const totalAmount = rows.reduce((s, r) => s + r.correctAmount, 0);
  const stores = new Set(rows.map(r => r.store)).size;
  const people = new Set(rows.map(r => r.personKey)).size;
  const skus = new Set(rows.map(r => r.skuCode || r.sku)).size;
  const invoices = new Set(rows.map(r => r.invoiceNo).filter(Boolean)).size;
  const avg = unitPriceFromAmount(totalAmount, totalQty);

  return (
    <section className="stats-grid wide">
      <StatCard label="ยอดรวม" value={`฿${money(totalAmount)}`} sub="Correct Amount" />
      <StatCard label="จำนวนชิ้น" value={fmt(totalQty)} />
      <StatCard label="ราคาเฉลี่ย/ชิ้น" value={`฿${money(avg)}`} />
      <StatCard label="ร้าน" value={fmt(stores)} />
      <StatCard label="บุคคล/PS" value={fmt(people)} />
      <StatCard label="SKU" value={fmt(skus)} />
      <StatCard label="Invoice" value={fmt(invoices)} />
      <StatCard label="แถวข้อมูล" value={fmt(rows.length)} />
    </section>
  );
}

function RankingTable({
  title,
  rows,
  onDrill,
  drillLabel = 'เจาะ',
}: {
  title: string;
  rows: AggregateRow[];
  onDrill?: (row: AggregateRow) => void;
  drillLabel?: string;
}) {
  return (
    <section className="ranking-card">
      <div className="table-head">
        <b>{title}</b>
        <span>{fmt(rows.length)} รายการ</span>
      </div>
      <div className="table-wrap small-table">
        <table>
          <thead>
            <tr>
              <th>รายการ</th>
              <th className="right">ยอด</th>
              <th className="right">ชิ้น</th>
              <th className="right">ร้าน</th>
              <th className="right">SKU</th>
              <th className="right">ราคา/ชิ้น</th>
              {onDrill && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 100).map(row => (
              <tr key={row.key}>
                <td className="wrap-cell">{row.label}</td>
                <td className="right">฿{money(row.correctAmount)}</td>
                <td className="right">{fmt(row.qtyPcs)}</td>
                <td className="right">{fmt(row.stores)}</td>
                <td className="right">{fmt(row.skus)}</td>
                <td className="right">฿{money(row.unitPrice)}</td>
                {onDrill && <td><button className="mini-btn" onClick={() => onDrill(row)}>{drillLabel}</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DashboardPage({ rows, setMode, setFilters, exportAgg }: {
  rows: ParsedRow[];
  setMode: (mode: AppMode) => void;
  setFilters: (filters: Filters) => void;
  exportAgg: (name: string, data: AggregateRow[]) => void;
}) {
  const people = useMemo(() => aggregateBy(rows, r => r.personKey), [rows]);
  const stores = useMemo(() => aggregateBy(rows, r => r.store), [rows]);
  const skus = useMemo(() => aggregateBy(rows, r => r.skuCode || r.sku, r => r.sku), [rows]);
  const areas = useMemo(() => aggregateBy(rows, r => r.area), [rows]);
  const types = useMemo(() => aggregateBy(rows, r => r.type), [rows]);
  const brands = useMemo(() => aggregateBy(rows, r => r.brand), [rows]);

  return (
    <>
      <SummaryCards rows={rows} />
      <section className="action-grid">
        <button className="primary-btn" onClick={() => setMode('people')}><Users size={16} /> ดูรายบุคคล</button>
        <button className="primary-btn" onClick={() => setMode('bill')}><Receipt size={16} /> ถอดบิล</button>
        <button className="secondary-btn" onClick={() => exportAgg('summary-by-person.csv', people)}><Download size={16} /> Export รายบุคคล</button>
        <button className="secondary-btn" onClick={() => exportAgg('summary-by-store.csv', stores)}><Download size={16} /> Export ร้าน</button>
      </section>
      <div className="grid-2">
        <RankingTable title="Top บุคคล / PS" rows={people} onDrill={row => { setFilters({ ...emptyFilters, person: row.key }); setMode('stores'); }} />
        <RankingTable title="Top ร้าน" rows={stores} onDrill={row => { setFilters({ ...emptyFilters, store: row.key }); setMode('skus'); }} />
        <RankingTable title="Top SKU" rows={skus} />
        <RankingTable title="พื้นที่ / Area" rows={areas} onDrill={row => { setFilters({ ...emptyFilters, area: row.key }); setMode('people'); }} />
        <RankingTable title="ประเภทเอกสาร" rows={types} onDrill={row => { setFilters({ ...emptyFilters, type: row.key }); setMode('dashboard'); }} />
        <RankingTable title="แบรนด์" rows={brands} onDrill={row => { setFilters({ ...emptyFilters, brand: row.key }); setMode('skus'); }} />
      </div>
    </>
  );
}

function PeoplePage({ rows, setFilters, setMode }: { rows: ParsedRow[]; setFilters: (filters: Filters) => void; setMode: (mode: AppMode) => void }) {
  const people = useMemo(() => aggregateBy(rows, r => r.personKey), [rows]);
  return <RankingTable title="รายบุคคล / PS" rows={people} onDrill={row => { setFilters({ ...emptyFilters, person: row.key }); setMode('stores'); }} drillLabel="ดูร้าน" />;
}

function StoresPage({ rows, filters, setFilters, setMode }: { rows: ParsedRow[]; filters: Filters; setFilters: (filters: Filters) => void; setMode: (mode: AppMode) => void }) {
  const stores = useMemo(() => aggregateBy(rows, r => r.store), [rows]);
  return <RankingTable title="รายร้าน" rows={stores} onDrill={row => { setFilters({ ...filters, store: row.key }); setMode('skus'); }} drillLabel="ดู SKU" />;
}

function SkusPage({ rows }: { rows: ParsedRow[] }) {
  const skus = useMemo(() => aggregateBy(rows, r => r.skuCode || r.sku, r => r.sku), [rows]);
  return <RankingTable title="ราย SKU" rows={skus} />;
}

function TodPage({ rows }: { rows: ParsedRow[] }) {
  return (
    <section className="table-card">
      <div className="table-title">TOD / รายการละเอียดหลังกรอง</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>วันที่</th>
              <th>Type</th>
              <th>บุคคล</th>
              <th>ร้าน</th>
              <th>SKU</th>
              <th className="right">ชิ้น</th>
              <th className="right">ยอด</th>
              <th className="right">ราคา/ชิ้น</th>
              <th>invoice</th>
              <th>source</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 1000).map(row => (
              <tr key={`${row.rowNo}-${row.invoiceNo}-${row.lineRef}-${row.sku}`}>
                <td>{row.rowNo}</td>
                <td>{row.date || '-'}</td>
                <td>{row.type}</td>
                <td className="wrap-cell">{row.personKey}</td>
                <td className="wrap-cell">{row.store}</td>
                <td className="wrap-cell">{row.sku}</td>
                <td className="right">{fmt(row.qtyPcs)}</td>
                <td className="right">฿{money(row.correctAmount)}</td>
                <td className="right">฿{money(row.unitPrice)}</td>
                <td>{row.invoiceNo || '-'}</td>
                <td>{row.priceSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 1000 && <div className="small-note">แสดง 1,000 แถวแรกจากทั้งหมด {fmt(rows.length)} แถว ใช้ Export เพื่อดูทั้งหมด</div>}
    </section>
  );
}

function IssuesPage({ rows }: { rows: ParsedRow[] }) {
  const avgPrice = unitPriceFromAmount(rows.reduce((s, r) => s + r.correctAmount, 0), rows.reduce((s, r) => s + r.qtyPcs, 0));
  const issues = rows.filter(row => {
    if (row.qtyPcs <= 0) return true;
    if (row.correctAmount <= 0) return true;
    if (row.unitPrice <= 0) return true;
    if (!row.personKey || row.personKey === 'ไม่ระบุบุคคล') return true;
    if (!row.store || row.store === 'ไม่ระบุร้าน') return true;
    if (!row.invoiceNo) return true;
    if (avgPrice > 0 && row.unitPrice > avgPrice * 8) return true;
    return false;
  });

  return (
    <section className="table-card">
      <div className="table-title"><AlertTriangle size={16} /> ตรวจผิดปกติ {fmt(issues.length)} แถว</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>เหตุผล</th>
              <th>บุคคล</th>
              <th>ร้าน</th>
              <th>SKU</th>
              <th className="right">ชิ้น</th>
              <th className="right">ยอด</th>
              <th className="right">ราคา/ชิ้น</th>
              <th>invoice</th>
            </tr>
          </thead>
          <tbody>
            {issues.slice(0, 1000).map(row => {
              const reason = [
                row.qtyPcs <= 0 ? 'qty 0' : '',
                row.correctAmount <= 0 ? 'amount 0' : '',
                row.unitPrice <= 0 ? 'price 0' : '',
                row.personKey === 'ไม่ระบุบุคคล' ? 'ไม่ระบุบุคคล' : '',
                row.store === 'ไม่ระบุร้าน' ? 'ไม่ระบุร้าน' : '',
                !row.invoiceNo ? 'ไม่มี invoice' : '',
                avgPrice > 0 && row.unitPrice > avgPrice * 8 ? 'ราคา/ชิ้นสูงผิดปกติ' : '',
              ].filter(Boolean).join(', ');
              return (
                <tr key={`${row.rowNo}-${row.sku}`}>
                  <td>{row.rowNo}</td>
                  <td>{reason}</td>
                  <td className="wrap-cell">{row.personKey}</td>
                  <td className="wrap-cell">{row.store}</td>
                  <td className="wrap-cell">{row.sku}</td>
                  <td className="right">{fmt(row.qtyPcs)}</td>
                  <td className="right">฿{money(row.correctAmount)}</td>
                  <td className="right">฿{money(row.unitPrice)}</td>
                  <td>{row.invoiceNo || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BillPage({ lines }: { lines: BillLine[] }) {
  const stores = useMemo(() => uniqueSorted(lines.map(line => line.store)), [lines]);
  const [store, setStore] = useState('');
  const [prices, setPrices] = useState<Record<string, string>>({});

  const activeStore = store || stores[0] || '';
  const activeLines = useMemo(() => lines.filter(line => line.store === activeStore), [lines, activeStore]);

  const getPrice = (line: BillLine) => {
    const key = `${line.store}||${line.sku}`;
    const custom = prices[key];
    if (custom == null || custom === '') return line.unitPrice;
    return safeNum(custom);
  };

  const totalQty = activeLines.reduce((s, line) => s + line.qtyPcs, 0);
  const totalAmount = activeLines.reduce((s, line) => s + lineTotal(line.qtyPcs, getPrice(line)), 0);

  const copyBill = async () => {
    const text = [
      `ร้าน ${activeStore}`,
      '',
      ...activeLines.map((line, idx) => {
        const price = getPrice(line);
        return `${idx + 1}. ${line.sku} | ${fmt(line.qtyPcs)} ชิ้น x ฿${money(price)} = ฿${money(lineTotal(line.qtyPcs, price))}`;
      }),
      '',
      `รวม ${fmt(totalQty)} ชิ้น`,
      `ยอดรวม ฿${money(totalAmount)}`,
    ].join('\n');

    await navigator.clipboard.writeText(text);
    alert('คัดลอกข้อความแล้ว');
  };

  return (
    <>
      <section className="store-tabs print-hide">
        {stores.map(st => (
          <button key={st} className={st === activeStore ? 'tab active' : 'tab'} onClick={() => setStore(st)}>
            {st}
          </button>
        ))}
      </section>

      <section className="bill-card">
        <div className="bill-header">
          <div>
            <div className="bill-title">ร้าน {activeStore}</div>
            <div className="bill-subtitle">สูตร V2.1: line total = qty × unit price</div>
          </div>
          <Receipt size={28} />
        </div>

        <div className="bill-list">
          {activeLines.map((line, idx) => {
            const key = `${line.store}||${line.sku}`;
            const price = getPrice(line);
            const total = lineTotal(line.qtyPcs, price);
            return (
              <div className="bill-item" key={key}>
                <div className="item-main">
                  <div className="item-name">{idx + 1}. {line.sku}</div>
                  <div className="item-meta">
                    PS: {line.personKey} · source: {line.priceSource} · amount ฿{money(line.correctAmount)} · invoice {line.invoices.length}
                  </div>
                </div>
                <div className="item-grid">
                  <div><span>จำนวน</span><b>{fmt(line.qtyPcs)}</b></div>
                  <label>
                    <span>ราคา/ชิ้น</span>
                    <input type="number" step="0.01" value={prices[key] ?? String(roundMoney(line.unitPrice))} onChange={e => setPrices(prev => ({ ...prev, [key]: e.target.value }))} />
                  </label>
                  <div className="right"><span>รวม</span><b>฿{money(total)}</b></div>
                </div>
              </div>
            );
          })}
        </div>

        {activeLines.length === 0 && <div className="empty-box">ไม่มีรายการในร้านนี้</div>}

        <div className="bill-total">
          <div><span>จำนวนรวม</span><b>{fmt(totalQty)} ชิ้น</b></div>
          <div><span>ยอดรวมสุทธิ</span><b>฿{money(totalAmount)}</b></div>
        </div>
      </section>

      <div className="button-row print-hide">
        <button className="secondary-btn grow" onClick={copyBill}><Clipboard size={16} /> คัดลอกส่งร้าน</button>
        <button className="primary-btn grow" onClick={() => window.print()}><Printer size={16} /> ปริ้นท์</button>
      </div>
    </>
  );
}

function UploadProgressModal({ progress }: { progress: UploadProgressState | null }) {
  if (!progress) return null;
  const percent = Math.max(0, Math.min(100, Math.round(progress.percent)));
  const isDone = progress.state === 'done';
  const isError = progress.state === 'error';

  return (
    <div className="upload-modal-backdrop" role="status" aria-live="polite">
      <div className="upload-modal">
        <div className={isError ? 'upload-modal-icon error' : isDone ? 'upload-modal-icon done' : 'upload-modal-icon'}>
          {isError ? '!' : isDone ? '✓' : <UploadCloud size={28} />}
        </div>
        <h2>{progress.title}</h2>
        <p>{progress.detail}</p>
        <div className="progress-head">
          <span>{isError ? 'หยุดทำงาน' : isDone ? 'เสร็จแล้ว' : 'กำลังทำงาน'}</span>
          <b>{percent}%</b>
        </div>
        <div className="progress-track">
          <div className={isError ? 'progress-fill error' : isDone ? 'progress-fill done' : 'progress-fill'} style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-note">
          {isError ? 'ตรวจสอบไฟล์แล้วลองใหม่อีกครั้ง' : isDone ? 'ไฟล์นี้ถูกตั้งเป็นไฟล์ล่าสุดอัตโนมัติ' : 'ห้ามปิดหน้านี้ระหว่างอัปโหลดหรือแปลงไฟล์'}
        </div>
      </div>
    </div>
  );
}

function UploadPage({ rows, fileName, latestFileName, error, loading, onUpload, onGoDashboard, onClear }: {
  rows: ParsedRow[];
  fileName: string;
  latestFileName: string;
  error: string;
  loading: boolean;
  onUpload: (file: File) => void;
  onGoDashboard: () => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <main className="content">
      <section className="hero-card">
        <div className="hero-icon"><FileSpreadsheet size={44} /></div>
        <h1>Solomon DOIT App V2.1</h1>
        <p>
          ตัวเต็ม: ภาครวม → รายบุคคล → ร้าน → SKU → ถอดบิล พร้อม filter, anomaly check, export และสูตรราคา V2
        </p>
        <input ref={inputRef} className="hidden" type="file" accept=".xlsx,.xls,.xlsm,.csv" onChange={e => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.currentTarget.value = '';
        }} />
        <button className="primary-btn" disabled={loading} onClick={() => inputRef.current?.click()}>
          <UploadCloud size={18} /> {loading ? 'กำลังอัปโหลด/แปลงไฟล์...' : 'เลือกไฟล์ DOIT'}
        </button>
        {fileName && <div className="file-name">ไฟล์ที่เลือก: {fileName}</div>}
        {latestFileName && <div className="latest-file-badge">ไฟล์ล่าสุดอัตโนมัติ: {latestFileName}</div>}
        {error && <div className="error-box">{error}</div>}
      </section>

      {rows.length > 0 && (
        <>
          <SummaryCards rows={rows} />
          <div className="button-row">
            <button className="secondary-btn" onClick={onClear}><RefreshCw size={16} /> ล้างข้อมูล</button>
            <button className="primary-btn grow" onClick={onGoDashboard}><BarChart3 size={16} /> เข้าภาครวม</button>
          </div>
        </>
      )}

      <section className="note-card">
        <b>สูตรราคา V2.1</b>
        <p>Correct Amount ใช้ `TotInvc` ก่อน แล้วคำนวณ `unitPrice = Correct Amount / Qty PCS` เพื่อกันยอดบวมจากการเอายอดเงินไปคูณจำนวนซ้ำ</p>
        <p>รองรับ field คนขาย, พื้นที่, ช่องทาง, brand, category, invoice, shipper, type สำหรับ drill-down รายบุคคลและภาครวม</p>
      </section>
    </main>
  );
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('upload');
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<UploadProgressState | null>(null);
  const [latestFileName, setLatestFileName] = useState(() => {
    try {
      return localStorage.getItem('doit.latestFileName') || '';
    } catch {
      return '';
    }
  });

  const filteredRows = useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const billLines = useMemo(() => buildBillLines(filteredRows), [filteredRows]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError('');
    setProgress({ percent: 8, title: 'กำลังอัปโหลดไฟล์ DOIT', detail: file.name, state: 'uploading' });

    try {
      await new Promise(resolve => setTimeout(resolve, 120));
      setProgress({ percent: 28, title: 'กำลังแปลงไฟล์', detail: 'กำลังอ่าน Excel/CSV และจัดรูปแบบข้อมูล', state: 'parsing' });

      const parsed = await parseDataFile(file);

      setProgress({ percent: 76, title: 'กำลังตรวจสอบข้อมูล', detail: `${fmt(parsed.length)} แถว · ตั้งค่าไฟล์ล่าสุด`, state: 'activating' });
      await new Promise(resolve => setTimeout(resolve, 120));

      setRows(parsed);
      setFileName(file.name);
      setLatestFileName(file.name);
      try {
        localStorage.setItem('doit.latestFileName', file.name);
      } catch {
        // localStorage can be blocked in some browsers; UI state still updates.
      }
      setFilters(emptyFilters);
      if (parsed.length === 0) setError('อ่านไฟล์ได้ แต่ไม่พบแถวที่มีจำนวนหรือยอดเงิน');

      setProgress({ percent: 100, title: 'อัปโหลดและแปลงไฟล์สำเร็จ', detail: `${file.name} ถูกตั้งเป็นไฟล์ล่าสุดแล้ว`, state: 'done' });
      setTimeout(() => setProgress(null), 900);
      setMode('dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'อ่านไฟล์ไม่ได้';
      setRows([]);
      setFileName(file.name);
      setError(message);
      setProgress({ percent: 100, title: 'อัปโหลดหรือแปลงไฟล์ไม่สำเร็จ', detail: message, state: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const exportFilteredRows = () => {
    downloadCsv('doit-filtered-rows.csv', toCsv(filteredRows.map(rowToExport)));
  };

  const exportAgg = (name: string, data: AggregateRow[]) => {
    downloadCsv(name, toCsv(data.map(aggregateToExport)));
  };

  const subtitle = rows.length > 0
    ? `${fmt(filteredRows.length)} / ${fmt(rows.length)} แถว · ${fmt(new Set(filteredRows.map(r => r.personKey)).size)} คน · ${fmt(new Set(filteredRows.map(r => r.store)).size)} ร้าน`
    : 'ภาครวม → รายบุคคล → ร้าน → SKU → บิล';

  return (
    <div className="page">
      <Header
        mode={mode}
        rows={rows}
        title={mode === 'upload' ? 'Solomon DOIT App V2.1' : 'Solomon DOIT App V2.1'}
        subtitle={subtitle}
        onBack={mode !== 'upload' ? () => setMode('upload') : undefined}
        onMode={setMode}
      />

      {mode === 'upload' ? (
        <UploadPage
          rows={rows}
          fileName={fileName}
          latestFileName={latestFileName}
          error={error}
          loading={loading}
          onUpload={handleUpload}
          onGoDashboard={() => setMode('dashboard')}
          onClear={() => { setRows([]); setFileName(''); setError(''); setFilters(emptyFilters); }}
        />
      ) : (
        <main className="content">
          <FilterBar rows={rows} filters={filters} setFilters={setFilters} onExport={exportFilteredRows} />
          {mode === 'dashboard' && <DashboardPage rows={filteredRows} setMode={setMode} setFilters={setFilters} exportAgg={exportAgg} />}
          {mode === 'people' && <PeoplePage rows={filteredRows} setFilters={setFilters} setMode={setMode} />}
          {mode === 'stores' && <StoresPage rows={filteredRows} filters={filters} setFilters={setFilters} setMode={setMode} />}
          {mode === 'skus' && <SkusPage rows={filteredRows} />}
          {mode === 'tod' && <TodPage rows={filteredRows} />}
          {mode === 'bill' && <BillPage lines={billLines} />}
          {mode === 'issues' && <IssuesPage rows={filteredRows} />}
        </main>
      )}
      <UploadProgressModal progress={progress} />
    </div>
  );
}
