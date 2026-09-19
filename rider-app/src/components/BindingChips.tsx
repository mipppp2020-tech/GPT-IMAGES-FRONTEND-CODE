/** The proof that a photo is worth money, framed protectively (Law IV) —
 * never "GPS verified / hash checked", always the plain-language equivalent. */
export function BindingChips({ gps, live, inApp, unique }: { gps: boolean; live: boolean; inApp: boolean; unique: boolean }) {
  const chips: { ok: boolean; icon: string; label: string }[] = [
    { ok: gps, icon: '📍', label: 'साईटवर' },
    { ok: live, icon: '⏱', label: 'लाईव्ह' },
    { ok: inApp, icon: '📷', label: 'अॅपमध्येच' },
    { ok: unique, icon: '✓', label: 'फक्त तुमचे' },
  ]
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span
          key={c.label}
          className={`text-[12px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            c.ok ? 'bg-good-surface text-good' : 'bg-surface-2 text-ink-2'
          }`}
        >
          <span>{c.icon}</span>
          {c.label}
        </span>
      ))}
    </div>
  )
}
