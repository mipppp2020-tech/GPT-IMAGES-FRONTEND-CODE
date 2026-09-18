import { useParams, useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { StatusStack } from '../components/StatusStack'
import { EntityTimeline } from '../components/EntityTimeline'
import { LifecycleMark } from '../components/LifecycleMark'
import { useAiecStore } from '../lib/store'
import { LIFECYCLE } from '../lib/lifecycle'
import { formatINR } from '../lib/selectors'

export function LeadDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const lead = leads.find((l) => l.id === id)

  if (!lead) {
    return (
      <div>
        <TopBar back title="लीड सापडली नाही" />
        <div className="px-4 pt-10 text-center text-ink-2">ही लीड सापडली नाही.</div>
      </div>
    )
  }

  const meta = LIFECYCLE[lead.status]
  const photoList = [lead.photos.building, lead.photos.shaft, lead.photos.contact].filter(Boolean) as string[]

  const status = statusCopy(lead.status, lead.aiTip)

  return (
    <div>
      <TopBar back title={lead.buildingName} />

      {photoList.length > 0 ? (
        <div className="flex gap-1 overflow-x-auto px-4 pt-3">
          {photoList.map((p, i) => (
            <img key={i} src={p} alt="" className="w-28 h-28 rounded-xl object-cover shrink-0" />
          ))}
        </div>
      ) : (
        <div className="mx-4 mt-3 h-32 rounded-xl bg-surface-2" />
      )}

      <div className="px-4 mt-4">
        <div className="flex items-center gap-2">
          <LifecycleMark meta={meta} size={16} />
          <span className="text-caption font-bold" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
        <p className="text-caption text-ink-2 mt-1">{lead.address}</p>
        <p className="text-caption text-ink-2">
          {lead.floors} मजले · {lead.passengers} प्रवासी लिफ्ट गरज · लीड #{lead.id}
        </p>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <p className="text-[11px] text-ink-2">या लीडची कमाई</p>
          <p className="text-title font-extrabold tnum">₹{formatINR(lead.payout)}</p>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <p className="text-[11px] text-ink-2">कॅप्चर तारीख</p>
          <p className="text-body font-bold">{new Date(lead.createdAt).toLocaleDateString('mr-IN', { day: '2-digit', month: 'short' })}</p>
        </div>
      </div>

      <div className="px-4 mt-4">
        <StatusStack {...status} />
      </div>

      {lead.status === 'in_sales' && (
        <div className="px-4 mt-3">
          <button className="w-full tap-target rounded-2xl border-2 border-accent text-accent font-extrabold text-body-l">
            फॉलो-अप करा
          </button>
        </div>
      )}

      <div className="px-4 mt-6">
        <h2 className="text-title font-extrabold mb-3">स्थिती आणि पुढील टप्पे</h2>
        <EntityTimeline lead={lead} />
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => navigate('/leads')}
          className="w-full tap-target rounded-2xl bg-surface-2 font-bold text-body-l"
        >
          सर्व लीड्सकडे परत जा
        </button>
      </div>
    </div>
  )
}

function statusCopy(status: string, aiTip?: string) {
  switch (status) {
    case 'new':
      return {
        state: 'नवीन लीड',
        reason: 'AI तुमचा फोटो व लोकेशन तपासत आहे',
        custody: 'सध्या AIEC टीमकडे',
        clock: 'साधारण 24 तासांत निकाल',
        consequence: 'पडताळणी पूर्ण होताच कमिशन क्लिअर होईल',
        tone: 'neutral' as const,
      }
    case 'in_sales':
      return {
        state: 'विक्री प्रक्रियेत',
        reason: aiTip ?? 'सेल्स टीम/AI ग्राहकाशी बोलत आहे',
        custody: 'सध्या सेल्स टीमकडे',
        clock: undefined,
        consequence: 'सौदा झाल्यास ₹1,500 बोनस मिळेल',
        tone: 'neutral' as const,
      }
    case 'won_awaiting_shaft':
      return {
        state: 'जिंकले — शाफ्ट प्रतीक्षेत',
        reason: 'ग्राहकाने टोकन भरले आहे',
        custody: 'सध्या ग्राहकाकडे — शाफ्ट तयार करत आहेत',
        clock: undefined,
        consequence: '₹1,500 बोनस तुमच्या खात्यात जमा झाला',
        tone: 'good' as const,
      }
    case 'in_transit':
      return {
        state: 'मटेरियल मार्गावर',
        reason: 'कंटेनर साईटकडे निघाला आहे',
        custody: 'सध्या सप्लायर/लॉजिस्टिककडे',
        clock: undefined,
        consequence: undefined,
        tone: 'neutral' as const,
      }
    case 'installing':
      return {
        state: 'इंस्टॉलेशन सुरू',
        reason: 'तंत्रज्ञ साईटवर काम करत आहेत',
        custody: 'सध्या तंत्रज्ञ टीमकडे',
        clock: undefined,
        consequence: 'पूर्ण झाल्यावर ₹1,000 बोनस मिळेल',
        tone: 'neutral' as const,
      }
    case 'complete':
      return {
        state: 'पूर्ण झाले',
        reason: 'हँडओव्हर व NOC पूर्ण झाले',
        custody: undefined,
        clock: undefined,
        consequence: '₹1,000 इंस्टॉलेशन बोनस जमा झाला',
        tone: 'good' as const,
      }
    case 'blocked':
      return {
        state: 'अडचणीत',
        reason: 'ग्राहकाशी पुन्हा संपर्क साधण्याची गरज आहे',
        custody: 'तुमच्याकडून कारवाईची वाट पाहत आहे',
        clock: '2 दिवसांत फॉलो-अप करा',
        consequence: 'फॉलो-अप न झाल्यास लीड थंड होऊ शकते',
        tone: 'warn' as const,
      }
    default:
      return {
        state: 'रद्द / बंद',
        reason: 'हा सौदा पुढे गेला नाही',
        custody: undefined,
        clock: undefined,
        consequence: 'मिळालेली अंशिक कमाई तुमच्याकडेच राहते',
        tone: 'bad' as const,
      }
  }
}
