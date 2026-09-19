/** The five-slot status grammar (Law II), stacked form. Never renders a bare
 * "Pending/Processing/Failed" — every status names who holds it, by when,
 * and what happens if it doesn't move. */
export function StatusStack({
  state,
  reason,
  custody,
  clock,
  consequence,
  tone = 'neutral',
}: {
  state: string
  reason?: string
  custody?: string
  clock?: string
  consequence?: string
  tone?: 'neutral' | 'good' | 'warn' | 'bad'
}) {
  const toneClass =
    tone === 'good'
      ? 'border-good/30 bg-good-surface'
      : tone === 'warn'
        ? 'border-warn/30 bg-warn-surface'
        : tone === 'bad'
          ? 'border-bad/30 bg-bad-surface'
          : 'border-black/10 bg-surface-2'

  return (
    <div className={`rounded-2xl border px-4 py-3.5 ${toneClass}`}>
      <p className="text-body-l font-extrabold leading-snug">{state}</p>
      {reason && <p className="text-caption text-ink-2 mt-1 leading-snug">{reason}</p>}
      {custody && <p className="text-caption font-medium mt-1.5 leading-snug">{custody}</p>}
      {clock && <p className="text-caption text-ink-2 leading-snug">{clock}</p>}
      {consequence && <p className="text-caption text-ink-2 mt-1.5 leading-snug italic">{consequence}</p>}
    </div>
  )
}
