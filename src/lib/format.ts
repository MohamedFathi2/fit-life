import { locale, t } from './i18n';
import { addDays, parseISO, todayISO } from './util';

export const fmtD = (s: string, o: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) => parseISO(s).toLocaleDateString(locale(), o);
export const fmtDay = (s: string) => {
  const td = todayISO();
  if (s === td) return t('today');
  if (s === addDays(td, -1)) return t('yesterday');
  return fmtD(s, { weekday: 'short', day: 'numeric', month: 'short' });
};
export const signed = (n: number, d = 1) => { const v = Math.round(n * 10 ** d) / 10 ** d; return (v > 0 ? '+' : '') + v; };
