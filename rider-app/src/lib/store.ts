import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, WalletEntry, RiderProfile, Quote } from './types'
import { DEMO_RIDER, SEED_LEADS, seedWalletEntries } from './mock'
import { nextWalletId } from './ids'
import { defaultShaftReadiness, emptyPayments } from './customerJourney'

interface RiderStore {
  rider: RiderProfile
  leads: Lead[]
  wallet: WalletEntry[]
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
}

export const useAiecStore = create<RiderStore>()(
  persist(
    (set, get) => ({
      rider: DEMO_RIDER,
      leads: SEED_LEADS,
      wallet: seedWalletEntries(SEED_LEADS),
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
    }),
    { name: 'aiec-rider-store' },
  ),
)
