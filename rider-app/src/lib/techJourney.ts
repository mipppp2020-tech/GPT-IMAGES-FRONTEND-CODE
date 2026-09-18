import type { Lead } from './types'

/** A technician job only exists once material has physically unlocked at
 * site — i.e. the lead is `installing`. Picks the most recently active
 * one, same recency-preference pattern as the Customer role. */
export function selectPrimaryTechLead(leads: Lead[]): Lead | null {
  const eligible = leads.filter((l) => l.status === 'installing')
  if (eligible.length === 0) return null
  return eligible.sort((a, b) => b.createdAt - a.createdAt)[0]
}
