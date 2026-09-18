/**
 * AIEC — MONEY PRIMITIVES
 *
 * All money in this system is integer paise. Never a float, never a Number
 * that has been through a division. A rounding drift of one paise on a
 * ₹6,15,000 deal is a reconciliation failure against the payment provider
 * (PRD §13.5), and the margin floor is a *numeric* constraint (§4.3 #2) —
 * it cannot be enforced against a value that has already lost precision.
 */
export type Paise = number & { readonly __brand: 'Paise' };

export function paise(n: number): Paise {
  if (!Number.isInteger(n)) throw new Error(`Paise must be an integer, got ${n}`);
  return n as Paise;
}

export function rupees(n: number): Paise {
  return paise(Math.round(n * 100));
}

export function addP(a: Paise, b: Paise): Paise {
  return paise(a + b);
}

export function subP(a: Paise, b: Paise): Paise {
  return paise(a - b);
}

/** Percentage of an amount, rounded half-up to the paise. */
export function pctOf(amount: Paise, percent: number): Paise {
  return paise(Math.round((amount * percent) / 100));
}

/**
 * Indian grouping (2,2,3) — ₹1,50,000, never ₹1,50,000 written as ₹150,000.
 * Design System §1.4 requires this in all three languages, with tabular
 * lining figures so a wallet row does not shift as the balance changes.
 */
export function formatINR(p: Paise, opts: { paise?: boolean } = {}): string {
  const neg = p < 0;
  const abs = Math.abs(p);
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  const s = String(whole);
  let grouped: string;
  if (s.length <= 3) {
    grouped = s;
  } else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  const out = opts.paise || frac !== 0 ? `${grouped}.${String(frac).padStart(2, '0')}` : grouped;
  return (neg ? '-' : '') + out;
}
