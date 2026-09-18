import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon, type IconName } from '@/components/Icon';
import { WorkflowProgress } from '@/components/Workflow';
import { NextAction } from '@/components/NextAction';
import { AlertCard, THUMBS } from '@/components/EntityCard';
import { useI18n, formatRupees } from '@/i18n';
import { FEE_BREAKDOWN, FEE_TOTAL_PAISE, SITE_RECORDS } from '@/data/records';

type Method = 'upi' | 'card' | 'netbanking';

/**
 * SCREEN CONTRACT — S-R-12 Statutory fee payment
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         pay the municipal registration fee for this site
 * DOMINANT_ACTION     pay ₹38
 * VISIBLE_COMPONENTS  AppBar, ContextBar, record card, WorkflowProgress(4),
 *                     fee breakdown, security note, method options,
 *                     encryption note, NextAction
 * WORKFLOW_STATE      step 3 of 4
 * CURRENT_GATE        none — documents cleared on the previous step
 * KEY_REQUIRED        a chosen payment method
 * DATA                registration fee, processing fee, GST, total
 * INTERACTIONS        choose method, pay, go back
 * FORBIDDEN_DATA      card numbers are never held by the app (stated on screen)
 * RESPONSIVE          <360 option hints wrap under the title
 * IMPORTANT_STATES    offline (payment blocked — connectivity is a real gate)
 *
 * This is money OUT (a statutory fee the rider pays on the site's behalf),
 * unlike S-R-05 which is money IN. Both are the rider's own cash position;
 * neither exposes what AIEC charges the customer.
 */
export function RiderFees() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const rec = SITE_RECORDS.find((r) => r.id === id) ?? SITE_RECORDS[0];
  const [method, setMethod] = useState<Method>('upi');

  const money = (p: number) => `${t('common.rupee')} ${formatRupees(p, lang)}`;

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar title={t('records.title')} onBack={() => nav(`/records/${rec.id}/documents`)} />
        </>
      }
      nextAction={
        <NextAction
          label={t('fee.pay', { amount: money(FEE_TOTAL_PAISE) })}
          icon="lock"
          onPress={() => nav(`/records/${rec.id}/fees/paid`)}
          secondary={{ label: t('photos.back'), icon: 'arrow-left', onPress: () => nav(-1) }}
        />
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {t('fee.title')}
          </h1>
          <p className="aiec-no-clip" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {t('fee.subtitle')}
          </p>
        </div>

        <section className="aiec-card">
          <div className="aiec-entity" style={{ gridTemplateColumns: '78px minmax(0,1fr)' }}>
            <img className="aiec-entity__thumb" src={THUMBS[rec.thumbnailId]} alt="" />
            <div className="aiec-entity__body" style={{ gap: 'var(--aiec-space-3)' }}>
              <span className="aiec-entity__title aiec-no-clip">{rec.siteName}</span>
              <span className="aiec-entity__metaitem" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Icon name="pin-filled" size={12} />
                {rec.locality} - {rec.pincode}
              </span>
              <span className="aiec-entity__metaitem" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Icon name="building" size={12} />
                {rec.floorsFull} &nbsp;|&nbsp; {t('fee.flatNo', { no: rec.flatNo ?? '101' })}
              </span>
            </div>
          </div>
        </section>

        <WorkflowProgress
          current={2}
          steps={[
            { label: t('fee.stepDocs'), note: t('fee.stDone') },
            { label: t('fee.stepDetails'), note: t('fee.stDone') },
            { label: t('fee.stepPayment'), note: t('fee.stRunning') },
            { label: t('fee.stepConfirm'), note: t('fee.stPending') },
          ]}
        />

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-6)' }}>
          <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('fee.breakdownTitle')}</h2>
          <div className="aiec-money">
            <div className="aiec-money__row">
              <span className="aiec-no-clip">{t('fee.registration')}</span>
              <b>{money(FEE_BREAKDOWN.registrationPaise)}</b>
            </div>
            <div className="aiec-money__row">
              <span>{t('fee.processing')}</span>
              <b>{money(FEE_BREAKDOWN.processingPaise)}</b>
            </div>
            <div className="aiec-money__row">
              <span>{t('fee.gst')}</span>
              <b>{money(FEE_BREAKDOWN.gstPaise)}</b>
            </div>
            <div className="aiec-money__rule" />
            <div className="aiec-money__total">
              <span>{t('fee.total')}</span>
              <b style={{ color: 'var(--text-primary)' }}>{money(FEE_TOTAL_PAISE)}</b>
            </div>
          </div>
        </section>

        <AlertCard title={t('fee.secureNote')} icon="shield" tone="done" />

        <section style={{ display: 'grid', gap: 'var(--aiec-space-5)' }}>
          <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('fee.methodTitle')}</h2>
          <FeeOption on={method === 'upi'} set={() => setMethod('upi')} icon="wallet-card" title={t('fee.upi')} hint={t('fee.upiHint')} />
          <FeeOption on={method === 'card'} set={() => setMethod('card')} icon="wallet-card" title={t('fee.card')} hint={t('fee.cardHint')} />
          <FeeOption on={method === 'netbanking'} set={() => setMethod('netbanking')} icon="bank" title={t('fee.netbanking')} hint={t('fee.netbankingHint')} />
        </section>

        <AlertCard title={t('fee.encryptTitle')} text={t('fee.encryptBody')} icon="lock" tone="selling" />
      </Stack>
    </Screen>
  );
}

function FeeOption({
  on,
  set,
  icon,
  title,
  hint,
}: {
  on: boolean;
  set: () => void;
  icon: IconName;
  title: string;
  hint: string;
}) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={set} className={`aiec-option${on ? ' aiec-option--selected' : ''}`}>
      <span className="aiec-option__radio" />
      <span
        style={{
          width: 40,
          height: 34,
          borderRadius: 'var(--aiec-radius-2)',
          background: 'var(--surface-sunken)',
          color: 'var(--icon-primary)',
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
        }}
      >
        <Icon name={icon} size={18} />
      </span>
      <span className="aiec-option__body">
        <span className="aiec-option__title aiec-no-clip">{title}</span>
        <span className="aiec-option__hint aiec-no-clip">{hint}</span>
      </span>
      <Icon name="chevron-right" size={17} style={{ color: 'var(--icon-secondary)', alignSelf: 'center', flex: 'none' }} />
    </button>
  );
}
