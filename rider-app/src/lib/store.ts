import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, WalletEntry, RiderProfile, Quote, TechJob, SopStepStatus, Inspection, QcInspectionType, QcVerdict, SupplyOrder, AdminDecision } from './types'
import { DEMO_RIDER, SEED_LEADS, seedWalletEntries } from './mock'
import { nextWalletId } from './ids'
import { defaultShaftReadiness, emptyPayments } from './customerJourney'
import { SOP_TEMPLATE, JOB_ON_TIME_BONUS } from './sop'
import { buildChecklist, QC_FEES } from './qcChecklists'
import { KIT_TEMPLATE } from './kits'

export interface Appeal {
  id: string
  leadId: string
  stepId: string
  reason: string
  createdAt: number
  resolved: boolean
  upheld: boolean | null
}

interface RiderStore {
  rider: RiderProfile
  leads: Lead[]
  wallet: WalletEntry[]
  techWallet: WalletEntry[]
  techJobs: TechJob[]
  appeals: Appeal[]
  qcWallet: WalletEntry[]
  inspections: Inspection[]
  supplierWallet: WalletEntry[]
  supplyOrders: SupplyOrder[]
  adminDecisions: AdminDecision[]
  rideActive: boolean
  online: boolean
  lastCoinEvent: { amount: number; label: string; cause: string; consequence: string } | null

  setOnline: (v: boolean) => void
  startRide: () => void
  endRide: () => void
  addLead: (lead: Lead) => void
  addWalletEntry: (entry: WalletEntry) => void
  syncQueued: () => void
  clearCoinEvent: () => void
  advanceLeadStatus: (leadId: string) => void
  closeDeal: (leadId: string, quote: Quote) => void
  payToken: (leadId: string) => void
  toggleShaftItem: (leadId: string, index: number) => void
  payMaterial90: (leadId: string) => void

  acceptJob: (leadId: string) => void
  checkInJob: (leadId: string) => void
  captureStepPhoto: (leadId: string, stepId: string, photoIndex: number, dataUrl: string) => void
  submitStep: (leadId: string, stepId: string, pass: boolean, reason?: string) => void
  retakeStep: (leadId: string, stepId: string) => void
  fileAppeal: (leadId: string, stepId: string, reason: string) => void
  resolveAppeal: (appealId: string, uphold: boolean) => void
  addTechWalletEntry: (entry: WalletEntry) => void

  startInspection: (leadId: string, type: QcInspectionType) => void
  checkInInspection: (inspectionId: string) => void
  setQcVerdict: (inspectionId: string, itemId: string, verdict: QcVerdict) => void
  setQcNote: (inspectionId: string, itemId: string, note: string) => void
  captureQcPhoto: (inspectionId: string, itemId: string, dataUrl: string) => void
  signOffInspection: (inspectionId: string) => void

  acceptOrder: (leadId: string) => void
  packKit: (orderId: string, kitId: string) => void
  sealAndDispatch: (orderId: string) => void

  resolveBlockedLead: (leadId: string, isDuplicate: boolean) => void
  recordAdminDecision: (alertId: string, label: string, reason: string) => void
}

export const useAiecStore = create<RiderStore>()(
  persist(
    (set, get) => ({
      rider: DEMO_RIDER,
      leads: SEED_LEADS,
      wallet: seedWalletEntries(SEED_LEADS),
      techWallet: [],
      techJobs: [],
      appeals: [],
      qcWallet: [],
      inspections: [],
      supplierWallet: [],
      supplyOrders: [],
      adminDecisions: [],
      rideActive: false,
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      lastCoinEvent: null,

      setOnline: (v) => {
        set({ online: v })
        if (v) get().syncQueued()
      },

      startRide: () => set({ rideActive: true }),
      endRide: () => set({ rideActive: false }),

      addLead: (lead) =>
        set((s) => ({ leads: [lead, ...s.leads] })),

      addWalletEntry: (entry) =>
        set((s) => ({
          wallet: [entry, ...s.wallet],
          lastCoinEvent: {
            amount: entry.amount,
            label: entry.label,
            cause: entry.cause,
            consequence: entry.consequence,
          },
        })),

      syncQueued: () =>
        set((s) => ({
          leads: s.leads.map((l) => (l.synced ? l : { ...l, synced: true })),
          wallet: s.wallet.map((w) => (w.state === 'pending' ? { ...w, state: 'cleared' } : w)),
        })),

      clearCoinEvent: () => set({ lastCoinEvent: null }),

      advanceLeadStatus: (leadId) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === leadId ? { ...l, status: 'in_sales' } : l)),
        })),

      // PRD §9.5: closing a deal is an 8-action cascade — a `LIFT`/`CUST`
      // record is created, the map pin turns purple, shaft-readiness SOP
      // dispatches, QC auto-schedules, supplier is notified... and the
      // rider who captured the original lead is credited ₹1,500 with a
      // named push notification. This MVP's slice of that cascade is the
      // one that proves the roles actually share one spine: the lead
      // flips to won_awaiting_shaft (which is what makes it show up as a
      // payable project for Phase 2's Customer), and the SAME rider
      // wallet used on the Rider screens gets the conversion credit,
      // live, cross-role.
      closeDeal: (leadId, quote) => {
        const lead = get().leads.find((l) => l.id === leadId)
        if (!lead) return
        set((s) => ({
          leads: s.leads.map((l) => (l.id === leadId ? { ...l, status: 'won_awaiting_shaft', quote } : l)),
        }))
        get().addWalletEntry({
          id: nextWalletId(),
          amount: 1500,
          label: 'लीड विक्रीत रूपांतरित',
          cause: `${lead.buildingName} — टोकन पेमेंट मिळाले`,
          consequence: 'तुमच्या खात्यात जमा',
          state: 'cleared',
          leadId,
          createdAt: Date.now(),
        })
      },

      // PRD §4.2 Gate 1: token payment is what dispatches the Shaft
      // Readiness SOP in the first place — nothing before it.
      payToken: (leadId) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  payments: { ...(l.payments ?? emptyPayments()), token: true },
                  shaftReadiness: l.shaftReadiness ?? defaultShaftReadiness(),
                }
              : l,
          ),
        })),

      toggleShaftItem: (leadId, index) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId && l.shaftReadiness
              ? {
                  ...l,
                  shaftReadiness: l.shaftReadiness.map((item, i) =>
                    i === index ? { ...item, done: !item.done } : item,
                  ),
                }
              : l,
          ),
        })),

      // PRD §11.1 "Arrival Day — 90% Payment Gate": funds settle to escrow,
      // supplier auto-paid, lock becomes eligible for unlock. This MVP
      // records the payment; the live container/unlock mechanics arrive
      // with the Supplier and Technician phases.
      payMaterial90: (leadId) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId ? { ...l, payments: { ...(l.payments ?? emptyPayments()), material90: true } } : l,
          ),
        })),

      // PRD §19.2: declining is free and unpenalised, accepting creates the
      // job with Step 1 unlocked and everything after it sequence-locked —
      // §20.4's "structural, not merely policy-level" step-skip prevention.
      acceptJob: (leadId) =>
        set((s) => {
          if (s.techJobs.some((j) => j.leadId === leadId)) return s
          const steps = SOP_TEMPLATE.map((t, i) => ({
            id: t.id,
            status: (i === 0 ? 'unlocked' : 'locked') as SopStepStatus,
            photos: t.evidenceLabels.map(() => null),
            failCount: 0,
            lastFailReason: null,
          }))
          return { techJobs: [...s.techJobs, { leadId, stage: 'accepted', steps, startedAt: null }] }
        }),

      checkInJob: (leadId) =>
        set((s) => ({
          techJobs: s.techJobs.map((j) =>
            j.leadId === leadId ? { ...j, stage: 'checked_in', startedAt: j.startedAt ?? Date.now() } : j,
          ),
        })),

      captureStepPhoto: (leadId, stepId, photoIndex, dataUrl) =>
        set((s) => ({
          techJobs: s.techJobs.map((j) =>
            j.leadId !== leadId
              ? j
              : {
                  ...j,
                  steps: j.steps.map((st) =>
                    st.id !== stepId
                      ? st
                      : { ...st, photos: st.photos.map((p, i) => (i === photoIndex ? dataUrl : p)) },
                  ),
                },
          ),
        })),

      // PRD §20.3 retry/escalation ladder: all-pass credits and unlocks the
      // next step; a fail offers a specific retake (2 retries allowed); a
      // second fail freezes the step for admin review — appeal stays open,
      // credit for a passed appeal is never "removed then re-added," it's
      // just held in Pending-equivalent (frozen) until resolved.
      submitStep: (leadId, stepId, pass, reason) => {
        const job = get().techJobs.find((j) => j.leadId === leadId)
        const stepIndex = job?.steps.findIndex((s) => s.id === stepId) ?? -1
        if (!job || stepIndex === -1) return
        const step = job.steps[stepIndex]
        const template = SOP_TEMPLATE[stepIndex]

        if (pass) {
          set((s) => ({
            techJobs: s.techJobs.map((j) =>
              j.leadId !== leadId
                ? j
                : {
                    ...j,
                    steps: j.steps.map((st, i) => {
                      if (i === stepIndex) return { ...st, status: 'verified', lastFailReason: null }
                      if (i === stepIndex + 1 && st.status === 'locked') return { ...st, status: 'unlocked' }
                      return st
                    }),
                  },
            ),
          }))
          const isLastStep = stepIndex === SOP_TEMPLATE.length - 1
          get().addTechWalletEntry({
            id: nextWalletId(),
            amount: template.reward,
            label: `पडताळणी: ${template.title}`,
            cause: `Step ${stepIndex + 1} of ${SOP_TEMPLATE.length}`,
            consequence: isLastStep ? 'जॉब पूर्ण — QC तपासणीची वाट पाहत आहे' : `Step ${stepIndex + 2} अनलॉक झाले`,
            state: 'cleared',
            leadId,
            createdAt: Date.now(),
          })
          if (isLastStep) {
            set((s) => ({ techJobs: s.techJobs.map((j) => (j.leadId === leadId ? { ...j, stage: 'done' } : j)) }))
            get().addTechWalletEntry({
              id: nextWalletId(),
              amount: JOB_ON_TIME_BONUS,
              label: 'वेळेत पूर्ण बोनस',
              cause: '14 दिवसांच्या आत सर्व टप्पे पूर्ण',
              consequence: 'तुमच्या खात्यात जमा',
              state: 'cleared',
              leadId,
              createdAt: Date.now(),
            })
          }
          return
        }

        const failCount = step.failCount + 1
        if (failCount >= 2) {
          set((s) => ({
            techJobs: s.techJobs.map((j) =>
              j.leadId !== leadId
                ? j
                : {
                    ...j,
                    steps: j.steps.map((st, i) =>
                      i === stepIndex ? { ...st, status: 'frozen', failCount, lastFailReason: reason ?? null } : st,
                    ),
                  },
            ),
          }))
        } else {
          set((s) => ({
            techJobs: s.techJobs.map((j) =>
              j.leadId !== leadId
                ? j
                : {
                    ...j,
                    steps: j.steps.map((st, i) =>
                      i === stepIndex ? { ...st, failCount, lastFailReason: reason ?? null } : st,
                    ),
                  },
            ),
          }))
        }
      },

      retakeStep: (leadId, stepId) =>
        set((s) => ({
          techJobs: s.techJobs.map((j) =>
            j.leadId !== leadId
              ? j
              : {
                  ...j,
                  steps: j.steps.map((st) => (st.id === stepId ? { ...st, photos: st.photos.map(() => null) } : st)),
                },
          ),
        })),

      fileAppeal: (leadId, stepId, reason) =>
        set((s) => ({
          appeals: [
            ...s.appeals,
            { id: `APL-${Date.now()}`, leadId, stepId, reason, createdAt: Date.now(), resolved: false, upheld: null },
          ],
        })),

      // The other half of fileAppeal — lives here rather than only in the
      // (later) Admin phase, since an appeal filed by a technician today
      // must be resolvable by an Admin session started at any point after,
      // without needing this action to be re-declared per role.
      resolveAppeal: (appealId, uphold) => {
        const appeal = get().appeals.find((a) => a.id === appealId)
        if (!appeal) return
        set((s) => ({
          appeals: s.appeals.map((a) => (a.id === appealId ? { ...a, resolved: true, upheld: uphold } : a)),
        }))
        if (uphold) {
          get().submitStep(appeal.leadId, appeal.stepId, true)
        } else {
          set((s) => ({
            techJobs: s.techJobs.map((j) =>
              j.leadId !== appeal.leadId
                ? j
                : { ...j, steps: j.steps.map((st) => (st.id === appeal.stepId ? { ...st, photos: st.photos.map(() => null), failCount: 0, status: 'unlocked' } : st)) },
            ),
          }))
        }
      },

      addTechWalletEntry: (entry: WalletEntry) =>
        set((s) => ({
          techWallet: [entry, ...s.techWallet],
          lastCoinEvent: {
            amount: entry.amount,
            label: entry.label,
            cause: entry.cause,
            consequence: entry.consequence,
          },
        })),

      // PRD §14.1: "role separation — QC never installs." Structurally a
      // completely different actor's wallet/queue from Technician's, even
      // though both work the same lead.
      startInspection: (leadId, type) =>
        set((s) => {
          if (s.inspections.some((i) => i.leadId === leadId && i.type === type && i.result === null)) return s
          return {
            inspections: [
              ...s.inspections,
              { id: `QCIN-${Date.now()}`, leadId, type, stage: 'offered', items: buildChecklist(type), result: null, signedAt: null },
            ],
          }
        }),

      checkInInspection: (inspectionId) =>
        set((s) => ({
          inspections: s.inspections.map((i) => (i.id === inspectionId ? { ...i, stage: 'checked_in' } : i)),
        })),

      setQcVerdict: (inspectionId, itemId, verdict) =>
        set((s) => ({
          inspections: s.inspections.map((i) =>
            i.id !== inspectionId
              ? i
              : { ...i, items: i.items.map((it) => (it.id === itemId ? { ...it, verdict } : it)) },
          ),
        })),

      setQcNote: (inspectionId, itemId, note) =>
        set((s) => ({
          inspections: s.inspections.map((i) =>
            i.id !== inspectionId
              ? i
              : { ...i, items: i.items.map((it) => (it.id === itemId ? { ...it, note } : it)) },
          ),
        })),

      captureQcPhoto: (inspectionId, itemId, dataUrl) =>
        set((s) => ({
          inspections: s.inspections.map((i) =>
            i.id !== inspectionId
              ? i
              : { ...i, items: i.items.map((it) => (it.id === itemId ? { ...it, photo: dataUrl } : it)) },
          ),
        })),

      // PRD §14.1 flow: ALL PASS -> cleared, drawings released, material
      // allocated (Gate 2) — here, the lead moving to in_transit. ANY FAIL
      // -> rework list back to the customer, annotated, re-inspection
      // implied by shaft-readiness simply being reopened. §14.2's final
      // audit clearing is what actually completes the lift (NOC-eligible
      // on the Customer screen) — the one thing Technician alone can never
      // do, per Non-Negotiable #3.
      signOffInspection: (inspectionId) => {
        const inspection = get().inspections.find((i) => i.id === inspectionId)
        if (!inspection) return
        const anyFail = inspection.items.some((it) => it.verdict === 'fail')
        const result = anyFail ? 'rework' : 'cleared'

        set((s) => ({
          inspections: s.inspections.map((i) =>
            i.id === inspectionId ? { ...i, stage: 'signed', result, signedAt: Date.now() } : i,
          ),
        }))

        set((s) => ({
          leads: s.leads.map((l) => {
            if (l.id !== inspection.leadId) return l
            if (result === 'cleared' && inspection.type === 'shaft') return { ...l, status: 'in_transit' }
            if (result === 'cleared' && inspection.type === 'final') return { ...l, status: 'complete' }
            if (result === 'rework' && inspection.type === 'shaft' && l.shaftReadiness) {
              return { ...l, shaftReadiness: l.shaftReadiness.map((it) => ({ ...it, done: false })) }
            }
            return l
          }),
        }))

        const lead = get().leads.find((l) => l.id === inspection.leadId)
        set((s) => ({
          qcWallet: [
            {
              id: nextWalletId(),
              amount: QC_FEES[inspection.type],
              label: inspection.type === 'shaft' ? 'शाफ्ट तपासणी' : 'अंतिम तपासणी',
              cause: lead?.buildingName ?? inspection.leadId,
              consequence: result === 'cleared' ? 'क्लिअर — पुढील टप्पा अनलॉक झाला' : 'रिवर्क यादी पाठवली',
              state: 'cleared',
              leadId: inspection.leadId,
              createdAt: Date.now(),
            },
            ...s.qcWallet,
          ],
          lastCoinEvent: {
            amount: QC_FEES[inspection.type],
            label: inspection.type === 'shaft' ? 'शाफ्ट तपासणी' : 'अंतिम तपासणी',
            cause: lead?.buildingName ?? inspection.leadId,
            consequence: result === 'cleared' ? 'क्लिअर' : 'रिवर्क यादी पाठवली',
          },
        }))
      },

      // PRD §15.2: allocation happens on QC clearance — here, a lead
      // reaching in_transit (set by QC's shaft clearance) is exactly what
      // makes it an order. §15.5: "paid on delivery-and-collection, not
      // 60/90-day credit" — the whole pitch to suppliers.
      acceptOrder: (leadId) =>
        set((s) => {
          if (s.supplyOrders.some((o) => o.leadId === leadId)) return s
          return {
            supplyOrders: [
              ...s.supplyOrders,
              {
                id: `ORD-${Date.now()}`,
                leadId,
                stage: 'packing',
                kits: KIT_TEMPLATE.map((k) => ({ id: k.id, packed: false })),
              },
            ],
          }
        }),

      packKit: (orderId, kitId) =>
        set((s) => ({
          supplyOrders: s.supplyOrders.map((o) =>
            o.id !== orderId ? o : { ...o, kits: o.kits.map((k) => (k.id === kitId ? { ...k, packed: true } : k)) },
          ),
        })),

      // §15.4: every kit scanned in, container sealed, IoT array armed.
      // §17/18's live tracking and triple-key unlock are out of MVP scope
      // (declared cut) — here, sealing directly delivers the material,
      // which is what makes the lead `installing` and therefore a job a
      // Technician can accept.
      sealAndDispatch: (orderId) => {
        const order = get().supplyOrders.find((o) => o.id === orderId)
        if (!order) return
        set((s) => ({
          supplyOrders: s.supplyOrders.map((o) => (o.id === orderId ? { ...o, stage: 'dispatched' } : o)),
        }))
        set((s) => ({
          leads: s.leads.map((l) => (l.id === order.leadId ? { ...l, status: 'installing' } : l)),
        }))
        const lead = get().leads.find((l) => l.id === order.leadId)
        const amount = lead?.quote?.baseCost ?? 500000
        set((s) => ({
          supplierWallet: [
            {
              id: nextWalletId(),
              amount,
              label: 'मटेरियल पेमेंट — डिलिव्हरीवर',
              cause: lead?.buildingName ?? order.leadId,
              consequence: 'त्याच दिवशी सेटल',
              state: 'cleared',
              leadId: order.leadId,
              createdAt: Date.now(),
            },
            ...s.supplierWallet,
          ],
          lastCoinEvent: {
            amount,
            label: 'मटेरियल पेमेंट — डिलिव्हरीवर',
            cause: lead?.buildingName ?? order.leadId,
            consequence: 'त्याच दिवशी सेटल',
          },
        }))
      },

      // The two duplicate-flagged riders' commissions were paused the
      // moment the lead was auto-blocked — this is the only action that
      // ever unfreezes them, one way or the other.
      resolveBlockedLead: (leadId, isDuplicate) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id !== leadId ? l : { ...l, status: isDuplicate ? 'lost' : 'in_sales' })),
        })),

      // A simple decisions list per the UX doc's MVP cut — not a full
      // permanent audit log. This is what lets a QC-rework or low-quality
      // alert leave the queue: those two kinds have no dedicated
      // "resolved" flag of their own to flip.
      recordAdminDecision: (alertId, label, reason) =>
        set((s) => ({
          adminDecisions: [
            { id: `DEC-${Date.now()}`, alertId, label, reason, createdAt: Date.now() },
            ...s.adminDecisions,
          ],
        })),
    }),
    { name: 'aiec-rider-store' },
  ),
)
