import { Link } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { useRiderStore } from '../lib/store'
import { walletStats, formatINR, nextFridayCountdown } from '../lib/selectors'

export function EarningsScreen() {
  const wallet = useRiderStore((s) => s.wallet)
  const rider = useRiderStore((s) => s.rider)
  const { todayTotal, weekTotal, pendingTotal, clearedTotal } = walletStats(wallet)
  const countdown = nextFridayCountdown()

  return (
    <div>
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="text-title-l font-extrabold">कमाई</h1>
        <p className="text-caption text-ink-2 mt-0.5">तुमचे वॉलेट — प्रत्येक रुपया फोटोपर्यंत शोधता येतो.</p>
      </div>

      <div className="mx-4 mt-4 rounded-2xl bg-ink text-white px-4 py-5">
        <p className="text-caption text-white/70">एकूण उपलब्ध शिल्लक</p>
        <p className="text-display font-extrabold tnum mt-1">₹{formatINR(clearedTotal)}</p>
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-[12px] text-white/60">आज</p>
            <p className="text-body-l font-extrabold tnum">₹{formatINR(todayTotal)}</p>
          </div>
          <div>
            <p className="text-[12px] text-white/60">हा आठवडा</p>
            <p className="text-body-l font-extrabold tnum">₹{formatINR(weekTotal)}</p>
          </div>
          <div>
            <p className="text-[12px] text-white/60">पडताळणीत</p>
            <p className="text-body-l font-extrabold tnum text-warn">₹{formatINR(pendingTotal)}</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-2xl bg-surface-2 px-4 py-3">
        <p className="text-body font-bold">पुढील पेआउट — शुक्रवार</p>
        <p className="text-caption text-ink-2 mt-0.5">
          {countdown.days} दिवस {countdown.hours} तास बाकी · {rider.upiId} वर जमा होईल
        </p>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-title font-extrabold mb-3">व्यवहार तपशील</h2>
        <div className="space-y-2.5">
          {wallet.map((w) => (
            <Link
              key={w.id}
              to={w.leadId ? `/leads/${w.leadId}` : '#'}
              className="flex items-center justify-between rounded-xl border border-black/10 px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="text-body font-bold truncate">{w.label}</p>
                <p className="text-caption text-ink-2 truncate">{w.cause}</p>
                <p className="text-[11px] text-ink-2 mt-0.5">
                  {w.id} · {new Date(w.createdAt).toLocaleDateString('mr-IN', { day: '2-digit', month: 'short' })}
                </p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-body-l font-extrabold tnum text-good">+₹{formatINR(w.amount)}</p>
                <p
                  className={`text-[11px] font-semibold ${w.state === 'pending' ? 'text-warn' : 'text-ink-2'}`}
                >
                  {w.state === 'pending' ? 'सिंक होत आहे' : 'क्लिअर'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
