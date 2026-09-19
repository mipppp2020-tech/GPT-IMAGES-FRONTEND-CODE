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
  payments?: CustomerPayments
  shaftReadiness?: ShaftReadinessItem[]
}

/** PRD §11.2: token at signature, 90% ("material payment") on container
 * arrival, final 10%-less-token at handover before NOC. */
export interface CustomerPayments {
  token: boolean
  material90: boolean
  final: boolean
}

export interface ShaftReadinessItem {
  label: string
  done: boolean
  photo: string | null
}

export type SopStepStatus = 'locked' | 'unlocked' | 'verified' | 'frozen'

export interface SopStepState {
  id: string
  status: SopStepStatus
  photos: (string | null)[]
  failCount: number
  lastFailReason: string | null
}

export type JobStage = 'offered' | 'accepted' | 'checked_in' | 'done'

export interface TechJob {
  leadId: string
  stage: JobStage
  steps: SopStepState[]
  startedAt: number | null
}

export type QcVerdict = 'pass' | 'conditional' | 'fail'
export type QcInspectionType = 'shaft' | 'final'

export interface QcChecklistItem {
  id: string
  group: string
  label: string
  verdict: QcVerdict | null
  photo: string | null
  note: string
}

export interface Inspection {
  id: string
  leadId: string
  type: QcInspectionType
  stage: 'offered' | 'checked_in' | 'signed'
  items: QcChecklistItem[]
  result: 'cleared' | 'rework' | null
  signedAt: number | null
}

export interface SupplyKitState {
  id: string
  packed: boolean
}

export type SupplyOrderStage = 'offered' | 'packing' | 'dispatched'

export interface SupplyOrder {
  id: string
  leadId: string
  stage: SupplyOrderStage
  kits: SupplyKitState[]
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
