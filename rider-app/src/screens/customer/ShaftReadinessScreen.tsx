import { useParams } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { fileToCompressedDataUrl } from '../../lib/image'

/** PRD §11.1: "10-item illustrated checklist, each with camera button...
 * AI pre-check on every upload (shows a shaft, tape legible, geotag
 * on-site)." Compressed to 5 items for this MVP (see customerJourney.ts) —
 * but each one is a real camera capture, matching the pattern used
 * everywhere else evidence is collected in this app. */
export function ShaftReadinessScreen() {
  const { id } = useParams()
  const leads = useAiecStore((s) => s.leads)
  const captureShaftPhoto = useAiecStore((s) => s.captureShaftPhoto)
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
          <div
            key={item.label}
            className={`w-full rounded-2xl border p-3.5 flex items-center gap-3 ${item.done ? 'border-good/40 bg-good-surface' : 'border-black/10'}`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-2 flex items-center justify-center">
              {item.photo ? (
                <img src={item.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[15px] text-ink-2">📷</span>
              )}
            </div>
            <span className="text-body flex-1">{item.label}</span>
            {item.done ? (
              <span className="w-7 h-7 rounded-full bg-good text-white flex items-center justify-center shrink-0 text-[13px]">✓</span>
            ) : (
              <label className="tap-target rounded-xl bg-accent text-accent-ink font-bold text-[13px] px-3 shrink-0 cursor-pointer flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (f) captureShaftPhoto(lead.id, i, await fileToCompressedDataUrl(f))
                  }}
                />
                फोटो घ्या
              </label>
            )}
          </div>
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
