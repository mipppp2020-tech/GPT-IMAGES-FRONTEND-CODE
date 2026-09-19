import { Outlet } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { CoinFeedback } from '../components/CoinFeedback'
import { ConversionBar } from '../components/ConversionBar'

/** Command-light theme. No bottom nav — per the UX doc, Sales Desk's home
 * IS the pipeline and everything else is one level deep from it, reached
 * by back-navigation rather than a persistent tab bar (matches the role
 * table: nav = "rail", a desktop pattern we simplify to back-nav on
 * mobile rather than inventing tabs the source doesn't call for). */
export function SalesLayout() {
  return (
    <div data-theme="sales" className="min-h-screen bg-surface-2 text-ink flex justify-center">
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
