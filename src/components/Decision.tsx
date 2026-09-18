import { Icon } from './Icon';
import { useI18n } from '@/i18n';

/**
 * DecisionCard — a question the user must answer, with its options.
 *
 * Used for the feedback rating and the multi-select. It states whether an
 * answer is required, so a submit gate downstream has something honest to
 * point at rather than silently refusing.
 */
export function DecisionCard({
  title,
  subtitle,
  required = false,
  children,
}: {
  title: string;
  subtitle?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <section className="aiec-card aiec-decision">
      <div className="aiec-decision__q">
        <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
          <span className="aiec-decision__title aiec-no-clip">{title}</span>
          {subtitle ? (
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }} className="aiec-no-clip">
              {subtitle}
            </span>
          ) : null}
        </span>
        {required ? <span className="aiec-decision__req">* {t('fb.required')}</span> : null}
      </div>
      {children}
    </section>
  );
}

const FACE_COLORS = ['#F3B0AC', '#F5A25C', '#F7D154', '#8FD05A', '#0F9D4F'] as const;
const FACE_TINTS = ['#FDEAE8', '#FFEFE4', '#FFF6E0', '#EAF6E2', '#E6F5ED'] as const;

/** A 5-point satisfaction scale. Shape and colour both encode the rating. */
export function RatingScale({
  labels,
  value,
  onChange,
}: {
  labels: string[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="aiec-scale" role="radiogroup">
      {labels.map((label, i) => {
        const on = value === i;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={label}
            className={`aiec-scale__opt${on ? ' aiec-scale__opt--on' : ''}`}
            onClick={() => onChange(i)}
          >
            <span className="aiec-scale__face" style={{ background: on ? FACE_COLORS[i] : FACE_TINTS[i] }}>
              <Face index={i} filled={on} />
            </span>
            <span className="aiec-scale__label aiec-no-clip">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Mouth curvature carries the rating, so it reads without colour. */
function Face({ index, filled }: { index: number; filled: boolean }) {
  const mouths = [
    'M7 16.5c1.6-2.2 3.2-3.2 5-3.2s3.4 1 5 3.2',
    'M7 15.6c1.6-1.5 3.2-2.2 5-2.2s3.4.7 5 2.2',
    'M7.5 14.8h9',
    'M7 13.4c1.6 1.5 3.2 2.2 5 2.2s3.4-.7 5-2.2',
    'M7 12.8c1.6 2.2 3.2 3.2 5 3.2s3.4-1 5-3.2',
  ];
  const stroke = filled ? '#FFFFFF' : '#3A3F47';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.6" cy="9.6" r="1.35" fill={stroke} />
      <circle cx="15.4" cy="9.6" r="1.35" fill={stroke} />
      <path d={mouths[index]} stroke={stroke} strokeWidth="1.9" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Multi-select chips. Selection is marked by a check, not colour alone. */
export function MultiSelect({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; label: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="aiec-multi">
      {options.map((o) => {
        const on = selected.has(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role="checkbox"
            aria-checked={on}
            className={`aiec-multi__opt${on ? ' aiec-multi__opt--on' : ''}`}
            onClick={() => onToggle(o.id)}
          >
            <span className="aiec-multi__box">
              {on ? <Icon name="check" size={12} stroke={3} /> : null}
            </span>
            <span className="aiec-no-clip">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * RoleSwitcher — the session identity card.
 *
 * It shows who the session is and at what level, and its verification state.
 * It offers no other role to switch into: a rider client is not permitted to
 * hold another role's data (§10), so a switcher that appeared to offer one
 * would be lying about what the client can do.
 */
export function RoleSwitcher() {
  const { t } = useI18n();
  return (
    <section className="aiec-card aiec-role">
      <span className="aiec-role__avatar">
        <Icon name="user" size={34} />
        <span className="aiec-role__cam">
          <Icon name="camera" size={13} />
        </span>
      </span>
      <span className="aiec-role__body">
        <span className="aiec-role__name aiec-no-clip">{t('chrome.riderName')}</span>
        <span className="aiec-role__role aiec-no-clip">{t('chrome.riderLevel')}</span>
        <span
          className="aiec-chip"
          style={{
            background: 'var(--aiec-lifecycle-done-surface)',
            color: 'var(--aiec-lifecycle-done-text)',
            justifySelf: 'start',
          }}
        >
          <Icon name="check-circle" size={13} />
          {t('profile.verified')}
        </span>
      </span>
      <button type="button" className="aiec-doc__action aiec-doc__action--info" style={{ flex: 'none' }}>
        <Icon name="list" size={14} />
        {t('profile.edit')}
      </button>
    </section>
  );
}
