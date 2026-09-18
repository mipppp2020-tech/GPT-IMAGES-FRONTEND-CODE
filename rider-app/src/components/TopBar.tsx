import { Link } from 'react-router-dom'
import { useRiderStore } from '../lib/store'

export function TopBar({ back, title }: { back?: boolean; title?: string }) {
  const rider = useRiderStore((s) => s.rider)
  const online = useRiderStore((s) => s.online)

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-black/5 px-4 pt-3 pb-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <Link to=".." relative="path" className="tap-target -ml-2 flex items-center justify-center shrink-0" aria-label="मागे">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-accent text-accent-ink flex items-center justify-center font-extrabold shrink-0">
              A
            </div>
          )}
          <div className="min-w-0">
            {title ? (
              <p className="text-title font-extrabold truncate">{title}</p>
            ) : (
              <>
                <p className="text-caption text-ink-2 leading-tight">नमस्कार</p>
                <p className="text-body font-semibold leading-tight truncate">{rider.name}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!online && (
            <span className="text-[12px] font-semibold px-2 py-1 rounded-full bg-warn-surface text-warn whitespace-nowrap">
              ऑफलाइन
            </span>
          )}
          <div className="text-right">
            <p className="text-[11px] text-ink-2 leading-none">रायडर</p>
            <p className="text-[12px] font-semibold leading-none mt-0.5">लेव्हल {rider.level}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
