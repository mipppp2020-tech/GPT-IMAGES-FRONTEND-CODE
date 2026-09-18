import { paise, pctOf, type Paise } from './money';

/**
 * WALLET & GAMIFICATION — PRD §13.3, Law 4.
 *
 * Credits land in Pending and become Cleared on verification. Penalties
 * deduct from Pending FIRST, then Cleared — that ordering is in the source
 * and it matters: it protects money a worker has already earned and cleared
 * from being clawed back while unverified money is still available to take.
 *
 * Every line carries a WLET id and taps through to the evidence that earned
 * it (Law 4 audit requirement).
 */

export type LedgerState = 'pending' | 'cleared' | 'paid';

/**
 * Ledger classification. PRD §13.3 flags getting this wrong as the thing
 * that "makes gamification spend look uncontrolled to an auditor or
 * investor": conversion commissions and completion bonuses are DIRECT COST
 * OF SALE. Only streaks, leaderboards, targets and wastage bonuses count
 * against the discretionary cap.
 */
export type CreditClass = 'direct-cost-of-sale' | 'discretionary';

export interface LedgerEntry {
  id: string;
  jobId: string;
  workerId: string;
  amount: Paise;
  state: LedgerState;
  creditClass: CreditClass;
  /** The evidence or event that earned it. Law 4: every line is traceable. */
  evidenceId: string | null;
  reason: string;
  at: number;
}

export interface GamificationCap {
  /** Recommended 2.5%, hard ceiling 4% of that job's gross margin. */
  recommendedPct: number;
  hardCeilingPct: number;
}

export const DEFAULT_GAMIFICATION_CAP: GamificationCap = {
  recommendedPct: 2.5,
  hardCeilingPct: 4,
};

export function capForJob(
  grossMargin: Paise,
  cap: GamificationCap = DEFAULT_GAMIFICATION_CAP,
): { recommended: Paise; ceiling: Paise } {
  return {
    recommended: pctOf(grossMargin, cap.recommendedPct),
    ceiling: pctOf(grossMargin, cap.hardCeilingPct),
  };
}

export interface CreditRequest {
  jobId: string;
  workerId: string;
  amount: Paise;
  creditClass: CreditClass;
  evidenceId: string | null;
  reason: string;
}

export type CreditOutcome =
  | { kind: 'credited'; amount: Paise }
  /**
   * Law 4 failure behaviour: past the cap, discretionary rewards convert to
   * non-cash — badges, rank, priority job access — and this is SURFACED to
   * the worker, never silently dropped.
   */
  | { kind: 'substituted'; substitute: 'badge' | 'rank' | 'priority-access'; because: string }
  | { kind: 'refused'; because: string };

/**
 * The single write-path for worker money.
 *
 * Gate 4 is enforced upstream (no verified evidence → this is never called).
 * This function enforces the budget cap and the ledger classification.
 */
export function requestCredit(
  req: CreditRequest,
  ctx: {
    grossMargin: Paise;
    /** Discretionary spend already committed on this job. */
    discretionarySpent: Paise;
    cap?: GamificationCap;
  },
): CreditOutcome {
  if (req.amount <= 0) {
    return { kind: 'refused', because: 'A credit must be a positive amount.' };
  }

  // Direct cost of sale is not discretionary and is not capped. Classifying
  // it as gamification is the audit failure the PRD calls out.
  if (req.creditClass === 'direct-cost-of-sale') {
    return { kind: 'credited', amount: req.amount };
  }

  const { ceiling } = capForJob(ctx.grossMargin, ctx.cap ?? DEFAULT_GAMIFICATION_CAP);
  const wouldBe = paise(ctx.discretionarySpent + req.amount);

  if (wouldBe > ceiling) {
    return {
      kind: 'substituted',
      substitute: 'priority-access',
      because:
        "This job's reward budget is fully committed. This one comes as priority access to the next job instead.",
    };
  }
  return { kind: 'credited', amount: req.amount };
}

export interface WalletBalance {
  pending: Paise;
  cleared: Paise;
}

/**
 * Penalties deduct from Pending first, then Cleared. Returns what was
 * actually taken from each bucket plus any shortfall that could not be
 * recovered from the wallet at all.
 */
export function applyPenalty(
  balance: WalletBalance,
  amount: Paise,
): { balance: WalletBalance; fromPending: Paise; fromCleared: Paise; shortfall: Paise } {
  if (amount < 0) throw new Error('A penalty cannot be negative.');
  const fromPending = paise(Math.min(balance.pending, amount));
  const afterPending = paise(amount - fromPending);
  const fromCleared = paise(Math.min(balance.cleared, afterPending));
  const shortfall = paise(afterPending - fromCleared);
  return {
    balance: {
      pending: paise(balance.pending - fromPending),
      cleared: paise(balance.cleared - fromCleared),
    },
    fromPending,
    fromCleared,
    shortfall,
  };
}

/** Verification moves money from Pending to Cleared. Nothing else does. */
export function clearCredit(balance: WalletBalance, amount: Paise): WalletBalance {
  const moved = paise(Math.min(balance.pending, amount));
  return { pending: paise(balance.pending - moved), cleared: paise(balance.cleared + moved) };
}

/**
 * Cleared balance auto-pays every Friday. Returns the next payout instant
 * from a given time, so the UI can show a real countdown rather than a
 * vague "soon".
 */
export function nextPayoutAt(from: Date): Date {
  const d = new Date(from.getTime());
  const FRIDAY = 5;
  const daysUntilFriday = (FRIDAY - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + daysUntilFriday);
  d.setUTCHours(0, 0, 0, 0);
  if (d.getTime() <= from.getTime()) d.setUTCDate(d.getUTCDate() + 7);
  return d;
}
