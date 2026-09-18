import { describe, it, expect } from 'vitest';
import { mr, en } from './strings';

/**
 * THE FORBIDDEN LEXICON — Design System §7.2.
 *
 * These words are banned product-wide, not discouraged. The UX Architecture
 * is explicit: "There is no screen in AIEC where 'Pending' is an acceptable
 * string." The replacement is never another word — it is a CustodyLine that
 * names who holds the work, what is needed, by when, and what happens if it
 * slips.
 *
 * This test is the enforcement. A style rule nobody checks is a style rule
 * that decays; this one fails the build.
 */

const BANNED_EVERYWHERE = [
  'pending', 'processing', 'in progress', 'awaiting approval',
  'something went wrong', 'error occurred', 'invalid', 'failed',
  'no data', 'n/a', 'oops', 'please try again later', 'contact support',
];

/** Law IV — verification protects the worker, it never accuses them. */
const BANNED_IN_WORKER_STRINGS = [
  'suspicious', 'flagged', 'detected', 'verified your identity',
  'location check passed', 'validated',
];

/** Marathi/Hindi equivalents of the same contentless status words. */
const BANNED_DEVANAGARI = ['प्रलंबित'];

/**
 * Explicit, reviewable exemptions.
 *
 * The rule stays strict and the exceptions stay visible. A banned word is
 * exempt only where it names a THING rather than reporting a STATE — e.g.
 * "Processing fee" (प्रक्रिया शुल्क) is a line item on an invoice, not a
 * status. Weakening the matcher instead would let real status copy back in.
 */
const EXEMPT: Record<string, string> = {
  'fee.processing': '"Processing fee" is the name of a charge, not a status.',
};

function offenders(dict: Record<string, string>, banned: string[]) {
  const hits: string[] = [];
  for (const [key, value] of Object.entries(dict)) {
    if (key in EXEMPT) continue;
    const v = value.toLowerCase();
    for (const word of banned) {
      // Word-boundary match so "unverified"/"verification" do not trip the
      // worker-accusation list, and "N/A" does not match "N/Africa".
      const re = new RegExp(`(^|[^\\p{L}])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'iu');
      if (re.test(v)) hits.push(`${key} = "${value}"`);
    }
  }
  return hits;
}

describe('forbidden lexicon', () => {
  it('no banned status word appears in any English string', () => {
    expect(offenders(en, BANNED_EVERYWHERE)).toEqual([]);
  });

  it('no banned status word appears in any Marathi string', () => {
    expect(offenders(mr as unknown as Record<string, string>, BANNED_DEVANAGARI)).toEqual([]);
  });

  it('no worker-facing string accuses the worker (Law IV)', () => {
    const workerKeys = Object.keys(en).filter((k) =>
      /^(capture|photos|payout|success|appeal|money|key|docs|progress)\./.test(k),
    );
    const workerDict = Object.fromEntries(workerKeys.map((k) => [k, en[k as keyof typeof en]]));
    expect(offenders(workerDict, BANNED_IN_WORKER_STRINGS)).toEqual([]);
  });

  it('the two dictionaries cover exactly the same keys', () => {
    // Law 6: a missing translation is a release blocker, never a silent
    // fallback to English — least of all for safety content.
    const mrKeys = Object.keys(mr).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(mrKeys);
  });

  it('every string is non-empty', () => {
    for (const [k, v] of Object.entries(en)) expect(v.trim(), `en.${k} is empty`).not.toBe('');
    for (const [k, v] of Object.entries(mr)) expect(String(v).trim(), `mr.${k} is empty`).not.toBe('');
  });
});

/**
 * Marathi quantity grammar.
 *
 * "X पैकी Y" means "Y out of X" — the TOTAL comes first. Getting it backwards
 * renders "4 पैकी 6" for four-of-six, which reads as six-of-four. This has now
 * been introduced twice by hand, so it is checked rather than remembered.
 */
describe('Marathi quantity grammar', () => {
  const dict = mr as unknown as Record<string, string>;

  it('every "पैकी" template puts the total before the count', () => {
    const wrong: string[] = [];
    for (const [key, value] of Object.entries(dict)) {
      if (!value.includes('पैकी')) continue;
      const m = /\{(\w+)\}\s*पैकी\s*\{(\w+)\}/.exec(value);
      if (!m) continue;
      const [, first, second] = m;
      // The slot before पैकी must be the total/denominator.
      const totalish = /^(total|required|all|denominator)$/i.test(first);
      const countish = /^(done|n|collected|count|completed)$/i.test(second);
      if (!totalish || !countish) wrong.push(`${key} = "${value}"`);
    }
    expect(wrong).toEqual([]);
  });
});
