import Link from 'next/link';

type PageSwitcherProps = {
  active: 'schedule' | 'templates';
};

export default function PageSwitcher({ active }: PageSwitcherProps) {
  return (
    <nav className="page-switcher" aria-label="สลับหน้าหลัก">
      <Link className={`page-switch ${active === 'schedule' ? 'active' : ''}`} href="/">
        ตารางเวร
        <small>ลงเวร / OT สีแดง / สรุป</small>
      </Link>
      <Link className={`page-switch ${active === 'templates' ? 'active' : ''}`} href="/templates">
        แม่แบบ Word
        <small>อัปโหลดฟอร์ม / สร้างเอกสาร</small>
      </Link>
    </nav>
  );
}
