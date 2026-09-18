import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import type { AiecNotification, DocumentRequirement, ProgressStage } from '@/domain/types';

/* ------------------------------------------------------------ SEGMENTS */

export interface SegmentSpec {
  id: string;
  label: string;
  count?: number;
  dot?: boolean;
}

/** Filter pills. Scrolls horizontally rather than dropping a filter (§8). */
export function Segments({
  items,
  value,
  onChange,
}: {
  items: SegmentSpec[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="aiec-segments" role="tablist">
      {items.map((s) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={s.id === value}
          className={`aiec-segment${s.id === value ? ' aiec-segment--on' : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.count === undefined ? s.label : `${s.label} (${s.count})`}
          {s.dot ? <span className="aiec-segment__dot" /> : null}
        </button>
      ))}
    </div>
  );
}

/** Content tabs (record detail). Underline treatment, not pills. */
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="aiec-tabs" role="tablist">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === value}
          className={`aiec-tabitem${t.id === value ? ' aiec-tabitem--on' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------ ENTITY TIMELINE */

export interface TimelineEntry {
  id: string;
  title: string;
  note?: string;
  state: 'done' | 'running' | 'pending';
  chip?: { label: string; tone: 'material' | 'selling' | 'done' | 'new' };
}

/**
 * EntityTimeline — what happened to this entity and what happens next.
 *
 * Distinct from WorkflowProgress: that one tracks a wizard the user is inside
 * right now, horizontally. This one is the entity's history and forecast, read
 * vertically, where each stage may carry its own custody and date.
 */
export function EntityTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="aiec-timeline">
      {entries.map((e) => (
        <li key={e.id} className={`aiec-tl aiec-tl--${e.state}`}>
          <span className="aiec-tl__marker">
            {e.state === 'done' ? (
              <Icon name="check" size={16} stroke={2.6} />
            ) : e.state === 'running' ? (
              <Icon name="clock" size={16} />
            ) : (
              <Icon name="clock" size={15} />
            )}
          </span>
          <span className="aiec-tl__body">
            <span className="aiec-tl__title aiec-no-clip">{e.title}</span>
            {e.note ? <span className="aiec-tl__note aiec-no-clip">{e.note}</span> : null}
          </span>
          {e.chip ? (
            <span
              className="aiec-chip"
              style={{
                background: `var(--aiec-lifecycle-${e.chip.tone}-surface)`,
                color: `var(--aiec-lifecycle-${e.chip.tone}-text)`,
                alignSelf: 'start',
              }}
            >
              {e.chip.label}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------- STAGE CARDS */

export function StageCard({ stage, expanded }: { stage: ProgressStage; expanded: boolean }) {
  const { t } = useI18n();
  const chip =
    stage.state === 'done'
      ? { key: 'progress.chipDone', tone: 'done' }
      : stage.state === 'running'
        ? { key: 'progress.chipRunning', tone: 'selling' }
        : { key: 'progress.chipPending', tone: 'new' };

  return (
    <article className="aiec-card">
      <div className={`aiec-tlcard aiec-tl--${stage.state}`}>
        <span className="aiec-tl__marker">
          {stage.state === 'done' ? (
            <Icon name="check" size={16} stroke={2.6} />
          ) : stage.state === 'running' ? (
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: '2.5px solid #fff',
              }}
            />
          ) : null}
        </span>
        <span className="aiec-tl__body">
          <span className="aiec-tl__title aiec-no-clip" style={{ color: 'var(--text-primary)' }}>
            {t(stage.titleKey as StringKey)}
          </span>
          <span className="aiec-tl__note aiec-no-clip">
            {t(stage.dateKey as StringKey, { date: stage.dateValue })}
          </span>
        </span>
        <span
          className="aiec-chip"
          style={{
            background: `var(--aiec-lifecycle-${chip.tone}-surface)`,
            color: `var(--aiec-lifecycle-${chip.tone}-text)`,
          }}
        >
          {t(chip.key as StringKey)}
        </span>
        <Icon
          name={expanded ? 'chevron-down' : 'chevron-right'}
          size={17}
          style={{ color: 'var(--icon-secondary)' }}
        />

        {expanded && stage.detail ? (
          <div className="aiec-tlcard__detail">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--aiec-space-6)' }}>
              <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {t('progress.currentState')}
                </span>
                <span className="aiec-no-clip" style={{ fontSize: 12.5, lineHeight: '18px' }}>
                  {t(stage.detail.bodyKey as StringKey)}
                </span>
              </span>
              <span
                style={{
                  fontFamily: 'var(--aiec-font-num)',
                  fontSize: 15,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('progress.percentDone', { pct: stage.detail.pct })}
              </span>
            </div>
            <span className="aiec-meter">
              <span className="aiec-meter__fill" style={{ width: `${stage.detail.pct}%` }} />
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* -------------------------------------------------------- DOCUMENT ROW */

/**
 * DocumentRow — one statutory requirement and its true state.
 *
 * A row never claims more than it has: an in-flight upload shows its percent
 * and offers cancel, a missing document offers a picker and says plainly that
 * nothing is there yet. The "view" affordance is muted when there is nothing
 * to view, rather than being offered and failing.
 */
export function DocumentRow({ doc, preview }: { doc: DocumentRequirement; preview?: string }) {
  const { t } = useI18n();
  const s = doc.state;

  const stateLine =
    s.kind === 'uploaded' ? (
      <span className="aiec-doc__state" style={{ color: 'var(--aiec-lifecycle-done-text)' }}>
        <Icon name="check-circle" size={15} />
        <span style={{ display: 'grid', gap: 1 }}>
          <span>{t('docs.uploaded')}</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{s.at}</span>
        </span>
      </span>
    ) : s.kind === 'uploading' ? (
      <span className="aiec-doc__state" style={{ color: 'var(--aiec-lifecycle-selling-text)' }}>
        <Icon name="clock" size={15} />
        {t('docs.uploading', { pct: s.pct })}
      </span>
    ) : (
      <span className="aiec-doc__state" style={{ color: 'var(--aiec-lifecycle-blocked-text)' }}>
        <Icon name="clock" size={15} />
        {t('docs.notUploaded')}
      </span>
    );

  return (
    <article className="aiec-card">
      <div className="aiec-doc">
        <span
          className="aiec-doc__icon"
          style={{
            background: `var(--aiec-lifecycle-${doc.tone}-surface)`,
            color: `var(--aiec-lifecycle-${doc.tone}-accent)`,
          }}
        >
          <Icon name={doc.icon === 'pin' ? 'pin-filled' : (doc.icon as IconName)} size={22} />
        </span>

        <span className="aiec-doc__body">
          <span className="aiec-doc__title aiec-no-clip">
            {t(doc.titleKey as StringKey)}
            {doc.required ? <span className="aiec-doc__req">&nbsp;*</span> : null}
          </span>
          <span className="aiec-doc__sub aiec-no-clip">{t(doc.subtitleKey as StringKey)}</span>
          {stateLine}
        </span>

        {s.kind === 'uploaded' && preview ? (
          <img className="aiec-doc__thumb" src={preview} alt="" />
        ) : (
          <span
            className="aiec-doc__drop"
            style={
              s.kind === 'uploading'
                ? ({
                    '--drop-border': 'var(--aiec-lifecycle-material-accent)',
                    '--drop-bg': 'var(--aiec-lifecycle-material-surface)',
                    '--drop-fg': 'var(--aiec-lifecycle-material-accent)',
                  } as CSSProperties)
                : ({
                    '--drop-border': 'var(--aiec-lifecycle-selling-accent)',
                    '--drop-fg': 'var(--aiec-lifecycle-selling-accent)',
                  } as CSSProperties)
            }
          >
            <Icon name={s.kind === 'uploading' ? 'list' : 'upload'} size={20} />
          </span>
        )}

        <span className="aiec-doc__actions">
          {s.kind === 'missing' ? (
            <button type="button" className="aiec-doc__action aiec-doc__action--info">
              {t('docs.choose')}
            </button>
          ) : (
            <>
              {/*
                Design System §5: `disabled` is FORBIDDEN as a bare state —
                "a greyed-out button is a lock with no key printed on it."
                While an upload is still in flight there is genuinely nothing
                to view, so the control states that instead of going grey and
                silent. It remains focusable and readable.
              */}
              {s.kind === 'uploaded' ? (
                <button type="button" className="aiec-doc__action aiec-doc__action--info">
                  <Icon name="search" size={14} />
                  {t('docs.view')}
                </button>
              ) : (
                <span className="aiec-doc__action aiec-doc__action--muted" role="note">
                  <Icon name="clock" size={14} />
                  {t('docs.viewWhenDone')}
                </span>
              )}
              <button type="button" className="aiec-doc__action">
                <Icon name={s.kind === 'uploaded' ? 'list' : 'close'} size={14} />
                {t(s.kind === 'uploaded' ? 'docs.replace' : 'docs.cancelUpload')}
              </button>
            </>
          )}
        </span>
      </div>
    </article>
  );
}

/* --------------------------------------------------- NOTIFICATION CENTER */

export function NotificationCenter({ items }: { items: AiecNotification[] }) {
  const { t } = useI18n();
  return (
    <div style={{ display: 'grid', gap: 'var(--aiec-space-5)' }}>
      {items.map((n) => (
        <button
          key={n.id}
          type="button"
          className="aiec-notif"
          style={
            {
              '--notif-surface': `var(--aiec-lifecycle-${n.tone}-surface)`,
              '--notif-accent': `var(--aiec-lifecycle-${n.tone}-accent)`,
              '--notif-text': `var(--aiec-lifecycle-${n.tone}-text)`,
            } as CSSProperties
          }
        >
          <span className="aiec-notif__icon">
            <Icon name={n.icon} size={19} />
          </span>
          <span style={{ display: 'grid', minWidth: 0 }}>
            <span className="aiec-notif__head">
              <span className="aiec-notif__title aiec-no-clip">{t(n.titleKey as StringKey)}</span>
              <span className="aiec-notif__time">{n.at}</span>
            </span>
            <span className="aiec-notif__body aiec-no-clip">{t(n.bodyKey as StringKey)}</span>
            {n.actionKey ? (
              <span className="aiec-notif__action">
                <Icon name="image" size={15} />
                {t(n.actionKey as StringKey)}
                <Icon name="chevron-right" size={14} style={{ marginInlineStart: 'auto' }} />
              </span>
            ) : null}
          </span>
          <Icon name="chevron-right" size={17} style={{ color: 'var(--icon-secondary)', alignSelf: 'center' }} />
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- SETTINGS */

export function SettingGroup({ children }: { children: ReactNode }) {
  return <div className="aiec-setgroup">{children}</div>;
}

export function SettingRow({
  icon,
  label,
  value,
  right,
  highlight = false,
  danger = false,
  layout = 'stacked',
}: {
  icon: IconName;
  label: string;
  value?: string;
  right?: ReactNode;
  highlight?: boolean;
  danger?: boolean;
  /**
   * 'stacked' — a setting: what it is, then what it is set to (preferences,
   *             security). The label leads because it is the subject.
   * 'inline'  — a stored fact: label left, value right (personal details).
   *             The value leads visually because it is what you came to read.
   */
  layout?: 'stacked' | 'inline';
}) {
  const inline = layout === 'inline';
  return (
    <button
      type="button"
      className={`aiec-setrow${highlight ? ' aiec-setrow--on' : ''}${danger ? ' aiec-setrow--danger' : ''}${
        inline ? ' aiec-setrow--inline' : ''
      }`}
    >
      <Icon name={icon} size={20} style={{ color: danger ? 'currentColor' : 'var(--icon-primary)' }} />
      {inline ? (
        <>
          <span className="aiec-setrow__key aiec-no-clip">{label}</span>
          <span className="aiec-setrow__factval aiec-no-clip">{value}</span>
        </>
      ) : (
        <span style={{ display: 'grid', gap: 1, minWidth: 0 }}>
          <span className="aiec-setrow__label aiec-no-clip">{label}</span>
          {value ? <span className="aiec-setrow__value aiec-no-clip">{value}</span> : null}
        </span>
      )}
      {right ?? <span />}
      <Icon name="chevron-right" size={17} style={{ color: 'var(--icon-secondary)' }} />
    </button>
  );
}
