import { useSyncExternalStore } from 'react';
import { todayISO } from './lib/util';

/** Transient UI state shared across screens (not synced). */
export const ui = { date: todayISO(), restEnd: 0, restTotal: 0 };
let v = 0;
const ls = new Set<() => void>();
export const setUi = (p: Partial<typeof ui>) => { Object.assign(ui, p); v++; ls.forEach(l => l()); };
export const useUi = () => { useSyncExternalStore(cb => { ls.add(cb); return () => { ls.delete(cb); }; }, () => v); return ui; };

export function startRest(sec: number) { if (sec > 0) setUi({ restEnd: Date.now() + sec * 1000, restTotal: sec }); }

export function beep() {
  try {
    const ac = new AudioContext();
    [0, 0.25, 0.5].forEach(o => {
      const os = ac.createOscillator(), g = ac.createGain();
      os.frequency.value = 880; os.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.2, ac.currentTime + o); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + o + 0.18);
      os.start(ac.currentTime + o); os.stop(ac.currentTime + o + 0.2);
    });
  } catch { /* audio unavailable */ }
  try { navigator.vibrate?.([200, 100, 200]); } catch { /* no vibration */ }
}

/** Glossary term shown in the info sheet (null = closed). */
export const termState = { id: null as string | null };
export const openTerm = (id: string) => { termState.id = id; v++; ls.forEach(l => l()); };
export const closeTerm = () => { termState.id = null; v++; ls.forEach(l => l()); };
