import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { CoinFeedback } from '../components/CoinFeedback'
import { ConversionBar } from '../components/ConversionBar'

/** Slate theme. UX doc §2.6: "Today · Jobs · SOP · Money · More" is the
 * real nav; this MVP folds it to two screens (Today, which is the one
 * that matters — "answers the only question that matters at 08:00" — and
 * Earnings) rather than building 5 tabs' worth of chrome. */
export function TechnicianLayout() {
  return (
    <div data-theme="technician" className="min-h-screen bg-surface-2 text-ink flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-screen relative shadow-sm">
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
