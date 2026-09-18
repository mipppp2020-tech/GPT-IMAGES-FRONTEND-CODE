import { Link } from 'react-router-dom'

/** Persistent, orange, unmissable — per PRD §6.2 this can never be dismissed.
 * It is the one honest signal that nothing here touches real money or
 * real messages, on every screen of every role. */
export function DemoRibbon() {
  return (
    <div
      className="sticky top-0 z-50 text-white text-[12px] font-bold tracking-wide flex items-center justify-between px-3 py-1.5"
      style={{ background: '#E8451F' }}
    >
      <span>⚠ DEMO MODE — खरे पैसे किंवा खरे मेसेज नाहीत</span>
      <Link to="/demo" className="underline underline-offset-2 shrink-0 ml-2">
        भूमिका बदला
      </Link>
    </div>
  )
}
