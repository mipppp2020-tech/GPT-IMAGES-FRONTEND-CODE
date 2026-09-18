import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { BindingChips } from '../components/BindingChips'
import { useGeolocation } from '../lib/useGeolocation'
import { useAiecStore } from '../lib/store'
import { OPPORTUNITY_SITES, OTHER_RIDER_LEADS, ZONES } from '../lib/mock'
import { distanceMeters, jitterCoord } from '../lib/geo'
import { fileToCompressedDataUrl } from '../lib/image'
import { nextLeadId, nextWalletId } from '../lib/ids'
import type { Lead } from '../lib/types'

type Step = 'shaft' | 'building' | 'contact' | 'details' | 'quality-choice' | 'submitting' | 'done'

const SHOT_META: Record<'shaft' | 'building' | 'contact', { title: string; guide: string }> = {
  shaft: { title: 'फोटो 1 / 3 — लिफ्ट शाफ्ट', guide: 'शाफ्टची जागा पूर्ण फ्रेममध्ये येऊ द्या' },
  building: { title: 'फोटो 2 / 3 — संपूर्ण इमारत', guide: 'संपूर्ण इमारत स्पष्ट दिसली पाहिजे' },
  contact: { title: 'फोटो 3 / 3 — संपर्क फलक / व्यक्ती', guide: 'साईट इंचार्ज किंवा बोर्ड फोटोत घ्या' },
}

function zoneFromCoords(lat: number, lng: number) {
  let best = 'Baner'
  let bestD = Infinity
  for (const [zone, c] of Object.entries(ZONES)) {
    const d = distanceMeters({ lat, lng }, c)
    if (d < bestD) {
      bestD = d
      best = zone
    }
  }
  return best
}

export function CaptureScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const geo = useGeolocation()
  const leads = useAiecStore((s) => s.leads)
  const online = useAiecStore((s) => s.online)
  const addLead = useAiecStore((s) => s.addLead)
  const addWalletEntry = useAiecStore((s) => s.addWalletEntry)

  const opportunityId = (location.state as { opportunityId?: string } | null)?.opportunityId
  const opportunity = OPPORTUNITY_SITES.find((o) => o.id === opportunityId)

  const captureCoords = opportunity ?? { lat: geo.lat, lng: geo.lng, buildingName: '', floors: 5, address: '' }

  const [step, setStep] = useState<Step>('shaft')
  const [photos, setPhotos] = useState<{ shaft: string | null; building: string | null; contact: string | null }>({
    shaft: null,
    building: null,
    contact: null,
  })
  const [floors, setFloors] = useState(opportunity?.floors ?? 5)
  const [shaftReady, setShaftReady] = useState(true)
  // Guards finalizeSubmit against a double-tap/double-click race: two click
  // events dispatched in the same synchronous turn both close over the same
  // pre-update `step`/`photos` state, so a React state flag alone can't stop
  // the second call — only a ref, mutated synchronously, can.
  const submitLockRef = useRef(false)

  const duplicate = useMemo(() => {
    const nearbyExisting = [
      ...leads.map((l) => ({ ...l, byName: 'तुम्ही', on: 'याआधी' })),
      ...OTHER_RIDER_LEADS.map((o) => ({ ...o, byName: o.by, on: o.on })),
    ]
    for (const item of nearbyExisting) {
      const d = distanceMeters(captureCoords, item)
      if (d <= 50) return { by: item.byName, on: item.on, buildingName: item.buildingName }
    }
    return null
  }, [captureCoords, leads])

  if (geo.status !== 'ready') {
    return (
      <div>
        <TopBar back title="नवीन लीड कॅप्चर करा" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
            <LocationOffIcon />
          </div>
          <p className="text-title font-extrabold">बाहेर या. GPS मुळेच ही लीड तुमची होते.</p>
          <p className="text-body text-ink-2 mt-2">
            {geo.status === 'locating'
              ? 'तुमचे स्थान शोधत आहोत...'
              : 'लोकेशन परवानगी बंद आहे किंवा उपलब्ध नाही.'}
          </p>
          <button
            onClick={geo.forceDemo}
            className="mt-6 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            डेमो लोकेशन वापरा
          </button>
        </div>
      </div>
    )
  }

  if (duplicate && step !== 'done') {
    return (
      <div>
        <TopBar back title="नवीन लीड कॅप्चर करा" />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-bad-surface flex items-center justify-center mb-4 text-2xl">
            🔒
          </div>
          <p className="text-title font-extrabold">आधीच कॅप्चर केलेली आहे</p>
          <p className="text-body text-ink-2 mt-2">
            {duplicate.buildingName} — {duplicate.by} यांनी {duplicate.on} रोजी कॅप्चर केली.
          </p>
          <p className="text-caption text-ink-2 mt-1">50 मीटरच्या आत दुसरी लीड नोंदवता येत नाही — पहिल्या रायडरचे कमिशन कायम राहते.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 tap-target w-full rounded-2xl bg-ink text-white font-extrabold text-body-l"
          >
            नकाशावर पिन पाहा
          </button>
        </div>
      </div>
    )
  }

  const handleShot = async (key: 'shaft' | 'building' | 'contact', file: File) => {
    const dataUrl = await fileToCompressedDataUrl(file)
    setPhotos((p) => ({ ...p, [key]: dataUrl }))
    if (key === 'shaft') setStep('building')
    else if (key === 'building') setStep('contact')
    else setStep('details')
  }

  /** Simulates the AI quality score (photo clarity, shaft visibility, contact
   * readability, floor-count confidence). We don't run real vision analysis in
   * this MVP, so GPS accuracy stands in as the one real signal we have — poor
   * accuracy correlates with indoor/obstructed capture conditions — plus a
   * small variance so the ₹10-vs-retake path is a real, reachable outcome
   * rather than dead code. */
  const computeQualityScore = () => {
    let score = 92
    if (geo.accuracy > 25) score -= 25
    else if (geo.accuracy > 12) score -= 10
    score -= Math.round(Math.random() * 12)
    return Math.max(35, Math.min(98, score))
  }

  const finalizeSubmit = (payout: 40 | 10, qualityScore: number) => {
    if (submitLockRef.current) return
    submitLockRef.current = true
    setStep('submitting')
    const zone = opportunity ? zoneFromCoords(opportunity.lat, opportunity.lng) : zoneFromCoords(geo.lat, geo.lng)
    const coords = opportunity ? { lat: opportunity.lat, lng: opportunity.lng } : jitterCoord({ lat: geo.lat, lng: geo.lng })
    const id = nextLeadId(zone)
    const lead: Lead = {
      id,
      buildingName: opportunity?.buildingName ?? 'नवीन साईट',
      address: opportunity?.address ?? `${zone}, पुणे`,
      zone,
      lat: coords.lat,
      lng: coords.lng,
      floors,
      shaftReady,
      passengers: floors >= 7 ? 10 : floors >= 5 ? 8 : 6,
      ownerName: 'साईट प्रतिनिधी',
      ownerPhone: '+91 90000 00000',
      photos,
      note: '',
      qualityScore,
      payout,
      status: 'new',
      createdAt: Date.now(),
      synced: online,
      newGroundBonus: Math.random() > 0.6,
    }

    const doCommit = () => {
      addLead(lead)
      addWalletEntry({
        id: nextWalletId(),
        amount: payout,
        label: payout === 40 ? 'वैध लीड कॅप्चर' : 'कमी गुणवत्ता लीड',
        cause: lead.buildingName,
        consequence: online ? 'तपासणीनंतर 24 तासांत क्लिअर होते' : 'नेटवर्क आल्यावर सिंक व सत्यापित होईल',
        state: online ? 'cleared' : 'pending',
        leadId: id,
        createdAt: Date.now(),
      })
      setStep('done')
    }

    setTimeout(doCommit, online ? 500 : 200)
  }

  const onSubmitTapped = () => {
    const score = computeQualityScore()
    if (score < 70) {
      setStep('quality-choice')
      return
    }
    finalizeSubmit(40, score)
  }

  if (step === 'done') {
    return <SubmittedScreen navigate={navigate} online={online} />
  }

  if (step === 'submitting') {
    return (
      <div>
        <TopBar back title="नवीन लीड कॅप्चर करा" />
        <div className="px-4 pt-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
          <p className="text-body font-semibold mt-4">{online ? 'सबमिट होत आहे...' : 'ऑफलाइन — रांगेत साठवत आहे...'}</p>
        </div>
      </div>
    )
  }

  if (step === 'quality-choice') {
    return (
      <div>
        <TopBar back title="नवीन लीड कॅप्चर करा" />
        <div className="px-4 pt-8">
          <p className="text-title font-extrabold">फोटो अस्पष्ट आहे</p>
          <p className="text-body text-ink-2 mt-2">
            पूर्ण ₹40 साठी पुन्हा फोटो घ्या, किंवा ₹10 साठी हीच लीड सबमिट करा.
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                setPhotos({ shaft: null, building: null, contact: null })
                setStep('shaft')
              }}
              className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
            >
              पुन्हा फोटो घ्या — पूर्ण ₹40
            </button>
            <button
              onClick={() => finalizeSubmit(10, computeQualityScore())}
              className="w-full tap-target rounded-2xl border-2 border-ink/15 font-bold text-body-l"
            >
              ₹10 साठी सबमिट करा
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'details') {
    return (
      <div>
        <TopBar back title="नवीन लीड कॅप्चर करा" />
        <div className="px-4 pt-4">
          <p className="text-caption text-ink-2 mb-3">
            {opportunity?.buildingName ?? 'नवीन साईट'} · {opportunity?.address}
          </p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {(['shaft', 'building', 'contact'] as const).map((k) => (
              <div key={k} className="rounded-xl overflow-hidden bg-surface-2 aspect-square">
                {photos[k] && <img src={photos[k]!} alt="" className="w-full h-full object-cover" />}
              </div>
            ))}
          </div>

          <div className="mb-4" role="group" aria-label="मजल्यांची संख्या">
            <span className="text-body font-bold">मजल्यांची संख्या</span>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                aria-label="मजला कमी करा"
                onClick={() => setFloors((f) => Math.max(1, f - 1))}
                className="tap-target w-14 rounded-xl bg-surface-2 text-title font-extrabold"
              >
                −
              </button>
              <span className="text-title-l font-extrabold tnum w-14 text-center" aria-live="polite">
                {floors}
              </span>
              <button
                type="button"
                aria-label="मजला वाढवा"
                onClick={() => setFloors((f) => Math.min(30, f + 1))}
                className="tap-target w-14 rounded-xl bg-surface-2 text-title font-extrabold"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-body font-bold">शाफ्ट तयार आहे का?</span>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShaftReady(true)}
                className={`flex-1 tap-target rounded-xl font-bold ${shaftReady ? 'bg-good text-white' : 'bg-surface-2 text-ink-2'}`}
              >
                होय
              </button>
              <button
                onClick={() => setShaftReady(false)}
                className={`flex-1 tap-target rounded-xl font-bold ${!shaftReady ? 'bg-warn text-white' : 'bg-surface-2 text-ink-2'}`}
              >
                अजून नाही
              </button>
            </div>
          </div>

          <button
            onClick={onSubmitTapped}
            className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            सबमिट करा
          </button>
        </div>
      </div>
    )
  }

  const activeKey = step as 'shaft' | 'building' | 'contact'
  const meta = SHOT_META[activeKey]

  return (
    <div>
      <TopBar back title="नवीन लीड कॅप्चर करा" />
      <div className="px-4 pt-3">
        <div className="flex items-center gap-1.5 mb-3">
          {(['shaft', 'building', 'contact'] as const).map((k) => (
            <div key={k} className={`h-1.5 flex-1 rounded-full ${photos[k] || k === activeKey ? 'bg-accent' : 'bg-surface-2'}`} />
          ))}
        </div>
        <p className="text-title font-extrabold">{meta.title}</p>
        <p className="text-caption text-ink-2 mt-0.5">{meta.guide}</p>

        <div className="mt-4 rounded-2xl overflow-hidden bg-ink relative" style={{ aspectRatio: '3/4' }}>
          <div className="absolute inset-6 border-2 border-white/70 rounded-2xl" />
          <div className="absolute top-3 left-3 bg-black/50 text-white text-[12px] px-2.5 py-1 rounded-full">
            📍 अचूकता: {geo.accuracy}मी
          </div>
          <label className="absolute inset-0 flex items-end justify-center pb-6">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void handleShot(activeKey, f)
              }}
            />
            <span className="w-[72px] h-[72px] rounded-full bg-white border-4 border-white/40 flex items-center justify-center active:scale-95 transition-transform">
              <span className="w-14 h-14 rounded-full bg-accent" />
            </span>
          </label>
        </div>

        <div className="mt-4">
          <BindingChips gps live inApp unique />
        </div>

        {!online && (
          <p className="text-caption text-warn font-semibold mt-3">
            ऑफलाइन — फोटो व लोकेशन डिव्हाइसवर साठवले जातील आणि नेटवर्क आल्यावर आपोआप सिंक होतील.
          </p>
        )}
      </div>
    </div>
  )
}

function SubmittedScreen({ navigate, online }: { navigate: ReturnType<typeof useNavigate>; online: boolean }) {
  return (
    <div>
      <TopBar back title="लीड सबमिट झाली" />
      <div className="px-4 pt-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-good-surface flex items-center justify-center text-4xl mb-4">
          ✅
        </div>
        <p className="text-title-l font-extrabold">लीड यशस्वीरित्या सबमिट केली!</p>
        <p className="text-body text-ink-2 mt-2">
          {online
            ? 'तुमची माहिती सुरक्षितपणे नोंदवली गेली आहे. AIEC टीम आता पडताळणी करेल.'
            : 'ऑफलाइन साठवली — नेटवर्क आल्यावर आपोआप सिंक व पडताळणी होईल. तुमचे कमिशन "सिंक होत आहे" असे दिसेल.'}
        </p>
        <div className="mt-8 w-full space-y-3">
          <button
            onClick={() => navigate('/leads')}
            className="w-full tap-target rounded-2xl bg-ink text-white font-extrabold text-body-l"
          >
            माझे लीड्स पाहा
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            आणखी एक लीड कॅप्चर करा
          </button>
        </div>
      </div>
    </div>
  )
}

function LocationOffIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.6 7-12a7 7 0 10-14 0c0 5.4 7 12 7 12z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
