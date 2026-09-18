import { paise, pctOf, type Paise } from './money';

/**
 * PRICING & MARGIN ENGINE — PRD §10.
 *
 * Non-negotiable #2: "The margin floor is code, not policy — 20% cannot be
 * typed by any bot or any human below Owner."
 *
 * Every figure here is CONFIGURATION, not a constant. PRD §10.5 is explicit:
 * "Do NOT hard-code the ₹6,15,000/₹5,00,000/60%/30%/20% example figures as
 * code constants." The worked example lives in fixtures; the policy lives
 * here and reads its numbers from a versioned rate card.
 */

/**
 * ⚠ LOAD-BEARING AMBIGUITY IN THE SOURCE — read before changing a number.
 *
 * The PRD's worked example states:
 *     base cost 5,00,000 · list 8,00,000 · bot floor 6,15,000 ("~23% margin")
 *     absolute floor 6,00,000 ("the 20% floor")
 *
 * Those percentages only reconcile as MARKUP ON COST:
 *     6,15,000 -> 23.0% markup on cost, but 18.7% margin on price
 *     6,00,000 -> 20.0% markup on cost, but 16.7% margin on price
 *
 * So "margin" in the manual means markup over base cost, not gross margin on
 * the selling price. Implementing the conventional reading (margin on price)
 * puts the floor at 6,25,000 instead of 6,00,000 — ₹25,000 higher on this
 * deal, on every deal, in the company's favour but against the manual.
 *
 * `basis` therefore makes the interpretation explicit and configurable. The
 * default reproduces the source's own numbers exactly. This is flagged in
 * DEVIATIONS.md as an Owner decision, not a developer one.
 */
export type MarginBasis = 'markup-on-cost' | 'margin-on-price';

export interface MarginPolicy {
  /** Version of the rate card these numbers came from — audited, not implied. */
  version: string;
  /** How the percentages are computed. See the note above. */
  basis: MarginBasis;
  /** Negotiation headroom added to base cost to form the list price. */
  listMarkupPct: number;
  /** Headline cap on how far the bot may discount off list. */
  botMaxDiscountPct: number;
  /** The bot's auto-approved margin floor (23% in the worked example). */
  botMarginFloorPct: number;
  /** The hard floor. Below this, nothing may be written by anyone but Owner. */
  absoluteMarginFloorPct: number;
}

export const DEFAULT_MARGIN_POLICY: MarginPolicy = {
  version: 'rate-card-illustrative-v0',
  basis: 'markup-on-cost',
  listMarkupPct: 60,
  botMaxDiscountPct: 30,
  botMarginFloorPct: 23,
  absoluteMarginFloorPct: 20,
};

/** The price at which a given margin percentage is exactly retained. */
export function priceAtMargin(baseCost: Paise, pct: number, basis: MarginBasis): Paise {
  return basis === 'markup-on-cost'
    ? paise(Math.ceil(baseCost * (1 + pct / 100)))
    : paise(Math.ceil(baseCost / (1 - pct / 100)));
}

export type PriceActor = 'bot' | 'sales-desk' | 'admin' | 'owner';

export interface PriceProposal {
  baseCost: Paise;
  proposedPrice: Paise;
  actor: PriceActor;
  /** Owner overrides below the floor REQUIRE a written, logged reason. */
  writtenReason?: string;
}

export interface PriceDecision {
  allowed: boolean;
  marginPct: number;
  listPrice: Paise;
  botFloorPrice: Paise;
  absoluteFloorPrice: Paise;
  /** Who must approve this price, if anyone above the proposing actor. */
  requiresApprovalFrom: PriceActor | null;
  reason: string;
}

export function listPrice(baseCost: Paise, p: MarginPolicy = DEFAULT_MARGIN_POLICY): Paise {
  return paise(baseCost + pctOf(baseCost, p.listMarkupPct));
}

/**
 * The lowest price the bot may reach unaided.
 *
 * TWO constraints bind, and the tighter one wins: the headline discount cap
 * off list, and the bot's own margin floor. In the worked example the margin
 * floor binds (6,15,000), not the 30% discount (5,60,000) — which is why the
 * manual's "up to 30%" and its stated bot floor look contradictory until both
 * are modelled.
 */
export function botFloorPrice(baseCost: Paise, p: MarginPolicy = DEFAULT_MARGIN_POLICY): Paise {
  const list = listPrice(baseCost, p);
  const byDiscount = paise(list - pctOf(list, p.botMaxDiscountPct));
  const byMargin = priceAtMargin(baseCost, p.botMarginFloorPct, p.basis);
  return paise(Math.max(byDiscount, byMargin));
}

/** The absolute floor: the price at which retained margin equals the floor %. */
export function absoluteFloorPrice(baseCost: Paise, p: MarginPolicy = DEFAULT_MARGIN_POLICY): Paise {
  return priceAtMargin(baseCost, p.absoluteMarginFloorPct, p.basis);
}

export function marginPct(
  baseCost: Paise,
  price: Paise,
  basis: MarginBasis = DEFAULT_MARGIN_POLICY.basis,
): number {
  if (price <= 0) return -Infinity;
  return basis === 'markup-on-cost'
    ? ((price - baseCost) / baseCost) * 100
    : ((price - baseCost) / price) * 100;
}

/**
 * The single write-path for any price in the system.
 *
 * Returns allowed:false rather than throwing, so the caller can render a
 * KeyringGate explaining who can approve — a greyed-out field would be a
 * banned `disabled` state (Design System §5).
 */
export function decidePrice(
  proposal: PriceProposal,
  policy: MarginPolicy = DEFAULT_MARGIN_POLICY,
): PriceDecision {
  const { baseCost, proposedPrice, actor } = proposal;
  const list = listPrice(baseCost, policy);
  const botFloor = botFloorPrice(baseCost, policy);
  const absFloor = absoluteFloorPrice(baseCost, policy);
  const margin = marginPct(baseCost, proposedPrice, policy.basis);

  const base: Omit<PriceDecision, 'allowed' | 'requiresApprovalFrom' | 'reason'> = {
    marginPct: margin,
    listPrice: list,
    botFloorPrice: botFloor,
    absoluteFloorPrice: absFloor,
  };

  if (proposedPrice > list) {
    return {
      ...base,
      allowed: false,
      requiresApprovalFrom: null,
      reason: 'A price above the list price is not a discount and is not issuable.',
    };
  }

  // Below the absolute floor: Owner only, and only with a written reason.
  if (proposedPrice < absFloor) {
    if (actor === 'owner' && proposal.writtenReason && proposal.writtenReason.trim().length > 0) {
      return {
        ...base,
        allowed: true,
        requiresApprovalFrom: null,
        reason: 'Owner override below the margin floor, recorded with a written reason.',
      };
    }
    return {
      ...base,
      allowed: false,
      requiresApprovalFrom: 'owner',
      reason: `This price retains ${margin.toFixed(1)}% margin, below the ${policy.absoluteMarginFloorPct}% floor. Only the Owner can approve it, in writing.`,
    };
  }

  // Between the bot floor and the absolute floor: human desk territory.
  if (proposedPrice < botFloor) {
    if (actor === 'bot') {
      return {
        ...base,
        allowed: false,
        requiresApprovalFrom: 'sales-desk',
        reason: 'Below the automated discount limit. A person on the sales desk has to take this one.',
      };
    }
    return {
      ...base,
      allowed: true,
      requiresApprovalFrom: null,
      reason: 'Within the human negotiating band, above the margin floor.',
    };
  }

  return {
    ...base,
    allowed: true,
    requiresApprovalFrom: null,
    reason: 'Within the automated discount range.',
  };
}

/**
 * Market sanity check — PRD §10.2: if list exceeds the zone's 90th-percentile
 * competitor quote, reduce the starting markup. "Fake discounts on a fake
 * price only work once."
 */
export function sanityAdjustedListPrice(
  baseCost: Paise,
  zoneP90CompetitorQuote: Paise | null,
  policy: MarginPolicy = DEFAULT_MARGIN_POLICY,
): Paise {
  const list = listPrice(baseCost, policy);
  if (zoneP90CompetitorQuote === null) return list;
  return list > zoneP90CompetitorQuote ? zoneP90CompetitorQuote : list;
}
