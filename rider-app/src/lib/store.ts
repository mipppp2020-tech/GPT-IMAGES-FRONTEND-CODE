import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, WalletEntry, RiderProfile } from './types'
import { DEMO_RIDER, SEED_LEADS, seedWalletEntries } from './mock'

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
}

export const useRiderStore = create<RiderStore>()(
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
    }),
    { name: 'aiec-rider-store' },
  ),
)
