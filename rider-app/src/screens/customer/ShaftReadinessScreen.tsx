import { useParams } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'

/** PRD §11.1: "10-item illustrated checklist, each with camera button...
 * AI pre-check on every upload (shows a shaft, tape legible, geotag
 * on-site)." Compressed to 5 items for this MVP (see customerJourney.ts). */
export function ShaftReadinessScreen() {
  const { id } = useParams()
  const leads = useAiecStore((s) => s.leads)
  const toggleShaftItem = useAiecStore((s) => s.toggleShaftItem)
  const lead = leads.find((l) => l.id === id)

  if (!lead || !lead.shaftReadiness) {
    return (
      <div>
        <RoleTopBar title="शाफ्ट तयारी" back backTo={`/customer/${id}`} />
        <p className="text-body text-ink-2 text-center py-10">ही यादी सापडली नाही.</p>
      </div>
    )
  }

  const doneCount = lead.shaftReadiness.filter((i) => i.done).length
  const total = lead.shaftReadiness.length

  return (
    <div>
      <RoleTopBar title="शाफ्ट तयारी" back backTo={`/customer/${id}`} />
      <div className="px-4 pt-3">
        <p className="text-caption text-ink-2">
          {doneCount}/{total} पूर्ण — 14 दिवसांत पूर्ण न झाल्यास मटेरियल दुसऱ्या ग्राहकाला दिले जाईल, दंड नाही पण रांगेतील स्थान जाईल.
        </p>
        <div className="h-1.5 rounded-full bg-surface-2 mt-2 overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${(doneCount / total) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 mt-5 space-y-3">
        {lead.shaftReadiness.map((item, i) => (
          <button
            key={item.label}
            onClick={() => toggleShaftItem(lead.id, i)}
            className={`w-full text-left rounded-2xl border p-3.5 flex items-center gap-3 ${item.done ? 'border-good/40 bg-good-surface' : 'border-black/10'}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[15px] ${item.done ? 'bg-good text-white' : 'bg-surface-2 text-ink-2'}`}
            >
              {item.done ? '✓' : '📷'}
            </span>
            <span className="text-body flex-1">{item.label}</span>
          </button>
        ))}
      </div>

      {doneCount === total && (
        <div className="px-4 mt-5">
          <div className="rounded-2xl bg-good-surface border border-good/30 p-3.5 text-center">
            <p className="text-body font-bold text-good">शाफ्ट तयारी पूर्ण झाली!</p>
            <p className="text-caption text-ink-2 mt-1">QC तपासणीसाठी टीमला सूचित केले जाईल.</p>
          </div>
        </div>
      )}
    </div>
  )
}
