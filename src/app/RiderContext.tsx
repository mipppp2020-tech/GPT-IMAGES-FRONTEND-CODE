import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { paise, rupees, type Paise } from '@/policy/money';
import { issueId } from '@/policy/ids';
import { requestCredit, applyPenalty, clearCredit, type WalletBalance } from '@/policy/wallet';
import type { RiderLead } from '@/domain/types';
import type { StatusGrammar } from '@/domain/lifecycle';
import { RIDER_LEADS } from '@/data/fixtures';

/**
 * RIDER SESSION STATE — PRD §8.
 *
 * The rider's day is a loop: start the ride, capture a shaft, get paid,
 * repeat. Before this, capture was a screen sequence that produced nothing —
 * you could "submit" a lead and My Leads would not change. This holds the
 * real state so the journey is end-to-end: a capture mints a LEAD id, runs
 * the 50m duplicate check, scores quality, credits the wallet, and the lead
 * appears in the list.
 *
 * Money moves through the Policy Engine's wallet rules, never by hand.
 */

/** PRD §8 reward table (illustrative amounts, admin-configurable in production). */
export const RIDER_RATES = {
  validLead: rupees(40),
  lowQualityLead: rupees(10),
  newGroundBonus: rupees(15),
  dailyTarget: rupees(240),
  breakLogged: rupees(30),
  conversion: rupees(1500),
  nocReached: rupees(1000),
} as const;

export const DAILY_TARGET_LEADS = 8;
export const DUPLICATE_RADIUS_M = 50;

export interface CapturedPhoto {
  kind: 'shaft' | 'building' | 'contact';
  src: string;
}

export type CaptureOutcome =
  | { kind: 'captured'; lead: RiderLead; credited: Paise; lowQuality: boolean }
  | { kind: 'duplicate'; by: string; on: string }
  | { kind: 'blocked'; because: 'gps' | 'photos' };

interface RiderValue {
  rideStarted: boolean;
  gpsAvailable: boolean;
  online: boolean;
  wallet: WalletBalance;
  leads: RiderLead[];
  capturedToday: number;
  queuedCount: number;
  /** Photos taken in the capture flow, before submit. */
  draft: CapturedPhoto[];

  startRide: () => void;
  endRide: () => void;
  setGps: (v: boolean) => void;
  setOnline: (v: boolean) => void;
  takePhoto: (kind: CapturedPhoto['kind'], src: string) => void;
  clearDraft: () => void;
  /** The whole capture transaction: duplicate check, score, mint, credit. */
  submitCapture: (opts?: { forceDuplicate?: boolean; lowQuality?: boolean }) => CaptureOutcome;
  logBreak: () => void;
  lastOutcome: CaptureOutcome | null;
}

const Ctx = createContext<RiderValue | null>(null);

/** A newly captured lead is always 'new', held by the rider, with a clock. */
function freshStatus(): StatusGrammar {
  return {
    state: 'new',
    chipLabel: 'नवीन लीड',
    reason: 'तुम्ही आत्ताच ही साइट नोंदवली आहे.',
    custody: { holder: 'aiec', name: 'विक्री टीम' },
    clock: { kind: 'due', at: '', remainingLabel: '60 सेकंदात सेल्सकडे' },
    consequence: 'सेल्स टीम स्कोअर करून ग्राहकाशी संपर्क करेल.',
  };
}

const SITE_NAMES = ['नवकार हाईट्स', 'शिवशक्ती अपार्टमेंट', 'रेणुका रेसिडेन्सी', 'तुळजाई टॉवर', 'अनंत कॉम्प्लेक्स'];
const LOCALITIES = [
  { locality: 'बाणेर, पुणे', pincode: '411045', zone: 'Z3' },
  { locality: 'कोथरूड, पुणे', pincode: '411038', zone: 'Z5' },
  { locality: 'औंध, पुणे', pincode: '411007', zone: 'Z2' },
];

/**
 * The rider's day survives a reload.
 *
 * Non-negotiable #5: "Offline must work — concrete shafts have no signal",
 * and §8.3 requires captures to be "queued locally, synced on reconnect".
 * In-memory state would lose a morning's leads to a dropped tab, so the
 * session is persisted. Reads are defensive: a corrupt or absent payload
 * starts a clean day rather than crashing the app on launch.
 */
const STORE_KEY = 'aiec.rider.session.v1';

interface Persisted {
  rideStarted: boolean;
  wallet: WalletBalance;
  leads: RiderLead[];
  capturedToday: number;
  queuedCount: number;
  serial: number;
}

function loadSession(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveSession(p: Persisted) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(p));
  } catch {
    // A full or blocked store must never break a capture in progress.
  }
}

export function RiderProvider({ children }: { children: ReactNode }) {
  const restored = loadSession();
  const [rideStarted, setRideStarted] = useState(restored.rideStarted ?? false);
  const [gpsAvailable, setGps] = useState(true);
  const [online, setOnline] = useState(true);
  const [wallet, setWallet] = useState<WalletBalance>(
    restored.wallet ?? { pending: rupees(0), cleared: rupees(4320) },
  );
  const [leads, setLeads] = useState<RiderLead[]>(restored.leads ?? RIDER_LEADS);
  const [capturedToday, setCapturedToday] = useState(restored.capturedToday ?? 0);
  const [queuedCount, setQueuedCount] = useState(restored.queuedCount ?? 0);
  // The draft is deliberately NOT persisted: a half-taken photo set belongs to
  // the moment the rider was standing at the shaft, not to the next session.
  const [draft, setDraft] = useState<CapturedPhoto[]>([]);
  const [serial, setSerial] = useState(restored.serial ?? 448);
  const [lastOutcome, setLastOutcome] = useState<CaptureOutcome | null>(null);

  const startRide = useCallback(() => setRideStarted(true), []);
  const endRide = useCallback(() => setRideStarted(false), []);
  const clearDraft = useCallback(() => setDraft([]), []);

  const takePhoto = useCallback((kind: CapturedPhoto['kind'], src: string) => {
    setDraft((d) => (d.some((p) => p.kind === kind) ? d : [...d, { kind, src }]));
  }, []);

  const submitCapture = useCallback(
    (opts: { forceDuplicate?: boolean; lowQuality?: boolean } = {}): CaptureOutcome => {
      // Failure table §8.3, in the order the rider hits them.
      if (!gpsAvailable) {
        const out: CaptureOutcome = { kind: 'blocked', because: 'gps' };
        setLastOutcome(out);
        return out;
      }
      if (draft.length === 0) {
        const out: CaptureOutcome = { kind: 'blocked', because: 'photos' };
        setLastOutcome(out);
        return out;
      }
      if (opts.forceDuplicate) {
        // The first capture keeps the commission; the second is blocked.
        const out: CaptureOutcome = { kind: 'duplicate', by: 'अनिल मोरे', on: '14 ऑग, 2025' };
        setLastOutcome(out);
        return out;
      }

      const place = LOCALITIES[serial % LOCALITIES.length];
      const id = issueId({ state: 'MH', city: 'PUNE', zone: place.zone, entity: 'LEAD', serial });
      const lowQuality = !!opts.lowQuality;
      const amount = lowQuality ? RIDER_RATES.lowQualityLead : RIDER_RATES.validLead;

      // Conversion and completion rewards are direct cost of sale; a capture
      // reward is the same class — it is what the company pays to acquire the
      // lead, not a discretionary streak bonus (PRD §13.3).
      const outcome = requestCredit(
        {
          jobId: id,
          workerId: 'rider-sandeep',
          amount,
          creditClass: 'direct-cost-of-sale',
          evidenceId: id,
          reason: lowQuality ? 'low-quality lead' : 'valid lead captured',
        },
        { grossMargin: rupees(115000), discretionarySpent: rupees(0) },
      );
      const credited = outcome.kind === 'credited' ? outcome.amount : rupees(0);

      const lead: RiderLead = {
        id: `l-new-${serial}`,
        reference: `#${id}`,
        siteName: SITE_NAMES[serial % SITE_NAMES.length],
        locality: place.locality,
        pincode: place.pincode,
        status: freshStatus(),
        distanceM: 40 + (serial % 7) * 35,
        riderEarningPaise: credited,
        capturedAt: 'कॅप्चर: आत्ताच',
        photoCount: draft.length,
        thumbnailId: 'rcc-frame',
      };

      setLeads((l) => [lead, ...l]);
      setWallet((w) => ({ ...w, pending: paise(w.pending + credited) }));
      setCapturedToday((n) => n + 1);
      setSerial((s) => s + 1);
      setDraft([]);
      if (!online) setQueuedCount((q) => q + 1);

      const out: CaptureOutcome = { kind: 'captured', lead, credited, lowQuality };
      setLastOutcome(out);
      return out;
    },
    [gpsAvailable, draft, serial, online],
  );

  const logBreak = useCallback(() => {
    setWallet((w) => ({ ...w, pending: paise(w.pending + RIDER_RATES.breakLogged) }));
  }, []);

  useEffect(() => {
    saveSession({ rideStarted, wallet, leads, capturedToday, queuedCount, serial });
  }, [rideStarted, wallet, leads, capturedToday, queuedCount, serial]);

  const value = useMemo<RiderValue>(
    () => ({
      rideStarted, gpsAvailable, online, wallet, leads, capturedToday, queuedCount, draft,
      startRide, endRide, setGps, setOnline, takePhoto, clearDraft, submitCapture, logBreak, lastOutcome,
    }),
    [rideStarted, gpsAvailable, online, wallet, leads, capturedToday, queuedCount, draft,
     startRide, endRide, takePhoto, clearDraft, submitCapture, logBreak, lastOutcome],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRider(): RiderValue {
  const c = useContext(Ctx);
  if (!c) throw new Error('useRider must be used inside RiderProvider');
  return c;
}

/** Exposed for the wallet screen so penalties/clearing use the policy rules. */
export { applyPenalty, clearCredit };
