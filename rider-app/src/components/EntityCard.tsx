import { Link } from 'react-router-dom'
import type { Lead } from '../lib/types'
import { LIFECYCLE } from '../lib/lifecycle'
import { LifecycleMark } from './LifecycleMark'
import { formatINR } from '../lib/selectors'

/** One card structure for every entity type. Fixed internal order so
 * recognition is instant: photo, id/state, progress, money, custody, next action. */
export function EntityCard({ lead }: { lead: Lead }) {
  const meta = LIFECYCLE[lead.status]
  const photo = lead.photos.building

  const moneyLabel =
    lead.status === 'new'
      ? `₹${lead.payout} संभाव्य कमाई`
      : lead.status === 'lost' || lead.status === 'blocked'
        ? `₹${lead.payout} अंशिक कमाई`
        : `₹${lead.payout} मिळाले`

  const custody =
    lead.status === 'new'
      ? 'AIEC टीमकडून पडताळणी सुरू आहे'
      : lead.status === 'in_sales'
        ? lead.aiTip ?? 'सेल्स टीम ग्राहकाशी संपर्कात आहे'
        : lead.status === 'blocked'
          ? 'तुमच्याकडून फॉलो-अपची गरज आहे'
          : meta.description

  return (
    <Link
      to={`/leads/${lead.id}`}
      className="block rounded-2xl border border-black/10 bg-surface overflow-hidden active:opacity-90"
    >
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 rounded-xl bg-surface-2 overflow-hidden shrink-0">
          {photo ? (
            <img src={photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-2">
              <BuildingIcon />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <LifecycleMark meta={meta} />
            <span className="text-[12px] font-semibold" style={{ color: meta.color }}>
              {meta.label}
            </span>
          </div>
          <p className="text-body font-extrabold truncate">{lead.buildingName}</p>
          <p className="text-caption text-ink-2 truncate">{lead.address}</p>
          <p className="text-caption font-semibold tnum mt-0.5">{moneyLabel}</p>
        </div>
      </div>
      <div className="px-3 pb-3">
        <p className="text-[12px] text-ink-2 leading-snug line-clamp-1">{custody}</p>
      </div>
    </Link>
  )
}

function BuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function formatMoney(n: number) {
  return formatINR(n)
}
