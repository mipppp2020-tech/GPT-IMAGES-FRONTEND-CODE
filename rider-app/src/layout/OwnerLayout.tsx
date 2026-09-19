import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { ConversionBar } from '../components/ConversionBar'

/** Executive — "dark, very large type, charts over tables, almost no
 * chrome" (UX doc §2.9). */
export function OwnerLayout() {
  return (
    <div data-theme="owner" className="min-h-dvh bg-surface-2 text-ink flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-dvh relative shadow-sm">
        <DemoRibbon />
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
