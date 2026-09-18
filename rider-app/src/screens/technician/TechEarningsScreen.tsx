import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { formatINR, nextFridayCountdown } from '../../lib/selectors'

/** T6 Money Meter. PRD §21.6: "every Friday, automatically... T6 always
 * shows the countdown." Own wallet, separate from every other role's —
 * "no visibility into other roles' pay" per the permission matrix. */
export function TechEarningsScreen() {
  const techWallet = useAiecStore((s) => s.techWallet)
  const total = techWallet.reduce((sum, w) => sum + w.amount, 0)
  const countdown = nextFridayCountdown()

  return (
    <div>
      <RoleTopBar title="मनी मीटर" back backTo="/technician" />
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-surface-2 p-5">
          <p className="text-caption text-ink-2">एकूण कमाई</p>
          <p className="text-display font-extrabold tnum mt-1">₹{formatINR(total)}</p>
        </div>

        <div className="mt-3 rounded-xl border border-black/10 p-3">
          <p className="text-body font-bold">पुढील पेआउट — शुक्रवार</p>
          <p className="text-caption text-ink-2 mt-0.5">{countdown.days} दिवस {countdown.hours} तास बाकी</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <p className="text-caption font-bold text-ink-2 mb-2">व्यवहार तपशील</p>
        {techWallet.length === 0 ? (
          <p className="text-body text-ink-2 text-center py-10">अजून कमाई नाही — आजचा टप्पा पूर्ण करा.</p>
        ) : (
          <div className="space-y-2.5">
            {techWallet.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-xl border border-black/10 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-body font-bold truncate">{w.label}</p>
                  <p className="text-caption text-ink-2 truncate">{w.cause}</p>
                </div>
                <span className="text-body-l font-extrabold tnum shrink-0 ml-2" style={{ color: 'var(--color-accent)' }}>
                  +₹{formatINR(w.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
