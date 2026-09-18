import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { MarginBar } from '../../components/MarginBar'
import { useAiecStore } from '../../lib/store'
import { computeQuote, marginPct } from '../../lib/pricing'
import { formatINR } from '../../lib/selectors'

/** UX doc §2.2: "Escalation lands fully assembled — full bot transcript,
 * every quote version, the stated objection, the exact margin position,
 * and the AI's recommended counter... The operator reads for 30 seconds,
 * calls, moves one slider, sends." One screen, no second tab to hunt for
 * the objection on. */
export function SalesDealScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const closeDeal = useAiecStore((s) => s.closeDeal)
  const lead = leads.find((l) => l.id === id)

  const baseQuote = useMemo(() => (lead ? computeQuote(lead) : null), [lead])
  const [offer, setOffer] = useState(baseQuote?.currentOffer ?? 0)
  const [closed, setClosed] = useState(false)

  if (!lead || !baseQuote) {
    return (
      <div>
        <RoleTopBar title="सौदा सापडला नाही" back backTo="/sales" />
        <p className="text-body text-ink-2 text-center py-10">हा सौदा सापडला नाही.</p>
      </div>
    )
  }

  const quote = { ...baseQuote, currentOffer: offer }
  const margin = marginPct(offer, quote.baseCost)

  if (closed) {
    return (
      <div>
        <RoleTopBar title="सौदा बंद झाला" back backTo="/sales" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-good-surface flex items-center justify-center text-3xl mb-4">✅</div>
          <p className="text-title-l font-extrabold">सौदा बंद झाला!</p>
          <p className="text-body text-ink-2 mt-2">
            ₹{formatINR(offer)} ला ({margin.toFixed(0)}% मार्जिन) — {lead.buildingName}
          </p>
          <p className="text-caption text-ink-2 mt-3 max-w-xs">
            करार तयार होत आहे. ग्राहकाला टोकन पेमेंट (₹10,000) साठी लिंक पाठवली जाईल. रायडरला ₹1,500 कमिशन जमा झाले.
          </p>
          <button
            onClick={() => navigate('/sales')}
            className="mt-8 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            पाईपलाईनकडे परत जा
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <RoleTopBar title={lead.buildingName} back backTo="/sales" />
      <div className="px-4 pt-4">
        <p className="text-caption text-ink-2">{lead.address}</p>
        <p className="text-caption text-ink-2">
          {lead.floors} मजले · {lead.passengers} प्रवासी लिफ्ट · लीड #{lead.id}
        </p>
      </div>

      <div className="px-4 mt-4 rounded-2xl bg-surface-2 p-3.5">
        <p className="text-caption font-bold text-ink-2 mb-1">बॉट ट्रान्सक्रिप्ट (सारांश)</p>
        <p className="text-body">
          {lead.aiTip ?? 'ग्राहकाने WhatsApp वर स्वारस्य दाखवले. व्हॉईस-बॉटने 6 डेटा पॉईंट्स गोळा केले. किंमतीवर आक्षेप — बॉटच्या मजल्यापेक्षा खाली मागणी, त्यामुळे मॅन्युअल डेस्ककडे पाठवले.'}
        </p>
        <p className="text-caption text-ink-2 mt-2">आक्षेप: किंमत जास्त वाटते, दुसऱ्या वेंडरकडून कमी कोट मिळाला असल्याचा दावा.</p>
      </div>

      <div className="px-4 mt-4">
        <MarginBar quote={quote} onChange={setOffer} />
      </div>

      <div className="px-4 mt-4 rounded-xl border border-black/10 p-3">
        <div className="flex justify-between text-caption">
          <span className="text-ink-2">बेस कॉस्ट</span>
          <span className="font-semibold tnum">₹{formatINR(quote.baseCost)}</span>
        </div>
        <div className="flex justify-between text-caption mt-1">
          <span className="text-ink-2">लिस्ट किंमत (+60%)</span>
          <span className="font-semibold tnum">₹{formatINR(quote.listPrice)}</span>
        </div>
        <div className="flex justify-between text-caption mt-1">
          <span className="text-ink-2">बॉट फ्लोर (~23%)</span>
          <span className="font-semibold tnum">₹{formatINR(quote.botFloor)}</span>
        </div>
      </div>

      <div className="px-4 mt-5">
        <button
          onClick={() => {
            closeDeal(lead.id, quote)
            setClosed(true)
          }}
          className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
        >
          ₹{formatINR(offer)} ला सौदा बंद करा
        </button>
        <p className="text-[11px] text-ink-2 text-center mt-2">
          20% पेक्षा कमी मार्जिनचे सौदे फक्त ओनर, लेखी कारणासह मंजूर करू शकतात.
        </p>
      </div>
    </div>
  )
}
