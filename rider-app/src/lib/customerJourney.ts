import type { CustomerPayments, Lead, ShaftReadinessItem } from './types'

/** PRD §11.1: a 10-item illustrated checklist. Compressed to 5 for this
 * MVP — enough to demonstrate the mechanic (camera button, AI pre-check
 * framing, progress) without authoring the full civil-engineering list. */
export function defaultShaftReadiness(): ShaftReadinessItem[] {
  return [
    { label: 'शाफ्टचे मोजमाप (रुंदी/खोली) टेपसह', done: false, photo: null },
    { label: 'शाफ्टचा पाया (पिट) पूर्ण व कोरडा', done: false, photo: null },
    { label: 'वीज पुरवठा पॉईंट शाफ्टजवळ तयार', done: false, photo: null },
    { label: 'हेडरूम (वरील मोकळी जागा) पुरेशी', done: false, photo: null },
    { label: 'शाफ्टभोवती काम करण्यासाठी मोकळी जागा', done: false, photo: null },
  ]
}

export function emptyPayments(): CustomerPayments {
  return { token: false, material90: false, final: false }
}

export type JourneyStageKey =
  | 'before_token'
  | 'shaft_readiness'
  | 'qc_wait'
  | 'material_transit'
  | 'installing'
  | 'complete'

export interface JourneyStage {
  key: JourneyStageKey
  percent: number
  ringLabel: string
}

/** Maps the shared Lead state (+ this role's own payments/checklist) to the
 * one thing the PRD's Day-0-through-Day-34 table says the customer should
 * see — the progress ring is "the single element carrying the whole
 * relationship state," so this is the one function every screen reads. */
export function journeyStage(lead: Lead): JourneyStage {
  const shaftDone = (lead.shaftReadiness ?? []).length > 0 && (lead.shaftReadiness ?? []).every((i) => i.done)

  if (lead.status === 'complete') return { key: 'complete', percent: 100, ringLabel: 'पूर्ण' }
  if (lead.status === 'installing') return { key: 'installing', percent: 75, ringLabel: 'इंस्टॉलेशन' }
  if (lead.status === 'in_transit') return { key: 'material_transit', percent: 55, ringLabel: 'मटेरियल मार्गावर' }
  if (!lead.payments?.token) return { key: 'before_token', percent: 0, ringLabel: 'टोकन बाकी' }
  if (!shaftDone) return { key: 'shaft_readiness', percent: 12, ringLabel: 'शाफ्ट तयारी' }
  return { key: 'qc_wait', percent: 28, ringLabel: 'QC प्रतीक्षा' }
}

/** Picks which project a customer session shows by default — the most
 * recently active one (so a deal just closed in Sales is what a demo
 * presenter sees immediately on switching roles), preferring an in-flight
 * journey over an already-finished one. */
export function selectPrimaryCustomerLead(leads: Lead[]): Lead | null {
  const eligible = leads.filter((l) =>
    ['won_awaiting_shaft', 'in_transit', 'installing', 'complete'].includes(l.status),
  )
  if (eligible.length === 0) return null
  const inFlight = eligible.filter((l) => l.status !== 'complete')
  const pool = inFlight.length > 0 ? inFlight : eligible
  return pool.sort((a, b) => b.createdAt - a.createdAt)[0]
}
