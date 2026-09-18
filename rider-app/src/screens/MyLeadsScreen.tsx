import { useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { EntityCard } from '../components/EntityCard'
import { useRiderStore } from '../lib/store'
import type { LeadStatus } from '../lib/types'

const FILTERS: { key: 'all' | 'active' | 'won' | 'closed'; label: string; match: (s: LeadStatus) => boolean }[] = [
  { key: 'all', label: 'सर्व', match: () => true },
  { key: 'active', label: 'सक्रिय', match: (s) => s === 'new' || s === 'in_sales' },
  { key: 'won', label: 'जिंकले', match: (s) => s === 'won_awaiting_shaft' || s === 'in_transit' || s === 'installing' || s === 'complete' },
  { key: 'closed', label: 'बंद', match: (s) => s === 'lost' || s === 'blocked' },
]

export function MyLeadsScreen() {
  const leads = useRiderStore((s) => s.leads)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const [q, setQ] = useState('')

  const active = FILTERS.find((f) => f.key === filter)!
  const filtered = useMemo(
    () =>
      leads
        .filter((l) => active.match(l.status))
        .filter((l) => (q ? l.buildingName.includes(q) || l.address.includes(q) : true))
        .sort((a, b) => b.createdAt - a.createdAt),
    [leads, active, q],
  )

  return (
    <div>
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="text-title-l font-extrabold">माझे लीड्स</h1>
        <p className="text-caption text-ink-2 mt-0.5">तुम्ही शोधलेले प्रत्येक लीड, मोठ्या संधींकडे एक पाऊल.</p>
      </div>

      <div className="px-4 mt-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="लीड शोधा (इमारत, परिसर)"
          className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-body bg-surface"
        />
      </div>

      <div className="px-4 mt-3 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const count = leads.filter((l) => f.match(l.status)).length
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[14px] font-semibold border ${
                filter === f.key ? 'bg-accent text-accent-ink border-accent' : 'bg-surface-2 text-ink-2 border-transparent'
              }`}
            >
              {f.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="px-4 mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-body text-ink-2 text-center py-10">या फिल्टरमध्ये अजून लीड नाही</p>
        ) : (
          filtered.map((l) => <EntityCard key={l.id} lead={l} />)
        )}
      </div>
    </div>
  )
}
