import { useParams, useNavigate } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { useGeolocation } from '../../lib/useGeolocation'
import { fileToCompressedDataUrl } from '../../lib/image'
import type { QcVerdict, QcInspectionType } from '../../lib/types'

const VERDICT_META: Record<QcVerdict, { label: string; glyph: string }> = {
  pass: { label: 'PASS', glyph: '✓' },
  conditional: { label: 'CONDITIONAL', glyph: '△' },
  fail: { label: 'FAIL', glyph: '✕' },
}

export function QcChecklistScreen() {
  const { leadId, type } = useParams<{ leadId: string; type: QcInspectionType }>()
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const inspections = useAiecStore((s) => s.inspections)
  const checkInInspection = useAiecStore((s) => s.checkInInspection)
  const setQcVerdict = useAiecStore((s) => s.setQcVerdict)
  const setQcNote = useAiecStore((s) => s.setQcNote)
  const captureQcPhoto = useAiecStore((s) => s.captureQcPhoto)
  const signOffInspection = useAiecStore((s) => s.signOffInspection)
  const geo = useGeolocation()

  const lead = leads.find((l) => l.id === leadId)
  const inspection = [...inspections]
    .reverse()
    .find((i) => i.leadId === leadId && i.type === type)

  if (!lead || !inspection) {
    return (
      <div>
        <RoleTopBar title="तपासणी सापडली नाही" back backTo="/qc" />
        <p className="text-body text-ink-2 text-center py-10">ही तपासणी सापडली नाही.</p>
      </div>
    )
  }

  if (inspection.stage === 'offered') {
    return (
      <div>
        <RoleTopBar title="साईटवर चेक-इन करा" back backTo="/qc" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">📍</span>
          <p className="text-title-l font-extrabold">{lead.buildingName}</p>
          <p className="text-body text-ink-2 mt-1">{lead.address}</p>
          {geo.status !== 'ready' ? (
            <>
              <p className="text-body-l mt-6">GPS मुळेच हे चेक-इन तुमचे होते.</p>
              <button onClick={geo.forceDemo} className="mt-6 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l">
                डेमो लोकेशन वापरा
              </button>
            </>
          ) : (
            <button
              onClick={() => checkInInspection(inspection.id)}
              className="mt-6 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
            >
              📍 साईटवर पोहोचलो — चेक-इन करा
            </button>
          )}
        </div>
      </div>
    )
  }

  if (inspection.stage === 'signed') {
    const cleared = inspection.result === 'cleared'
    return (
      <div>
        <RoleTopBar title="अहवाल सबमिट झाला" back backTo="/qc" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">{cleared ? '🟢' : '🔴'}</span>
          <p className="text-title-l font-extrabold">{cleared ? 'क्लिअर' : 'रिवर्क आवश्यक'}</p>
          <p className="text-body text-ink-2 mt-2 max-w-xs">
            {cleared
              ? inspection.type === 'shaft'
                ? 'ड्रॉइंग्ज रिलीज झाले, मटेरियल वाटप सुरू झाले. साईट पुढील टप्प्यात गेली.'
                : 'हँडओव्हरसाठी पात्र — NOC आता ग्राहकाच्या स्क्रीनवर उपलब्ध होईल.'
              : 'अ‍ॅनोटेटेड रिवर्क यादी संबंधित टीमला पाठवली गेली आहे.'}
          </p>
          <button
            onClick={() => navigate('/qc')}
            className="mt-8 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            रांगेकडे परत जा
          </button>
        </div>
      </div>
    )
  }

  const allAnswered = inspection.items.every(
    (it) => it.verdict !== null && it.photo !== null && (it.verdict === 'pass' || it.note.trim().length > 0),
  )

  return (
    <div>
      <RoleTopBar title={inspection.type === 'shaft' ? 'शाफ्ट तपासणी' : 'अंतिम तपासणी'} back backTo="/qc" />
      <div className="px-4 pt-3 pb-2">
        <p className="text-title font-extrabold">{lead.buildingName}</p>
        <p className="text-caption text-ink-2">{lead.address}</p>
      </div>

      <div className="px-4 space-y-4">
        {inspection.items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-black/10 p-3.5">
            <p className="text-[11px] font-bold text-ink-2">{item.group}</p>
            <p className="text-body font-semibold mt-0.5">{item.label}</p>

            {/* Three visually equal segments, no default, no colour bias
             * until chosen — the UX doc's deliberate exception to "one
             * dominant action": approval bias is exactly what this
             * control exists to prevent. */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {(['pass', 'conditional', 'fail'] as const).map((v) => {
                const selected = item.verdict === v
                return (
                  <button
                    key={v}
                    onClick={() => setQcVerdict(inspection.id, item.id, v)}
                    className="rounded-xl py-2.5 flex flex-col items-center gap-0.5 border-2"
                    style={{
                      borderColor: selected ? 'var(--color-ink)' : 'var(--color-surface-3, var(--color-surface-2))',
                      background: selected ? 'var(--color-ink)' : 'transparent',
                      color: selected ? 'var(--color-surface)' : 'var(--color-ink)',
                    }}
                  >
                    <span className="text-[16px]">{VERDICT_META[v].glyph}</span>
                    <span className="text-[10px] font-bold">{VERDICT_META[v].label}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex gap-2 items-start">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                {item.photo ? (
                  <img src={item.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <label className="w-full h-full flex items-center justify-center cursor-pointer text-xl">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0]
                        if (f) captureQcPhoto(inspection.id, item.id, await fileToCompressedDataUrl(f))
                      }}
                    />
                    📷
                  </label>
                )}
              </div>
              {item.verdict && item.verdict !== 'pass' && (
                <textarea
                  value={item.note}
                  onChange={(e) => setQcNote(inspection.id, item.id, e.target.value)}
                  placeholder="टीप लिहा (अनिवार्य) — काय व का"
                  className="flex-1 text-caption rounded-lg border border-black/15 bg-transparent p-2 min-h-16"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-5">
        <button
          disabled={!allAnswered}
          onClick={() => {
            signOffInspection(inspection.id)
          }}
          className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l disabled:opacity-40"
        >
          स्वाक्षरी करा आणि सबमिट करा
        </button>
        <p className="text-[11px] text-ink-2 text-center mt-2">
          प्रत्येक आयटमला पुरावा फोटो व verdict हवे — PASS नसल्यास टीप अनिवार्य.
        </p>
      </div>
    </div>
  )
}
