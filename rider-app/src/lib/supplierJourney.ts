import type { Lead } from './types'

/** An order exists the moment QC clears the shaft (lead becomes
 * in_transit) — allocation is automatic per PRD §15.2, no bidding step
 * in this MVP. */
export function selectSupplyQueue(leads: Lead[]): Lead[] {
  return leads.filter((l) => l.status === 'in_transit').sort((a, b) => b.createdAt - a.createdAt)
}
