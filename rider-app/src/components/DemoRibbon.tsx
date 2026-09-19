import { Link } from 'react-router-dom'
import { useDarkMode } from '../lib/useDarkMode'

/** Persistent, orange, unmissable — per PRD §6.2 this can never be dismissed.
 * It is the one honest signal that nothing here touches real money or
 * real messages, on every screen of every role. Also carries the one
 * app-wide control that belongs on every screen regardless of role: the
 * light/dark switch, top right, since this component is already mounted
 * by every role's layout. */
export function DemoRibbon() {
  const { dark, toggle } = useDarkMode()
  return (
    <div
      className="sticky top-0 z-50 text-white text-[12px] font-bold tracking-wide flex items-center justify-between gap-2 px-3 py-1.5"
      style={{ background: '#E8451F' }}
    >
      <span className="min-w-0 truncate">⚠ DEMO MODE — खरे पैसे किंवा खरे मेसेज नाहीत</span>
      <span className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggle}
          aria-label={dark ? 'उजळ मोड वापरा' : 'गडद मोड वापरा'}
          data-testid="theme-toggle"
          className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[13px] leading-none"
        >
          {dark ? '☀️' : '🌙'}
        </button>
        <Link to="/demo" className="underline underline-offset-2">
          भूमिका बदला
        </Link>
      </span>
    </div>
  )
}
