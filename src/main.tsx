import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { loadStore } from './store/store';
import { startSync } from './store/sync';
import { App } from './App';
import './styles.css';

async function boot() {
  await loadStore();
  await startSync().catch(e => console.error(e));
  try { await navigator.storage?.persist?.(); } catch { /* not supported */ }
  createRoot(document.getElementById('root')!).render(<App />);
  registerSW({ immediate: true });
}
void boot();
