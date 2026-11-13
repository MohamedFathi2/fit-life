import { useMemo, useState } from 'react';
import { day, note, plan, put, setDay, setNote, setPlan, settings, setSettings } from '../store/store';
import { useUi } from '../uiState';
import { isRest, planDayFor } from '../domain/cycle';
import { allFoods, dominant, extraMacros, foodById, macrosOf, resolveDay, roundAmount, shoppingList, swapOptions, totals, type Metric, type ResolvedItem } from '../domain/nutrition';
import { FOOD_CATS } from '../data/foods';
import { fmtN, L, t } from '../lib/i18n';
import { num, r1, uid } from '../lib/util';
import { Bar, Icon, NoteField, Ring, Seg, Sheet, confirmAsk, toast } from '../components/ui';
import type { Food, Macros } from '../types';

const fmtAmt = (a: number, unit: string) => `${r1(a)}${unit === 'g' || unit === 'ml' ? ' ' : ' × '}${unit === 'g' ? 'g' : unit}`;
const macroLine = (m: Macros) => `P ${r1(m.p)} · C ${r1(m.c)} · F ${r1(m.f)}`;

export function Nutrition() {
  const { date } = useUi();
  const [edit, setEdit] = useState(false);
  const [swap, setSwap] = useState<{ mealUid: string; itemUid: string } | null>(null);
  const [picker, setPicker] = useState<{ mode: 'extra' } | { mode: 'plan'; mealUid: string } | null>(null);
  const [itemEdit, setItemEdit] = useState<{ mealUid: string; itemUid: string } | null>(null);
  const [mealEdit, setMealEdit] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);
  const rest = isRest(date), rec = day(date);
  const { target, eaten } = totals(date);
  const meals = resolveDay(date);
  const left = target.kcal - eaten.kcal;
  const defRest = !!planDayFor(date)?.rest;

  const toggle = (uid_: string) => setDay(date, d => { if (d.eaten[uid_]) delete d.eaten[uid_]; else d.eaten[uid_] = true; });
  const eatAll = (items: ResolvedItem[]) => setDay(date, d => { const allOn = items.every(i => d.eaten[i.item.uid]); items.forEach(i => { if (allOn) delete d.eaten[i.item.uid]; else d.eaten[i.item.uid] = true; }); });
  const setType = (v: 'train' | 'rest') => setDay(date, d => { if ((v === 'rest') === defRest) delete d.dayType; else d.dayType = v; });

  return (
    <>
      <div className="card">
        <div className="row wrap" style={{ marginBottom: 12 }}>
          <span className="chip accent">{t('phase')}: {L(plan().nutrition.phase)}</span><span className="sp" />
          <Seg value={rest ? 'rest' : 'train'} options={[['train', t('trainingDay')], ['rest', t('restDay')]]} onChange={setType} />
        </div>
        <div className="row" style={{ gap: 16 }}>
          <Ring size={128} val={eaten.kcal} max={target.kcal} label={fmtN(eaten.kcal)} sub={left >= 0 ? t('left', fmtN(left)) : t('over', fmtN(-left))} />
          <div className="sp">
            <Bar label={t('protein')} val={eaten.p} max={target.p} color="var(--p)" />
            <Bar label={t('carbs')} val={eaten.c} max={target.c} color="var(--c)" />
            <Bar label={t('fat')} val={eaten.f} max={target.f} color="var(--f)" />
          </div>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <span className="muted tiny sp">{t('macrosFromPlan')}</span>
          <button className={`btn sm ${edit ? 'primary' : ''}`} onClick={() => setEdit(!edit)}><Icon n="edit" s={14} />{edit ? t('doneEditing') : t('editPlan')}</button>
        </div>
      </div>

      {meals.map(m => {
        const eatenM = m.items.filter(i => rec?.eaten?.[i.item.uid]).reduce((a, i) => a + i.macros.kcal, 0);
        const allOn = m.items.length > 0 && m.items.every(i => rec?.eaten?.[i.item.uid]);
        const myNote = note('meal:' + m.meal.uid);
        return (
          <div key={m.meal.uid} className={`card flush ${m.skipped ? 'skip' : ''}`}>
            <div className="mealh">
              <div className="sp"><h3>{L(m.meal.name)}</h3><div className="muted tiny">{fmtN(eatenM)} / {fmtN(m.total.kcal)} {t('kcal')} · {macroLine(m.total)}</div></div>
              {m.skipped ? <span className="chip">{t('skippedRest')}</span> : m.meal.trainingOnly ? <span className="chip">{t('trainingOnly')}</span> : null}
              <button className={`ib ${myNote ? 'on' : ''}`} title={t('myNote')} onClick={() => setNoteOpen(noteOpen === m.meal.uid ? null : m.meal.uid)}><Icon n="note" s={18} /></button>
              {edit
                ? <button className="ib" onClick={() => setMealEdit(m.meal.uid)}><Icon n="edit" s={18} /></button>
                : !m.skipped && m.items.length > 0 && <button className={`btn sm ${allOn ? '' : 'primary'}`} onClick={() => eatAll(m.items)}><Icon n="check" s={14} />{t('eatAll')}</button>}
            </div>
            {m.meal.note && <div className="notebox"><Icon n="bulb" s={14} className="" /> <b className="tiny muted">{t('coachNote')}:</b> {L(m.meal.note)}</div>}
            {(noteOpen === m.meal.uid || myNote) && (
              <div className="notebox mine">
                {noteOpen === m.meal.uid
                  ? <NoteField value={myNote} onSave={v => setNote('meal:' + m.meal.uid, v)} />
                  : <span style={{ whiteSpace: 'pre-wrap' }}><b className="tiny muted">{t('myNote')}:</b> {myNote}</span>}
              </div>
            )}
            {m.items.map(i => {
              const on = !!rec?.eaten?.[i.item.uid];
              const origFood = i.item.orig ? foodById(i.item.orig.foodId) : undefined;
              const cooked = i.food?.cookedFactor ? Math.round(i.amount * i.food.cookedFactor) : null;
              return (
                <div key={i.item.uid} className={`food ${on ? 'on' : ''}`}>
                  <button className={`chk ${on ? 'on' : ''}`} disabled={m.skipped} onClick={() => toggle(i.item.uid)} aria-pressed={on}>{on && <Icon n="check" s={16} />}</button>
                  <div className="fmain">
                    <div className="fname">{i.food ? L(i.food.name) : '?'}{i.todaySwap && <span className="tag">{t('swapToday')}</span>}</div>
                    <div className="fsub">{i.food ? fmtAmt(i.amount, i.food.unit) : ''}{cooked ? ` (${t('cooked', cooked)})` : ''} · {macroLine(i.macros)}</div>
                    {origFood && !i.todaySwap && <div className="fsub" style={{ color: 'var(--warn)' }}>{t('swappedFrom', L(origFood.name))}</div>}
                  </div>
                  <div className="fk">{fmtN(i.macros.kcal)}<small>{t('kcal')}</small></div>
                  {edit
                    ? <button className="ib" onClick={() => setItemEdit({ mealUid: m.meal.uid, itemUid: i.item.uid })}><Icon n="edit" s={17} /></button>
                    : <button className="ib" title={t('swap')} onClick={() => setSwap({ mealUid: m.meal.uid, itemUid: i.item.uid })}><Icon n="swap" s={18} /></button>}
                </div>
              );
            })}
            {edit && <div style={{ padding: '10px 14px' }}><button className="btn sm" onClick={() => setPicker({ mode: 'plan', mealUid: m.meal.uid })}><Icon n="plus" s={14} />{t('add')}</button></div>}
          </div>
        );
      })}
      {edit && <button className="btn block" style={{ marginBottom: 12 }} onClick={() => setPlan(p => { p.nutrition.meals.push({ uid: uid(), name: { en: 'New meal', ar: 'وجبة جديدة' }, items: [] }); })}><Icon n="plus" s={16} />{t('add')}</button>}

      <div className="card flush">
        <div className="mealh"><h3 className="sp">{t('extras')}</h3><button className="btn sm primary" onClick={() => setPicker({ mode: 'extra' })}><Icon n="plus" s={14} />{t('add')}</button></div>
        {rec?.extras?.length ? rec.extras.map((x, i) => {
          const f = x.foodId ? foodById(x.foodId) : undefined, m = extraMacros(x);
          return (
            <div key={x.uid} className="food">
              <div className="fmain"><div className="fname">{f ? L(f.name) : x.name}</div><div className="fsub">{f ? fmtAmt(x.amount, f.unit) + ' · ' : ''}{macroLine(m)}</div></div>
              <div className="fk">{fmtN(m.kcal)}<small>{t('kcal')}</small></div>
              <button className="ib" onClick={() => setDay(date, d => { d.extras.splice(i, 1); })}><Icon n="trash" s={17} /></button>
            </div>
          );
        }) : <div className="empty">{t('extrasEmpty')}</div>}
      </div>

      <Shopping />

      {swap && <SwapSheet date={date} {...swap} onClose={() => setSwap(null)} />}
      {picker && <FoodPicker onClose={() => setPicker(null)} onPick={(food, amount) => {
        if (picker.mode === 'extra') setDay(date, d => { d.extras.push({ uid: uid(), foodId: food.id, amount }); });
        else setPlan(p => { p.nutrition.meals.find(x => x.uid === picker.mealUid)?.items.push({ uid: uid(), foodId: food.id, amount }); });
        setPicker(null);
      }} onQuick={picker.mode === 'extra' ? (name, m) => { setDay(date, d => { d.extras.push({ uid: uid(), name, amount: 1, macros: m }); }); setPicker(null); } : undefined} />}
      {itemEdit && <ItemEditSheet {...itemEdit} onClose={() => setItemEdit(null)} />}
      {mealEdit && <MealEditSheet mealUid={mealEdit} onClose={() => setMealEdit(null)} />}
    </>
  );
}

/* ---------- swap ---------- */
function SwapSheet({ date, mealUid, itemUid, onClose }: { date: string; mealUid: string; itemUid: string; onClose: () => void }) {
  const s = settings();
  const meal = plan().nutrition.meals.find(m => m.uid === mealUid);
  const item = meal?.items.find(i => i.uid === itemUid);
  const todaySw = day(date)?.swaps?.[itemUid];
  const from = item ? foodById(item.foodId) : undefined;
  const [mode, setMode] = useState<'auto' | Metric>(s.swapMode);
  const [scope, setScope] = useState<'group' | 'all'>('group');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const opts = useMemo(() => (from && item ? swapOptions(from, item.amount, mode, scope, q) : []), [from, item, mode, scope, q]);
  if (!item || !from) return null;
  const orig = macrosOf(from, item.amount);
  const chosen = opts.find(o => o.food.id === sel);
  const amt = num(amount) || chosen?.amount || 0;
  const chosenM = chosen ? macrosOf(chosen.food, amt) : null;
  const autoM = dominant(from);
  const metricLabel: Record<Metric, string> = { kcal: t('calories'), p: t('protein'), c: t('carbs'), f: t('fat') };

  const apply = (always: boolean) => {
    if (!chosen) return;
    if (always) {
      setPlan(p => {
        const it = p.nutrition.meals.find(m => m.uid === mealUid)?.items.find(i => i.uid === itemUid); if (!it) return;
        it.orig ??= { foodId: it.foodId, amount: it.amount };
        it.foodId = chosen.food.id; it.amount = amt;
        if (it.orig.foodId === it.foodId) delete it.orig;
      });
      if (todaySw) setDay(date, d => { delete d.swaps[itemUid]; });
    } else {
      setDay(date, d => { d.swaps[itemUid] = { foodId: chosen.food.id, amount: amt }; });
    }
    if (mode !== s.swapMode) setSettings(x => { x.swapMode = mode; });
    toast(t('saved')); onClose();
  };
  const D = ({ k, v }: { k: string; v: number }) => { const r = Math.round(v); return r === 0 ? null : <span className={`d ${r > 0 ? 'up' : 'dn'}`}>{k} {r > 0 ? '+' : ''}{r}</span>; };

  return (
    <Sheet open onClose={onClose} title={t('swapTitle', L(from.name))} wide
      footer={chosen ? (
        <div style={{ width: '100%' }}>
          <div className="row wrap" style={{ marginBottom: 10 }}>
            <b className="sp">{L(chosen.food.name)}</b>
            <div className="stepper">
              <button className="ib" onClick={() => setAmount(String(Math.max(0, roundAmount(amt - (chosen.food.unit === 'g' ? 5 : 0.5), chosen.food.unit))))}><Icon n="minus" s={16} /></button>
              <input type="number" inputMode="decimal" value={amount || chosen.amount} onChange={e => setAmount(e.target.value)} />
              <span className="muted small">{chosen.food.unit}</span>
              <button className="ib" onClick={() => setAmount(String(roundAmount(amt + (chosen.food.unit === 'g' ? 5 : 0.5), chosen.food.unit)))}><Icon n="plus" s={16} /></button>
            </div>
          </div>
          {chosenM && <div className="small muted" style={{ marginBottom: 10 }}>{fmtN(chosenM.kcal)} {t('kcal')} · {macroLine(chosenM)}</div>}
          <div className="row"><button className="btn sp" onClick={() => apply(false)}>{t('swapToday')}</button><button className="btn primary sp" onClick={() => apply(true)}>{t('swapAlways')}</button></div>
        </div>
      ) : (todaySw || item.orig) ? (
        <div className="row wrap" style={{ width: '100%' }}>
          {todaySw && <button className="btn sp" onClick={() => { setDay(date, d => { delete d.swaps[itemUid]; }); onClose(); }}>{t('revertToday')}</button>}
          {item.orig && <button className="btn sp" onClick={() => { setPlan(p => { const it = p.nutrition.meals.find(m => m.uid === mealUid)?.items.find(i => i.uid === itemUid); if (it?.orig) { it.foodId = it.orig.foodId; it.amount = it.orig.amount; delete it.orig; } }); onClose(); }}>{t('revertCoach')}</button>}
        </div>
      ) : undefined}>
      <div className="stat" style={{ marginBottom: 12 }}><small>{fmtAmt(item.amount, from.unit)}</small><b>{fmtN(orig.kcal)} {t('kcal')}</b> <span className="small muted">{macroLine(orig)}</span></div>
      <div className="row wrap" style={{ marginBottom: 8 }}>
        <span className="small muted">{t('matchBy')}</span>
        <Seg value={mode} onChange={v => { setMode(v); setSel(null); setAmount(''); }} options={[['auto', `${t('matchAuto')} (${metricLabel[autoM]})`], ['kcal', t('calories')], ['p', t('protein')], ['c', t('carbs')], ['f', t('fat')]]} />
      </div>
      <input type="search" placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} style={{ marginBottom: 8 }} />
      {!q && <div style={{ marginBottom: 12 }}><Seg value={scope} onChange={setScope} options={[['group', t('sameGroup')], ['all', t('allFoods')]]} /></div>}
      {opts.length === 0 && <div className="empty">{t('noMatches')}</div>}
      {opts.map(o => (
        <button key={o.food.id} className={`opt ${sel === o.food.id ? 'sel' : ''}`} onClick={() => { setSel(o.food.id); setAmount(''); }}>
          <div className="sp">
            <div className="fname">{L(o.food.name)}</div>
            <div className="fsub">{L(FOOD_CATS[o.food.cat] ?? FOOD_CATS.other)}</div>
            <div className="diffs"><D k="kcal" v={o.diff.kcal} /><D k="P" v={o.diff.p} /><D k="C" v={o.diff.c} /><D k="F" v={o.diff.f} /></div>
          </div>
          <div className="fk">{fmtAmt(o.amount, o.food.unit)}<small>{fmtN(o.macros.kcal)} {t('kcal')}</small></div>
        </button>
      ))}
    </Sheet>
  );
}

/* ---------- food picker (extras / adding to plan) ---------- */
function FoodPicker({ onClose, onPick, onQuick }: { onClose: () => void; onPick: (f: Food, amount: number) => void; onQuick?: (name: string, m: Macros) => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Food | null>(null);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'pick' | 'new' | 'quick'>('pick');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return allFoods().filter(f => !s || (f.name.en + ' ' + f.name.ar).toLowerCase().includes(s)).sort((a, b) => Number(!!b.custom) - Number(!!a.custom)).slice(0, 80);
  }, [q]);
  const amt = num(amount) || (sel ? (sel.unit === 'g' || sel.unit === 'ml' ? 100 : 1) : 0);
  return (
    <Sheet open onClose={onClose} title={mode === 'new' ? t('newFood') : mode === 'quick' ? t('quick') : t('addExtra')}
      footer={mode === 'pick' && sel ? (
        <div className="row" style={{ width: '100%' }}>
          <b className="sp">{L(sel.name)}</b>
          <input type="number" inputMode="decimal" style={{ width: 90 }} value={amount} placeholder={String(amt)} onChange={e => setAmount(e.target.value)} />
          <span className="muted small">{sel.unit}</span>
          <button className="btn primary" onClick={() => onPick(sel, amt)}>{t('add')} · {fmtN(macrosOf(sel, amt).kcal)}</button>
        </div>
      ) : undefined}>
      {mode === 'pick' && <>
        <div className="row" style={{ marginBottom: 10 }}>
          <input type="search" autoFocus placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="row wrap" style={{ marginBottom: 10 }}>
          <button className="btn sm" onClick={() => setMode('new')}><Icon n="plus" s={14} />{t('newFood')}</button>
          {onQuick && <button className="btn sm" onClick={() => setMode('quick')}>{t('quick')}</button>}
        </div>
        {list.map(f => (
          <button key={f.id} className={`opt ${sel?.id === f.id ? 'sel' : ''}`} onClick={() => { setSel(f); setAmount(''); }}>
            <div className="sp"><div className="fname">{L(f.name)}</div><div className="fsub">{L(FOOD_CATS[f.cat] ?? FOOD_CATS.other)} · {fmtN(f.kcal)} {t('kcal')} / {f.per} {f.unit}</div></div>
          </button>
        ))}
      </>}
      {mode === 'new' && <FoodForm onSave={f => { put('foods', f.id, f); setMode('pick'); setQ(L(f.name)); setSel(f); }} onCancel={() => setMode('pick')} />}
      {mode === 'quick' && onQuick && <QuickForm onSave={onQuick} onCancel={() => setMode('pick')} />}
    </Sheet>
  );
}

function FoodForm({ onSave, onCancel }: { onSave: (f: Food) => void; onCancel: () => void }) {
  const [v, setV] = useState({ name: '', cat: 'custom', unit: 'g', per: '100', kcal: '', p: '', c: '', f: '' });
  const F = (k: keyof typeof v, label: string, type = 'number') => <label className="f"><span>{label}</span><input type={type} inputMode={type === 'number' ? 'decimal' : undefined} value={v[k]} onChange={e => setV({ ...v, [k]: e.target.value })} /></label>;
  const save = () => {
    const p = num(v.p), c = num(v.c), f = num(v.f);
    const kcal = v.kcal === '' ? Math.round(4 * p + 4 * c + 9 * f) : num(v.kcal);
    if (!v.name.trim()) return;
    onSave({ id: 'c_' + uid(), name: { en: v.name.trim(), ar: v.name.trim() }, cat: v.cat, unit: v.unit.trim() || 'g', per: num(v.per) || 100, kcal, p, c, f, custom: true });
  };
  return (
    <>
      {F('name', t('foodName'), 'text')}
      <div className="grid3">
        <label className="f"><span>{t('group')}</span><select value={v.cat} onChange={e => setV({ ...v, cat: e.target.value })}>{Object.entries(FOOD_CATS).map(([k, l]) => <option key={k} value={k}>{L(l)}</option>)}</select></label>
        {F('per', t('per'))}{F('unit', t('unit'), 'text')}
      </div>
      <div className="grid3">{F('p', t('protein') + ' g')}{F('c', t('carbs') + ' g')}{F('f', t('fat') + ' g')}</div>
      {F('kcal', t('kcal'))}
      <div className="row"><button className="btn" onClick={onCancel}>{t('cancel')}</button><span className="sp" /><button className="btn primary" onClick={save}>{t('save')}</button></div>
    </>
  );
}
function QuickForm({ onSave, onCancel }: { onSave: (name: string, m: Macros) => void; onCancel: () => void }) {
  const [v, setV] = useState({ name: '', kcal: '', p: '', c: '', f: '' });
  const F = (k: keyof typeof v, label: string, type = 'number') => <label className="f"><span>{label}</span><input type={type} inputMode={type === 'number' ? 'decimal' : undefined} value={v[k]} onChange={e => setV({ ...v, [k]: e.target.value })} /></label>;
  return (
    <>
      {F('name', t('foodName'), 'text')}
      <div className="grid3">{F('p', t('protein') + ' g')}{F('c', t('carbs') + ' g')}{F('f', t('fat') + ' g')}</div>
      {F('kcal', t('kcal'))}
      <div className="row"><button className="btn" onClick={onCancel}>{t('cancel')}</button><span className="sp" />
        <button className="btn primary" onClick={() => { const p = num(v.p), c = num(v.c), f = num(v.f); onSave(v.name.trim() || '—', { p, c, f, kcal: v.kcal === '' ? 4 * p + 4 * c + 9 * f : num(v.kcal) }); }}>{t('add')}</button></div>
    </>
  );
}

/* ---------- plan editing ---------- */
function ItemEditSheet({ mealUid, itemUid, onClose }: { mealUid: string; itemUid: string; onClose: () => void }) {
  const item = plan().nutrition.meals.find(m => m.uid === mealUid)?.items.find(i => i.uid === itemUid);
  const food = item ? foodById(item.foodId) : undefined;
  const [amount, setAmount] = useState(String(item?.amount ?? ''));
  if (!item || !food) return null;
  const m = macrosOf(food, num(amount));
  return (
    <Sheet open onClose={onClose} title={L(food.name)}
      footer={<><button className="btn bad" onClick={() => { if (!confirmAsk(t('confirmDelete'))) return; setPlan(p => { const meal = p.nutrition.meals.find(x => x.uid === mealUid); if (meal) meal.items = meal.items.filter(i => i.uid !== itemUid); }); onClose(); }}><Icon n="trash" s={14} />{t('del')}</button><span className="sp" />
        <button className="btn primary" onClick={() => { setPlan(p => { const it = p.nutrition.meals.find(x => x.uid === mealUid)?.items.find(i => i.uid === itemUid); if (it) it.amount = num(amount); }); onClose(); }}>{t('save')}</button></>}>
      <label className="f"><span>{t('amount')} ({food.unit})</span><input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} /></label>
      <div className="small muted">{fmtN(m.kcal)} {t('kcal')} · {macroLine(m)}</div>
    </Sheet>
  );
}
function MealEditSheet({ mealUid, onClose }: { mealUid: string; onClose: () => void }) {
  const meal = plan().nutrition.meals.find(m => m.uid === mealUid);
  const [name, setName] = useState(meal ? L(meal.name) : '');
  const [trainingOnly, setTO] = useState(!!meal?.trainingOnly);
  if (!meal) return null;
  return (
    <Sheet open onClose={onClose} title={L(meal.name)}
      footer={<><button className="btn bad" onClick={() => { if (!confirmAsk(t('confirmDelete'))) return; setPlan(p => { p.nutrition.meals = p.nutrition.meals.filter(x => x.uid !== mealUid); }); onClose(); }}><Icon n="trash" s={14} />{t('del')}</button><span className="sp" />
        <button className="btn primary" onClick={() => { setPlan(p => { const m = p.nutrition.meals.find(x => x.uid === mealUid); if (m) { m.name = { en: name, ar: name }; m.trainingOnly = trainingOnly; } }); onClose(); }}>{t('save')}</button></>}>
      <label className="f"><span>{t('foodName')}</span><input type="text" value={name} onChange={e => setName(e.target.value)} /></label>
      <label className="row small"><input type="checkbox" checked={trainingOnly} onChange={e => setTO(e.target.checked)} /> {t('trainingOnly')}</label>
    </Sheet>
  );
}

/* ---------- shopping ---------- */
function Shopping() {
  const [days, setDays] = useState(7);
  const rows = shoppingList(days).sort((a, b) => L(a.food.name).localeCompare(L(b.food.name)));
  return (
    <details className="card">
      <summary><Icon n="cart" s={18} />{t('shopping')}</summary>
      <div style={{ marginTop: 12 }}>
        <div className="row" style={{ marginBottom: 8 }}><span className="small muted">{t('shopDays')}</span><input type="number" min={1} max={60} style={{ width: 80 }} value={days} onChange={e => setDays(Math.max(1, Math.min(60, Math.round(num(e.target.value)) || 1)))} /></div>
        <div className="muted tiny" style={{ marginBottom: 8 }}>{t('shopHint')}</div>
        {rows.map(r => <div key={r.food.id} className="entry"><span className="sp">{L(r.food.name)}</span><b>{r.food.unit === 'g' && r.amount >= 1000 ? `${r1(r.amount / 1000)} kg` : fmtAmt(r.amount, r.food.unit)}</b></div>)}
      </div>
    </details>
  );
}
