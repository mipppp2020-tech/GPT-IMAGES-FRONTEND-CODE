import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { CoinFeedback } from '../components/CoinFeedback'
import { DemoRibbon } from '../components/DemoRibbon'
import { ConversionBar } from '../components/ConversionBar'
import { useAiecStore } from '../lib/store'

export function AppLayout() {
  const setOnline = useAiecStore((s) => s.setOnline)
  const checkPendingVerifications = useAiecStore((s) => s.checkPendingVerifications)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    // Reconcile on mount too — a rider who captured offline and only reopens
    // the app after connectivity is already back would otherwise never fire
    // a live 'online' transition, and queued items would sit as "syncing"
    // forever. Network recovery must sync regardless of *when* it's noticed.
    if (navigator.onLine) setOnline(true)
    // Independent of connectivity: a capture's simulated verification is
    // purely time-based, so re-check it on every reopen too, not only on
    // an online transition (a rider backgrounding the app while online the
    // whole time still needs this, since the live setTimeout that would
    // normally fire this doesn't survive the reload).
    checkPendingVerifications()
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [setOnline, checkPendingVerifications])

  return (
    <div className="min-h-dvh bg-surface-2 flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-dvh relative shadow-sm">
        <DemoRibbon />
        <CoinFeedback />
        <div className="pb-36">
          <Outlet />
        </div>
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
          <ConversionBar />
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
