import { useEffect, useState } from 'react';
import { all, del, get, put } from '../store/store';
import { deletePhoto, photoURL, savePhoto } from '../store/sync';
import { useUi } from '../uiState';
import { weights } from '../domain/summary';
import { t } from '../lib/i18n';
import { addDays, diffDays, numOrNull, r1, uid } from '../lib/util';
import { fmtD, signed } from '../lib/format';
import { Chart, Icon, NumField, Seg, confirmAsk, toast } from '../components/ui';
import type { BodyEntry } from '../types';

function upsert(date: string, patch: Partial<BodyEntry>) {
  const cur = get('body', date) ?? { date };
  const next: BodyEntry = { ...cur, ...patch, date };
  const hasData = Object.entries(next).some(([k, v]) => k !== 'date' && v != null);
  if (hasData) put('body', date, next); else del('body', date);
}

/** Small "log today's weight" control used on Home and Progress. */
export function BodyQuick() {
  const { date } = useUi();
  const cur = get('body', date);
  return (
    <div className="row">
      <NumField value={cur?.weight ?? null} placeholder={t('weightKg')} step="0.1" onCommit={v => { const n = numOrNull(v); if (n !== (cur?.weight ?? null)) { upsert(date, { weight: n }); if (n != null) toast(t('saved')); } }} />
      <span className="muted small">kg</span>
    </div>
  );
}

async function compress(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const sc = Math.min(1, 1200 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>(res => c.toBlob(b => res(b!), 'image/jpeg', 0.82));
  } finally { URL.revokeObjectURL(url); }
}

function Photo({ id, alt }: { id: string; alt?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => { let live = true; void photoURL(id).then(u => { if (live) setSrc(u); }); return () => { live = false; }; }, [id]);
  return src ? <img src={src} alt={alt ?? ''} /> : <div style={{ aspectRatio: '3/4' }} />;
}

const FIELDS = ['waist', 'chest', 'arm', 'thigh', 'hips', 'neck', 'bf'] as const;

export function Progress() {
  const { date } = useUi();
  const [range, setRange] = useState(90);
  const [sel, setSel] = useState<string[]>([]);
  const cur = get('body', date);
  const ws = weights(), from = range ? addDays(date, -range) : '0000';
  const inR = ws.filter(e => e.date >= from && e.date <= date);
  const ma = inR.map(e => { const w = ws.filter(x => x.date > addDays(e.date, -7) && x.date <= e.date); return { x: e.date, y: r1(w.reduce((a, b) => a + b.weight, 0) / w.length) }; });
  const first = inR[0], last = inR[inR.length - 1];
  const ch = first && last && first !== last ? last.weight - first.weight : null;
  const wk = ch != null ? (ch / Math.max(1, diffDays(first.date, last.date))) * 7 : null;
  const body = all('body').sort((a, b) => b.date.localeCompare(a.date));
  const photos = body.filter(e => e.photo);
  const waist = body.filter(e => e.waist != null && e.date >= from && e.date <= date);
  const selE = sel.map(d => body.find(e => e.date === d)).filter((e): e is BodyEntry => !!e?.photo).sort((a, b) => a.date.localeCompare(b.date));

  const onPhoto = async (f: File | undefined) => {
    if (!f) return;
    const blob = await compress(f);
    const id = cur?.photo ?? uid();
    await savePhoto(id, blob);
    upsert(date, { photo: id });
    toast(t('saved'));
  };

  return (
    <>
      <div className="card">
        <h2><Icon n="edit" s={18} />{t('logWeight')} · <span className="muted">{fmtD(date, { weekday: 'short', day: 'numeric', month: 'short' })}</span></h2>
        <BodyQuick />
        <details style={{ marginTop: 12 }}>
          <summary className="small">{t('measurements')} · {t('photo')}</summary>
          <div className="grid3" style={{ marginTop: 10 }}>
            {FIELDS.map(k => (
              <label className="f" key={k}><span>{t(k === 'bf' ? 'bodyFat' : k)}</span>
                <NumField value={cur?.[k] ?? null} step="0.1" onCommit={v => { const n = numOrNull(v); if (n !== (cur?.[k] ?? null)) upsert(date, { [k]: n }); }} /></label>
            ))}
          </div>
          <label className="btn sm"><Icon n="camera" s={14} />{t('addPhoto')}<input type="file" accept="image/*" hidden onChange={e => void onPhoto(e.target.files?.[0])} /></label>
        </details>
      </div>

      <div className="card">
        <div className="row wrap" style={{ marginBottom: 10 }}>
          <h2 className="sp" style={{ margin: 0 }}>{t('weight')}</h2>
          <Seg value={range} onChange={setRange} options={[[30, t('d30')], [90, t('d90')], [180, t('d180')], [0, t('all')]]} />
        </div>
        <div className="grid3" style={{ marginBottom: 10 }}>
          <div className="stat"><small>{t('current')}</small><b>{last ? r1(last.weight) : t('noData')}</b></div>
          <div className="stat"><small>{t('change')}</small><b style={{ color: ch == null ? undefined : ch <= 0 ? 'var(--good)' : 'var(--warn)' }}>{ch != null ? signed(ch) : t('noData')}</b></div>
          <div className="stat"><small>{t('perWeek')}</small><b>{wk != null ? signed(wk, 2) : t('noData')}</b></div>
        </div>
        <Chart series={[{ pts: inR.map(e => ({ x: e.date, y: e.weight })), color: 'var(--muted)', dots: 3, line: false, faint: true }, { pts: ma, color: 'var(--accent)' }]} />
        <div className="legend"><span><i style={{ background: 'var(--muted)' }} />{t('weight')}</span><span><i style={{ background: 'var(--accent)' }} />{t('avg7')}</span></div>
        {waist.length > 1 && <><hr /><h2>{t('waist')} (cm)</h2><Chart h={140} series={[{ pts: waist.map(e => ({ x: e.date, y: e.waist! })), color: 'var(--p)', dots: 3 }]} /></>}
      </div>

      <div className="card">
        <h2><Icon n="camera" s={18} />{t('photos')}</h2>
        {!photos.length ? <div className="empty">{t('noPhotos')}</div> : <>
          {selE.length === 2
            ? <div className="compare">{selE.map(e => <div key={e.date}><Photo id={e.photo!} /><div className="small muted" style={{ textAlign: 'center' }}>{fmtD(e.date, { day: 'numeric', month: 'short', year: 'numeric' })}{e.weight != null ? ` · ${r1(e.weight)} kg` : ''}</div></div>)}</div>
            : <div className="muted small" style={{ marginBottom: 8 }}>{t('compareHint')}</div>}
          <div className="photos">
            {photos.map(e => (
              <button key={e.date} className={`photo ${sel.includes(e.date) ? 'sel' : ''}`} onClick={() => setSel(s => s.includes(e.date) ? s.filter(x => x !== e.date) : [...s, e.date].slice(-2))}>
                <Photo id={e.photo!} /><span>{fmtD(e.date)}</span>
              </button>
            ))}
          </div>
        </>}
      </div>

      <details className="card">
        <summary>{t('entries')} ({body.length})</summary>
        <div style={{ marginTop: 8 }}>
          {body.map(e => (
            <div className="entry" key={e.date}>
              <span style={{ minWidth: 84 }}>{fmtD(e.date, { day: 'numeric', month: 'short', year: '2-digit' })}</span>
              <span className="sp small">{e.weight != null && <b>{r1(e.weight)} kg </b>}{FIELDS.filter(k => e[k] != null).map(k => `${t(k === 'bf' ? 'bodyFat' : k)} ${e[k]}`).join(' · ')}{e.photo ? ' 📷' : ''}</span>
              <button className="ib" onClick={() => { if (!confirmAsk(t('confirmDelete'))) return; if (e.photo) void deletePhoto(e.photo); del('body', e.date); }}><Icon n="trash" s={16} /></button>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}
