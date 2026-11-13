import { useState } from 'react';
import { signIn, signUp } from '../store/sync';
import { t } from '../lib/i18n';
import { Icon } from '../components/ui';

/** Sign-in / sign-up screen. The user can also keep using the app on this device only. */
export function Auth({ onSkip }: { onSkip: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ err?: string; info?: string }>({});
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg({});
    try {
      if (mode === 'in') await signIn(email.trim(), pw);
      else if (await signUp(email.trim(), pw)) { setMsg({ info: t('checkEmail') }); setMode('in'); }
    } catch (err) { setMsg({ err: (err as Error).message }); } finally { setBusy(false); }
  };
  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <div className="brand" style={{ marginBottom: 6 }}><img src="./icon.svg" width={28} height={28} alt="" />FitLife</div>
        <h1 style={{ margin: '8px 0 4px' }}>{t('authTitle')}</h1>
        <p className="muted small" style={{ marginTop: 0 }}>{t('authSub')}</p>
        <label className="f"><span>{t('email')}</span><input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="f"><span>{t('password')}</span><input type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} required minLength={6} value={pw} onChange={e => setPw(e.target.value)} /></label>
        {msg.err && <div className="err">{msg.err}</div>}
        {msg.info && <div className="small" style={{ color: 'var(--good)', margin: '6px 0' }}>{msg.info}</div>}
        <button className="btn primary block" disabled={busy} type="submit"><Icon n="cloud" s={16} />{mode === 'in' ? t('signIn') : t('signUp')}</button>
        <div className="row" style={{ marginTop: 12 }}>
          <button type="button" className="btn ghost sm" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? t('signUp') : t('signIn')}</button>
          <span className="sp" />
          <button type="button" className="btn ghost sm" onClick={onSkip}>{t('useOffline')}</button>
        </div>
      </form>
    </div>
  );
}
