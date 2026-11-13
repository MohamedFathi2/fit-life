import { useEffect, useState } from 'react';
import { settings, useStoreVersion } from './store/store';
import { cloudConfigured, syncInfo } from './store/sync';
import { beep, setUi, ui, useUi } from './uiState';
import { setLang, t } from './lib/i18n';
import { addDays, mmss, todayISO } from './lib/util';
import { fmtDay } from './lib/format';
import { Icon } from './components/ui';
import { Home } from './views/Home';
import { Nutrition } from './views/Nutrition';
import { Training } from './views/Training';
import { Progress } from './views/Progress';
import { Habits } from './views/Habits';
import { Settings, useSync } from './views/Settings';
import { Auth } from './views/Auth';
import { GlossaryView, TermSheet } from './components/Glossary';

const TABS = [['home', 'home'], ['nutrition', 'food'], ['training', 'dumbbell'], ['progress', 'chart'], ['habits', 'habits']] as const;
type Route = (typeof TABS)[number][0] | 'settings' | 'learn';
const routeFromHash = (): Route => { const h = location.hash.slice(1); return (['settings', 'learn', ...TABS.map(x => x[0])] as string[]).includes(h) ? (h as Route) : 'home'; };
const SKIP_KEY = 'fitlife.localOnly';
const skipped = () => { try { return localStorage.getItem(SKIP_KEY) === '1'; } catch { return false; } };

export function App() {
  useStoreVersion();
  const sync = useSync();
  const { date, restEnd } = useUi();
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [authOpen, setAuthOpen] = useState(cloudConfigured && !syncInfo.session && !skipped());
  const s = settings();

  setLang(s.lang);
  useEffect(() => {
    const r = document.documentElement;
    r.lang = s.lang; r.dir = s.lang === 'ar' ? 'rtl' : 'ltr';
    if (s.theme === 'auto') r.removeAttribute('data-theme'); else r.dataset.theme = s.theme;
  }, [s.lang, s.theme]);
  useEffect(() => { const f = () => { setRoute(routeFromHash()); window.scrollTo(0, 0); }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  useEffect(() => { document.title = `FitLife · ${t(route === 'learn' ? 'glossary' : route)}`; }, [route, s.lang]);
  useEffect(() => { if (sync.session) setAuthOpen(false); }, [sync.session]);
  // roll over to the new day if the app stays open past midnight
  useEffect(() => { let last = todayISO(); const id = setInterval(() => { const n = todayISO(); if (n !== last) { if (ui.date === last) setUi({ date: n }); last = n; } }, 30_000); return () => clearInterval(id); }, []);
  // live clocks (workout elapsed + rest timer) without re-rendering the whole app
  useEffect(() => {
    const id = setInterval(() => {
      document.querySelectorAll<HTMLElement>('[data-elapsed]').forEach(el => { el.textContent = mmss((Date.now() - Number(el.dataset.elapsed)) / 1000); });
      if (ui.restEnd) {
        const left = (ui.restEnd - Date.now()) / 1000;
        if (left <= 0) { setUi({ restEnd: 0 }); beep(); } else { const el = document.getElementById('restleft'); if (el) el.textContent = mmss(left); }
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  if (authOpen) return <Auth onSkip={() => { try { localStorage.setItem(SKIP_KEY, '1'); } catch { /* private mode */ } setAuthOpen(false); }} />;

  const today = todayISO();
  const View = { home: Home, nutrition: Nutrition, training: Training, progress: Progress, habits: Habits, learn: GlossaryView }[route as Exclude<Route, 'settings'>];
  const dotTitle = sync.state === 'local' ? t('localOnly') : sync.state === 'syncing' ? t('syncing') : sync.state === 'offline' ? t('syncOffline') : sync.state === 'error' ? t('syncError') : t('syncOk');
  return (
    <>
      <header className="top">
        <div className="hwrap">
          <a className="brand" href="#home" style={{ textDecoration: 'none' }} title={dotTitle}>FitLife <span className={`syncdot ${sync.state}`} /></a>
          <div className="datenav">
            <button aria-label="previous day" onClick={() => setUi({ date: addDays(date, -1) })}><Icon n="left" s={18} className="flip" /></button>
            <button className="dl" onClick={() => setUi({ date: today })}>{fmtDay(date)}</button>
            <button aria-label="next day" disabled={date >= today} onClick={() => setUi({ date: addDays(date, 1) })}><Icon n="right" s={18} className="flip" /></button>
          </div>
          <a className={`iconbtn ${route === 'learn' ? 'on' : ''}`} href="#learn" aria-label={t('glossary')} title={t('glossary')}><Icon n="book" s={18} /></a>
          <a className={`iconbtn ${route === 'settings' ? 'on' : ''}`} href="#settings" aria-label={t('settings')} title={t('settings')}><Icon n="gear" s={18} /></a>
        </div>
      </header>
      <main>{route === 'settings' ? <Settings onShowAuth={() => setAuthOpen(true)} /> : <View />}</main>
      {restEnd > 0 && (
        <div className="restbar"><div>
          <Icon n="timer" s={18} /><span className="small">{t('restTimer')}</span><b id="restleft">{mmss((restEnd - Date.now()) / 1000)}</b>
          <button onClick={() => setUi({ restEnd: restEnd - 15000 })}>−15</button>
          <button onClick={() => setUi({ restEnd: restEnd + 15000 })}>+15</button>
          <button onClick={() => setUi({ restEnd: 0 })}>{t('skip')}</button>
        </div></div>
      )}
      <TermSheet />
      <nav className="bottom"><div className="in">
        {TABS.map(([k, i]) => <a key={k} href={'#' + k} className={route === k ? 'on' : ''}><Icon n={i} s={22} /><span>{t(k)}</span></a>)}
      </div></nav>
    </>
  );
}
