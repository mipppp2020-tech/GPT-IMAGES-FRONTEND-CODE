import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { MoneyMeter } from '../components/MoneyMeter'
import { RiderMap } from '../components/RiderMap'
import { useRiderStore } from '../lib/store'
import { OPPORTUNITY_SITES } from '../lib/mock'
import { useGeolocation } from '../lib/useGeolocation'
import { distanceMeters } from '../lib/geo'
import { leadsCapturedToday, walletStats, formatINR } from '../lib/selectors'

export function RideMapScreen() {
  const navigate = useNavigate()
  const leads = useRiderStore((s) => s.leads)
  const wallet = useRiderStore((s) => s.wallet)
  const rideActive = useRiderStore((s) => s.rideActive)
  const startRide = useRiderStore((s) => s.startRide)
  const geo = useGeolocation()

  const todayCount = leadsCapturedToday(leads)
  const { weekTotal } = walletStats(wallet)
  const here = { lat: geo.lat, lng: geo.lng }

  // Recomputed only when position or leads actually change — not on every
  // unrelated re-render (e.g. a wallet update elsewhere) — since this array
  // feeds the map's marker-rebuild effect, and a fresh array identity there
  // means clearing and redrawing every pin for no reason.
  const nearby = useMemo(
    () =>
      OPPORTUNITY_SITES.map((o) => ({
        ...o,
        distance: Math.round(distanceMeters(here, o)),
      })).sort((a, b) => a.distance - b.distance),
    [here.lat, here.lng],
  )

  return (
    <div>
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="text-title-l font-extrabold leading-tight">आजचा दिवस, नवी संधी!</h1>
        <p className="text-caption text-ink-2 mt-0.5">अधिक शाफ्ट, अधिक कुटुंबांचे सुरक्षित भविष्य.</p>
      </div>

      <MoneyMeter />

      <div className="grid grid-cols-3 gap-2 px-4 mt-3">
        <StatTile value={String(todayCount)} label="आजचे कॅप्चर" />
        <StatTile value={String(nearby.length)} label="जवळील संधी" />
        <StatTile value={`₹${formatINR(weekTotal)}`} label="आठवड्याची कमाई" />
      </div>

      <div className="mx-4 mt-4">
        <RiderMap
          center={here}
          myPosition={{ lat: geo.lat, lng: geo.lng, accuracy: geo.accuracy }}
          leads={leads}
          opportunities={nearby}
          onOpportunityClick={(id) => navigate('/capture', { state: { opportunityId: id } })}
          onLeadClick={(id) => navigate(`/leads/${id}`)}
        />
      </div>

      <div className="px-4 mt-5">
        {!rideActive ? (
          <button
            onClick={startRide}
            className="w-full tap-target rounded-2xl bg-accent text-accent-ink text-body-l font-extrabold flex items-center justify-center gap-2 shadow-sm active:opacity-90"
          >
            <PlayIcon /> राईड सुरू करा
          </button>
        ) : (
          <button
            onClick={() => navigate('/capture')}
            className="w-full tap-target rounded-2xl bg-accent text-accent-ink text-body-l font-extrabold flex items-center justify-center gap-2 shadow-sm active:opacity-90"
          >
            <CameraIcon /> लीड कॅप्चर करा
          </button>
        )}
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-title font-extrabold mb-3">जवळील संधी</h2>
        {nearby.length === 0 ? (
          <p className="text-body text-ink-2 py-6 text-center">
            या परिसरात अजून नवीन संधी नाही — राईड सुरू ठेवा
          </p>
        ) : (
          <div className="space-y-3">
            {nearby.map((o) => (
              <div
                key={o.id}
                data-testid={`opportunity-${o.id}`}
                className="rounded-2xl border border-black/10 p-3 flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 text-ink-2">
                  <BuildingGlyph />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-bold truncate">{o.buildingName}</p>
                  <p className="text-caption text-ink-2 truncate">{o.address}</p>
                  <p className="text-caption text-ink-2">{o.distance} मीटर दूर</p>
                </div>
                <button
                  onClick={() => navigate('/capture', { state: { opportunityId: o.id } })}
                  className="shrink-0 tap-target px-4 rounded-xl bg-accent/10 text-accent font-bold text-[14px]"
                >
                  लीड कॅप्चर करा
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {todayCount === 0 && (
        <div className="mx-4 mt-4 rounded-2xl bg-warn-surface border border-warn/20 px-4 py-3">
          <p className="text-body font-bold text-warn">आज अजून लीड नाही — राईड सुरू करा</p>
          <p className="text-caption text-ink-2 mt-0.5">प्रत्येक वैध लीडसाठी ₹40. पहिली लीड आज कॅप्चर करा.</p>
        </div>
      )}

      <div className="mx-4 mt-4 mb-2 rounded-2xl bg-good-surface px-4 py-3 flex items-center gap-3">
        <span className="text-xl">🪖</span>
        <div>
          <p className="text-caption font-bold text-good">सुरक्षित राईडिंग, सुरक्षित भविष्य</p>
          <p className="text-[12px] text-ink-2">हेल्मेट वापरा — तुमचे आणि इतरांचे जीवन मौल्यवान आहे</p>
        </div>
      </div>
    </div>
  )
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-surface-2 py-2.5 text-center">
      <p className="text-body font-extrabold tnum leading-tight">{value}</p>
      <p className="text-[11px] text-ink-2 leading-tight mt-0.5">{label}</p>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
    </svg>
  )
}
function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function BuildingGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
