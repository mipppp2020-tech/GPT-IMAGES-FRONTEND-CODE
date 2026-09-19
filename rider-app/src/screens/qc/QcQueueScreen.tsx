import { useNavigate } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { selectQcQueue } from '../../lib/qcJourney'
import { QC_FEES } from '../../lib/qcChecklists'
import { formatINR } from '../../lib/selectors'

/** Q1 Inspection Map, simplified to a task-card queue for this MVP —
 * "sorted by real driving distance" per the UX doc is a nicety this
 * scope skips; the task-card shape (site/type/duration/fee) is kept. */
export function QcQueueScreen() {
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const techJobs = useAiecStore((s) => s.techJobs)
  const inspections = useAiecStore((s) => s.inspections)
  const qcWallet = useAiecStore((s) => s.qcWallet)
  const startInspection = useAiecStore((s) => s.startInspection)

  const queue = selectQcQueue(leads, techJobs)
  const myEarnings = qcWallet.reduce((sum, w) => sum + w.amount, 0)

  return (
    <div>
      <RoleTopBar title="तपासणी रांग" />

      <div className="mx-4 mt-3 rounded-2xl bg-surface-2 px-4 py-3.5">
        <p className="text-caption text-ink-2">माझी एकूण कमाई — तपासणी फी</p>
        <p className="text-title-l font-extrabold tnum mt-0.5" style={{ color: 'var(--color-accent)' }}>
          ₹{formatINR(myEarnings)}
        </p>
        <p className="text-[11px] text-ink-2 mt-0.5">{qcWallet.length} तपासण्या पूर्ण</p>
      </div>

      <div className="px-4 pt-3">
        <p className="text-caption text-ink-2">
          शाफ्ट QC — ग्राहकाने शाफ्ट तयार असल्याचे सांगितले आहे. अंतिम QC — तंत्रज्ञाने सर्व टप्पे पूर्ण केले आहेत, हे अनपेक्षित ऑडिट आहे.
        </p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {queue.length === 0 ? (
          <p className="text-body text-ink-2 text-center py-10">सध्या कोणतीही तपासणी प्रतीक्षेत नाही.</p>
        ) : (
          queue.map(({ lead, type }) => {
            const existing = inspections.find((i) => i.leadId === lead.id && i.type === type && i.result === null)
            return (
              <div key={`${lead.id}-${type}`} data-testid={`qc-${lead.id}-${type}`} className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${type === 'shaft' ? 'bg-surface-2 text-ink-2' : 'bg-warn-surface text-warn'}`}
                  >
                    {type === 'shaft' ? 'शाफ्ट QC' : 'अंतिम QC · अनपेक्षित'}
                  </span>
                  <span className="text-body font-extrabold tnum" style={{ color: 'var(--color-accent)' }}>
                    ₹{formatINR(QC_FEES[type])}
                  </span>
                </div>
                <p className="text-title font-extrabold mt-2">{lead.buildingName}</p>
                <p className="text-caption text-ink-2">{lead.address}</p>
                <p className="text-caption text-ink-2 mt-0.5">
                  {type === 'shaft' ? '6-item तपासणी · ~45 मिनिटे' : '6-item ऑडिट · ~30 मिनिटे'}
                </p>
                <button
                  onClick={() => {
                    if (!existing) startInspection(lead.id, type)
                    navigate(`/qc/${lead.id}/${type}`)
                  }}
                  className="mt-3 w-full tap-target rounded-xl bg-accent text-accent-ink font-extrabold text-body-l"
                >
                  स्वीकारा
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
