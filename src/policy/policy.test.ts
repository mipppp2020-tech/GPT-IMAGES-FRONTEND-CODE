import { describe, it, expect } from 'vitest';
import { rupees, paise, formatINR, addP } from './money';
import { issueId, parseId, dammCheckDigit, dammIsValid } from './ids';
import {
  gate1Token, gate2QcClearance, gate3NinetyPercent, gate4SopEvidence, gate5FinalPayment,
  tripleKeyUnlock, gate3WindowExpired, PAYMENT_WINDOW_HOURS,
} from './gates';
import {
  decidePrice, listPrice, botFloorPrice, absoluteFloorPrice, marginPct,
  sanityAdjustedListPrice, DEFAULT_MARGIN_POLICY,
} from './pricing';
import { requestCredit, applyPenalty, clearCredit, capForJob, nextPayoutAt } from './wallet';
import { evaluatePipeline, advance, PIPELINE_STAGES, type PipelineFacts } from './pipeline';

/* ========================================================== MONEY */
describe('money is integer paise', () => {
  it('refuses a fractional paise', () => {
    expect(() => paise(10.5)).toThrow();
  });

  it('formats with Indian grouping, not thousands grouping', () => {
    expect(formatINR(rupees(615000))).toBe('6,15,000');
    expect(formatINR(rupees(150000))).toBe('1,50,000');
    expect(formatINR(rupees(1000))).toBe('1,000');
    expect(formatINR(rupees(100))).toBe('100');
    expect(formatINR(rupees(10000000))).toBe('1,00,00,000');
  });

  it('survives a round-trip that a float would corrupt', () => {
    // 0.1 + 0.2 in float is 0.30000000000000004; in paise it is exact.
    let total = rupees(0);
    for (let i = 0; i < 3; i++) total = addP(total, rupees(0.1));
    expect(total).toBe(30);
  });
});

/* ========================================================== LAW 1 — IDs */
describe('Law 1 — location-aware IDs with a Damm check digit', () => {
  it('issues an ID whose check digit validates', () => {
    const id = issueId({ state: 'MH', city: 'PUNE', zone: 'Z3', entity: 'LEAD', serial: 447 });
    expect(id).toMatch(/^MH-PUNE-Z3-LEAD-0447-\d$/);
    expect(parseId(id)).not.toBeNull();
  });

  it('catches a single mistyped digit', () => {
    const id = issueId({ state: 'MH', city: 'PUNE', zone: 'Z3', entity: 'LEAD', serial: 447 });
    const broken = id.replace('0447', '0448');
    expect(parseId(broken)).toBeNull();
  });

  it('catches an adjacent transposition, which Luhn would miss', () => {
    // Damm is specified precisely because it catches all adjacent transpositions.
    const a = issueId({ state: 'MH', city: 'PUNE', zone: 'Z3', entity: 'CONT', serial: 1234 });
    const transposed = a.replace('1234', '2134');
    expect(parseId(transposed)).toBeNull();
  });

  it('validates the Damm property directly across many transpositions', () => {
    let caught = 0, total = 0;
    for (let n = 0; n < 500; n++) {
      const s = String(n).padStart(4, '0');
      const withCheck = s + dammCheckDigit(s);
      for (let i = 0; i < withCheck.length - 1; i++) {
        const arr = withCheck.split('');
        if (arr[i] === arr[i + 1]) continue;
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        total++;
        if (!dammIsValid(arr.join(''))) caught++;
      }
    }
    expect(total).toBeGreaterThan(0);
    expect(caught).toBe(total); // every single one
  });

  it('rejects a malformed ID rather than silently correcting it', () => {
    expect(() => issueId({ state: 'M', city: 'PUNE', zone: 'Z3', entity: 'LEAD', serial: 1 })).toThrow();
    expect(() => issueId({ state: 'MH', city: 'PUNE', zone: 'Z3', entity: 'LEAD', serial: 99999 })).toThrow();
  });
});

/* ========================================================== THE FIVE GATES */
describe('Gate 1 — no token, no project', () => {
  // `blocks` carries translation KEYS, not prose: Law 6 requires all three
  // languages, so the engine never returns a user-facing sentence.
  it('stays shut without a token', () => {
    const v = gate1Token({ tokenPaid: false, tokenAmount: rupees(0), agreementSigned: true });
    expect(v.open).toBe(false);
    expect(v.blocks).toContain('blk.agmt');
  });
  it('opens on a token', () => {
    expect(gate1Token({ tokenPaid: true, tokenAmount: rupees(10000), agreementSigned: true }).open).toBe(true);
  });
  it('has no override path', () => {
    expect(gate1Token({ tokenPaid: false, tokenAmount: rupees(0), agreementSigned: false }).override).toBe('none');
  });
});

describe('Gate 2 — no QC clearance, no drawings or material', () => {
  it('stays shut when the shaft has not been inspected', () => {
    const v = gate2QcClearance({ qcReportId: null, qcStatus: 'none' });
    expect(v.open).toBe(false);
    expect(v.blocks).toEqual(expect.arrayContaining(['blk.drawings', 'blk.allocation']));
  });
  it('stays shut on a rework verdict', () => {
    expect(gate2QcClearance({ qcReportId: 'QCIN-1', qcStatus: 'rework' }).open).toBe(false);
  });
  it('will not open on a status without a signed report', () => {
    expect(gate2QcClearance({ qcReportId: null, qcStatus: 'cleared' }).open).toBe(false);
  });
  it('opens on a signed, cleared report', () => {
    expect(gate2QcClearance({ qcReportId: 'QCIN-1', qcStatus: 'cleared' }).open).toBe(true);
  });
});

describe('Gate 3 — no 90% payment, the container never unlocks', () => {
  it('stays shut while unpaid', () => {
    expect(gate3NinetyPercent({ containerArrived: true, ninetyPercentPaid: false, hoursSinceArrival: 1 }).open).toBe(false);
  });
  it('counts the 48-hour window down and then recalls the truck', () => {
    expect(gate3WindowExpired({ containerArrived: true, ninetyPercentPaid: false, hoursSinceArrival: 47 })).toBe(false);
    expect(gate3WindowExpired({ containerArrived: true, ninetyPercentPaid: false, hoursSinceArrival: PAYMENT_WINDOW_HOURS })).toBe(true);
  });
  it('has no override at any level', () => {
    expect(gate3NinetyPercent({ containerArrived: true, ninetyPercentPaid: false, hoursSinceArrival: 1 }).override).toBe('none');
  });
});

describe('Gate 4 — no verified evidence, no worker credit', () => {
  const base = { stepIndex: 8, priorStepVerified: true, evidenceSubmitted: true, machineVerdict: 'pass' as const, appealOpen: false };
  it('opens on verified evidence', () => {
    expect(gate4SopEvidence(base).open).toBe(true);
  });
  it('enforces the sequence lock — step 8 cannot exist before step 7 verifies', () => {
    const v = gate4SopEvidence({ ...base, priorStepVerified: false });
    expect(v.open).toBe(false);
    expect(v.reason).toContain('7');
  });
  it('cannot be opened by declaration alone', () => {
    expect(gate4SopEvidence({ ...base, evidenceSubmitted: false }).open).toBe(false);
  });
  it('never accuses the worker on rejection (Law IV)', () => {
    const v = gate4SopEvidence({ ...base, machineVerdict: 'reject' });
    expect(v.open).toBe(false);
    const forbidden = ['suspicious', 'flagged', 'detected', 'invalid', 'failed'];
    for (const w of forbidden) expect(v.reason.toLowerCase()).not.toContain(w);
    expect(v.reason).toContain('held, not lost');
  });
});

describe('Gate 5 — no final payment, no NOC', () => {
  it('stays shut before handover', () => {
    expect(gate5FinalPayment({ handoverComplete: false, finalPaymentPaid: true }).open).toBe(false);
  });
  it('withholds the technician payout too', () => {
    const v = gate5FinalPayment({ handoverComplete: true, finalPaymentPaid: false });
    expect(v.open).toBe(false);
    expect(v.blocks).toContain('blk.payout');
  });
});

/* ========================================================== TRIPLE KEY */
describe('triple-key container unlock', () => {
  const t0 = 1_700_000_000_000;
  const ok = {
    gate3Open: true,
    customerOtpAt: t0,
    technicianBiometricAt: t0 + 60_000,
    systemApprovalAt: t0 + 120_000,
    technicianDistanceM: 10,
    now: t0 + 120_000,
  };

  it('opens with all three keys inside the window and the geofence', () => {
    expect(tripleKeyUnlock(ok).open).toBe(true);
  });

  it('will not open on money alone', () => {
    const v = tripleKeyUnlock({ ...ok, technicianBiometricAt: null });
    expect(v.open).toBe(false);
    expect(v.waitingOn).toBe('technician');
  });

  it('will not open on keys alone without Gate 3', () => {
    const v = tripleKeyUnlock({ ...ok, gate3Open: false });
    expect(v.open).toBe(false);
    expect(v.waitingOn).toBe('payment');
  });

  it('refuses keys spread beyond the 5-minute window', () => {
    const v = tripleKeyUnlock({ ...ok, systemApprovalAt: t0 + 6 * 60_000, now: t0 + 6 * 60_000 });
    expect(v.open).toBe(false);
    expect(v.waitingOn).toBe('window');
  });

  it('refuses a technician outside the 50m geofence', () => {
    const v = tripleKeyUnlock({ ...ok, technicianDistanceM: 51 });
    expect(v.open).toBe(false);
    expect(v.waitingOn).toBe('geofence');
  });
});

/* ========================================================== MARGIN FLOOR */
describe('the margin floor is code, not policy', () => {
  const base = rupees(500000);

  it("reproduces the manual's worked example exactly", () => {
    expect(listPrice(base)).toBe(rupees(800000));
    // The margin floor binds before the 30% discount cap does.
    expect(botFloorPrice(base)).toBe(rupees(615000));
    expect(absoluteFloorPrice(base)).toBe(rupees(600000));
  });

  it('lands on a different floor under the other reading of "margin"', () => {
    // Documented so the commercial consequence is visible, not buried.
    const onPrice = { ...DEFAULT_MARGIN_POLICY, basis: 'margin-on-price' as const };
    expect(absoluteFloorPrice(base, onPrice)).toBe(rupees(625000));
  });

  it('lets the bot discount within its range', () => {
    expect(decidePrice({ baseCost: base, proposedPrice: rupees(700000), actor: 'bot' }).allowed).toBe(true);
  });

  it('sends the bot to a human below the bot floor', () => {
    const d = decidePrice({ baseCost: base, proposedPrice: rupees(610000), actor: 'bot' });
    expect(d.allowed).toBe(false);
    expect(d.requiresApprovalFrom).toBe('sales-desk');
  });

  it('BLOCKS the sales desk below the 20% floor', () => {
    const d = decidePrice({ baseCost: base, proposedPrice: rupees(590000), actor: 'sales-desk' });
    expect(d.allowed).toBe(false);
    expect(d.requiresApprovalFrom).toBe('owner');
    expect(d.marginPct).toBeLessThan(20);
  });

  it('BLOCKS admin below the floor — not even Admin can cross it', () => {
    expect(decidePrice({ baseCost: base, proposedPrice: rupees(590000), actor: 'admin' }).allowed).toBe(false);
  });

  it('blocks the Owner too, unless a written reason is recorded', () => {
    expect(decidePrice({ baseCost: base, proposedPrice: rupees(590000), actor: 'owner' }).allowed).toBe(false);
    expect(decidePrice({ baseCost: base, proposedPrice: rupees(590000), actor: 'owner', writtenReason: '  ' }).allowed).toBe(false);
    const withReason = decidePrice({
      baseCost: base, proposedPrice: rupees(590000), actor: 'owner',
      writtenReason: 'Strategic entry into Wakad zone; approved at board review 12 Aug.',
    });
    expect(withReason.allowed).toBe(true);
  });

  it('refuses a price above list — that is not a discount', () => {
    expect(decidePrice({ baseCost: base, proposedPrice: rupees(900000), actor: 'owner', writtenReason: 'x' }).allowed).toBe(false);
  });

  it('applies the market sanity check — fake discounts on a fake price work once', () => {
    expect(sanityAdjustedListPrice(base, rupees(700000))).toBe(rupees(700000));
    expect(sanityAdjustedListPrice(base, rupees(900000))).toBe(rupees(800000));
    expect(sanityAdjustedListPrice(base, null)).toBe(rupees(800000));
  });

  it('holds the floor across a sweep of base costs', () => {
    for (let cost = 100000; cost <= 2000000; cost += 100000) {
      const c = rupees(cost);
      const floor = absoluteFloorPrice(c);
      expect(marginPct(c, floor)).toBeGreaterThanOrEqual(DEFAULT_MARGIN_POLICY.absoluteMarginFloorPct - 0.001);
      const justBelow = paise(floor - 100);
      expect(decidePrice({ baseCost: c, proposedPrice: justBelow, actor: 'admin' }).allowed).toBe(false);
    }
  });
});

/* ========================================================== WALLET */
describe('wallet mechanics', () => {
  it('penalties take from Pending before Cleared', () => {
    const r = applyPenalty({ pending: rupees(300), cleared: rupees(1000) }, rupees(500));
    expect(r.fromPending).toBe(rupees(300));
    expect(r.fromCleared).toBe(rupees(200));
    expect(r.balance).toEqual({ pending: rupees(0), cleared: rupees(800) });
    expect(r.shortfall).toBe(rupees(0));
  });

  it('reports a shortfall rather than driving the wallet negative', () => {
    const r = applyPenalty({ pending: rupees(100), cleared: rupees(100) }, rupees(500));
    expect(r.balance).toEqual({ pending: rupees(0), cleared: rupees(0) });
    expect(r.shortfall).toBe(rupees(300));
  });

  it('only verification moves Pending to Cleared', () => {
    expect(clearCredit({ pending: rupees(2800), cleared: rupees(0) }, rupees(2800)))
      .toEqual({ pending: rupees(0), cleared: rupees(2800) });
  });

  it('caps discretionary rewards at 4% of gross margin', () => {
    const margin = rupees(115000);
    const { ceiling } = capForJob(margin);
    expect(ceiling).toBe(rupees(4600));
    const out = requestCredit(
      { jobId: 'J1', workerId: 'W1', amount: rupees(500), creditClass: 'discretionary', evidenceId: null, reason: 'streak' },
      { grossMargin: margin, discretionarySpent: rupees(4400) },
    );
    expect(out.kind).toBe('substituted');
  });

  it('substitutes rather than silently dropping, and tells the worker why', () => {
    const out = requestCredit(
      { jobId: 'J1', workerId: 'W1', amount: rupees(5000), creditClass: 'discretionary', evidenceId: null, reason: 'leaderboard' },
      { grossMargin: rupees(115000), discretionarySpent: rupees(0) },
    );
    expect(out.kind).toBe('substituted');
    if (out.kind === 'substituted') expect(out.because.length).toBeGreaterThan(10);
  });

  it('does NOT cap direct cost of sale — the classification an auditor checks', () => {
    const out = requestCredit(
      { jobId: 'J1', workerId: 'W1', amount: rupees(50000), creditClass: 'direct-cost-of-sale', evidenceId: 'EVID-1', reason: 'conversion commission' },
      { grossMargin: rupees(115000), discretionarySpent: rupees(4600) },
    );
    expect(out.kind).toBe('credited');
  });

  it('pays out on Fridays', () => {
    // 2025-08-18 is a Monday.
    const monday = new Date(Date.UTC(2025, 7, 18, 10, 0, 0));
    expect(nextPayoutAt(monday).getUTCDay()).toBe(5);
    const friday = new Date(Date.UTC(2025, 7, 22, 10, 0, 0));
    const next = nextPayoutAt(friday);
    expect(next.getUTCDay()).toBe(5);
    expect(next.getTime()).toBeGreaterThan(friday.getTime());
  });
});

/* ========================================================== PIPELINE */
const clean: PipelineFacts = {
  stage: 'won',
  tokenPaid: false, tokenAmount: rupees(0), agreementSigned: true,
  qcReportId: null, qcStatus: 'none',
  containerArrived: false, ninetyPercentPaid: false, hoursSinceArrival: 0,
  customerOtpAt: null, technicianBiometricAt: null, systemApprovalAt: null, technicianDistanceM: 5,
  sopStepIndex: 1, sopPriorStepVerified: true, sopEvidenceSubmitted: false, sopMachineVerdict: 'none', sopAppealOpen: false,
  handoverComplete: false, finalPaymentPaid: false,
  now: 1_700_000_000_000,
};

describe('the money pipeline', () => {
  it('names the exact lock the user is standing at', () => {
    const s = evaluatePipeline(clean);
    expect(s.standingAt?.gate).toBe(1);
    expect(s.canAdvanceTo).toBeNull();
  });

  it('will not skip a stage', () => {
    const r = advance({ ...clean, tokenPaid: true, tokenAmount: rupees(10000) }, 'qc-cleared');
    expect(r.ok).toBe(false);
  });

  it('will not move backwards — money flows forward only', () => {
    const r = advance({ ...clean, stage: 'paid-90' }, 'awaiting-payment');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.because).toContain('forward only');
  });

  it('advances once the token is paid', () => {
    const r = advance({ ...clean, tokenPaid: true, tokenAmount: rupees(10000) }, 'token-paid');
    expect(r.ok).toBe(true);
  });

  it('holds at Gate 2 until a signed clearance exists', () => {
    const at = { ...clean, stage: 'shaft-readiness' as const, tokenPaid: true, tokenAmount: rupees(10000) };
    expect(advance(at, 'qc-cleared').ok).toBe(false);
    expect(advance({ ...at, qcReportId: 'QCIN-1', qcStatus: 'cleared' }, 'qc-cleared').ok).toBe(true);
  });

  it('holds custody transfer until all three keys turn, even with the money in', () => {
    const paid = {
      ...clean, stage: 'paid-90' as const,
      tokenPaid: true, tokenAmount: rupees(10000),
      qcReportId: 'QCIN-1', qcStatus: 'cleared' as const,
      containerArrived: true, ninetyPercentPaid: true, hoursSinceArrival: 2,
    };
    expect(advance(paid, 'custody-transferred').ok).toBe(false);
    const withKeys = {
      ...paid,
      customerOtpAt: paid.now, technicianBiometricAt: paid.now + 1000, systemApprovalAt: paid.now + 2000,
    };
    expect(advance(withKeys, 'custody-transferred').ok).toBe(true);
  });

  it('walks the whole pipeline end to end when every key is supplied', () => {
    let f: PipelineFacts = { ...clean, stage: PIPELINE_STAGES[0] };
    const keys: Partial<PipelineFacts> = {
      tokenPaid: true, tokenAmount: rupees(10000),
      qcReportId: 'QCIN-1', qcStatus: 'cleared',
      containerArrived: true, ninetyPercentPaid: true, hoursSinceArrival: 2,
      customerOtpAt: clean.now, technicianBiometricAt: clean.now + 1000, systemApprovalAt: clean.now + 2000,
      sopPriorStepVerified: true, sopEvidenceSubmitted: true, sopMachineVerdict: 'pass',
      handoverComplete: true, finalPaymentPaid: true,
    };
    f = { ...f, ...keys };
    for (let i = 0; i < PIPELINE_STAGES.length - 1; i++) {
      const to = PIPELINE_STAGES[i + 1];
      const r = advance(f, to);
      expect(r, `stuck moving ${f.stage} -> ${to}`).toMatchObject({ ok: true });
      f = { ...f, stage: to };
    }
    expect(f.stage).toBe('amc-active');
  });

  it('stalls at exactly one gate when exactly one key is missing', () => {
    const allKeys: Partial<PipelineFacts> = {
      tokenPaid: true, tokenAmount: rupees(10000),
      qcReportId: 'QCIN-1', qcStatus: 'cleared',
      containerArrived: true, ninetyPercentPaid: true, hoursSinceArrival: 2,
      customerOtpAt: clean.now, technicianBiometricAt: clean.now + 1000, systemApprovalAt: clean.now + 2000,
      sopPriorStepVerified: true, sopEvidenceSubmitted: true, sopMachineVerdict: 'pass',
      handoverComplete: true, finalPaymentPaid: true,
    };
    // Remove the 90% payment: the pipeline must stop at awaiting-payment.
    let f: PipelineFacts = { ...clean, ...allKeys, stage: PIPELINE_STAGES[0], ninetyPercentPaid: false };
    let stuckAt: string | null = null;
    for (let i = 0; i < PIPELINE_STAGES.length - 1; i++) {
      const r = advance(f, PIPELINE_STAGES[i + 1]);
      if (!r.ok) { stuckAt = f.stage; break; }
      f = { ...f, stage: PIPELINE_STAGES[i + 1] };
    }
    expect(stuckAt).toBe('awaiting-payment');
  });
});

/* ============================================ ENGINE HOLDS NO USER COPY */
describe('the Policy Engine holds no user-facing prose (Law 6)', () => {
  it('every gate verdict returns a code and key-shaped blocks', () => {
    const verdicts = [
      gate1Token({ tokenPaid: false, tokenAmount: rupees(0), agreementSigned: false }),
      gate2QcClearance({ qcReportId: null, qcStatus: 'none' }),
      gate3NinetyPercent({ containerArrived: true, ninetyPercentPaid: false, hoursSinceArrival: 1 }),
      gate4SopEvidence({ stepIndex: 8, priorStepVerified: false, evidenceSubmitted: false, machineVerdict: 'none', appealOpen: false }),
      gate5FinalPayment({ handoverComplete: false, finalPaymentPaid: false }),
    ];
    for (const v of verdicts) {
      expect(v.code, 'verdict must carry a language-free code').toMatch(/^g[1-5]\./);
      for (const b of v.blocks) {
        expect(b, `"${b}" should be a translation key, not prose`).toMatch(/^blk\.[a-zA-Z]+$/);
      }
    }
  });
});
