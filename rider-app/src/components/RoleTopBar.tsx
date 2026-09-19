import { Link } from 'react-router-dom'

/** The non-Rider equivalent of TopBar — that component is intentionally
 * bound to the rider's own profile/greeting, which doesn't make sense for
 * a Sales operator, a QC inspector, etc. Every other role shares this one:
 * brand mark, screen title, optional back, optional right-side slot. */
export function RoleTopBar({
  title,
  back,
  backTo,
  right,
}: {
  title: string
  back?: boolean
  backTo?: string
  right?: React.ReactNode
}) {
  return (
    <header className="sticky top-9 z-30 bg-surface border-b border-black/10 px-4 pt-3 pb-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <Link
              to={backTo ?? '..'}
              relative={backTo ? undefined : 'path'}
              className="tap-target -ml-2 flex items-center justify-center shrink-0"
              aria-label="मागे"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-accent text-accent-ink flex items-center justify-center font-extrabold shrink-0 text-[13px]">
              A
            </div>
          )}
          <p className="text-title font-extrabold truncate">{title}</p>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  )
}
