export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);
export const r1 = (n: number) => Math.round(n * 10) / 10;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const num = (v: unknown) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };
export const numOrNull = (v: unknown) => { const s = String(v ?? '').trim(); if (!s) return null; const n = parseFloat(s.replace(',', '.')); return Number.isFinite(n) ? n : null; };
export const clone = <T,>(v: T): T => structuredClone(v);
export const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const todayISO = () => iso(new Date());
export const addDays = (s: string, n: number) => { const d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); };
export const diffDays = (a: string, b: string) => Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 864e5);
export const mmss = (sec: number) => {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

/** Parse "8-12" → [8, 12]; "40" → [40, 40]. */
export const repRange = (s: string): [number, number] | null => {
  const m = String(s).match(/(\d+)\s*[-–]\s*(\d+)/);
  if (m) return [+m[1], +m[2]];
  const k = String(s).match(/\d+/);
  return k ? [+k[0], +k[0]] : null;
};
