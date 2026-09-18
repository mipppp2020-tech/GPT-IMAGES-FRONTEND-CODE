import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'मुख्य स्क्रीन', icon: HomeIcon },
  { to: '/leads', label: 'माझे लीड्स', icon: ListIcon },
  { to: '/earnings', label: 'कमाई', icon: WalletIcon },
  { to: '/more', label: 'अधिक', icon: MoreIcon },
]

export function BottomNav() {
  return (
    <nav className="bg-surface border-t border-black/10 flex z-40 pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 tap-target ${
              isActive ? 'text-accent' : 'text-ink-2'
            }`
          }
        >
          <Icon />
          <span className="text-[13px] font-medium leading-none text-center">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 11 12 4l8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="15" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function WalletIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="6" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M14 12.5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
