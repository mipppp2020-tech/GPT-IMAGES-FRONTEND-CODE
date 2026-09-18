import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { useI18n } from '@/i18n';
import { isGated, type ActionState, type Gate } from '@/domain/lifecycle';

/**
 * NextAction — the single dominant action of a screen.
 *
 * Field ergonomics (source §9): it occupies the bottom third, is at least the
 * theme's primary touch target, and carries its own safe-area padding so the
 * control is never flush to the device edge.
 *
 * If the action is gated it does not render a dead button — it renders the
 * KeyringGate, so the operator learns what to do instead of tapping nothing.
 */
export function NextAction({
  label,
  icon = 'arrow-right',
  action = { kind: 'open' },
  onPress,
  secondary,
  context,
  contextLayout = 'stack',
  onPage = false,
}: {
  label: string;
  icon?: IconName;
  action?: ActionState;
  onPress?: () => void;
  secondary?: { label: string; icon?: IconName; onPress?: () => void };
  /** Optional value strip, e.g. the earning this action realises. */
  context?: { label: string; value: string };
  /** 'inline' puts the value beside the button, as the detail screen does. */
  contextLayout?: 'stack' | 'inline';
  /** Render inline in the page flow rather than pinned above the tab bar. */
  onPage?: boolean;
}) {
  if (isGated(action)) {
    return (
      <div className={`aiec-nextaction${onPage ? ' aiec-nextaction--onpage' : ''}`}>
        <KeyringGate gate={action.gate} />
      </div>
    );
  }

  if (context && contextLayout === 'inline') {
    return (
      <div className={`aiec-nextaction${onPage ? ' aiec-nextaction--onpage' : ''}`}>
        <div className="aiec-nextaction__row">
          <div className="aiec-nextaction__context">
            <span className="aiec-nextaction__ctxlabel aiec-no-clip">{context.label}</span>
            <span className="aiec-nextaction__ctxvalue">{context.value}</span>
          </div>
          <button type="button" className="aiec-btn aiec-btn--primary aiec-nextaction__grow" onClick={onPress}>
            {label}
            <Icon name={icon} size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`aiec-nextaction${onPage ? ' aiec-nextaction--onpage' : ''}`}>
      {context ? (
        <div className="aiec-nextaction__context">
          <span className="aiec-nextaction__ctxlabel aiec-no-clip">{context.label}</span>
          <span className="aiec-nextaction__ctxvalue">{context.value}</span>
        </div>
      ) : null}
      <div className="aiec-nextaction__row">
        {secondary ? (
          <button type="button" className="aiec-btn aiec-btn--secondary" onClick={secondary.onPress}>
            {secondary.icon ? <Icon name={secondary.icon} size={20} /> : null}
            {secondary.label}
          </button>
        ) : null}
        <button
          type="button"
          className={`aiec-btn aiec-btn--primary${secondary ? ' aiec-nextaction__grow' : ' aiec-btn--block'}`}
          onClick={onPress}
        >
          {label}
          <Icon name={icon} size={20} />
        </button>
      </div>
    </div>
  );
}

/**
 * KeyringGate — source requirement §12.
 *
 * Renders WHY LOCKED / WHO CAN UNLOCK / WHAT IS REQUIRED / WHAT HAPPENS NEXT.
 * Every field is mandatory in the Gate type, so an under-explained lock
 * cannot be constructed.
 */
export function KeyringGate({ gate }: { gate: Gate }) {
  const { t } = useI18n();
  return (
    <section className="aiec-gate" aria-label={t('gate.locked')}>
      <header className="aiec-gate__head">
        <span className="aiec-gate__lock">
          <Icon name="lock" size={20} />
        </span>
        <span className="aiec-gate__title aiec-no-clip">{t('gate.locked')}</span>
      </header>

      <div className="aiec-gate__answers">
        <GateAnswer k={t('gate.why')} v={gate.reason} />
        <GateAnswer k={t('gate.who')} v={gate.unlockableBy} />
        <GateAnswer k={t('gate.need')} v={<Requirement gate={gate} />} />
        <GateAnswer k={t('gate.next')} v={gate.nextStep} />
      </div>
    </section>
  );
}

function GateAnswer({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="aiec-slot">
      <span className="aiec-slot__key">{k}</span>
      <span className="aiec-slot__val aiec-no-clip">{v}</span>
    </div>
  );
}

function Requirement({ gate }: { gate: Gate }) {
  const { t, lang } = useI18n();
  const r = gate.requirement;
  if (r.kind === 'evidence') {
    const pct = Math.min(100, Math.round((r.collected / r.required) * 100));
    return (
      <span style={{ display: 'grid', gap: 'var(--aiec-space-3)' }}>
        <span className="aiec-gate__req">
          <span className="aiec-no-clip">{r.label}</span>
          <span>{t('gate.evidenceProgress', { done: r.collected, total: r.required })}</span>
        </span>
        <span className="aiec-gate__meter">
          <span className="aiec-gate__meterfill" style={{ width: `${pct}%` }} />
        </span>
      </span>
    );
  }
  if (r.kind === 'payment') {
    const amount = new Intl.NumberFormat(lang === 'mr' ? 'mr-IN' : 'en-IN').format(r.amountPaise / 100);
    return <>{`${r.label} — ₹ ${amount}`}</>;
  }
  if (r.kind === 'approval') return <>{`${r.label} — ${r.approver}`}</>;
  return <>{r.label}</>;
}
