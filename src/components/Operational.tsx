import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { useI18n } from '@/i18n';
import { useApp } from '@/app/AppContext';
import type { QueuedAction } from '@/domain/types';
import type { StatusClock } from '@/domain/lifecycle';

/**
 * OfflineQueue — source requirement §13.
 *
 * Offline is an operational mode, not an error. The surface stays calm
 * (neutral lifecycle tone, no red), names each held item, and states the
 * promise explicitly: the work is on the phone and will sync by itself.
 */
export function OfflineQueue({ items }: { items: QueuedAction[] }) {
  const { t } = useI18n();
  const { online } = useApp();
  if (items.length === 0) return null;

  return (
    <section className="aiec-offline" aria-live="polite">
      <header className="aiec-offline__head">
        <Icon name={online ? 'upload' : 'cloud-off'} size={18} />
        <span className="aiec-offline__title aiec-no-clip">
          {online ? t('offline.syncing') : t('offline.title')}
        </span>
        <span className="aiec-offline__count">{t('offline.queued', { count: items.length })}</span>
      </header>
      <p className="aiec-alert__text aiec-no-clip">{t('offline.body')}</p>
      <ul className="aiec-offline__items">
        {items.map((q) => (
          <li key={q.id} className="aiec-offline__item">
            <Icon name={q.kind === 'photo-upload' ? 'image' : 'list'} size={15} />
            <b className="aiec-no-clip">{q.label}</b>
            <span className="aiec-offline__size">{q.sizeLabel}</span>
          </li>
        ))}
      </ul>
      <span className="aiec-custody">
        <Icon name="shield" size={14} />
        {t('offline.storedLocally')}
      </span>
    </section>
  );
}

/**
 * SLAIndicator — the clock slot rendered on its own.
 * A breach is stated, never implied by colour alone.
 */
export function SLAIndicator({ clock }: { clock: StatusClock }) {
  if (clock.kind === 'none') return null;
  const breached = clock.kind === 'due' && clock.breached;
  const cls = `aiec-sla${breached ? ' aiec-sla--breached' : clock.kind === 'due' ? ' aiec-sla--due' : ''}`;
  return (
    <span className={cls}>
      <Icon name={breached ? 'alert' : 'clock'} size={14} />
      {clock.kind === 'held' ? clock.elapsedLabel : clock.remainingLabel}
    </span>
  );
}

/** SafetyOverride — the standing field-safety reminder. */
export function SafetyOverride() {
  const { t } = useI18n();
  return (
    <aside className="aiec-safety">
      <span className="aiec-safety__icon">
        <Icon name="helmet" size={18} />
      </span>
      <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <span className="aiec-safety__title aiec-no-clip">{t('home.safetyTitle')}</span>
        <span className="aiec-safety__body aiec-no-clip">{t('home.safetyBody')}</span>
      </span>
      <Icon name="chevron-right" size={16} style={{ color: 'var(--icon-secondary)', flex: 'none' }} />
    </aside>
  );
}

/** DemoRibbon — marks a non-production session. Suppressed when demo=false. */
export function DemoRibbon() {
  const { demo } = useApp();
  if (!demo) return null;
  return <div className="aiec-demoribbon">DEMO DATA · NOT A LIVE SESSION</div>;
}

/** ContextSheet — the bottom-sheet detent used for map and filter context. */
export function ContextSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div className="aiec-sheet__scrim" onClick={onClose} role="presentation" />
      <div className="aiec-sheet" role="dialog" aria-label={title}>
        <span className="aiec-sheet__grabber" />
        <span className="aiec-sheet__title aiec-no-clip">{title}</span>
        {children}
      </div>
    </>
  );
}

/** GlobalSearch — the search + filter row shared by home and leads. */
export function GlobalSearch({
  placeholder,
  filterLabel,
  onFilter,
  trailing,
}: {
  placeholder: string;
  filterLabel: string;
  onFilter?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <div className="aiec-searchrow">
      <label className="aiec-search">
        <Icon name="search" size={19} />
        <input type="search" placeholder={placeholder} aria-label={placeholder} />
      </label>
      {trailing ?? (
        <button type="button" className="aiec-filterbtn" onClick={onFilter}>
          <Icon name="filter" size={17} />
          {filterLabel}
        </button>
      )}
    </div>
  );
}

/** LanguageSwitch — mr is primary; en exists to exercise layout expansion. */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <button
      type="button"
      className="aiec-iconbtn"
      onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
      aria-label={t('chrome.language')}
      style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}
    >
      {lang === 'mr' ? 'EN' : 'मर'}
    </button>
  );
}

/** ScreenHelp — the per-screen help affordance seen in the capture header. */
export function ScreenHelp({ onPress }: { onPress?: () => void }) {
  const { t } = useI18n();
  return (
    <button type="button" className="aiec-chip aiec-chip--interactive" onClick={onPress}>
      <Icon name="info" size={15} />
      {t('chrome.help')}
    </button>
  );
}
