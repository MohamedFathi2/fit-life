import { useState } from 'react';
import { GLOSSARY, GLOSSARY_CATS, termById, type Term } from '../data/glossary';
import { mineLine } from '../domain/glossary';
import { closeTerm, openTerm, termState, useUi } from '../uiState';
import { L, t } from '../lib/i18n';
import { Icon, Sheet } from './ui';

/** Small ⓘ button that opens a glossary term. */
export function Info({ id, s = 15 }: { id: string; s?: number }) {
  return <button type="button" className="info" aria-label={t('learnMore')} onClick={e => { e.preventDefault(); e.stopPropagation(); openTerm(id); }}><Icon n="info" s={s} /></button>;
}

function TermBody({ term, onSee }: { term: Term; onSee: (id: string) => void }) {
  const mine = term.mine ? mineLine(term.mine) : null;
  return (
    <>
      <p style={{ margin: '0 0 10px', lineHeight: 1.6 }}>{L(term.body)}</p>
      {mine && <div className="mine"><Icon n="flag" s={14} /><span>{mine}</span></div>}
      {term.see?.length ? <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
        <span className="tiny muted">{t('seeAlso')}</span>
        {term.see.map(id => { const x = termById(id); return x ? <button key={id} className="chip accent" onClick={() => onSee(id)}>{L(x.title)}</button> : null; })}
      </div> : null}
    </>
  );
}

/** Global sheet for a single term (opened from any ⓘ button). */
export function TermSheet() {
  useUi();
  const term = termState.id ? termById(termState.id) : undefined;
  return (
    <Sheet open={!!term} onClose={closeTerm} title={term ? L(term.title) : ''} footer={<a className="btn sm ghost" href="#learn" onClick={closeTerm}><Icon n="book" s={14} />{t('glossary')}</a>}>
      {term && <TermBody term={term} onSee={openTerm} />}
    </Sheet>
  );
}

export function termOfTheDay(date: string) {
  const n = Math.floor(new Date(date).getTime() / 864e5);
  return GLOSSARY[((n % GLOSSARY.length) + GLOSSARY.length) % GLOSSARY.length];
}

/** Full glossary page. */
export function GlossaryView() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Term['cat'] | 'all'>('all');
  const [open, setOpen] = useState<string | null>(null);
  const s = q.trim().toLowerCase();
  const list = GLOSSARY.filter(x => (cat === 'all' || x.cat === cat) && (!s || (x.title.en + x.title.ar + x.body.en + x.body.ar).toLowerCase().includes(s)));
  const jump = (id: string) => { setQ(''); setCat('all'); setOpen(id); setTimeout(() => document.getElementById('term-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); };
  return (
    <>
      <h1><Icon n="book" s={22} />{t('glossary')}</h1>
      <p className="muted small" style={{ marginTop: -6 }}>{t('glossarySub')}</p>
      <input type="search" placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} style={{ marginBottom: 10 }} />
      <div className="chips">
        <button className={`chip ${cat === 'all' ? 'accent' : ''}`} onClick={() => setCat('all')}>{t('all')}</button>
        {(Object.keys(GLOSSARY_CATS) as Term['cat'][]).map(c => <button key={c} className={`chip ${cat === c ? 'accent' : ''}`} onClick={() => setCat(c)}>{L(GLOSSARY_CATS[c])}</button>)}
      </div>
      {(Object.keys(GLOSSARY_CATS) as Term['cat'][]).map(c => {
        const items = list.filter(x => x.cat === c); if (!items.length) return null;
        return (
          <section key={c}>
            <h2 className="section">{L(GLOSSARY_CATS[c])}</h2>
            <div className="card flush">
              {items.map(x => (
                <div key={x.id} id={'term-' + x.id} className={`term ${open === x.id ? 'open' : ''}`}>
                  <button className="term-h" onClick={() => setOpen(open === x.id ? null : x.id)} aria-expanded={open === x.id}>
                    <span className="sp">{L(x.title)}</span><Icon n="down" s={16} className="chev" />
                  </button>
                  {open === x.id && <div className="term-b"><TermBody term={x} onSee={jump} /></div>}
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {!list.length && <div className="empty">{t('noMatches')}</div>}
      <p className="muted tiny" style={{ textAlign: 'center', marginTop: 16 }}>{t('notMedical')}</p>
    </>
  );
}
