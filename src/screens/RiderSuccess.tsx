import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { AlertCard, THUMBS } from '@/components/EntityCard';
import { useI18n, formatRupees } from '@/i18n';
import { RIDER_LEADS } from '@/data/fixtures';

/**
 * SCREEN CONTRACT — S-R-06 Submission confirmation
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         confirm the lead is safely recorded, and offer the next
 * DOMINANT_ACTION     add another lead
 * VISIBLE_COMPONENTS  AppBar, success mark, praise AlertCard, lead summary,
 *                     custody note, upsell, dual NextAction, TabBar
 * WORKFLOW_STATE      submitted — custody has moved to AIEC
 * CURRENT_GATE        none
 * KEY_REQUIRED        none
 * DATA                reference, submitted-at, amount, method, state, next step
 * INTERACTIONS        go home, add new lead, view receipt
 * FORBIDDEN_DATA      commercial fields
 * RESPONSIVE          <360 the two closing actions stack
 * IMPORTANT_STATES    offline (submission held in queue — stated, not hidden)
 *
 * The confirmation states custody explicitly: the work has left the rider and
 * is now with AIEC. That is the difference between "done" and "sent".
 */
export function RiderSuccess() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const lead = RIDER_LEADS[0];

  return (
    <Screen header={<AppBar notificationCount={3} />} statusBarTime="9:20">
      <Stack gap="loose" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div className="aiec-success">
          <span className="aiec-success__ring">
            <Confetti />
            <Icon name="check" size={42} stroke={3} />
          </span>
          <h1 className="aiec-success__title aiec-no-clip">{t('success.title')}</h1>
          <p className="aiec-success__sub aiec-no-clip">{t('success.subtitle')}</p>
        </div>

        <AlertCard title={t('success.praiseTitle')} text={t('success.praiseBody')} icon="trophy" tone="done" />

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-6)' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--aiec-space-5)' }}>
            <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('success.detailTitle')}</h2>
            <span style={{ display: 'grid', gap: 1, textAlign: 'end' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t('success.refLabel')}</span>
              <span style={{ fontFamily: 'var(--aiec-font-num)', fontSize: 12, fontWeight: 700 }}>{lead.reference}</span>
            </span>
          </header>

          <div style={{ display: 'flex', gap: 'var(--aiec-space-6)', alignItems: 'flex-start' }}>
            <img
              src={THUMBS[lead.thumbnailId]}
              alt=""
              style={{ width: 78, height: 78, borderRadius: 'var(--aiec-radius-2)', objectFit: 'cover', flex: 'none' }}
            />
            <div style={{ display: 'grid', gap: 'var(--aiec-space-3)', minWidth: 0 }}>
              <span style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }} className="aiec-no-clip">
                {lead.siteName}
              </span>
              <span className="aiec-entity__metaitem" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Icon name="pin-filled" size={13} />
                {lead.locality} - {lead.pincode}
              </span>
              <span className="aiec-entity__metaitem" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Icon name="users" size={13} />
                {lead.floors} · {lead.liftRequirement}
              </span>
            </div>
          </div>

          <div className="aiec-rows">
            <Row icon="calendar" k={t('success.submittedAt')} v="16 ऑग, 2025, 10:24 AM" />
            <Row icon="rupee" k={t('success.amount')} v={`${t('common.rupee')} ${formatRupees(3800, lang)}`} />
            <Row icon="wallet-card" k={t('success.method')} v="UPI (sandeep.patil@okaxis)" />
            {/* The submission outcome, not the lead's lifecycle state: the
                lead is recorded; its journey has not started yet. */}
            <Row
              icon="check-circle"
              k={t('success.state')}
              v={<span style={{ color: 'var(--aiec-lifecycle-done-text)' }}>{t('success.stateValue')}</span>}
            />
            <Row icon="arrow-right" k={t('success.nextLabel')} v={t('success.nextValue')} />
          </div>
        </section>

        {/* Custody has moved. Say so plainly rather than implying completion. */}
        <AlertCard title={t('success.teamTitle')} text={t('success.teamBody')} icon="users" tone="selling" />

        <button
          type="button"
          className="aiec-alert"
          style={{ '--alert-surface': 'var(--surface-primary-weak)', '--alert-accent': 'var(--accent-primary)' } as React.CSSProperties}
          onClick={() => nav('/capture')}
        >
          <span className="aiec-alert__icon">
            <Icon name="gift" size={17} />
          </span>
          <span className="aiec-alert__body" style={{ textAlign: 'start' }}>
            <span className="aiec-alert__title aiec-no-clip">{t('success.moreTitle')}</span>
            <span className="aiec-alert__text aiec-no-clip">{t('success.moreBody')}</span>
          </span>
          <Icon name="chevron-right" size={17} style={{ color: 'var(--icon-secondary)', flex: 'none', alignSelf: 'center' }} />
        </button>

        <div className="aiec-nextaction__row" style={{ marginTop: 'var(--aiec-space-4)' }}>
          <button type="button" className="aiec-btn aiec-btn--secondary" onClick={() => nav('/')}>
            <Icon name="home" size={19} />
            {t('success.goHome')}
          </button>
          <button type="button" className="aiec-btn aiec-btn--primary" onClick={() => nav('/capture')}>
            <Icon name="plus" size={19} />
            {t('success.addNew')}
          </button>
        </div>
      </Stack>
    </Screen>
  );
}

function Row({ icon, k, v }: { icon: Parameters<typeof Icon>[0]['name']; k: string; v: React.ReactNode }) {
  return (
    <div className="aiec-rows__row">
      <span className="aiec-rows__key">
        <Icon name={icon} size={15} style={{ color: 'var(--icon-secondary)' }} />
        {k}
      </span>
      <span className="aiec-rows__val aiec-no-clip">{v}</span>
    </div>
  );
}

/** Static decorative confetti, matching the reference. No entrance motion. */
function Confetti() {
  // Scattered across the header band, as the reference shows — not ringed
  // around the mark. Static: a celebration must not delay the next capture.
  const bits = [
    { x: -150, y: -30, r: -20, c: 'var(--aiec-lifecycle-material-accent)' },
    { x: -118, y: 34, r: 42, c: 'var(--aiec-lifecycle-installing-accent)' },
    { x: -96, y: -62, r: 12, c: 'var(--aiec-lifecycle-done-accent)' },
    { x: -74, y: 70, r: -38, c: 'var(--aiec-lifecycle-selling-accent)' },
    { x: -58, y: -44, r: 66, c: 'var(--aiec-lifecycle-material-accent)' },
    { x: -30, y: -78, r: -12, c: 'var(--aiec-lifecycle-done-accent)' },
    { x: 34, y: -74, r: 28, c: 'var(--aiec-lifecycle-selling-accent)' },
    { x: 62, y: -40, r: -55, c: 'var(--aiec-lifecycle-installing-accent)' },
    { x: 84, y: 40, r: 18, c: 'var(--aiec-lifecycle-material-accent)' },
    { x: 112, y: -22, r: -30, c: 'var(--aiec-lifecycle-done-accent)' },
    { x: 142, y: 26, r: 48, c: 'var(--aiec-lifecycle-selling-accent)' },
    { x: 158, y: -58, r: -18, c: 'var(--aiec-lifecycle-installing-accent)' },
    { x: -140, y: 76, r: 22, c: 'var(--aiec-lifecycle-done-accent)' },
    { x: 126, y: 78, r: -44, c: 'var(--aiec-lifecycle-material-accent)' },
  ];
  return (
    <span className="aiec-confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${b.x}px)`,
            top: `calc(50% + ${b.y}px)`,
            width: 7,
            height: 11,
            borderRadius: 2,
            background: b.c,
            transform: `rotate(${b.r}deg)`,
          }}
        />
      ))}
    </span>
  );
}
