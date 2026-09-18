import { Link } from 'react-router-dom'
import { DemoRibbon } from '../components/DemoRibbon'
import type { RoleId } from '../lib/roles'
import { roleById } from '../lib/roles'

const PRIMARY_JOB: Partial<Record<RoleId, string>> = {
  sales: 'लीड बंद करा — मार्जिन 20% च्या खाली कधीच जाणार नाही.',
  customer: 'तुमची लिफ्ट कुठे आहे, काय बाकी आहे, हे एका नजरेत पाहा.',
  technician: 'एक टप्पा पूर्ण करा, पुरावा द्या, कमवा — पडताळणी झाल्यावर लगेच.',
  qc: 'साईट किंवा इंस्टॉलेशन तपासा — पास इतकंच सोपं जितकं फेल.',
  supplier: 'किट पॅक करा, पाठवा — पेमेंट तारीख नेहमी दिसेल.',
  admin: 'अलर्ट रांग रिकामी ठेवा — एक निर्णय दर 90 सेकंदात.',
  owner: 'चार आकडे, दहा सेकंद — व्यवसाय चालतोय की नाही ते कळेल.',
  join: 'कमाई कॅल्क्युलेटर पाहा, 48 तासांत पहिली नोकरी मिळवा.',
}

/** Placeholder for a role whose phase hasn't landed yet — still themed and
 * ribboned correctly so the role grid never routes to something broken,
 * and each one gets replaced by its real screens exactly once, in its own
 * commit, per the build plan. */
export function RoleStubScreen({ role }: { role: RoleId }) {
  const meta = roleById(role)
  return (
    // `color` must be re-declared here, not just `--color-ink` redefined:
    // CSS custom properties cascade, but body's own `color: var(--color-ink)`
    // already resolved to the *root* Sunlight value and that resolved colour
    // is what plain inheritance passes to every descendant. Without an
    // explicit `text-ink` at this boundary, every themed screen's unstyled
    // text stays root-dark regardless of theme — invisible on a dark surface.
    <div data-theme={meta.theme ?? undefined} className="min-h-dvh bg-surface-2 text-ink flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-dvh relative shadow-sm">
        <DemoRibbon />
        <div className="px-4 pt-16 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">{meta.emoji}</span>
          <p className="text-title-l font-extrabold">{meta.label}</p>
          <p className="text-body text-ink-2 mt-2 max-w-xs">{PRIMARY_JOB[role]}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-full bg-warn-surface text-warn">
            🚧 हा भाग लवकरच तयार होत आहे
          </div>
          <Link
            to="/demo"
            className="mt-8 tap-target w-full rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l flex items-center justify-center"
          >
            भूमिका निवडीकडे परत जा
          </Link>
        </div>
      </div>
    </div>
  )
}
