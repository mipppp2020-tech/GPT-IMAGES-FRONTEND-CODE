import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { CoinFeedback } from '../components/CoinFeedback'
import { useRiderStore } from '../lib/store'

export function AppLayout() {
  const setOnline = useRiderStore((s) => s.setOnline)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [setOnline])

  return (
    <div className="min-h-dvh bg-surface-2 flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-dvh relative shadow-sm">
        <CoinFeedback />
        <div className="pb-24">
          <Outlet />
        </div>
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
