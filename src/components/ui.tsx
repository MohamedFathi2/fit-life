import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clamp, diffDays } from '../lib/util';
import { fmtN, t } from '../lib/i18n';
import { fmtD } from '../lib/format';

/* ---------- icons ---------- */
const P: Record<string, string> = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  food: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M12 11V8m0 0c0-2.5 1.6-4.5 4.5-4.5 0 2.8-1.8 4.5-4.5 4.5zm0 0C12 5.5 10.4 3.5 7.5 3.5c0 2.8 1.8 4.5 4.5 4.5z"/>',
  dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  habits: '<path d="m9 11 3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  left: '<path d="M15 18l-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  swap: '<path d="M7 7h13l-3.5-3.5M17 17H4l3.5 3.5"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  drop: '<path d="M12 2.7 6.3 9a8 8 0 1 0 11.4 0z"/>',
  play: '<path d="M7 4v16l13-8z" fill="currentColor"/>',
  video: '<rect x="2" y="5" width="15" height="14" rx="3"/><path d="m17 10 5-3v10l-5-3"/>',
  flag: '<path d="M4 22V4m0 0h13l-2 4 2 4H4"/>',
  note: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  camera: '<path d="M3 8a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6"/>',
  cloud: '<path d="M17.5 19H7a5 5 0 1 1 1.4-9.8A6 6 0 0 1 19.8 11 4 4 0 0 1 17.5 19z"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
};
export function Icon({ n, s = 20, className = '' }: { n: keyof typeof P | string; s?: number; className?: string }) {
  return <svg className={`ic ${className}`} viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: P[n] ?? '' }} />;
}

/* ---------- toast ---------- */
let toastT: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string) {
  document.querySelectorAll('.toast').forEach(e => e.remove());
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d);
  clearTimeout(toastT); toastT = setTimeout(() => d.remove(), 2400);
}

/* ---------- ring & bars ---------- */
export function Ring({ val, max, size = 116, stroke = 11, color = 'var(--kcal)', label, sub }: { val: number; max: number; size?: number; stroke?: number; color?: string; label: ReactNode; sub?: ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, pct = max ? clamp(val / max, 0, 1) : 0, col = max && val > max * 1.05 ? 'var(--warn)' : color;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface2)" strokeWidth={stroke} />
        {pct > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(c * pct).toFixed(1)} ${c.toFixed(1)}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />}
      </svg>
      <div className="ringtxt"><b>{label}</b>{sub && <small>{sub}</small>}</div>
    </div>
  );
}
export function Bar({ label, val, max, color, unit = 'g' }: { label: string; val: number; max: number; color: string; unit?: string }) {
  const pct = max ? clamp((val / max) * 100, 0, 100) : 0;
  return (
    <div className="mbar">
      <div className="mlab"><b>{label}</b><span>{fmtN(val)} / {fmtN(max)} {unit}</span></div>
      <div className="track"><i style={{ width: pct + '%', background: max && val > max * 1.05 ? 'var(--warn)' : color }} /></div>
    </div>
  );
}
export function Track({ pct, color, h }: { pct: number; color: string; h?: number }) {
  return <div className="track" style={h ? { height: h } : undefined}><i style={{ width: clamp(pct, 0, 100) + '%', background: color }} /></div>;
}

export function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return <div className="seg">{options.map(([v, l]) => <button key={String(v)} type="button" className={v === value ? 'on' : ''} onClick={() => onChange(v)}>{l}</button>)}</div>;
}

/* ---------- sheet ---------- */
export function Sheet({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="sheet" style={wide ? { width: 'min(720px, 100vw)' } : undefined} onClose={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
      {open && (
        <div className="sheet-in">
          <div className="sheet-h"><h3>{title}</h3><button type="button" className="ib" onClick={onClose} aria-label={t('close')}><Icon n="x" /></button></div>
          <div className="sheet-b">{children}</div>
          {footer && <div className="sheet-f">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/* ---------- note field (saves on blur) ---------- */
export function NoteField({ value, onSave, placeholder, rows = 2 }: { value: string; onSave: (v: string) => void; placeholder?: string; rows?: number }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return <textarea rows={rows} value={v} placeholder={placeholder ?? t('addNote')} onChange={e => setV(e.target.value)} onBlur={() => { if (v !== value) onSave(v); }} />;
}

/** Number input that keeps its own text while typing and commits on blur/enter. */
export function NumField({ value, onCommit, placeholder, step = 'any', className, style }: { value: number | null | undefined; onCommit: (v: string) => void; placeholder?: string; step?: string; className?: string; style?: React.CSSProperties }) {
  const [v, setV] = useState(value == null ? '' : String(value));
  useEffect(() => setV(value == null ? '' : String(value)), [value]);
  return <input type="number" inputMode="decimal" step={step} className={className} style={style} value={v} placeholder={placeholder}
    onChange={e => setV(e.target.value)} onBlur={() => onCommit(v)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />;
}

/* ---------- charts ---------- */
export interface Series { pts: { x: string; y: number }[]; color: string; dots?: number; line?: boolean; dash?: boolean; width?: number; faint?: boolean }
export function Chart({ series, h = 180, fmt = (v: number) => String(Math.round(v * 10) / 10) }: { series: Series[]; h?: number; fmt?: (v: number) => string }) {
  const all = series.flatMap(s => s.pts);
  const dates = [...new Set(all.map(p => p.x))].sort();
  if (dates.length < 2) return <div className="empty">{t('needMoreData')}</div>;
  const W = 600, H = h, pl = 44, pr = 12, pt = 10, pb = 24, x0 = dates[0], span = Math.max(1, diffDays(x0, dates[dates.length - 1]));
  let lo = Math.min(...all.map(p => p.y)), hi = Math.max(...all.map(p => p.y));
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
  const X = (d: string) => pl + (diffDays(x0, d) / span) * (W - pl - pr);
  const Y = (v: number) => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img">
      {[0, 0.5, 1].map(f => { const v = lo + (hi - lo) * f, y = Y(v); return <g key={f}><line x1={pl} x2={W - pr} y1={y} y2={y} stroke="var(--line)" /><text x={pl - 6} y={y + 4} textAnchor="end">{fmt(v)}</text></g>; })}
      <text x={pl} y={H - 6}>{fmtD(x0)}</text>
      <text x={W - pr} y={H - 6} textAnchor="end">{fmtD(dates[dates.length - 1])}</text>
      {series.map((s, i) => {
        const pts = [...s.pts].sort((a, b) => a.x.localeCompare(b.x));
        return (
          <g key={i}>
            {s.line !== false && pts.length > 1 && <path d={'M' + pts.map(p => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('L')} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dash ? '5 4' : undefined} />}
            {s.dots ? pts.map((p, j) => <circle key={j} cx={X(p.x)} cy={Y(p.y)} r={s.dots} fill={s.color} opacity={s.faint ? 0.45 : 1} />) : null}
          </g>
        );
      })}
    </svg>
  );
}
export function Spark({ vals, color = 'var(--accent)' }: { vals: number[]; color?: string }) {
  if (vals.length < 2) return null;
  const W = 120, H = 34, lo = Math.min(...vals), hi = Math.max(...vals), rg = hi - lo || 1;
  return <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ direction: 'ltr', flex: 'none' }}><path d={'M' + vals.map((v, i) => `${((i / (vals.length - 1)) * (W - 4) + 2).toFixed(1)},${(H - 3 - ((v - lo) / rg) * (H - 6)).toFixed(1)}`).join('L')} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export const confirmAsk = (msg: string) => window.confirm(msg);
