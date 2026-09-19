import { Link } from 'react-router-dom'

/** PRD §6.2: "the actual top of the recruitment and investment funnel."
 * A slim, non-dismissable strip in normal flow just above each role's own
 * bottom nav — never fighting the nav for the fixed-bottom slot. Leads to
 * /join, the one real (built) sign-up path in this MVP — the Candidate
 * earnings-calculator-to-first-job funnel — rather than the bare
 * unwired <button> this used to be, which looked tappable and did nothing. */
export function ConversionBar() {
  return (
    <Link
      to="/join"
      className="w-full flex items-center justify-center gap-2 bg-ink text-white text-[13px] font-semibold py-2.5"
    >
      <span>आवडलं? तुमचे खरे खाते तयार करा</span>
      <span aria-hidden>→</span>
    </Link>
  )
}
