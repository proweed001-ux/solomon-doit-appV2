import { ArrowLeft } from 'lucide-react';
import type { AppMode, ParsedRow } from '../types';

const APP_TABS: Array<[AppMode, string]> = [
  ['dashboard', 'ภาครวม'],
  ['people', 'รายบุคคล'],
  ['stores', 'ร้าน'],
  ['skus', 'SKU'],
  ['tod', 'TOD'],
  ['bill', 'ถอดบิล'],
  ['issues', 'ตรวจผิดปกติ'],
];

export function AppHeader({
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
          {APP_TABS.map(([key, label]) => (
            <button key={key} className={mode === key ? 'top-tab active' : 'top-tab'} onClick={() => onMode(key)}>
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
