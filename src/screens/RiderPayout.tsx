import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon, type IconName } from '@/components/Icon';
import { WorkflowProgress } from '@/components/Workflow';
import { NextAction } from '@/components/NextAction';
import { AlertCard } from '@/components/EntityCard';
import { useI18n, formatRupees } from '@/i18n';
import { RIDER_LEADS } from '@/data/fixtures';

type Method = 'upi' | 'bank' | 'wallet';

const GROSS = 4000;
const TDS_RATE = 0.05;

/**
 * SCREEN CONTRACT — S-R-05 Payout method
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         confirm where this lead's earning is paid
 * DOMINANT_ACTION     submit
 * VISIBLE_COMPONENTS  AppBar(contextual), WorkflowProgress(5), AlertCard,
 *                     money breakdown, payout options, SLA note, NextAction
 * WORKFLOW_STATE      step 4 of 5
 * CURRENT_GATE        none — the evidence gate cleared on the previous step
 * KEY_REQUIRED        a linked payout destination
 * DATA                gross, TDS, net, linked UPI handle
 * INTERACTIONS        choose method, change linked account, submit
 * FORBIDDEN_DATA      project value, margin, customer commercials
 * RESPONSIVE          <360 option rows keep full-width radio + stacked hint
 * IMPORTANT_STATES    no linked account (gates submit), offline (queued)
 *
 * The rider sees gross, deduction and net — their own money only. Nothing
 * about what AIEC charges the customer is present in this payload.
 */
export function RiderPayout() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const [method, setMethod] = useState<Method>('upi');
  const lead = RIDER_LEADS[0];

  const tds = Math.round(GROSS * TDS_RATE);
  const net = GROSS - tds;

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar
            title={t('leads.title')}
            onBack={() => nav(-1)}
            actions={
              <button type="button" className="aiec-chip aiec-chip--interactive">
                <Icon name="users" size={15} />
                {t('home.viewDetails')}
              </button>
            }
          />
        </>
      }
      nextAction={
        <NextAction
          label={t('payout.submit')}
          icon="check"
          onPress={() => nav('/success')}
          secondary={{ label: t('photos.back'), icon: 'arrow-left', onPress: () => nav(-1) }}
        />
      }
    >
      <Stack gap="loose" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 23, lineHeight: '30px', fontWeight: 800 }}>
            {lead.siteName}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {lead.locality} - {lead.pincode}
          </p>
        </div>

        <WorkflowProgress
          current={3}
          steps={[
            { label: t('capture.step1'), note: '16 ऑग' },
            { label: t('capture.step2'), note: '18 ऑग' },
            { label: t('capture.step3'), note: '18 ऑग' },
            { label: 'साईट पाहणी', note: '18 ऑग' },
            { label: t('leads.statWon') },
          ]}
        />

        <AlertCard title={t('payout.title')} text={t('payout.subtitle')} icon="check-circle" tone="done" />

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-6)' }}>
          <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('payout.sectionTitle')}</h2>

          <div className="aiec-money__hero">
            <span className="aiec-money__heroicon">
              <Icon name="rupee" size={19} />
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }} className="aiec-no-clip">
              {t('payout.earnLabel')}
            </span>
            <span className="aiec-money__herovalue">
              {t('common.rupee')} {formatRupees(GROSS, lang)}
            </span>
          </div>

          <div className="aiec-money">
            <div className="aiec-money__row">
              <span>{t('payout.gross')}</span>
              <b>
                {t('common.rupee')} {formatRupees(GROSS, lang)}
              </b>
            </div>
            <div className="aiec-money__row">
              <span>{t('payout.tds')}</span>
              <b>
                - {t('common.rupee')} {formatRupees(tds, lang)}
              </b>
            </div>
            <div className="aiec-money__rule" />
            <div className="aiec-money__total">
              <span className="aiec-no-clip">{t('payout.net')}</span>
              <b>
                {t('common.rupee')} {formatRupees(net, lang)}
              </b>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 'var(--aiec-space-5)' }}>
          <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('payout.methodTitle')}</h2>

          <PayoutOption
            selected={method === 'upi'}
            onSelect={() => setMethod('upi')}
            icon="wallet-card"
            title={t('payout.upi')}
            hint={t('payout.upiHint')}
            account={
              <span className="aiec-option__account">
                <Icon name="wallet-card" size={15} style={{ color: 'var(--accent-primary)' }} />
                sandeep.patil@okaxis
                <span className="aiec-badge-ok">{t('payout.linked')}</span>
                <button type="button" className="aiec-link">
                  {t('payout.change')}
                </button>
              </span>
            }
          />
          <PayoutOption
            selected={method === 'bank'}
            onSelect={() => setMethod('bank')}
            icon="bank"
            title={t('payout.bank')}
            hint={t('payout.bankHint')}
          />
          <PayoutOption
            selected={method === 'wallet'}
            onSelect={() => setMethod('wallet')}
            icon="wallet"
            title={t('payout.wallet')}
            hint={t('payout.walletHint')}
          />
        </section>

        <AlertCard title={t('payout.slaNote')} text={t('payout.slaHelp')} icon="clock" tone="info" />
      </Stack>
    </Screen>
  );
}

function PayoutOption({
  selected,
  onSelect,
  icon,
  title,
  hint,
  account,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: IconName;
  title: string;
  hint: string;
  account?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`aiec-option${selected ? ' aiec-option--selected' : ''}`}
    >
      <span className="aiec-option__radio" />
      <span className="aiec-option__body">
        <span className="aiec-option__title">
          <Icon name={icon} size={17} style={{ color: 'var(--icon-secondary)' }} />
          <span className="aiec-no-clip">{title}</span>
        </span>
        <span className="aiec-option__hint aiec-no-clip">{hint}</span>
        {selected ? account : null}
      </span>
    </button>
  );
}
