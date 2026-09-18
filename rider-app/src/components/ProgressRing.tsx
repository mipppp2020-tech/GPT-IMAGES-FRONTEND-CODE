/** UX doc §2.3: "The progress ring, gold, with the stage name inside it" —
 * the single element carrying the whole relationship state. One ring, one
 * sentence, one button is the entire design for this role. */
export function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const size = 176
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-surface-2)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-gold)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 420ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-title-l font-extrabold tnum">{Math.round(percent)}%</p>
        <p className="text-caption text-ink-2 leading-tight mt-1">{label}</p>
      </div>
    </div>
  )
}
