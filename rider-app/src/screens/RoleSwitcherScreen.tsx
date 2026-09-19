import { Link } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import { ROLES } from '../lib/roles'

/** PRD §6.2: "Try Demo → role grid → instant entry, no password/OTP/wait."
 * Six role changes in seven minutes, per the UX doc's RoleSwitcher spec —
 * this screen has to be reachable in one tap from anywhere and switch
 * with no loading state visible to the room. */
export function RoleSwitcherScreen() {
  return (
    <div className="min-h-screen bg-surface-2 flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-screen relative shadow-sm">
        <DemoRibbon />
        <div className="px-4 pt-5 pb-8">
          <h1 className="text-title-l font-extrabold">AIEC डेमो</h1>
          <p className="text-caption text-ink-2 mt-1">
            एक लीड — रायडरपासून हँडओव्हरपर्यंत. कोणतीही भूमिका निवडा आणि तोच प्रवास वेगळ्या नजरेतून पाहा.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {ROLES.map((r) => (
              <Link
                key={r.id}
                to={r.path}
                className="rounded-2xl border border-black/10 p-4 flex flex-col gap-2 active:opacity-80 relative"
              >
                {!r.live && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-warn-surface text-warn">
                    लवकरच
                  </span>
                )}
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <p className="text-body font-extrabold leading-tight">{r.label}</p>
                  <p className="text-[11px] text-ink-2 leading-tight mt-0.5">{r.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
