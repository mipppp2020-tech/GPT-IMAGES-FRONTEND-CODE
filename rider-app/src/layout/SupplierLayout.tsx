import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { CoinFeedback } from '../components/CoinFeedback'
import { ConversionBar } from '../components/ConversionBar'

/** Command, warehouse variant — same light palette as Sales. UX doc §2.5:
 * "Order Board is home, not the map... the supplier's work is a queue,
 * not a territory." */
export function SupplierLayout() {
  return (
    <div data-theme="supplier" className="min-h-screen bg-surface-2 text-ink flex justify-center">
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
