import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { BindingChips } from '../../components/BindingChips'
import { useAiecStore } from '../../lib/store'
import { useGeolocation } from '../../lib/useGeolocation'
import { selectPrimaryTechLead } from '../../lib/techJourney'
import { SOP_TEMPLATE, jobTotalValue, jobMaxPossible, JOB_ON_TIME_BONUS, JOB_ZERO_WASTAGE_BONUS, JOB_FIVE_STAR_BONUS } from '../../lib/sop'
import { fileToCompressedDataUrl } from '../../lib/image'
import { formatINR } from '../../lib/selectors'
import { distanceMeters } from '../../lib/geo'

const FAIL_REASONS = [
  'टॉर्क रीडिंग स्पष्ट दिसत नाही — जवळून घ्या आणि प्रकाश तपासा.',
  'फोटोत जास्त प्रकाश परावर्तन आहे — कोन बदला.',
  'संपूर्ण भाग फ्रेममध्ये दिसत नाही.',
  'हा भाग स्पष्ट ओळखता येत नाही — पुन्हा जवळून घ्या.',
]

function simulateStepCheck(accuracy: number): { pass: boolean; reason?: string } {
  let score = 90
  if (accuracy > 25) score -= 30
  else if (accuracy > 12) score -= 12
  score -= Math.round(Math.random() * 10)
  if (score >= 65) return { pass: true }
  return { pass: false, reason: FAIL_REASONS[Math.floor(Math.random() * FAIL_REASONS.length)] }
}

export function TechnicianTodayScreen() {
  const leads = useAiecStore((s) => s.leads)
  const techJobs = useAiecStore((s) => s.techJobs)
  const appeals = useAiecStore((s) => s.appeals)
  const acceptJob = useAiecStore((s) => s.acceptJob)
  const checkInJob = useAiecStore((s) => s.checkInJob)
  const captureStepPhoto = useAiecStore((s) => s.captureStepPhoto)
  const submitStep = useAiecStore((s) => s.submitStep)
  const retakeStep = useAiecStore((s) => s.retakeStep)
  const fileAppeal = useAiecStore((s) => s.fileAppeal)
  const geo = useGeolocation()

  const lead = selectPrimaryTechLead(leads)

  if (!lead) {
    return (
      <div>
        <RoleTopBar title="आज" />
        <div className="px-4 pt-10 text-center">
          <p className="text-body text-ink-2">आज कोणतेही काम नियुक्त नाही. नवीन जॉब आल्यावर इथे दिसेल.</p>
        </div>
      </div>
    )
  }

  const job = techJobs.find((j) => j.leadId === lead.id)

  if (!job) {
    return <JobOffer leadId={lead.id} buildingName={lead.buildingName} address={lead.address} floors={lead.floors} passengers={lead.passengers} onAccept={() => acceptJob(lead.id)} />
  }

  if (job.stage === 'accepted') {
    return (
      <div>
        <RoleTopBar title="साईटवर चेक-इन करा" />
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
              onClick={() => checkInJob(lead.id)}
              className="mt-6 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
            >
              📍 साईटवर पोहोचलो — चेक-इन करा
            </button>
          )}
        </div>
      </div>
    )
  }

  if (job.stage === 'done') {
    const earned = jobMaxPossible()
    return (
      <div>
        <RoleTopBar title="जॉब पूर्ण" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">🎉</span>
          <p className="text-title-l font-extrabold">जॉब पूर्ण झाला!</p>
          <p className="text-body text-ink-2 mt-2">{lead.buildingName} — सर्व 7 टप्पे पडताळले गेले</p>
          <p className="text-title font-extrabold tnum mt-4" style={{ color: 'var(--color-accent)' }}>
            ₹{formatINR(earned)} कमावले
          </p>
          <p className="text-caption text-ink-2 mt-2 max-w-xs">
            आता QC इन्स्पेक्टरची अंतिम तपासणी बाकी आहे — त्यानंतर ग्राहकासोबत हँडओव्हर होईल.
          </p>
          <Link to="/technician/earnings" className="mt-8 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l flex items-center justify-center">
            मनी मीटर पाहा
          </Link>
        </div>
      </div>
    )
  }

  const stepIndex = job.steps.findIndex((s) => s.status !== 'verified')
  const step = job.steps[stepIndex]
  const template = SOP_TEMPLATE[stepIndex]
  const appeal = appeals.find((a) => a.leadId === lead.id && a.stepId === step.id && !a.resolved)

  return (
    <StepScreen
      stepIndex={stepIndex}
      step={step}
      template={template}
      accuracy={geo.accuracy}
      pendingAppeal={!!appeal}
      onCapture={async (i, file) => {
        const dataUrl = await fileToCompressedDataUrl(file)
        captureStepPhoto(lead.id, step.id, i, dataUrl)
      }}
      onSubmit={() => {
        const result = simulateStepCheck(geo.accuracy)
        submitStep(lead.id, step.id, result.pass, result.reason)
      }}
      onRetake={() => retakeStep(lead.id, step.id)}
      onAppeal={() => fileAppeal(lead.id, step.id, step.lastFailReason ?? 'कारण नमूद नाही')}
    />
  )
}

function JobOffer({
  leadId,
  buildingName,
  address,
  floors,
  passengers,
  onAccept,
}: {
  leadId: string
  buildingName: string
  address: string
  floors: number
  passengers: number
  onAccept: () => void
}) {
  const [declined, setDeclined] = useState(false)
  const geo = useGeolocation()
  const distance = Math.round(distanceMeters({ lat: geo.lat, lng: geo.lng }, { lat: geo.lat + 0.02, lng: geo.lng + 0.02 }) / 100) / 10

  if (declined) {
    return (
      <div>
        <RoleTopBar title="जॉब नाकारला" />
        <div className="px-4 pt-10 text-center">
          <p className="text-body text-ink-2">कोणताही दंड नाही — तुम्ही जमेल तेव्हा दुसरा जॉब स्वीकारू शकता.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <RoleTopBar title="नवीन जॉब" />
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-black/10 p-4">
          <p className="text-caption text-ink-2">NEW JOB · LIFT #{leadId}</p>
          <p className="text-title font-extrabold mt-1">{buildingName}</p>
          <p className="text-caption text-ink-2">📍 {address} · {distance} किमी दूर</p>
          <p className="text-caption text-ink-2 mt-1">
            G+{floors} · {passengers}-प्रवासी · ऑटो डोअर · SS फिनिश
          </p>
          <p className="text-caption text-ink-2 mt-2">तुमची लेव्हल आवश्यक: L3 ✅</p>

          <div className="mt-4 pt-3 border-t border-black/10 space-y-1.5">
            <MoneyLine label="एकूण जॉब मूल्य" amount={jobTotalValue()} />
            <MoneyLine label="वेळेत पूर्ण बोनस" amount={JOB_ON_TIME_BONUS} />
            <MoneyLine label="शून्य-वाया बोनस" amount={JOB_ZERO_WASTAGE_BONUS} />
            <MoneyLine label="5★ ग्राहक बोनस" amount={JOB_FIVE_STAR_BONUS} />
            <div className="pt-2 mt-1 border-t border-black/10">
              <MoneyLine label="कमाल शक्य" amount={jobMaxPossible()} bold />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={() => setDeclined(true)} className="flex-1 tap-target rounded-2xl border-2 border-black/15 font-bold text-body-l">
            नाकारा
          </button>
          <button onClick={onAccept} className="flex-1 tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l">
            स्वीकारा
          </button>
        </div>
      </div>
    </div>
  )
}

function MoneyLine({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`text-caption ${bold ? 'font-extrabold' : 'text-ink-2'}`}>💰 {label}</span>
      <span className={`text-caption tnum ${bold ? 'font-extrabold' : 'font-semibold'}`}>₹{formatINR(amount)}</span>
    </div>
  )
}

function StepScreen({
  stepIndex,
  step,
  template,
  accuracy,
  pendingAppeal,
  onCapture,
  onSubmit,
  onRetake,
  onAppeal,
}: {
  stepIndex: number
  step: { id: string; status: string; photos: (string | null)[]; failCount: number; lastFailReason: string | null }
  template: (typeof SOP_TEMPLATE)[number]
  accuracy: number
  pendingAppeal: boolean
  onCapture: (i: number, file: File) => void
  onSubmit: () => void
  onRetake: () => void
  onAppeal: () => void
}) {
  const allCaptured = step.photos.every((p) => p !== null)

  if (step.status === 'frozen') {
    return (
      <div>
        <RoleTopBar title={`Step ${stepIndex + 1} of ${SOP_TEMPLATE.length}`} />
        <div className="px-4 pt-6">
          <p className="text-title font-extrabold text-bad">Step {stepIndex + 1} पुन्हा घ्या</p>
          <p className="text-body mt-2">{step.lastFailReason}</p>
          <div className="rounded-xl bg-surface-2 p-3 mt-3">
            <p className="text-caption text-ink-2">2 प्रयत्न वापरले. तुमचे ₹{formatINR(template.reward)} अजून आहे — गमावलेले नाही.</p>
          </div>
          {pendingAppeal ? (
            <div className="mt-5 rounded-2xl border border-black/10 p-4 text-center">
              <p className="text-body font-bold">🕐 अपील पाठवले</p>
              <p className="text-caption text-ink-2 mt-1">Admin कडून 4 तासांत उत्तर मिळेल. तुमचे पेमेंट सुरक्षित आहे.</p>
            </div>
          ) : (
            <button onClick={onAppeal} className="mt-5 w-full tap-target rounded-2xl border-2 border-black/15 font-bold text-body-l">
              हे बरोबर आहे — व्यक्तीला विचारा
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <RoleTopBar title={`Step ${stepIndex + 1} of ${SOP_TEMPLATE.length}`} />
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-title-l font-extrabold">{template.title}</p>
          <span className="text-body font-extrabold tnum" style={{ color: 'var(--color-accent)' }}>
            ₹{formatINR(template.reward)}
          </span>
        </div>

        <ol className="mt-3 space-y-1">
          {template.instructions.map((line, i) => (
            <li key={i} className="text-caption text-ink-2">
              {i + 1}. {line}
            </li>
          ))}
        </ol>

        {template.safetyLine && (
          <div className="mt-3 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(255,77,61,0.12)', border: '1px solid var(--color-safety)' }}>
            <span style={{ color: 'var(--color-safety)' }}>⚠️</span>
            <p className="text-caption font-semibold" style={{ color: 'var(--color-safety)' }}>
              {template.safetyLine}
            </p>
          </div>
        )}

        {step.failCount > 0 && step.status !== 'frozen' && (
          <div className="mt-3 rounded-xl bg-warn-surface p-3">
            <p className="text-caption font-semibold text-warn">पुन्हा फोटो घ्या — {step.lastFailReason}</p>
            <p className="text-[11px] text-ink-2 mt-1 mb-2">प्रयत्न {step.failCount}/2 वापरले</p>
            <button onClick={onRetake} className="w-full tap-target rounded-xl bg-warn text-white font-bold text-[14px]">
              सर्व फोटो पुन्हा घ्या
            </button>
          </div>
        )}

        <p className="text-caption font-bold text-ink-2 mt-4 mb-2">आवश्यक पुरावा ({template.evidenceLabels.length})</p>
        <div className="grid grid-cols-2 gap-2">
          {template.evidenceLabels.map((label, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-surface-2 relative" style={{ aspectRatio: '4/3' }}>
              {step.photos[i] ? (
                <img src={step.photos[i]!} alt="" className="w-full h-full object-cover" />
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) onCapture(i, f)
                    }}
                  />
                  <span className="text-2xl">📷</span>
                  <span className="text-[11px] text-ink-2 text-center px-1">{label}</span>
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <BindingChips gps live inApp unique />
        </div>

        {allCaptured && (
          <button onClick={onSubmit} className="mt-5 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l">
            सबमिट करा
          </button>
        )}

        <p className="text-[11px] text-ink-2 text-center mt-2">GPS अचूकता: {Math.round(accuracy)}मी</p>
      </div>
    </div>
  )
}
