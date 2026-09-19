import { useNavigate } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { selectSupplyQueue } from '../../lib/supplierJourney'
import { formatINR } from '../../lib/selectors'

/** P1 Order Board — home, not a map. UX doc §2.5: "the payment date on
 * every order card, always... that is the differentiator this company is
 * selling to suppliers, and it should never be more than one glance away." */
export function SupplierOrderBoardScreen() {
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const supplyOrders = useAiecStore((s) => s.supplyOrders)
  const acceptOrder = useAiecStore((s) => s.acceptOrder)

  const queue = selectSupplyQueue(leads)

  return (
    <div>
      <RoleTopBar title="ऑर्डर बोर्ड" />
      <div className="px-4 pt-3">
        <p className="text-caption text-ink-2">QC क्लिअरन्स झाल्यावर ऑर्डर आपोआप वाटप होते — किंमत, वेळ, रेटिंग, अंतर, क्षमतेनुसार.</p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {queue.length === 0 ? (
          <p className="text-body text-ink-2 text-center py-10">सध्या कोणतीही ऑर्डर नाही.</p>
        ) : (
          queue.map((lead) => {
            const order = supplyOrders.find((o) => o.leadId === lead.id)
            const amount = lead.quote?.baseCost ?? 500000
            return (
              <div key={lead.id} data-testid={`order-${lead.id}`} className="rounded-2xl border border-black/10 p-4">
                <div className="rounded-xl bg-good-surface px-3 py-2 mb-3">
                  <p className="text-[11px] text-good font-bold">पेमेंट तारीख</p>
                  <p className="text-body font-extrabold text-good">डिलिव्हरी + त्याच दिवशी — ₹{formatINR(amount)}</p>
                </div>
                <p className="text-title font-extrabold">{lead.buildingName}</p>
                <p className="text-caption text-ink-2">{lead.address}</p>
                <p className="text-caption text-ink-2 mt-0.5">8 किट्स · 4 तास स्वीकारण्यासाठी</p>
                <button
                  onClick={() => {
                    if (!order) acceptOrder(lead.id)
                    navigate(`/supplier/${lead.id}`)
                  }}
                  className="mt-3 w-full tap-target rounded-xl bg-accent text-accent-ink font-extrabold text-body-l"
                >
                  {order ? 'पॅकिंग सुरू ठेवा' : 'स्वीकारा'}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
