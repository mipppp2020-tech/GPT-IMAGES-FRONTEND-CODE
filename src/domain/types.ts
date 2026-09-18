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

/* =========================================================================
   RECORD / COMPLIANCE FLOW (S-R-08 … S-R-16)

   A SiteRecord is the registered construction site a lead becomes once AIEC
   accepts it. The rider services it: uploads statutory documents, pays the
   municipal fee, and tracks construction to handover.

   Role boundary still holds — a record carries the fee the rider actually
   paid, never the commercial value of the installation.
   ========================================================================= */

export interface SiteRecord {
  id: string;
  reference: string;
  siteName: string;
  locality: string;
  pincode: string;
  status: import('./lifecycle').StatusGrammar;
  /** Display string, e.g. "16 ऑग, 2025, 10:24 AM". */
  recordedAt: string;
  /** Compact form for lists, e.g. "G + 4". */
  floors: string;
  /** Full form for the detail fact grid, e.g. "G + 4 (एकूण 5)". */
  floorsFull: string;
  /** Flat count shown beside the floor spec in the list. */
  flats: number;
  ownerName: string;
  thumbnailId: BuildingThumb;
  feePaidPaise: number;
  flatNo?: string;
  buildingType: 'residential';
}

/** A statutory document the site must supply before the record can proceed. */
export interface DocumentRequirement {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: 'building' | 'pin' | 'image' | 'list' | 'helmet' | 'shield';
  tone: 'done' | 'installing' | 'new';
  required: boolean;
  state: DocumentState;
}

export type DocumentState =
  | { kind: 'uploaded'; at: string }
  | { kind: 'uploading'; pct: number }
  | { kind: 'missing' };

export function isDocumentSatisfied(d: DocumentRequirement): boolean {
  return d.state.kind === 'uploaded';
}

/** One stage of the build, as shown on the construction-progress screen. */
export interface ProgressStage {
  id: string;
  titleKey: string;
  state: 'done' | 'running' | 'pending';
  /** Pre-formatted date phrase, already localised at the fixture level. */
  dateKey: string;
  dateValue: string;
  detail?: {
    bodyKey: string;
    pct: number;
    photos: { src: string; captionKey: string }[];
  };
}

export interface AiecNotification {
  id: string;
  titleKey: string;
  bodyKey: string;
  at: string;
  /** Drives both the icon tone and the card surface. */
  tone: 'done' | 'selling' | 'material' | 'installing' | 'new';
  icon: 'check-circle' | 'image' | 'clock' | 'info' | 'bell';
  actionKey?: string;
  unread?: boolean;
  category: 'unread' | 'important' | 'system' | 'other';
}
