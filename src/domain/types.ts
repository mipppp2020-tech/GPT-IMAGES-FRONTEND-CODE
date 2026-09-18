import type { LifecycleState, StatusGrammar } from './lifecycle';

/** Roles the app can run as. A session carries exactly one. */
export type AiecRole = 'rider' | 'owner' | 'engineer';

/**
 * ROLE BOUNDARY (source requirement §10).
 *
 * A Lead as the RIDER is permitted to see it. Fields the rider must never
 * receive are absent from this type, not merely hidden: the rider client has
 * no shape in which to hold customer pricing, margin, or owner cash figures,
 * so it cannot render or cache them even by mistake.
 */
export interface RiderLead {
  id: string;
  /** Human-facing reference shown on receipts and to AIEC staff. */
  reference: string;
  siteName: string;
  locality: string;
  pincode: string;
  status: StatusGrammar;
  /** Straight-line distance from the rider, in metres. */
  distanceM: number;
  /** What THIS rider earns for this lead, in paise. Not project value. */
  riderEarningPaise: number;
  capturedAt: string;
  photoCount: number;
  thumbnailId: BuildingThumb;
  floors?: string;
  liftRequirement?: string;
  contact?: { name: string; role: string };
}

/** Owner-only fields, declared so the boundary is explicit and reviewable. */
export const RIDER_FORBIDDEN_FIELDS = [
  'projectValue',
  'quotedPrice',
  'margin',
  'customerPhone',
  'competitorQuotes',
  'ownerCashPosition',
] as const;

export type BuildingThumb = 'rcc-frame' | 'finished-tower' | 'shell-core' | 'low-rise' | 'slab';

export interface RiderEarnings {
  todayPaise: number;
  weekPaise: number;
  appointmentsToday: number;
  nearbyLeads: number;
}

export interface MapEntityPoint {
  id: string;
  state: LifecycleState;
  /** Normalised 0..1 position within the map viewport. */
  x: number;
  y: number;
  label?: string;
}

export interface QueuedAction {
  id: string;
  kind: 'lead-capture' | 'photo-upload' | 'status-update';
  label: string;
  createdAt: string;
  sizeLabel: string;
}
