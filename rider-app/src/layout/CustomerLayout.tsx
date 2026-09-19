import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { CoinFeedback } from '../components/CoinFeedback'
import { ConversionBar } from '../components/ConversionBar'

/** Premium theme. UX doc §2.3: "never more than one primary action on this
 * screen at a time" — the whole journey is one flowing dashboard, not a
 * tab bar to hunt across, which is truer to that principle than building
 * the spec's literal 3-item nav (My Lift/Payments/Support) would be for
 * an MVP this size. */
export function CustomerLayout() {
  return (
    <div data-theme="customer" className="min-h-dvh bg-surface-2 text-ink flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-dvh relative shadow-sm">
        <DemoRibbon />
        <CoinFeedback />
        <div className="pb-14">
          <Outlet />
        </div>
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
          <ConversionBar />
        </div>
      </div>
    </div>
  )
}
