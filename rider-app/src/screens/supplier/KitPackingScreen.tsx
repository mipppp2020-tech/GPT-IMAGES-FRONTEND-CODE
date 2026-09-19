import { useNavigate, useParams } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { KIT_TEMPLATE } from '../../lib/kits'
import { formatINR } from '../../lib/selectors'

/** P2 Kit Packing. UX doc §2.5: "Barcode-first. The scan target is the
 * largest interactive element on the packing screen... a packing screen
 * that requires typing on a warehouse floor will be worked around within
 * a week." Scanning is simulated as a large tap target, no keyboard
 * anywhere on this screen. */
export function KitPackingScreen() {
  const { leadId } = useParams()
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const supplyOrders = useAiecStore((s) => s.supplyOrders)
  const supplierWallet = useAiecStore((s) => s.supplierWallet)
  const packKit = useAiecStore((s) => s.packKit)
  const sealAndDispatch = useAiecStore((s) => s.sealAndDispatch)

  const lead = leads.find((l) => l.id === leadId)
  const order = supplyOrders.find((o) => o.leadId === leadId)

  if (!lead || !order) {
    return (
      <div>
        <RoleTopBar title="ऑर्डर सापडली नाही" back backTo="/supplier" />
        <p className="text-body text-ink-2 text-center py-10">ही ऑर्डर सापडली नाही.</p>
      </div>
    )
  }

  if (order.stage === 'dispatched') {
    const settled = [...supplierWallet].filter((w) => w.leadId === leadId).sort((a, b) => b.createdAt - a.createdAt)[0]?.amount ?? 0
    return (
      <div>
        <RoleTopBar title="पाठवले गेले" back backTo="/supplier" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">🔒</span>
          <p className="text-title-l font-extrabold">कंटेनर सील झाला</p>
          <p className="text-body text-ink-2 mt-2">{lead.buildingName} — सर्व 8 किट्स लोड, सील व पाठवले गेले.</p>

          <div className="mt-4 w-full rounded-2xl bg-good-surface border border-good/30 px-4 py-3.5">
            <p className="text-caption text-good font-bold">पेमेंट सेटल झाले</p>
            <p className="text-title-l font-extrabold tnum mt-0.5 text-good">₹{formatINR(settled)}</p>
            <p className="text-[11px] text-ink-2 mt-0.5">त्याच दिवशी — 60/90 दिवसांच्या क्रेडिटची वाट नाही.</p>
          </div>

          <button
            onClick={() => navigate('/supplier')}
            className="mt-8 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            बोर्डकडे परत जा
          </button>
        </div>
      </div>
    )
  }

  const packedCount = order.kits.filter((k) => k.packed).length
  const allPacked = packedCount === order.kits.length

  return (
    <div>
      <RoleTopBar title="किट पॅकिंग" back backTo="/supplier" />
      <div className="px-4 pt-3">
        <p className="text-title font-extrabold">{lead.buildingName}</p>
        <p className="text-caption text-ink-2">
          {packedCount}/{order.kits.length} किट्स पॅक झाले
        </p>
        <div className="h-1.5 rounded-full bg-surface-2 mt-2 overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${(packedCount / order.kits.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2.5">
        {KIT_TEMPLATE.map((t, i) => {
          const state = order.kits[i]
          return (
            <button
              key={t.id}
              disabled={state.packed}
              onClick={() => packKit(order.id, t.id)}
              className={`w-full text-left tap-target rounded-2xl border p-3.5 flex items-center gap-3 ${state.packed ? 'border-good/40 bg-good-surface' : 'border-black/10'}`}
            >
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg font-extrabold ${state.packed ? 'bg-good text-white' : 'bg-surface-2 text-ink-2'}`}>
                {state.packed ? '✓' : '▤'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-bold">{t.id} — {t.name}</p>
                <p className="text-caption text-ink-2 truncate">{t.contents}</p>
                <p className="text-[11px] text-ink-2">{t.unlocksAt} ला अनलॉक होते</p>
              </div>
              {!state.packed && <span className="text-[13px] font-bold text-accent shrink-0">स्कॅन करा</span>}
            </button>
          )
        })}
      </div>

      {allPacked && (
        <div className="px-4 mt-5">
          <button
            onClick={() => sealAndDispatch(order.id)}
            className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            🔒 कंटेनर सील करा आणि पाठवा
          </button>
        </div>
      )}
    </div>
  )
}
