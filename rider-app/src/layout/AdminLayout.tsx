import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { CoinFeedback } from '../components/CoinFeedback'
import { ConversionBar } from '../components/ConversionBar'

/** Command, dark — "a dark console over a map full of blue and red pins"
 * (UX doc §0.4). */
export function AdminLayout() {
  return (
    <div data-theme="admin" className="min-h-screen bg-surface-2 text-ink flex justify-center">
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
