import { embedUrl, exById, isPortrait } from '../domain/training';
import { L, t } from '../lib/i18n';
import { Icon, Sheet } from './ui';

/** Plays an exercise's demo video inside the app (YouTube / TikTok / Instagram embeds). */
export function VideoSheet({ exId, onClose }: { exId: string | null; onClose: () => void }) {
  const ex = exId ? exById(exId) : null;
  const src = embedUrl(ex?.video);
  return (
    <Sheet open={!!exId} onClose={onClose} title={ex ? L(ex.name) : ''}
      footer={ex?.video ? <a className="btn sm ghost" href={ex.video} target="_blank" rel="noreferrer"><Icon n="right" s={14} className="flip" />{t('openOriginal')}</a> : undefined}>
      {src
        ? <iframe className={`video ${isPortrait(ex?.video) ? 'port' : 'land'}`} src={src} title={ex ? L(ex.name) : ''} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" />
        : <div className="empty">{t('noVideo')}</div>}
    </Sheet>
  );
}
