export type LeadStatus =
  | 'new'
  | 'in_sales'
  | 'won_awaiting_shaft'
  | 'in_transit'
  | 'installing'
  | 'complete'
  | 'blocked'
  | 'lost'

export interface LeadPhotos {
  shaft: string | null
  building: string | null
  contact: string | null
}

/** Margin is markup-over-cost — (offer - baseCost) / baseCost — matching the
 * PRD §10 worked example exactly: ₹8,00,000 list on ₹5,00,000 cost is "60%
 * negotiation margin," ₹6,00,000 is "the 20% floor." Not margin-over-price. */
export interface Quote {
  baseCost: number
  listPrice: number
  botFloor: number
  hardFloor: number
  currentOffer: number
}

export interface Lead {
  id: string // MH-PUN-{ZONE}-LEAD-nnnn-x
  buildingName: string
  address: string
  zone: string
  lat: number
  lng: number
  floors: number
  shaftReady: boolean
  passengers: number
  ownerName: string
  ownerPhone: string
  photos: LeadPhotos
  note: string
  qualityScore: number // 0-100, AI-computed at capture
  payout: 40 | 10
  status: LeadStatus
  createdAt: number
  synced: boolean
  newGroundBonus: boolean
  aiTip?: string
  quote?: Quote
}

export type WalletState = 'pending' | 'cleared'

export interface WalletEntry {
  id: string // WLET-xxxx
  amount: number
  label: string
  cause: string
  consequence: string
  state: WalletState
  leadId?: string
  createdAt: number
}

export interface RiderProfile {
  name: string
  phone: string
  level: number
  city: string
  zone: string
  verified: boolean
  streakDays: number
  upiId: string
}

export interface QueuedCapture {
  opId: string // idempotency key
  lead: Lead
  createdAt: number
}
