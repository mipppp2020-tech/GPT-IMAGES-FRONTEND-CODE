import { Link } from 'react-router-dom'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { formatINR } from '../../lib/selectors'

/** UX doc §2.2: "Ninety percent of this role is a bot." The pipeline is
 * what's left after the bot has already tried — every lead here is
 * `in_sales`, meaning WhatsApp + voice-bot qualification already ran
 * (PRD §9.2). This screen's job is just: which of these needs a human,
 * and how close is it to the 20% wall. */
export function SalesPipelineScreen() {
  const leads = useAiecStore((s) => s.leads)
  const salesWallet = useAiecStore((s) => s.salesWallet)
  const pipeline = leads.filter((l) => l.status === 'in_sales').sort((a, b) => b.qualityScore - a.qualityScore)
  const myEarnings = salesWallet.reduce((sum, w) => sum + w.amount, 0)

  return (
    <div>
      <RoleTopBar title="पाईपलाईन" />
      <div className="px-4 pt-4">
        <p className="text-caption text-ink-2">
          बॉटने आधीच वाटाघाटी केली आहे. इथे फक्त तेच सौदे आहेत ज्यांना माणसाची गरज आहे.
        </p>
      </div>

      <div className="mx-4 mt-4 rounded-2xl bg-ink text-white px-4 py-3.5">
        <p className="text-[11px] text-white/70">माझी एकूण कमाई — बंद केलेले सौदे</p>
        <p className="text-title-l font-extrabold tnum mt-0.5" style={{ color: 'var(--color-accent)' }}>
          ₹{formatINR(myEarnings)}
        </p>
        <p className="text-[11px] text-white/60 mt-0.5">{salesWallet.length} सौदे बंद केले</p>
      </div>

      <div className="px-4 mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <p className="text-[11px] text-ink-2">आजचे सौदे</p>
          <p className="text-title font-extrabold tnum">{pipeline.length}</p>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <p className="text-[11px] text-ink-2">संभाव्य मूल्य</p>
          <p className="text-title font-extrabold tnum">
            ₹{formatINR(pipeline.reduce((sum, l) => sum + Math.round((l.floors * 12000 + l.passengers * 18000 + 350000) * 1.23), 0))}
          </p>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-3">
        {pipeline.length === 0 ? (
          <p className="text-body text-ink-2 text-center py-10">
            सध्या कोणतेही सौदे प्रतीक्षेत नाहीत — नवीन लीड्स रायडरकडून येताच इथे दिसतील.
          </p>
        ) : (
          pipeline.map((l) => (
            <Link
              key={l.id}
              to={`/sales/${l.id}`}
              className="block rounded-2xl border border-black/10 p-3.5 active:opacity-80"
            >
              <div className="flex items-center justify-between">
                <p className="text-body font-extrabold truncate">{l.buildingName}</p>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-ink-2 shrink-0 ml-2">
                  स्कोअर {l.qualityScore}
                </span>
              </div>
              <p className="text-caption text-ink-2 mt-0.5">{l.address}</p>
              <p className="text-caption text-ink-2">
                {l.floors} मजले · {l.passengers} प्रवासी लिफ्ट
              </p>
              {l.aiTip && <p className="text-[12px] text-ink-2 mt-1.5 line-clamp-1">🤖 {l.aiTip}</p>}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
