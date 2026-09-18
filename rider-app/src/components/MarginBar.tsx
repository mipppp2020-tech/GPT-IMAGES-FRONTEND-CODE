import type { Quote } from '../lib/types'
import { marginPct } from '../lib/pricing'
import { formatINR } from '../lib/selectors'

/** PRD §10 / UX doc §2.2: "the largest object on the screen — a single bar
 * showing list price, current offer, the bot's floor, and the hard 20%
 * wall." The control is a native range input constrained to
 * [hardFloor, listPrice] — below the wall is not a validation error, the
 * value simply does not exist on the slider. That's the point: "a form
 * that lets you type an illegal number and then scolds you is a worse
 * design than one where the number does not exist." */
export function MarginBar({
  quote,
  onChange,
}: {
  quote: Quote
  onChange: (offer: number) => void
}) {
  const { baseCost, listPrice, botFloor, hardFloor, currentOffer } = quote
  const pct = (v: number) => ((v - hardFloor) / (listPrice - hardFloor)) * 100
  const margin = marginPct(currentOffer, baseCost)
  const atWall = currentOffer <= hardFloor + 1

  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-caption text-ink-2">सध्याचा ऑफर</p>
          <p className="text-title-l font-extrabold tnum">₹{formatINR(currentOffer)}</p>
        </div>
        <div className="text-right">
          <p className="text-caption text-ink-2">मार्जिन</p>
          <p className={`text-title font-extrabold tnum ${atWall ? 'text-bad' : ''}`}>{margin.toFixed(0)}%</p>
        </div>
      </div>

      <div className="relative mt-5 mb-7">
        <input
          type="range"
          min={hardFloor}
          max={listPrice}
          step={1000}
          value={currentOffer}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)] h-2"
          aria-label="किंमत ऑफर — 20% मार्जिनच्या खाली जाता येत नाही"
        />
        <Tick label="20% भिंत" sub={`₹${formatINR(hardFloor)}`} leftPct={pct(hardFloor)} tone="bad" />
        <Tick label="बॉट थांबले" sub={`₹${formatINR(botFloor)}`} leftPct={pct(botFloor)} tone="neutral" />
        <Tick label="लिस्ट किंमत" sub={`₹${formatINR(listPrice)}`} leftPct={pct(listPrice)} tone="neutral" align="right" />
      </div>

      {atWall && (
        <p className="text-caption text-bad font-semibold">
          🔒 20% पेक्षा कमी मार्जिन शक्य नाही — हे सिस्टीममध्येच लॉक आहे, फक्त ओनर अपवाद करू शकतात.
        </p>
      )}
    </div>
  )
}

function Tick({
  label,
  sub,
  leftPct,
  tone,
  align = 'left',
}: {
  label: string
  sub: string
  leftPct: number
  tone: 'bad' | 'neutral'
  align?: 'left' | 'right'
}) {
  const clamped = Math.min(96, Math.max(4, leftPct))
  return (
    <div
      className="absolute top-4 flex flex-col"
      style={{
        left: `${clamped}%`,
        transform: align === 'right' ? 'translateX(-100%)' : 'translateX(-2px)',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <span className={`text-[11px] font-bold whitespace-nowrap ${tone === 'bad' ? 'text-bad' : 'text-ink-2'}`}>{label}</span>
      <span className="text-[11px] text-ink-2 tnum whitespace-nowrap">{sub}</span>
    </div>
  )
}
