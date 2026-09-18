import {
  gate1Token, gate2QcClearance, gate3NinetyPercent, gate4SopEvidence, gate5FinalPayment,
  tripleKeyUnlock, type GateVerdict, type TripleKeyVerdict,
} from './gates';
import type { Paise } from './money';

/**
 * THE MONEY PIPELINE — PRD §3 stage table, §29 state machines.
 *
 * Seventeen stages from a rider spotting a shaft to AMC renewal. The whole
 * business is this line, and the five gates are the only places it can stop.
 *
 * The stage list is ordered and the machine is STRICTLY FORWARD: there is no
 * transition that moves money or custody backwards. Rework loops re-enter an
 * earlier *work* stage (readiness, installation) but never un-take a payment
 * or un-transfer custody — that is what "money flows only forward" means.
 */
export const PIPELINE_STAGES = [
  'lead-captured',
  'lead-scored',
  'contacted',
  'qualified',
  'quoted',
  'won',
  'token-paid',          // ← GATE 1
  'shaft-readiness',
  'qc-cleared',          // ← GATE 2
  'material-allocated',
  'in-transit',
  'awaiting-payment',
  'paid-90',             // ← GATE 3
  'custody-transferred', // ← triple key
  'installing',          // ← GATE 4, per step
  'audited',
  'handover',
  'noc-issued',          // ← GATE 5
  'amc-active',
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export function stageIndex(s: PipelineStage): number {
  return PIPELINE_STAGES.indexOf(s);
}

/** Every fact the pipeline needs. One object, so a gate cannot be asked a question it has no evidence for. */
export interface PipelineFacts {
  stage: PipelineStage;
  tokenPaid: boolean;
  tokenAmount: Paise;
  agreementSigned: boolean;
  qcReportId: string | null;
  qcStatus: 'none' | 'cleared' | 'rework';
  containerArrived: boolean;
  ninetyPercentPaid: boolean;
  hoursSinceArrival: number;
  customerOtpAt: number | null;
  technicianBiometricAt: number | null;
  systemApprovalAt: number | null;
  technicianDistanceM: number;
  sopStepIndex: number;
  sopPriorStepVerified: boolean;
  sopEvidenceSubmitted: boolean;
  sopMachineVerdict: 'pass' | 'reject' | 'none';
  sopAppealOpen: boolean;
  handoverComplete: boolean;
  finalPaymentPaid: boolean;
  now: number;
}

export interface PipelineState {
  stage: PipelineStage;
  /** All five gate verdicts, always — the UI never has to guess. */
  gates: Record<1 | 2 | 3 | 4 | 5, GateVerdict>;
  tripleKey: TripleKeyVerdict;
  /** The one lock the user is standing at right now, if any. */
  standingAt: GateVerdict | null;
  /** The next stage, if nothing is blocking. */
  canAdvanceTo: PipelineStage | null;
}

export function evaluatePipeline(f: PipelineFacts): PipelineState {
  const gates = {
    1: gate1Token({ tokenPaid: f.tokenPaid, tokenAmount: f.tokenAmount, agreementSigned: f.agreementSigned }),
    2: gate2QcClearance({ qcReportId: f.qcReportId, qcStatus: f.qcStatus }),
    3: gate3NinetyPercent({
      containerArrived: f.containerArrived,
      ninetyPercentPaid: f.ninetyPercentPaid,
      hoursSinceArrival: f.hoursSinceArrival,
    }),
    4: gate4SopEvidence({
      stepIndex: f.sopStepIndex,
      priorStepVerified: f.sopPriorStepVerified,
      evidenceSubmitted: f.sopEvidenceSubmitted,
      machineVerdict: f.sopMachineVerdict,
      appealOpen: f.sopAppealOpen,
    }),
    5: gate5FinalPayment({ handoverComplete: f.handoverComplete, finalPaymentPaid: f.finalPaymentPaid }),
  } as const;

  const tripleKey = tripleKeyUnlock({
    gate3Open: gates[3].open,
    customerOtpAt: f.customerOtpAt,
    technicianBiometricAt: f.technicianBiometricAt,
    systemApprovalAt: f.systemApprovalAt,
    technicianDistanceM: f.technicianDistanceM,
    now: f.now,
  });

  /** Which gate guards the transition OUT of the current stage. */
  const guard: Partial<Record<PipelineStage, GateVerdict>> = {
    won: gates[1],
    'shaft-readiness': gates[2],
    'awaiting-payment': gates[3],
    installing: gates[4],
    handover: gates[5],
  };

  const standingAt = guard[f.stage] && !guard[f.stage]!.open ? guard[f.stage]! : null;
  const i = stageIndex(f.stage);
  const next = i >= 0 && i < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[i + 1] : null;

  // Custody transfer additionally needs all three keys, not just the money.
  const custodyBlocked = f.stage === 'paid-90' && !tripleKey.open;

  return {
    stage: f.stage,
    gates: gates as PipelineState['gates'],
    tripleKey,
    standingAt,
    canAdvanceTo: standingAt || custodyBlocked ? null : next,
  };
}

/**
 * The only transition function. Refuses to move the pipeline backwards, and
 * refuses to cross a shut gate, regardless of who is asking.
 */
export function advance(f: PipelineFacts, to: PipelineStage): { ok: true; stage: PipelineStage } | { ok: false; because: string } {
  const state = evaluatePipeline(f);
  const from = stageIndex(f.stage);
  const target = stageIndex(to);

  if (target < 0) return { ok: false, because: `"${to}" is not a stage in this pipeline.` };
  if (target <= from) {
    return {
      ok: false,
      because: 'The pipeline moves forward only. Rework re-opens a work stage; it never un-takes a payment or un-transfers custody.',
    };
  }
  if (target > from + 1) {
    return { ok: false, because: 'Stages cannot be skipped — each one is the evidence the next one depends on.' };
  }
  if (state.standingAt) {
    return { ok: false, because: state.standingAt.reason };
  }
  if (f.stage === 'paid-90' && !state.tripleKey.open) {
    return { ok: false, because: 'The container needs all three keys in the same five-minute window, at the site.' };
  }
  return { ok: true, stage: to };
}
