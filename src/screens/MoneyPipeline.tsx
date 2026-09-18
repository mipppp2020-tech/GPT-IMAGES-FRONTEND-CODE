import { useState } from 'react';
import { Screen, Stack, SectionHeader } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { KeyringGate } from '@/components/NextAction';
import { AlertCard } from '@/components/EntityCard';
import { MoneyMeter, TripleKeyPanel, AppealPath, useVerdictToGate } from '@/components/Money';
import { usePipeline, type KeyName } from '@/app/PipelineContext';
import { useI18n } from '@/i18n';
import { PIPELINE_STAGES, stageIndex, type PipelineStage } from '@/policy/pipeline';
import { formatINR, rupees } from '@/policy/money';
import { listPrice, botFloorPrice, absoluteFloorPrice, DEFAULT_MARGIN_POLICY } from '@/policy/pricing';
import type { GateNumber } from '@/policy/gates';

/**
 * SCREEN CONTRACT — S-P-01 The money journey
 *
 * ROLE                cross-role (this is the operator's view of the pipeline)
 * THEME               sunlight
 * PRIMARY_JOB         see which lock the job is standing at, and what opens it
 * DOMINANT_ACTION     turn the outstanding key
 * WORKFLOW_STATE      any of the 19 pipeline stages
 * CURRENT_GATE        whichever of the five is shut at this stage
 * DATA                pipeline facts → Policy Engine verdicts (no local logic)
 * FORBIDDEN_DATA      none at operator level; per-role views filter downstream
 *
 * Every yes/no on this screen comes from `evaluatePipeline`. The screen holds
 * no business rule of its own — that is the point. If a gate opens here that
 * should not, the bug is in the Policy Engine and its tests, where it can be
 * caught once rather than in each screen that happens to ask.
 */

/** Which stage each gate guards, so the walk can label the locks in place. */
const GATE_AT: Partial<Record<PipelineStage, GateNumber>> = {
  won: 1,
  'shaft-readiness': 2,
  'awaiting-payment': 3,
  installing: 4,
  handover: 5,
};

const STAGE_LABEL: Record<PipelineStage, string> = {
  'lead-captured': 'लीड कॅप्चर',
  'lead-scored': 'स्कोअरिंग',
  contacted: 'संपर्क',
  qualified: 'पात्रता',
  quoted: 'कोटेशन',
  won: 'डील जिंकली',
  'token-paid': 'टोकन भरले',
  'shaft-readiness': 'शाफ्ट तयारी',
  'qc-cleared': 'QC मंजुरी',
  'material-allocated': 'मटेरियल वाटप',
  'in-transit': 'वाहतुकीत',
  'awaiting-payment': '90% प्रतीक्षा',
  'paid-90': '90% भरले',
  'custody-transferred': 'ताबा हस्तांतरित',
  installing: 'इंस्टॉलेशन',
  audited: 'QC ऑडिट',
  handover: 'हँडओव्हर',
  'noc-issued': 'NOC जारी',
  'amc-active': 'AMC सुरू',
};

/** The key that opens the gate guarding each stage. */
const KEY_FOR_STAGE: Partial<Record<PipelineStage, KeyName>> = {
  won: 'token',
  'shaft-readiness': 'qc',
  'awaiting-payment': 'ninety',
  installing: 'evidence',
  handover: 'final',
};

export function MoneyPipeline() {
  const { t, lang } = useI18n();
  const { facts, state, supplyKey, tryAdvance, reset } = usePipeline();
  const [blockedBecause, setBlockedBecause] = useState<string | null>(null);
  const toGate = useVerdictToGate();

  const here = stageIndex(facts.stage);
  const baseCost = rupees(500000);
  const keysTurned = [facts.tokenPaid, facts.qcStatus === 'cleared', facts.ninetyPercentPaid,
    facts.sopMachineVerdict === 'pass', facts.finalPaymentPaid].filter(Boolean).length;

  const onAdvance = () => {
    const r = tryAdvance();
    setBlockedBecause(r.ok ? null : (r.because ?? null));
  };

  const stageKey = KEY_FOR_STAGE[facts.stage];
  const atCustody = facts.stage === 'paid-90';

  return (
    <Screen
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar title={t('pipe.title')} />
        </>
      }
      tabBar={false}
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-12)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {t('pipe.title')}
          </h1>
          <p className="aiec-no-clip" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {t('pipe.subtitle')}
          </p>
        </div>

        {/* The commercial frame: what this job is worth and where the floors sit. */}
        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-5)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{t('pipe.deal')}</span>
          <div className="aiec-money">
            <LadderRow label="बेस कॉस्ट" value={formatINR(baseCost)} />
            <LadderRow label={`लिस्ट प्राईस (+${DEFAULT_MARGIN_POLICY.listMarkupPct}%)`} value={formatINR(listPrice(baseCost))} />
            <LadderRow label={`बॉट फ्लोअर (${DEFAULT_MARGIN_POLICY.botMarginFloorPct}%)`} value={formatINR(botFloorPrice(baseCost))} />
            <div className="aiec-money__rule" />
            <LadderRow
              label={`हार्ड फ्लोअर (${DEFAULT_MARGIN_POLICY.absoluteMarginFloorPct}%) — फक्त मालक`}
              value={formatINR(absoluteFloorPrice(baseCost))}
              strong
            />
          </div>
        </section>

        <SectionHeader title={t('pipe.keysGiven', { n: keysTurned, total: 5 })} />

        {/* The walk. Each stage shows whether a gate stands there and its state. */}
        <ol className="aiec-pipeline">
          {PIPELINE_STAGES.map((s, i) => {
            const g = GATE_AT[s];
            const verdict = g ? state.gates[g] : null;
            const cls = [
              'aiec-pstage',
              i < here ? 'aiec-pstage--done' : '',
              i === here ? 'aiec-pstage--here' : '',
              i === here && verdict && !verdict.open ? 'aiec-pstage--gate' : '',
            ].filter(Boolean).join(' ');
            return (
              <li key={s} className={cls}>
                <span className="aiec-pstage__dot">
                  {i < here ? <Icon name="check" size={14} stroke={3} /> : i + 1}
                </span>
                <span className="aiec-pstage__name aiec-no-clip">{STAGE_LABEL[s]}</span>
                {verdict ? (
                  <span className={`aiec-pstage__gate${verdict.open ? ' aiec-pstage__gate--open' : ''}`}>
                    {t('pipe.gate', { n: verdict.gate })} · {verdict.open ? t('pipe.open') : t('pipe.shut')}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* The lock the job is actually standing at, rendered as a keyring gate. */}
        {state.standingAt ? (
          <>
            <SectionHeader title={t('pipe.standingAt')} />
            <KeyringGate gate={toGate(state.standingAt)} />
            <AlertCard
              title={t('pipe.whatBlocks')}
              text={state.standingAt.blocks.map((b) => t(b as never)).join(' · ')}
              icon="lock"
              tone="blocked"
            />
            {stageKey ? (
              <button type="button" className="aiec-btn aiec-btn--primary aiec-btn--block" onClick={() => supplyKey(stageKey)}>
                <Icon name="check" size={19} />
                {t('pipe.supplyKey')}
              </button>
            ) : null}
          </>
        ) : null}

        {/* Gate 4's rejection path — an AI verdict always carries an appeal. */}
        {facts.stage === 'installing' && facts.sopMachineVerdict === 'reject' ? (
          <AppealPath amountHeld={rupees(2800)} retriesLeft={2} />
        ) : null}

        {/* The physical lock. Money makes it eligible; three keys open it. */}
        {atCustody ? (
          <>
            <SectionHeader title={t('key.title')} />
            <TripleKeyPanel verdict={state.tripleKey} onTurn={(k) => supplyKey(k)} />
          </>
        ) : null}

        {/* A worker's money, never a bare number. */}
        <SectionHeader title={t('tab.earnings')} />
        <MoneyMeter
          pending={rupees(2800)}
          cleared={rupees(4320)}
          cause={t('money.walletCause')}
          consequence={t('money.walletConsequence')}
        />

        {blockedBecause ? (
          <AlertCard title={t('pipe.blocked')} text={blockedBecause} icon="lock" tone="blocked" />
        ) : null}

        <div className="aiec-nextaction__row" style={{ marginTop: 'var(--aiec-space-6)' }}>
          <button type="button" className="aiec-btn aiec-btn--secondary" onClick={reset}>
            <Icon name="switch-camera" size={18} />
            {t('pipe.reset')}
          </button>
          <button type="button" className="aiec-btn aiec-btn--primary aiec-nextaction__grow" onClick={onAdvance}>
            {here === PIPELINE_STAGES.length - 1 ? t('pipe.complete') : t('pipe.advance')}
            <Icon name="arrow-right" size={19} />
          </button>
        </div>

        <p style={{ fontSize: 11, lineHeight: '16px', color: 'var(--text-muted)' }} className="aiec-no-clip">
          {lang === 'mr'
            ? 'या स्क्रीनवरचा प्रत्येक निर्णय Policy Engine मधून येतो — स्क्रीनमध्ये स्वतःचा कोणताही नियम नाही.'
            : 'Every decision on this screen comes from the Policy Engine — the screen holds no rule of its own.'}
        </p>
      </Stack>
    </Screen>
  );
}

function LadderRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  const { t } = useI18n();
  return (
    <div className={strong ? 'aiec-money__total' : 'aiec-money__row'}>
      <span className="aiec-no-clip">{label}</span>
      <b style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}>
        {t('common.rupee')} {value}
      </b>
    </div>
  );
}
