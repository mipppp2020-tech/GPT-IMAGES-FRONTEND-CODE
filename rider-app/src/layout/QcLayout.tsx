import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { ConversionBar } from '../components/ConversionBar'

/** Slate, judicial variant — same dark palette as Technician (both are
 * "same shafts, arriving cold" per the UX doc), but the checklist itself
 * is built to feel like a bench, not a toolbox. */
export function QcLayout() {
  return (
    <div data-theme="qc" className="min-h-dvh bg-surface-2 text-ink flex justify-center">
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
