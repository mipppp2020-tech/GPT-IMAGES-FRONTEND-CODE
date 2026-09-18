import { Icon, type IconName } from './Icon';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { formatINR, type Paise } from '@/policy/money';
import type { GateVerdict, TripleKeyVerdict } from '@/policy/gates';
import type { Gate } from '@/domain/lifecycle';

/**
 * MoneyMeter — Interface Law VI: "Money is never a bare number."
 *
 * Four slots, always: the amount, its state, what caused it, and what happens
 * to it next. A worker looking at ₹4,320 must be able to tell whether it is
 * theirs yet, why it exists, and when it lands.
 */
export function MoneyMeter({
  pending,
  cleared,
  cause,
  consequence,
}: {
  pending: Paise;
  cleared: Paise;
  cause: string;
  consequence: string;
}) {
  const { t } = useI18n();
  const total = (pending + cleared) as Paise;
  return (
    <section className="aiec-moneymeter" aria-live="polite">
      <div className="aiec-moneymeter__row">
        <span className="aiec-moneymeter__amount">
          {t('common.rupee')} {formatINR(total)}
        </span>
        <span className="aiec-moneymeter__split">
          <span className="aiec-moneymeter__bucket">
            <span className="aiec-moneymeter__label">{t('money.pending')}</span>
            <span className="aiec-moneymeter__value" style={{ color: 'var(--aiec-lifecycle-material-text)' }}>
              {t('common.rupee')} {formatINR(pending)}
            </span>
          </span>
          <span className="aiec-moneymeter__bucket">
            <span className="aiec-moneymeter__label">{t('money.cleared')}</span>
            <span className="aiec-moneymeter__value" style={{ color: 'var(--aiec-lifecycle-done-text)' }}>
              {t('common.rupee')} {formatINR(cleared)}
            </span>
          </span>
        </span>
      </div>
      <span className="aiec-moneymeter__cause aiec-no-clip">{cause}</span>
      <span className="aiec-moneymeter__consequence aiec-no-clip">{consequence}</span>
    </section>
  );
}

/**
 * Adapts a Policy-Engine verdict into the KeyringGate contract, translating
 * on the way. The engine returns codes; the words are chosen here, so a
 * Marathi user sees a Marathi lock rather than an English fallback.
 */
export function useVerdictToGate(): (v: GateVerdict) => Gate {
  const { t } = useI18n();
  return (v: GateVerdict): Gate => ({
    reason: t(`gate.${v.code}` as StringKey, v.params),
    unlockableBy: t(`custody.${v.unlockableBy}` as StringKey),
    requirement: {
      kind: 'approval',
      label: t(`gate.req.g${v.gate}` as StringKey, v.params),
      approver: t(`custody.${v.unlockableBy}` as StringKey),
    },
    nextStep: t(`gate.con.g${v.gate}` as StringKey, v.params),
  });
}

/**
 * TripleKeyPanel — the one physical lock in the product.
 *
 * Three keys, one five-minute window, one geofence. The panel always says
 * which of those is outstanding, because "locked" on its own tells a
 * technician standing at a sealed container nothing they can act on.
 */
export function TripleKeyPanel({
  verdict,
  onTurn,
}: {
  verdict: TripleKeyVerdict;
  onTurn: (k: 'otp' | 'biometric' | 'system') => void;
}) {
  const { t } = useI18n();
  const rows: { id: 'otp' | 'biometric' | 'system'; icon: IconName; title: string; sub: string; turned: boolean }[] = [
    { id: 'otp', icon: 'message', title: t('key.customer'), sub: t('key.customerSub'), turned: verdict.keys.customer },
    { id: 'biometric', icon: 'user', title: t('key.technician'), sub: t('key.technicianSub'), turned: verdict.keys.technician },
    { id: 'system', icon: 'shield', title: t('key.system'), sub: t('key.systemSub'), turned: verdict.keys.system },
  ];

  const waiting: Record<TripleKeyVerdict['waitingOn'], string> = {
    payment: t('key.waitPayment'),
    customer: t('key.waitCustomer'),
    technician: t('key.waitTechnician'),
    system: t('key.waitSystem'),
    geofence: t('key.waitGeofence'),
    window: t('key.waitWindow'),
    none: t('key.open'),
  };

  return (
    <section className="aiec-card aiec-triplekey">
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--aiec-space-5)' }}>
        <span className="aiec-gate__lock">
          <Icon name={verdict.open ? 'check' : 'lock'} size={20} />
        </span>
        <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
          <span className="aiec-gate__title">{t('key.title')}</span>
          <span className="aiec-key__sub aiec-no-clip">{waiting[verdict.waitingOn]}</span>
        </span>
      </header>

      <div className="aiec-triplekey__keys">
        {rows.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`aiec-key${r.turned ? ' aiec-key--turned' : ''}`}
            onClick={() => onTurn(r.id)}
            disabled={undefined}
          >
            <span className="aiec-key__icon">
              <Icon name={r.turned ? 'check' : r.icon} size={18} />
            </span>
            <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
              <span className="aiec-key__title aiec-no-clip">{r.title}</span>
              <span className="aiec-key__sub aiec-no-clip">{r.sub}</span>
            </span>
            <Icon
              name={r.turned ? 'check-circle' : 'chevron-right'}
              size={17}
              style={{ color: r.turned ? 'var(--aiec-lifecycle-done-accent)' : 'var(--icon-secondary)' }}
            />
          </button>
        ))}
      </div>

      {verdict.windowClosesInMs !== null && !verdict.open ? (
        <span className="aiec-triplekey__window">
          <Icon name="clock" size={15} />
          {t('key.window', { min: Math.max(0, Math.ceil(verdict.windowClosesInMs / 60000)) })}
        </span>
      ) : null}
    </section>
  );
}

/**
 * AppealPath — required child of every negative machine verdict.
 *
 * UX Architecture Part 0 #4 calls a missing appeal "the mechanism by which a
 * technician network learns to distrust the app". It is not a support ticket
 * and not a settings item: it sits inside the rejection, above the retake
 * button, and the worker is paid while it is decided.
 */
export function AppealPath({
  amountHeld,
  onAppeal,
  onRetake,
  retriesLeft,
}: {
  amountHeld: Paise;
  onAppeal?: () => void;
  onRetake?: () => void;
  retriesLeft: number;
}) {
  const { t } = useI18n();
  return (
    <div className="aiec-appeal">
      <div className="aiec-appeal__head">
        <Icon name="shield" size={17} style={{ color: 'var(--aiec-lifecycle-selling-accent)' }} />
        <span className="aiec-appeal__title">{t('appeal.title')}</span>
      </div>
      <span className="aiec-appeal__body aiec-no-clip">
        {t('appeal.body', { amount: `${t('common.rupee')} ${formatINR(amountHeld)}` })}
      </span>
      <span className="aiec-appeal__body aiec-no-clip">{t('appeal.sla')}</span>
      <div className="aiec-appeal__actions">
        <button type="button" className="aiec-btn aiec-btn--secondary aiec-btn--compact" onClick={onRetake}>
          {t('appeal.retake', { n: retriesLeft })}
        </button>
        <button type="button" className="aiec-btn aiec-btn--primary aiec-btn--compact" onClick={onAppeal}>
          {t('appeal.ask')}
        </button>
      </div>
    </div>
  );
}
