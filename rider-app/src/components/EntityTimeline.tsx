import type { Lead } from '../lib/types'
import { LIFECYCLE, STATUS_ORDER } from '../lib/lifecycle'

/** Six-node timeline, distinguishable without colour. The current node is
 * always expanded; everything below shows only its name. */
export function EntityTimeline({ lead }: { lead: Lead }) {
  const isTerminalFail = lead.status === 'lost' || lead.status === 'blocked'
  const currentIndex = isTerminalFail ? STATUS_ORDER.indexOf('new') : STATUS_ORDER.indexOf(lead.status)

  return (
    <div>
      {STATUS_ORDER.map((s, i) => {
        const meta = LIFECYCLE[s]
        const isPast = i < currentIndex || (isTerminalFail && i === 0)
        const isCurrent = i === currentIndex && !isTerminalFail
        const isFuture = i > currentIndex && !isTerminalFail

        return (
          <div key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Node state={isPast ? 'complete' : isCurrent ? 'current' : 'upcoming'} color={meta.color} />
              {i < STATUS_ORDER.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-6 ${isPast ? 'bg-good' : 'bg-black/10'}`} />
              )}
            </div>
            <div className={`pb-5 ${isFuture ? 'opacity-45' : ''}`}>
              <p className={`text-body font-bold ${isCurrent ? '' : ''}`}>{meta.label}</p>
              {isCurrent && <p className="text-caption text-ink-2 mt-0.5">{meta.description}</p>}
            </div>
          </div>
        )
      })}

      {isTerminalFail && (
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <Node state="failed" color={LIFECYCLE[lead.status].color} />
          </div>
          <div className="pb-2">
            <p className="text-body font-bold" style={{ color: LIFECYCLE[lead.status].color }}>
              {LIFECYCLE[lead.status].label}
            </p>
            <p className="text-caption text-ink-2 mt-0.5">{LIFECYCLE[lead.status].description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Node({ state, color }: { state: 'complete' | 'current' | 'upcoming' | 'failed'; color: string }) {
  if (state === 'complete') {
    return (
      <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-good)' }}>
        <svg width="9" height="9" viewBox="0 0 16 16">
          <path d="M3 8.5 L6.5 12 L13 4" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }
  if (state === 'current') {
    return (
      <span
        className="w-4 h-4 rounded-full shrink-0 relative flex items-center justify-center"
        style={{ border: `3px solid ${color}` }}
      >
        <span className="absolute inset-0 rounded-full animate-ping" style={{ background: color, opacity: 0.3 }} />
      </span>
    )
  }
  if (state === 'failed') {
    return (
      <span
        className="w-4 h-4 rounded-[3px] shrink-0 relative overflow-hidden"
        style={{ border: `2.5px solid ${color}` }}
      >
        <span className="absolute rotate-45" style={{ background: color, height: 2.5, width: 20, top: '48%', left: -4 }} />
      </span>
    )
  }
  return <span className="w-4 h-4 rounded-full border-2 border-black/15 shrink-0" />
}
