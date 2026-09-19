import type { Lead, Quote } from './types'

/** PRD §10.1: base cost is a function of shaft size (floors/passengers),
 * zone logistics and current material rates. We don't have a live rate
 * card in this MVP, so floors/passengers stand in as the one real signal —
 * tuned so a G+4, 8-passenger reference lift lands near the source's own
 * ₹5,00,000 worked example. */
export function computeBaseCost(lead: Pick<Lead, 'floors' | 'passengers'>): number {
  const raw = 350_000 + lead.passengers * 18_000 + lead.floors * 12_000
  return Math.round(raw / 5000) * 5000
}

/** PRD §10.2: list = cost + 60% headroom, bot floor ≈ cost + 23% (the
 * ceiling of its 0-30% discount authority), hard floor = cost + 20% —
 * the absolute, code-level minimum margin that not even Admin can cross. */
export function computeQuote(lead: Pick<Lead, 'floors' | 'passengers'>): Quote {
  const baseCost = computeBaseCost(lead)
  const listPrice = Math.round(baseCost * 1.6)
  const botFloor = Math.round(baseCost * 1.23)
  const hardFloor = Math.round(baseCost * 1.2)
  return { baseCost, listPrice, botFloor, hardFloor, currentOffer: botFloor }
}

export function marginPct(offer: number, baseCost: number): number {
  return ((offer - baseCost) / baseCost) * 100
}
