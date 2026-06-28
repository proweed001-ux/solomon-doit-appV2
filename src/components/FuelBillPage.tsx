import { useEffect, useMemo, useState } from 'react';
import { Calculator, Download, FileSpreadsheet, RefreshCw, Save, UserPlus } from 'lucide-react';
import * as XLSX from 'xlsx';

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const ROUTES = [
  'R01',
  'R02',
  'R03',
  'R04',
  'R05',
  'R06',
  'R07',
  'R08',
  'R09',
  'R10',
  'R11',
  'R12',
  'หยุด',
  'ประชุม canvass',
  'อื่นๆ',
];

const DEFAULT_EMPLOYEES = [
  'นาย นันทภพ ฐิตานุกูล',
  'นาย บูรพา พานนิล',
  'นาย ยุทธนา อ่ำกลาง',
  'นางสาว ฉัตรชา สังข์เจริญ',
  'นางสาว กรรวี มีแก้ว',
  'นาย สันติภาพ ช้างจั่น',
  'นาย ศุกิจ ปิ่นวิเศษ',
  'นาย จารึก จัดกลาง',
  'นาย รังสรรค์ เถาะรอด',
  'นาย สรายุทธ ภู่หลักแก้ว',
  'นางสาว พัทนันธ์ บุญธรรม',
  'นางสาว กนกพร นิลพัตร์',
  'นางสาว วันเพ็ญ กฤษเพชร์',
  'นาย มณเฑียร ตะเคียนงาม',
  'นางสาว ปพิชญา ทางาม',
  'นาย คมสัน แก้วสาลี',
  'นาย พลภัทร มีเอี่ยม',
  'นาย ฉัตรชัย จันทร์กลิ่น',
  'นางสาว วิรัตน์ ซืสเลอร์',
  'นางสาว ชัญญ์ญาณ์ เจี๊ยะจิ๋ว',
  'นางสาว นรีรัตน์ ผิวนิล',
  'นางสาว ณัฐวดี พลีขันธ์',
];

const STORAGE_KEY = 'salomon-fuel-bill-v1';

interface FuelRowInput {
  route: string;
  km: string;
  fuelCode: string;
  fuelPrice: string;
}

interface FuelProfile {
  month: number;
  year: number;
  employee: string;
  position: string;
  department: string;
  saleArea: string;
  carPlate: string;
  startMileage: string;
  advanceAmount: string;
  signDay: string;
}

interface ComputedFuelRow extends FuelRowInput {
  day: number;
  kmNumber: number;
  startMileage: number;
  endMileage: number;
  fuelAmount: number;
  fuelPriceNumber: number;
  liters: number;
}

function currentThaiYear() {
  return new Date().getFullYear() + 543;
}

function daysInMonth(month: number, thaiYear: number) {
  return new Date(thaiYear - 543, month, 0).getDate();
}

function blankRows(days: number): FuelRowInput[] {
  return Array.from({ length: days }, () => ({ route: '', km: '', fuelCode: '', fuelPrice: '' }));
}

function safeNumber(value: string | number) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function fuelAmountFromCode(code: string) {
  if (code === '1') return 100;
  if (code === '2') return 200;
  if (code === '3') return 300;
  return 0;
}

function formatNumber(value: number, digits = 2) {
  if (!value) return '';
  return value.toLocaleString('th-TH', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function downloadText(fileName: string, text: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\ufeff' + text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeSignName(name: string) {
  return name.replace(/^(นาย|นางสาว|นาง)\s+/u, '').trim();
}

export default function FuelBillPage() {
  const now = new Date();
  const [employees, setEmployees] = useState<string[]>(DEFAULT_EMPLOYEES);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [activeTab, setActiveTab] = useState<'mileage' | 'expense' | 'employees'>('mileage');
  const [profile, setProfile] = useState<FuelProfile>({
    month: now.getMonth() + 1,
    year: currentThaiYear(),
    employee: 'นาย ฉัตรชัย จันทร์กลิ่น',
    position: 'ADS01',
    department: 'HFS',
    saleArea: 'CNRAYA',
    carPlate: '',
    startMileage: '',
    advanceAmount: '',
    signDay: String(now.getDate()),
  });
  const [rows, setRows] = useState<FuelRowInput[]>(() => blankRows(daysInMonth(now.getMonth() + 1, currentThaiYear())));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { profile?: FuelProfile; rows?: FuelRowInput[]; employees?: string[] };
      if (saved.profile) setProfile(prev => ({ ...prev, ...saved.profile }));
      if (Array.isArray(saved.rows)) setRows(saved.rows);
      if (Array.isArray(saved.employees) && saved.employees.length) setEmployees(saved.employees);
    } catch {
      // ignore bad local drafts
    }
  }, []);

  useEffect(() => {
    const targetDays = daysInMonth(profile.month, profile.year);
    setRows(prev => {
      if (prev.length === targetDays) return prev;
      if (prev.length > targetDays) return prev.slice(0, targetDays);
      return [...prev, ...blankRows(targetDays - prev.length)];
    });
  }, [profile.month, profile.year]);

  const updateProfile = (patch: Partial<FuelProfile>) => setProfile(prev => ({ ...prev, ...patch }));

  const updateRow = (index: number, patch: Partial<FuelRowInput>) => {
    setRows(prev => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)));
  };

  const computedRows = useMemo<ComputedFuelRow[]>(() => {
    let mileage = safeNumber(profile.startMileage);
    return rows.map((row, index) => {
      const kmNumber = safeNumber(row.km);
      const fuelAmount = fuelAmountFromCode(row.fuelCode);
      const fuelPriceNumber = safeNumber(row.fuelPrice);
      const startMileage = mileage;
      const endMileage = startMileage + kmNumber;
      const liters = fuelAmount && fuelPriceNumber ? fuelAmount / fuelPriceNumber : 0;
      mileage = endMileage;
      return {
        ...row,
        day: index + 1,
        kmNumber,
        startMileage,
        endMileage,
        fuelAmount,
        fuelPriceNumber,
        liters,
      };
    });
  }, [profile.startMileage, rows]);

  const totalKm = computedRows.reduce((sum, row) => sum + row.kmNumber, 0);
  const totalFuel = computedRows.reduce((sum, row) => sum + row.fuelAmount, 0);
  const totalLiters = computedRows.reduce((sum, row) => sum + row.liters, 0);
  const advanceAmount = safeNumber(profile.advanceAmount);
  const balance = advanceAmount ? advanceAmount - totalFuel : 0;
  const monthName = THAI_MONTHS[profile.month - 1];

  const addEmployee = () => {
    const clean = newEmployeeName.trim();
    if (!clean) return;
    if (!employees.includes(clean)) setEmployees(prev => [...prev, clean]);
    updateProfile({ employee: clean });
    setNewEmployeeName('');
  };

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, rows, employees }));
    alert('บันทึกแบบร่างในเครื่องนี้แล้ว');
  };

  const resetRows = () => {
    if (!confirm('ล้างข้อมูลรายวันทั้งหมดหรือไม่')) return;
    setRows(blankRows(daysInMonth(profile.month, profile.year)));
  };

  const exportCsv = () => {
    const header = ['วันที่', 'ตลาด / ที่หมาย', 'เลขไมล์เริ่ม', 'เลขไมล์สิ้นสุด', 'จำนวน กม.', 'ลิตร', 'บาท/ลิตร', 'ยอดเงิน'];
    const body = computedRows.map(row => [
      row.day,
      row.route,
      row.startMileage || '',
      row.endMileage || '',
      row.kmNumber || '',
      row.liters ? row.liters.toFixed(3) : '',
      row.fuelPriceNumber || '',
      row.fuelAmount || '',
    ]);
    const csv = [header, ...body].map(line => line.map(csvEscape).join(',')).join('\n');
    downloadText(`fuel-mileage-${profile.year}-${String(profile.month).padStart(2, '0')}.csv`, csv);
  };

  const exportWorkbookDraft = () => {
    const mileageRows = [
      ['บริษัท ชินราช เอส.ดี.โอ จำกัด'],
      ['บันทึกค่าใช้จ่ายเกี่ยวกับยานพาหนะ'],
      ['ประจำเดือน', monthName, '', 'พ.ศ.', profile.year, '', 'ทะเบียนรถ', profile.carPlate],
      ['ชื่อ/สกุล', profile.employee, '', 'ตำแหน่ง', profile.position],
      ['เขตการขาย', profile.saleArea, '', 'แผนก', profile.department],
      [],
      ['วันที่', 'ตลาด / ที่หมาย', 'จุดปลายทาง / ที่พัก', 'ระยะทางกิโลเมตร', '', '', 'น้ำมัน ดีเซล', '', ''],
      ['', '', '', 'เริ่ม', 'สิ้นสุด', 'จำนวน กม.', 'ลิตร', 'บาท/ลิตร', 'ยอดเงิน'],
      ...computedRows.map(row => [
        row.day,
        row.route,
        '',
        row.startMileage || '',
        row.endMileage || '',
        row.kmNumber || '',
        row.liters ? Number(row.liters.toFixed(3)) : '',
        row.fuelPriceNumber || '',
        row.fuelAmount || '',
      ]),
      [],
      ['', '', 'ค่าเฉลี่ยรถวิ่ง กม. / ลิตร', '', '', totalKm, Number(totalLiters.toFixed(2)), '', totalFuel],
    ];

    const expenseRows = [
      ['บริษัท ชินราช เอส.ดี.โอ จำกัด'],
      [`รายงานค่าใช้จ่าย ประจำเดือน ____ ${monthName} ____  พ.ศ._${profile.year}_____`],
      [`ชื่อ-สกุล___${profile.employee}____________________ตำแหน่ง____${profile.position}____________________`],
      ['บิลวันที่', 'รายละเอียด', 'ค่าที่พัก', 'ค่าไฟ', 'ค่าน้ำ', 'ค่าขยะ', 'ค่าน้ำมัน', 'หมายเหตุ'],
      ...computedRows.map(row => [row.day, row.route, '', '', '', '', row.fuelAmount || '', '']),
      [],
      ['', 'รวม', '', '', '', '', totalFuel, ''],
      ['', '', '', '', '', '', 'เงินโอน คชจ. ล่วงหน้า', advanceAmount || ''],
      ['', normalizeSignName(profile.employee), '…...…….……………………………………………………….', '', '', '', 'รวมยอดค่าใช้จ่าย', totalFuel],
      [`วันที่………  ${profile.signDay}${monthName} ${profile.year} ………………...……`, '', 'วันที่………………………...………………..….', '', '', '', 'เงินคงเหลือ/ยอดส่งเงิน', balance],
      ['พนักงานขาย', '', 'ผู้ตรวจสอบ'],
    ];

    const workbook = XLSX.utils.book_new();
    const mileageSheet = XLSX.utils.aoa_to_sheet(mileageRows);
    const expenseSheet = XLSX.utils.aoa_to_sheet(expenseRows);
    mileageSheet['!cols'] = [{ wch: 8 }, { wch: 18 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    expenseSheet['!cols'] = [{ wch: 10 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(workbook, mileageSheet, 'เลขไมค์');
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'รายงานค่าใช้จ่าย');
    XLSX.writeFile(workbook, `บิลน้ำมัน-${profile.employee}-${monthName}-${profile.year}.xlsx`);
  };

  return (
    <>
      <section className="bill-card fuel-card">
        <div className="bill-header">
          <div>
            <div className="bill-title">บิลน้ำมัน / เลขไมล์</div>
            <div className="bill-subtitle">กรอกครั้งเดียว ระบบคำนวณเลขไมล์ ลิตร และดึงข้อมูลไปหน้ารายงานค่าใช้จ่าย</div>
          </div>
          <Calculator size={28} />
        </div>

        <div className="fuel-tabs print-hide">
          <button className={activeTab === 'mileage' ? 'tab active' : 'tab'} onClick={() => setActiveTab('mileage')}>เลขไมล์</button>
          <button className={activeTab === 'expense' ? 'tab active' : 'tab'} onClick={() => setActiveTab('expense')}>รายงานค่าใช้จ่าย</button>
          <button className={activeTab === 'employees' ? 'tab active' : 'tab'} onClick={() => setActiveTab('employees')}>รายชื่อ</button>
        </div>

        <div className="fuel-form-grid print-hide">
          <label className="field-card">
            <span>เดือน</span>
            <select value={profile.month} onChange={e => updateProfile({ month: Number(e.target.value) })}>
              {THAI_MONTHS.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
            </select>
          </label>
          <label className="field-card">
            <span>พ.ศ.</span>
            <input value={profile.year} inputMode="numeric" onChange={e => updateProfile({ year: Number(e.target.value) || currentThaiYear() })} />
          </label>
          <label className="field-card wide-field">
            <span>ชื่อ/สกุล</span>
            <select value={profile.employee} onChange={e => updateProfile({ employee: e.target.value })}>
              {employees.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="field-card">
            <span>ตำแหน่ง</span>
            <input value={profile.position} onChange={e => updateProfile({ position: e.target.value })} />
          </label>
          <label className="field-card">
            <span>ทะเบียนรถ</span>
            <input value={profile.carPlate} onChange={e => updateProfile({ carPlate: e.target.value })} placeholder="เช่น 1กณ 2904 พิจิตร" />
          </label>
          <label className="field-card">
            <span>เลขไมล์เริ่มต้น</span>
            <input value={profile.startMileage} inputMode="decimal" onChange={e => updateProfile({ startMileage: e.target.value })} placeholder="กรอกวันแรกครั้งเดียว" />
          </label>
          <label className="field-card">
            <span>เขตการขาย</span>
            <input value={profile.saleArea} onChange={e => updateProfile({ saleArea: e.target.value })} />
          </label>
          <label className="field-card">
            <span>แผนก</span>
            <input value={profile.department} onChange={e => updateProfile({ department: e.target.value })} />
          </label>
          <label className="field-card">
            <span>เงินโอนล่วงหน้า</span>
            <input value={profile.advanceAmount} inputMode="decimal" onChange={e => updateProfile({ advanceAmount: e.target.value })} placeholder="ถ้ามี" />
          </label>
          <label className="field-card">
            <span>วันที่เซ็น</span>
            <input value={profile.signDay} inputMode="numeric" onChange={e => updateProfile({ signDay: e.target.value })} />
          </label>
        </div>

        <section className="stats-grid wide fuel-summary-grid">
          <div className="stat-card"><span>รวมระยะทาง</span><b>{totalKm.toLocaleString('th-TH')}</b><small>กม.</small></div>
          <div className="stat-card"><span>รวมลิตร</span><b>{formatNumber(totalLiters)}</b><small>ลิตร</small></div>
          <div className="stat-card"><span>รวมค่าน้ำมัน</span><b>฿{totalFuel.toLocaleString('th-TH')}</b><small>ดึงไปชีทรายงาน</small></div>
          <div className="stat-card"><span>คงเหลือ/ส่งเงิน</span><b>฿{balance.toLocaleString('th-TH')}</b><small>เงินโอน - ใช้จริง</small></div>
        </section>
      </section>

      {activeTab === 'mileage' && (
        <section className="table-card">
          <div className="table-title"><FileSpreadsheet size={16} /> ชีทเลขไมค์</div>
          <div className="table-wrap fuel-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ตลาด</th>
                  <th className="right">กม.</th>
                  <th>น้ำมัน</th>
                  <th className="right">บาท/ลิตร</th>
                  <th className="right">ลิตร</th>
                  <th className="right">เริ่ม</th>
                  <th className="right">สิ้นสุด</th>
                </tr>
              </thead>
              <tbody>
                {computedRows.map((row, idx) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>
                      <select className="cell-select" value={row.route} onChange={e => updateRow(idx, { route: e.target.value })}>
                        <option value="">เลือก</option>
                        {ROUTES.map(route => <option key={route} value={route}>{route}</option>)}
                      </select>
                    </td>
                    <td><input className="cell-input right-input" inputMode="decimal" value={row.km} onChange={e => updateRow(idx, { km: e.target.value })} placeholder="0" /></td>
                    <td><input className="cell-input" inputMode="numeric" value={row.fuelCode} onChange={e => updateRow(idx, { fuelCode: e.target.value.replace(/[^123]/g, '').slice(0, 1) })} placeholder="1/2" /></td>
                    <td><input className="cell-input right-input" inputMode="decimal" value={row.fuelPrice} onChange={e => updateRow(idx, { fuelPrice: e.target.value })} placeholder="33.09" /></td>
                    <td className="right">{formatNumber(row.liters, 3)}</td>
                    <td className="right">{row.startMileage || ''}</td>
                    <td className="right">{row.endMileage || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'expense' && (
        <section className="table-card">
          <div className="table-title">รายงานค่าใช้จ่าย: ดึงจากชีทเลขไมค์</div>
          <div className="table-wrap fuel-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>บิลวันที่</th>
                  <th>รายละเอียด</th>
                  <th className="right">ค่าน้ำมัน</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {computedRows.map(row => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.route}</td>
                    <td className="right">{row.fuelAmount ? row.fuelAmount.toLocaleString('th-TH') : ''}</td>
                    <td>{row.fuelAmount ? `รหัส ${row.fuelCode} = ${row.fuelAmount} บาท` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'employees' && (
        <section className="bill-card">
          <div className="bill-title">รายชื่อพนักงาน</div>
          <div className="bill-subtitle">เพิ่มชื่อใหม่แล้วเลือกใช้งานได้ทันที รายชื่อถูกบันทึกพร้อมแบบร่างในเครื่องนี้</div>
          <div className="inline-actions print-hide">
            <input value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} placeholder="เพิ่มชื่อ-สกุลคนใหม่" />
            <button className="primary-btn" onClick={addEmployee}><UserPlus size={16} /> เพิ่มชื่อ</button>
          </div>
          <div className="employee-list">
            {employees.map(name => (
              <button key={name} className={profile.employee === name ? 'employee-pill active' : 'employee-pill'} onClick={() => updateProfile({ employee: name })}>
                {name}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="button-row print-hide">
        <button className="secondary-btn grow" onClick={saveDraft}><Save size={16} /> บันทึกแบบร่าง</button>
        <button className="secondary-btn grow" onClick={resetRows}><RefreshCw size={16} /> ล้างรายวัน</button>
        <button className="secondary-btn grow" onClick={exportCsv}><Download size={16} /> Export CSV</button>
        <button className="primary-btn grow" onClick={exportWorkbookDraft}><Download size={16} /> Export Excel</button>
      </div>

      <section className="note-card">
        <b>กฎคำนวณที่ใช้</b>
        <p>เลขเริ่มของวันถัดไป = เลขสิ้นสุดของวันก่อนหน้า, เลขสิ้นสุด = เลขเริ่ม + จำนวนกิโล, รหัสน้ำมัน 1 = 100 บาท และ 2 = 200 บาท, ลิตร = ยอดเงิน / ราคาน้ำมันวันนั้น</p>
        <p>หมายเหตุ: ปุ่ม Export Excel ในหน้านี้สร้างไฟล์ 2 ชีทตามข้อมูลจริงแล้ว แต่การคุมหน้าตาให้เหมือนแม่แบบ 100% ต้องผูกไฟล์ template ต้นฉบับกับระบบ export รอบถัดไป</p>
      </section>
    </>
  );
}
