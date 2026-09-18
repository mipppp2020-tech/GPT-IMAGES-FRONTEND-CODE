import { useParams, useNavigate, Link } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { ProgressRing } from '../../components/ProgressRing'
import { useAiecStore } from '../../lib/store'
import { journeyStage, selectPrimaryCustomerLead } from '../../lib/customerJourney'
import { formatINR } from '../../lib/selectors'

export function CustomerDashboardScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const leads = useAiecStore((s) => s.leads)
  const payToken = useAiecStore((s) => s.payToken)
  const payMaterial90 = useAiecStore((s) => s.payMaterial90)

  const lead = id ? leads.find((l) => l.id === id) : selectPrimaryCustomerLead(leads)

  if (!lead) {
    return (
      <div>
        <RoleTopBar title="माझी लिफ्ट" />
        <div className="px-4 pt-10 text-center">
          <p className="text-body text-ink-2">
            अजून कोणताही प्रकल्प सुरू नाही. सेल्स डेस्कवरून एखादा सौदा बंद करा — तो लगेच इथे दिसेल.
          </p>
        </div>
      </div>
    )
  }

  const stage = journeyStage(lead)
  const quote = lead.quote
  const token = 10000
  const material90 = quote ? Math.round(quote.currentOffer * 0.9) : 0
  const finalAmt = quote ? Math.round(quote.currentOffer * 0.1 - token) : 0

  return (
    <div>
      <RoleTopBar title={lead.buildingName} />
      <div className="px-4 pt-3">
        <p className="text-caption text-ink-2">{lead.address}</p>
        <p className="text-caption text-ink-2">
          {lead.floors} मजले · {lead.passengers} प्रवासी लिफ्ट · LIFT #{lead.id}
        </p>
      </div>

      <div className="flex flex-col items-center pt-6 pb-2">
        <ProgressRing percent={stage.percent} label={stage.ringLabel} />
      </div>

      <div className="px-4 mt-4">
        <CustodyMessage stageKey={stage.key} paidMaterial={!!lead.payments?.material90} />
      </div>

      <div className="px-4 mt-6">
        {stage.key === 'before_token' && (
          <>
            <button
              onClick={() => payToken(lead.id)}
              className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
            >
              ₹{formatINR(token)} टोकन भरा
            </button>
            <p className="text-[11px] text-ink-2 text-center mt-2">
              करारावर स्वाक्षरी झाल्यावर हे पेमेंट घेतले जाते — तुमच्या एकूण किंमतीतून वजा होईल.
            </p>
          </>
        )}

        {stage.key === 'shaft_readiness' && (
          <button
            onClick={() => navigate(`/customer/${lead.id}/shaft`)}
            className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            शाफ्ट तयारीचे फोटो अपलोड करा
          </button>
        )}

        {stage.key === 'material_transit' && !lead.payments?.material90 && (
          <>
            <button
              onClick={() => payMaterial90(lead.id)}
              className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
            >
              ₹{formatINR(material90)} भरा (मटेरियल पोहोचले)
            </button>
            <p className="text-[11px] text-ink-2 text-center mt-2">
              48 तासांत पेमेंट न झाल्यास कंटेनर सप्लायरकडे परत जाईल — टोकन कराराप्रमाणे परत/जमा होईल.
            </p>
          </>
        )}

        {stage.key === 'complete' && (
          <NocCard buildingName={lead.buildingName} finalAmt={finalAmt} />
        )}
      </div>

      {quote && (
        <div className="px-4 mt-6">
          <p className="text-caption font-bold text-ink-2 mb-2">पेमेंट टप्पे</p>
          <div className="rounded-xl border border-black/10 divide-y divide-black/5">
            <PaymentRow label="टोकन (करारावेळी)" amount={token} done={!!lead.payments?.token} />
            <PaymentRow label="मटेरियल पेमेंट (90%)" amount={material90} done={!!lead.payments?.material90} />
            <PaymentRow label="अंतिम पेमेंट (उर्वरित 10%)" amount={finalAmt} done={!!lead.payments?.final} />
          </div>
        </div>
      )}

      <div className="px-4 mt-6">
        <Link to="/demo" className="text-caption text-ink-2 underline">
          इतर भूमिका पाहा
        </Link>
      </div>
    </div>
  )
}

function CustodyMessage({ stageKey, paidMaterial }: { stageKey: string; paidMaterial: boolean }) {
  const text: Record<string, string> = {
    before_token: 'तुमचा करार तयार आहे. टोकन भरा — इथूनच तुमच्या प्रकल्पाची खरी सुरुवात होते.',
    shaft_readiness: 'तुमच्याकडे — शाफ्ट तयारीचे फोटो अपलोड करा. जितक्या लवकर पूर्ण कराल, तितक्या लवकर तपासणी होईल.',
    qc_wait: 'सध्या AIEC टीमकडे — QC इन्स्पेक्टर शाफ्ट तपासणीसाठी येत आहेत. आज तुम्हाला काही करायची गरज नाही.',
    material_transit: paidMaterial
      ? 'सध्या तंत्रज्ञ टीमकडे — कंटेनर अनलॉक होऊन साहित्य साईटवर उतरत आहे.'
      : 'तुमच्याकडे — मटेरियल तुमच्या पत्त्यावर पोहोचले आहे. 90% पेमेंट झाल्याशिवाय कंटेनर उघडणार नाही.',
    installing: 'सध्या तंत्रज्ञ टीमकडे — इंस्टॉलेशनचे काम सुरू आहे.',
    complete: 'पूर्ण झाले! तुमची लिफ्ट तयार आहे.',
  }
  return <p className="text-body-l text-center font-medium">{text[stageKey]}</p>
}

function PaymentRow({ label, amount, done }: { label: string; amount: number; done: boolean }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] ${done ? 'bg-good text-white' : 'bg-surface-2 text-ink-2'}`}>
          {done ? '✓' : ''}
        </span>
        <span className="text-body truncate">{label}</span>
      </div>
      <span className="text-body font-bold tnum shrink-0 ml-2">₹{formatINR(amount)}</span>
    </div>
  )
}

function NocCard({ buildingName, finalAmt }: { buildingName: string; finalAmt: number }) {
  return (
    <div className="rounded-2xl border-2 p-5 text-center animate-coin" style={{ borderColor: 'var(--color-gold)' }}>
      <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl" style={{ background: 'var(--color-gold)', opacity: 0.15 }}>
        🎖️
      </div>
      <p className="text-title-l font-extrabold">NOC व वॉरंटी जारी</p>
      <p className="text-caption text-ink-2 mt-1">{buildingName} — अंतिम पेमेंट ₹{formatINR(finalAmt)} स्वीकारले गेले</p>
      <p className="text-caption text-ink-2 mt-3">AMC वर्ष 1 आजपासून सक्रिय झाले आहे.</p>
      <button className="mt-4 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l">
        NOC डाउनलोड करा
      </button>
    </div>
  )
}
