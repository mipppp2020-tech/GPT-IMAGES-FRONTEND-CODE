import { useRiderStore } from '../lib/store'
import { walletStats, formatINR, STREAK_BONUS, STREAK_TARGET_DAYS } from '../lib/selectors'

/** Business Law 4: money on every field screen, as chrome not a page.
 * Shows today, week, and the distance to the next threshold. */
export function MoneyMeter() {
  const wallet = useRiderStore((s) => s.wallet)
  const rider = useRiderStore((s) => s.rider)
  const { todayTotal, weekTotal, pendingTotal } = walletStats(wallet)
  const daysLeft = Math.max(0, STREAK_TARGET_DAYS - rider.streakDays)

  return (
    <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-br from-[#FFF3EC] to-[#FFE7DA] border border-accent/15 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-ink-2">आजचे कमाई</p>
          <p className="text-title-l font-extrabold tnum text-accent">₹{formatINR(todayTotal)}</p>
        </div>
        <div className="text-right">
          <p className="text-caption text-ink-2">या आठवड्याची कमाई</p>
          <p className="text-body-l font-extrabold tnum">₹{formatINR(weekTotal)}</p>
        </div>
      </div>
      {pendingTotal > 0 && (
        <p className="text-caption text-ink-2 mt-2">
          ₹{formatINR(pendingTotal)} अजून पडताळणीत — पडताळणी झाल्यावर लगेच जमा होईल
        </p>
      )}
      {daysLeft > 0 && daysLeft <= 6 && (
        <p className="text-caption font-medium mt-2 text-accent">
          अजून {daysLeft} दिवस राईड करा — ₹{formatINR(STREAK_BONUS)} स्ट्रीक बोनससाठी
        </p>
      )}
    </div>
  )
}
