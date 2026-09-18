import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon, type IconName } from '@/components/Icon';
import { AlertCard, THUMBS } from '@/components/EntityCard';
import { NextAction } from '@/components/NextAction';
import { useI18n, formatRupees } from '@/i18n';
import { FEE_TOTAL_PAISE, SITE_RECORDS } from '@/data/records';

/**
 * SCREEN CONTRACT — S-R-13 Fee payment receipt
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         confirm the municipal fee is paid and the receipt stored
 * DOMINANT_ACTION     back to my records
 * VISIBLE_COMPONENTS  AppBar, success mark, record summary, receipt rows,
 *                     receipt actions, next-process AlertCard, NextAction
 * WORKFLOW_STATE      payment complete; site inspection is next
 * CURRENT_GATE        none
 * KEY_REQUIRED        none
 * DATA                amount, method, transaction ref, timestamp, state
 * INTERACTIONS        view receipt, download receipt, return to records
 * FORBIDDEN_DATA      card details (never held — stated on the previous screen)
 * RESPONSIVE          <360 the two receipt actions stack
 * IMPORTANT_STATES    offline (receipt still readable from local cache)
 */
export function RiderFeePaid() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const rec = SITE_RECORDS.find((r) => r.id === id) ?? SITE_RECORDS[0];
  const money = `${t('common.rupee')} ${formatRupees(FEE_TOTAL_PAISE, lang)}`;

  return (
    <Screen
      statusBarTime="9:20"
      header={<AppBar notificationCount={3} />}
      nextAction={
        <NextAction label={t('paid.backToRecords')} onPress={() => nav('/records')} />
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div className="aiec-success" style={{ paddingBlock: 'var(--aiec-space-11) var(--aiec-space-6)' }}>
          <span className="aiec-success__ring" style={{ boxShadow: '0 0 0 10px var(--aiec-lifecycle-done-surface)' }}>
            <Rays />
            <Icon name="check" size={40} stroke={3} />
          </span>
          <h1 className="aiec-success__title aiec-no-clip">{t('paid.title')}</h1>
          <p className="aiec-success__sub aiec-no-clip" style={{ fontSize: 15 }}>
            {t('paid.sub1')}
          </p>
          <p className="aiec-no-clip" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {t('paid.sub2')}
          </p>
        </div>

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--aiec-space-6)', alignItems: 'flex-start' }}>
            <img src={THUMBS[rec.thumbnailId]} alt="" style={{ width: 78, height: 78, borderRadius: 'var(--aiec-radius-2)', objectFit: 'cover', flex: 'none' }} />
            <div style={{ display: 'grid', gap: 'var(--aiec-space-3)', minWidth: 0 }}>
              <span style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }} className="aiec-no-clip">
                {rec.siteName}
              </span>
              <span className="aiec-entity__metaitem" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Icon name="pin-filled" size={13} />
                {rec.locality} - {rec.pincode}
              </span>
              <span className="aiec-entity__metaitem" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Icon name="building" size={13} />
                {rec.floorsFull} &nbsp;|&nbsp; {t('fee.flatNo', { no: rec.flatNo ?? '101' })}
              </span>
            </div>
          </div>

          <div className="aiec-money__rule" />

          <div className="aiec-rows">
            <Row k={t('paid.amount')} v={money} strong />
            <Row k={t('paid.method')} v="UPI (PhonePe)" />
            <Row k={t('paid.txn')} v={rec.reference} />
            <Row k={t('paid.datetime')} v="16 ऑग, 2025, 10:32 AM" />
            <Row
              k={t('paid.state')}
              v={
                <span className="aiec-chip" style={{ background: 'var(--aiec-lifecycle-done-surface)', color: 'var(--aiec-lifecycle-done-text)' }}>
                  <Icon name="check-circle" size={13} />
                  {t('paid.stateValue')}
                </span>
              }
            />
          </div>
        </section>

        <div className="aiec-nextaction__row">
          <ReceiptBtn icon="image" label={t('paid.viewReceipt')} />
          <ReceiptBtn icon="upload" label={t('paid.downloadReceipt')} />
        </div>

        <AlertCard title={t('paid.nextTitle')} text={t('paid.nextBody')} icon="info" tone="selling" />
      </Stack>
    </Screen>
  );
}

function ReceiptBtn({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      className="aiec-btn"
      style={{
        background: 'var(--surface-raised)',
        color: 'var(--aiec-lifecycle-selling-text)',
        border: '1.5px solid var(--aiec-lifecycle-selling-accent)',
        fontSize: 13,
      }}
    >
      <Icon name={icon} size={18} />
      {label}
    </button>
  );
}

function Row({ k, v, strong = false }: { k: string; v: React.ReactNode; strong?: boolean }) {
  return (
    <div className="aiec-rows__row">
      <span className="aiec-rows__key">{k}</span>
      <span className="aiec-rows__val aiec-no-clip" style={strong ? { fontSize: 17, fontWeight: 800 } : undefined}>
        {v}
      </span>
    </div>
  );
}

/** Static confetti rays, as the reference draws them. No entrance motion. */
function Rays() {
  const rays = [
    { a: -90, d: 62 }, { a: -50, d: 66 }, { a: -20, d: 70 }, { a: 20, d: 70 },
    { a: 50, d: 66 }, { a: 90, d: 62 }, { a: 130, d: 66 }, { a: 160, d: 70 },
    { a: -160, d: 70 }, { a: -130, d: 66 },
  ];
  const colors = [
    'var(--aiec-lifecycle-selling-accent)',
    'var(--aiec-lifecycle-material-accent)',
    'var(--aiec-lifecycle-done-accent)',
  ];
  return (
    <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
      {rays.map((r, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 6,
            height: 13,
            borderRadius: 2,
            background: colors[i % 3],
            transform: `rotate(${r.a}deg) translateY(-${r.d}px)`,
            transformOrigin: 'center',
          }}
        />
      ))}
    </span>
  );
}
