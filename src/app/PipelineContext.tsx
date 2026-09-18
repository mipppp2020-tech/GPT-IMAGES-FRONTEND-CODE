import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { rupees } from '@/policy/money';
import {
  evaluatePipeline, advance, PIPELINE_STAGES,
  type PipelineFacts, type PipelineStage, type PipelineState,
} from '@/policy/pipeline';

/**
 * The single source of pipeline truth for the whole app.
 *
 * Screens do not decide whether something is allowed. They read a verdict
 * from the Policy Engine and render it. That is what makes the five gates
 * real rather than decorative: there is exactly one place that can say yes.
 */

const NOW = 1_700_000_000_000;

export const INITIAL_FACTS: PipelineFacts = {
  stage: 'won',
  tokenPaid: false,
  tokenAmount: rupees(0),
  agreementSigned: true,
  qcReportId: null,
  qcStatus: 'none',
  containerArrived: true,
  ninetyPercentPaid: false,
  hoursSinceArrival: 7,
  customerOtpAt: null,
  technicianBiometricAt: null,
  systemApprovalAt: null,
  technicianDistanceM: 12,
  sopStepIndex: 8,
  sopPriorStepVerified: true,
  sopEvidenceSubmitted: false,
  sopMachineVerdict: 'none',
  sopAppealOpen: false,
  handoverComplete: false,
  finalPaymentPaid: false,
  now: NOW,
};

/** The keys a user can supply. Each one is a rupee or a photograph. */
export type KeyName =
  | 'token' | 'qc' | 'ninety' | 'otp' | 'biometric' | 'system'
  | 'evidence' | 'handover' | 'final';

interface PipelineValue {
  facts: PipelineFacts;
  state: PipelineState;
  supplyKey: (k: KeyName) => void;
  tryAdvance: () => { ok: boolean; because?: string };
  reset: () => void;
  /** Move the cursor without supplying keys, for inspecting any stage. */
  gotoStage: (s: PipelineStage) => void;
}

const Ctx = createContext<PipelineValue | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [facts, setFacts] = useState<PipelineFacts>(INITIAL_FACTS);
  const state = useMemo(() => evaluatePipeline(facts), [facts]);

  const supplyKey = useCallback((k: KeyName) => {
    setFacts((f) => {
      switch (k) {
        case 'token': return { ...f, tokenPaid: true, tokenAmount: rupees(10000) };
        case 'qc': return { ...f, qcStatus: 'cleared', qcReportId: 'MH-PUNE-Z3-QCIN-0112-4' };
        case 'ninety': return { ...f, ninetyPercentPaid: true };
        case 'otp': return { ...f, customerOtpAt: f.now };
        case 'biometric': return { ...f, technicianBiometricAt: f.now + 30_000 };
        case 'system': return { ...f, systemApprovalAt: f.now + 60_000 };
        case 'evidence': return { ...f, sopEvidenceSubmitted: true, sopMachineVerdict: 'pass' };
        case 'handover': return { ...f, handoverComplete: true };
        case 'final': return { ...f, finalPaymentPaid: true };
        default: return f;
      }
    });
  }, []);

  const tryAdvance = useCallback(() => {
    const i = PIPELINE_STAGES.indexOf(facts.stage);
    const next = PIPELINE_STAGES[i + 1];
    if (!next) return { ok: false, because: 'The pipeline is complete.' };
    const r = advance(facts, next);
    if (r.ok) {
      setFacts((f) => ({ ...f, stage: next }));
      return { ok: true };
    }
    return { ok: false, because: r.because };
  }, [facts]);

  const gotoStage = useCallback((s: PipelineStage) => setFacts((f) => ({ ...f, stage: s })), []);
  const reset = useCallback(() => setFacts(INITIAL_FACTS), []);

  const value = useMemo(
    () => ({ facts, state, supplyKey, tryAdvance, reset, gotoStage }),
    [facts, state, supplyKey, tryAdvance, reset, gotoStage],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePipeline(): PipelineValue {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePipeline must be used inside PipelineProvider');
  return c;
}
