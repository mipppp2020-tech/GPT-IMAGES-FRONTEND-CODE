import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n';
import { LIFECYCLE_LABEL_KEY, type LifecycleState, type StatusGrammar, type Custody } from '@/domain/lifecycle';
import type { StringKey } from '@/i18n/strings';

/**
 * StatusIndicator — source requirement §11.
 *
 * There is deliberately no way to render a status from a loose string. The
 * component takes a StatusGrammar, so a bare "Pending" cannot reach the
 * screen: the type has no field to put it in.
 *
 * `variant="compact"` is the pill used in lists; `variant="full"` discloses
 * all five slots and is used wherever the user must act on the state.
 */
function lifecycleVars(state: LifecycleState): CSSProperties {
  return {
    '--status-accent': `var(--aiec-lifecycle-${state}-accent)`,
    '--status-surface': `var(--aiec-lifecycle-${state}-surface)`,
    '--status-text': `var(--aiec-lifecycle-${state}-text)`,
  } as CSSProperties;
}

export function StatusIndicator({
  status,
  variant = 'compact',
  bare = false,
  dot = false,
}: {
  status: StatusGrammar;
  variant?: 'compact' | 'full';
  bare?: boolean;
  /** The map legend carries dots; list chips read as tinted pills. */
  dot?: boolean;
}) {
  const { t } = useI18n();
  const label = status.chipLabel ?? t(LIFECYCLE_LABEL_KEY[status.state] as StringKey);

  const pill = (
    <span className={`aiec-status${bare ? ' aiec-status--bare' : ''}`} style={lifecycleVars(status.state)}>
      {dot ? <span className="aiec-status__dot" /> : null}
      {label}
    </span>
  );

  if (variant === 'compact') return pill;

  return (
    <div className="aiec-statusfull">
      <div className="aiec-statusfull__head">
        <span className="aiec-status" style={lifecycleVars(status.state)}>
          <span className="aiec-status__dot" />
          {label}
        </span>
        <ClockLabel status={status} />
      </div>
      <p className="aiec-statusfull__reason aiec-no-clip">{status.reason}</p>
      <div className="aiec-statusfull__grid">
        <Slot k={t('status.custody')} v={<CustodyLine custody={status.custody} />} />
        <Slot k={t('status.consequence')} v={status.consequence} />
      </div>
    </div>
  );
}

function Slot({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="aiec-slot">
      <span className="aiec-slot__key">{k}</span>
      <span className="aiec-slot__val aiec-no-clip">{v}</span>
    </div>
  );
}

/** CLOCK slot. Renders elapsed-held or time-remaining, never a bare date. */
export function ClockLabel({ status }: { status: StatusGrammar }) {
  const c = status.clock;
  if (c.kind === 'none') return null;
  const breached = c.kind === 'due' && c.breached;
  return (
    <span
      className="aiec-custody"
      style={breached ? { color: 'var(--aiec-lifecycle-blocked-text)', fontWeight: 600 } : undefined}
    >
      {c.kind === 'held' ? c.elapsedLabel : c.remainingLabel}
    </span>
  );
}

/**
 * CustodyLine — who holds the work right now.
 *
 * The rider's own custody is rendered in the primary accent because "it is
 * waiting on you" is the single most operationally important thing a field
 * screen can say.
 */
export function CustodyLine({ custody }: { custody: Custody }) {
  const { t } = useI18n();
  const key = `custody.${custody.holder}` as StringKey;
  return (
    <span className={`aiec-custody aiec-custody--${custody.holder}`}>
      <span className="aiec-custody__badge">{t(key)}</span>
      {custody.name ? <span>{custody.name}</span> : null}
    </span>
  );
}
