import type { Paise } from './money';

/**
 * THE FIVE PAYMENT GATES — PRD §4.2 ("memorise these five").
 *
 * Money flows in one direction only: forward, and only on verified evidence.
 * Each gate is a pure predicate over facts. A gate never returns a boolean on
 * its own — it returns a GateVerdict carrying the four things the UI is
 * required to show (UX Arch §3.4 KeyringGate): why it is locked, who can
 * unlock it, what is required, and what happens next.
 *
 * This is the whole product. UX Architecture Part 0:
 *   "This is not a workflow app with payments attached. It is a keyring."
 *   "The key is always either a rupee or a photograph."
 */

export const GATES = [1, 2, 3, 4, 5] as const;
export type GateNumber = (typeof GATES)[number];

export type UnlockAuthority =
  | 'customer' | 'rider' | 'technician' | 'qc' | 'supplier'
  | 'sales-desk' | 'admin' | 'owner' | 'system' | 'none';

/**
 * A stable, language-free identifier for each verdict branch.
 *
 * The Policy Engine must not hold user-facing prose. Law 6 requires every
 * string in this product to exist in three languages; if the engine returns
 * English sentences, the Marathi build silently falls back to English at
 * exactly the moments that matter most — a locked gate, a held payment.
 *
 * So the engine returns a CODE and its parameters; the i18n layer owns the
 * words. Tests assert on codes, which also makes them immune to copy edits.
 */
export type GateCode =
  | 'g1.awaiting-token' | 'g1.open'
  | 'g2.not-inspected' | 'g2.rework' | 'g2.open'
  | 'g3.window-open' | 'g3.window-closed' | 'g3.open'
  | 'g4.sequence-locked' | 'g4.awaiting-evidence' | 'g4.rejected' | 'g4.open'
  | 'g5.awaiting-handover' | 'g5.awaiting-payment' | 'g5.open';

export interface GateVerdict {
  gate: GateNumber;
  /** Language-free identifier for this branch. The UI translates it. */
  code: GateCode;
  /** Parameters the translated string needs (hours left, step number, ...). */
  params: Record<string, string | number>;
  /** open = the key is present and the lock has turned. */
  open: boolean;
  /** WHY LOCKED — never the bare word "locked". */
  reason: string;
  /** WHO CAN UNLOCK — a named party, never "the system" unless truly so. */
  unlockableBy: UnlockAuthority;
  /** WHAT IS REQUIRED — the key itself. */
  requirement: string;
  /** WHAT HAPPENS NEXT once the key turns. */
  consequence: string;
  /** What is blocked while it stays shut, as translation keys (Law 6). */
  blocks: string[];
  /** Whether ANY override path exists. Most of these are 'none' by source. */
  override: UnlockAuthority;
}

/* ------------------------------------------------------------------ GATE 1 */
export interface Gate1Facts {
  tokenPaid: boolean;
  tokenAmount: Paise;
  agreementSigned: boolean;
}

/** GATE 1 — No token → no agreement, no project. No override exists. */
export function gate1Token(f: Gate1Facts): GateVerdict {
  const open = f.tokenPaid && f.tokenAmount > 0;
  return {
    gate: 1,
    code: open ? 'g1.open' : 'g1.awaiting-token',
    params: {},
    open,
    reason: f.tokenPaid
      ? 'Token received; the project record exists.'
      : 'The commitment token has not been received.',
    unlockableBy: 'customer',
    requirement: 'Token payment against the signed agreement',
    consequence: 'CUST, LIFT and AGMT records are created and the shaft-readiness checklist is dispatched.',
    blocks: ['blk.cust', 'blk.lift', 'blk.agmt', 'blk.readiness'],
    override: 'none',
  };
}

/* ------------------------------------------------------------------ GATE 2 */
export interface Gate2Facts {
  qcReportId: string | null;
  qcStatus: 'none' | 'cleared' | 'rework';
}

/** GATE 2 — No QC clearance → no drawings, no material. Hard gate. */
export function gate2QcClearance(f: Gate2Facts): GateVerdict {
  const open = f.qcStatus === 'cleared' && !!f.qcReportId;
  return {
    gate: 2,
    code: open ? 'g2.open' : f.qcStatus === 'rework' ? 'g2.rework' : 'g2.not-inspected',
    params: {},
    open,
    reason:
      f.qcStatus === 'cleared'
        ? 'Pre-installation clearance is signed.'
        : f.qcStatus === 'rework'
          ? 'The inspection raised a rework list that is still outstanding.'
          : 'The shaft has not been inspected yet.',
    unlockableBy: 'qc',
    requirement: 'A signed QCIN report with status Cleared',
    consequence: 'Drawings are released and material allocation fires to the ranked supplier.',
    blocks: ['blk.drawings', 'blk.bom', 'blk.allocation'],
    // PRD §4.2 marks this «TBD»: no override path is documented. Treated as
    // hard until a product decision says otherwise. Do not soften silently.
    override: 'none',
  };
}

/* ------------------------------------------------------------------ GATE 3 */
export interface Gate3Facts {
  containerArrived: boolean;
  ninetyPercentPaid: boolean;
  hoursSinceArrival: number;
}

export const PAYMENT_WINDOW_HOURS = 48;

/** GATE 3 — No 90% payment → container never unlocks. No override at any level. */
export function gate3NinetyPercent(f: Gate3Facts): GateVerdict {
  const expired = f.containerArrived && !f.ninetyPercentPaid && f.hoursSinceArrival >= PAYMENT_WINDOW_HOURS;
  const hoursLeft = Math.max(0, PAYMENT_WINDOW_HOURS - f.hoursSinceArrival);
  return {
    gate: 3,
    code: f.ninetyPercentPaid ? 'g3.open' : expired ? 'g3.window-closed' : 'g3.window-open',
    params: { hours: hoursLeft },
    open: f.ninetyPercentPaid,
    reason: f.ninetyPercentPaid
      ? 'Material payment has cleared; the container may be unlocked.'
      : expired
        ? 'The payment window closed. The truck is recalled and the material returns to the supplier.'
        : `The material is at your gate, sealed. ${hoursLeft} hours remain in the payment window.`,
    unlockableBy: 'customer',
    requirement: '90% material payment',
    consequence: 'Escrow settles, the supplier is paid the same day, and the triple-key unlock becomes available.',
    blocks: ['blk.unlock', 'blk.custody', 'blk.installStart'],
    override: 'none',
  };
}

/** The window is a hard recall, not a nudge. Separated so the UI can say so. */
export function gate3WindowExpired(f: Gate3Facts): boolean {
  return f.containerArrived && !f.ninetyPercentPaid && f.hoursSinceArrival >= PAYMENT_WINDOW_HOURS;
}

/* ------------------------------------------------------------------ GATE 4 */
export interface Gate4Facts {
  stepIndex: number;
  priorStepVerified: boolean;
  evidenceSubmitted: boolean;
  machineVerdict: 'pass' | 'reject' | 'none';
  /** An appeal in flight pays the worker while it is decided (Risk item 6). */
  appealOpen: boolean;
}

/**
 * GATE 4 — No verified SOP evidence → no worker credit.
 *
 * The sequence lock is part of this gate: step N's evidence cannot exist
 * before step N-1 verifies. A step cannot be marked verified by declaration.
 */
export function gate4SopEvidence(f: Gate4Facts): GateVerdict {
  const open = f.priorStepVerified && f.evidenceSubmitted && f.machineVerdict === 'pass';
  const code: GateCode = open
    ? 'g4.open'
    : !f.priorStepVerified
      ? 'g4.sequence-locked'
      : !f.evidenceSubmitted
        ? 'g4.awaiting-evidence'
        : 'g4.rejected';
  return {
    gate: 4,
    code,
    params: { step: f.stepIndex, priorStep: f.stepIndex - 1, nextStep: f.stepIndex + 1 },
    open,
    reason: !f.priorStepVerified
      ? `Step ${f.stepIndex - 1} has to be signed off before this one can start.`
      : !f.evidenceSubmitted
        ? 'This step still needs its photographs.'
        : f.machineVerdict === 'reject'
          ? 'The photographs did not show what this step needs. Your money is held, not lost.'
          : 'Evidence accepted.',
    unlockableBy: 'technician',
    requirement: `Evidence for step ${f.stepIndex}, captured on camera at the site`,
    consequence: 'The step credit lands in your Pending balance and the next step unlocks.',
    blocks: ['blk.stepCredit', 'blk.nextStep'],
    // Admin reviews a second machine rejection; a human can decide, but no
    // one can declare a step verified without evidence.
    override: 'admin',
  };
}

/* ------------------------------------------------------------------ GATE 5 */
export interface Gate5Facts {
  handoverComplete: boolean;
  finalPaymentPaid: boolean;
}

/** GATE 5 — No final 10% → no NOC. Escalates to a payment plan, then legal. */
export function gate5FinalPayment(f: Gate5Facts): GateVerdict {
  const open = f.handoverComplete && f.finalPaymentPaid;
  return {
    gate: 5,
    code: open ? 'g5.open' : !f.handoverComplete ? 'g5.awaiting-handover' : 'g5.awaiting-payment',
    params: {},
    open,
    reason: !f.handoverComplete
      ? 'Handover is not finished yet.'
      : f.finalPaymentPaid
        ? 'Final payment received.'
        : 'The final payment has not been received.',
    unlockableBy: 'customer',
    requirement: 'Final 10% payment after handover',
    consequence: 'The NOC, warranty and operating manual are issued, AMC activates, and the technician payout releases.',
    blocks: ['blk.noc', 'blk.warranty', 'blk.amc', 'blk.payout'],
    override: 'none',
  };
}

/**
 * TRIPLE-KEY CONTAINER UNLOCK — the one physical lock.
 *
 * Three keys inside the same 5-minute window and the same geofence. This is
 * not a gate that money opens; it is the custody transfer that Gate 3 makes
 * *eligible*. Both must hold.
 */
export const TRIPLE_KEY_WINDOW_MINUTES = 5;
export const GEOFENCE_TOLERANCE_METRES = 50;

export interface TripleKeyFacts {
  gate3Open: boolean;
  customerOtpAt: number | null;
  technicianBiometricAt: number | null;
  systemApprovalAt: number | null;
  technicianDistanceM: number;
  now: number;
}

export interface TripleKeyVerdict {
  open: boolean;
  keys: { customer: boolean; technician: boolean; system: boolean };
  /** Which requirement is not yet met — drives the UI, one line. */
  waitingOn: 'payment' | 'customer' | 'technician' | 'system' | 'geofence' | 'window' | 'none';
  windowClosesInMs: number | null;
}

export function tripleKeyUnlock(f: TripleKeyFacts): TripleKeyVerdict {
  const keys = {
    customer: f.customerOtpAt !== null,
    technician: f.technicianBiometricAt !== null,
    system: f.systemApprovalAt !== null,
  };
  const stamps = [f.customerOtpAt, f.technicianBiometricAt, f.systemApprovalAt].filter(
    (t): t is number => t !== null,
  );
  const windowMs = TRIPLE_KEY_WINDOW_MINUTES * 60_000;
  const spread = stamps.length > 1 ? Math.max(...stamps) - Math.min(...stamps) : 0;
  const withinWindow = stamps.length === 0 || spread <= windowMs;
  const withinGeofence = f.technicianDistanceM <= GEOFENCE_TOLERANCE_METRES;

  let waitingOn: TripleKeyVerdict['waitingOn'] = 'none';
  if (!f.gate3Open) waitingOn = 'payment';
  else if (!withinGeofence) waitingOn = 'geofence';
  else if (!withinWindow) waitingOn = 'window';
  else if (!keys.customer) waitingOn = 'customer';
  else if (!keys.technician) waitingOn = 'technician';
  else if (!keys.system) waitingOn = 'system';

  const open =
    f.gate3Open && keys.customer && keys.technician && keys.system && withinWindow && withinGeofence;

  return {
    open,
    keys,
    waitingOn,
    windowClosesInMs: stamps.length > 0 ? Math.max(0, Math.min(...stamps) + windowMs - f.now) : null,
  };
}
