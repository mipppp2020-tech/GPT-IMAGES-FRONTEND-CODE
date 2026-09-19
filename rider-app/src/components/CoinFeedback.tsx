import { useEffect, useState } from 'react'
import { useAiecStore } from '../lib/store'
import { formatINR } from '../lib/selectors'

/** MoneyFeedback: amount, state, cause, consequence — lands within 3s of the
 * verified act. 700ms coin motion, interruptible, never blocks the next capture. */
export function CoinFeedback() {
  const event = useAiecStore((s) => s.lastCoinEvent)
  const clear = useAiecStore((s) => s.clearCoinEvent)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!event) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      clear()
    }, 2600)
    return () => clearTimeout(t)
  }, [event, clear])

  if (!event || !visible) return null

  return (
    <div
      className="fixed top-11 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 animate-coin"
      role="status"
      onClick={() => {
        setVisible(false)
        clear()
      }}
    >
      <div className="bg-ink text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shrink-0 text-lg font-extrabold">
          ₹
        </div>
        <div className="min-w-0">
          <p className="text-body-l font-extrabold tnum leading-tight">+₹{formatINR(event.amount)}</p>
          <p className="text-caption text-white/80 truncate leading-tight">
            {event.label} · {event.cause}
          </p>
        </div>
      </div>
    </div>
  )
}
