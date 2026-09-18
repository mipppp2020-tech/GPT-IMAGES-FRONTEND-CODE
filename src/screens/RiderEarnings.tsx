import { useNavigate } from 'react-router-dom';
import { Screen, Stack, SectionHeader } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { AlertCard } from '@/components/EntityCard';
import { MoneyMeter } from '@/components/Money';
import { usePipeline } from '@/app/PipelineContext';
import { useI18n } from '@/i18n';
import { rupees, formatINR } from '@/policy/money';
import { nextPayoutAt, capForJob } from '@/policy/wallet';

/**
 * SCREEN CONTRACT — S-R-17 Earnings
 *
 * ROLE                rider
 * PRIMARY_JOB         know what is mine, what is held, and when it lands
 * DOMINANT_ACTION     open the money journey
 * DATA                wallet buckets, next payout instant, reward budget
 * FORBIDDEN_DATA      any other worker's earnings; customer commercials
 *
 * There is no reference image for this screen — the mockups stop before the
 * money. It is built from Law VI ("money is never a bare number") and the
 * wallet mechanics in PRD §13.3.
 */
export function RiderEarnings() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { state } = usePipeline();

  const pending = rupees(2800);
  const cleared = rupees(4320);
  const payout = nextPayoutAt(new Date());
  const { ceiling } = capForJob(rupees(115000));
  const shutGates = Object.values(state.gates).filter((g) => !g.open).length;

  return (
    <Screen header={<AppBar notificationCount={3} />}>
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
          {t('tab.earnings')}
        </h1>

        <MoneyMeter
          pending={pending}
          cleared={cleared}
          cause={t('money.walletCause')}
          consequence={t('money.walletConsequence')}
        />

        <AlertCard
          title={
            lang === 'mr'
              ? `पुढील जमा: ${payout.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
              : `Next payout: ${payout.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
          }
          text={t('money.walletConsequence')}
          icon="calendar"
          tone="selling"
        />

        {/* Law 4: the reward budget is visible, not a silent ceiling. */}
        <AlertCard
          title={
            lang === 'mr'
              ? `या कामाचे बक्षीस बजेट: ₹ ${formatINR(ceiling)}`
              : `Reward budget on this job: ₹ ${formatINR(ceiling)}`
          }
          text={
            lang === 'mr'
              ? 'बजेट संपल्यावर बक्षिसे रोख नाही, तर पुढच्या कामाची प्राधान्य-संधी म्हणून मिळतात.'
              : 'Once it is committed, rewards come as priority access to the next job rather than cash.'
          }
          icon="gift"
          tone="material"
        />

        <SectionHeader title={t('pipe.title')} />
        <button
          type="button"
          className="aiec-alert"
          style={{ textAlign: 'start', width: '100%' }}
          onClick={() => nav('/pipeline')}
        >
          <span className="aiec-alert__icon">
            <Icon name="lock" size={17} />
          </span>
          <span className="aiec-alert__body">
            <span className="aiec-alert__title aiec-no-clip">{t('pipe.subtitle')}</span>
            <span className="aiec-alert__text aiec-no-clip">
              {t('pipe.keysGiven', { n: 5 - shutGates, total: 5 })}
            </span>
          </span>
          <Icon name="chevron-right" size={17} style={{ color: 'var(--icon-secondary)', alignSelf: 'center' }} />
        </button>
      </Stack>
    </Screen>
  );
}
