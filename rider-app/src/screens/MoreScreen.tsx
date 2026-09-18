import { TopBar } from '../components/TopBar'
import { useAiecStore } from '../lib/store'

const SCHEDULE = [
  { time: '07:45', task: 'राईड सुरू करा', done: true },
  { time: '08:00–11:00', task: 'बाणेर-औंध झोन स्वीप — लक्ष्य 5 लीड्स', done: true },
  { time: '11:00–11:20', task: 'ब्रेक', done: false },
  { time: '11:20–14:00', task: 'कोथरूड झोन स्वीप — लक्ष्य 3 लीड्स', done: false },
  { time: '18:00', task: 'राईड संपवा', done: false },
]

const LEADERBOARD = [
  { rank: 1, name: 'विजय शिंदे', leads: 34, me: false },
  { rank: 2, name: 'संदीप पाटील', leads: 28, me: true },
  { rank: 3, name: 'राहुल मोरे', leads: 24, me: false },
]

export function MoreScreen() {
  const rider = useAiecStore((s) => s.rider)

  return (
    <div>
      <TopBar />
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-4">
          <div className="w-16 h-16 rounded-full bg-ink/10 flex items-center justify-center text-2xl font-extrabold shrink-0">
            {rider.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-title font-extrabold truncate">{rider.name}</p>
            <p className="text-caption text-ink-2">रायडर · लेव्हल {rider.level} · {rider.zone}</p>
            {rider.verified && (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-good mt-1">
                ✓ सत्यापित वापरकर्ता
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-title font-extrabold mb-2">आजचे वेळापत्रक</h2>
        <p className="text-caption text-ink-2 mb-3">AI ने तुमच्यासाठी आजचा मार्ग तयार केला आहे</p>
        <div className="space-y-2">
          {SCHEDULE.map((s) => (
            <div key={s.time} className="flex items-center gap-3 rounded-xl border border-black/10 px-3.5 py-2.5">
              <span
                className={`w-3 h-3 rounded-full shrink-0 ${s.done ? 'bg-good' : 'bg-surface-2 border border-black/20'}`}
              />
              <div className="min-w-0">
                <p className="text-caption text-ink-2">{s.time}</p>
                <p className={`text-body font-semibold ${s.done ? 'line-through text-ink-2' : ''}`}>{s.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-title font-extrabold mb-1">लीडरबोर्ड — पुणे</h2>
        <p className="text-caption text-ink-2 mb-3">{rider.streakDays}-दिवसांची स्ट्रीक 🔥</p>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          {LEADERBOARD.map((r) => (
            <div
              key={r.rank}
              className={`flex items-center gap-3 px-3.5 py-3 ${r.me ? 'bg-accent/10' : ''} ${r.rank !== 3 ? 'border-b border-black/5' : ''}`}
            >
              <span className="w-7 text-body font-extrabold text-ink-2">#{r.rank}</span>
              <span className="flex-1 text-body font-semibold truncate">{r.name}{r.me && ' (तुम्ही)'}</span>
              <span className="text-body font-extrabold tnum">{r.leads} लीड्स</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6 mb-4 space-y-2.5">
        <MenuRow label="मदत व समर्थन" />
        <MenuRow label="अटी व शर्ती" />
        <button className="w-full flex items-center justify-between rounded-2xl border-2 border-bad/30 bg-bad-surface px-4 py-3.5 tap-target">
          <span className="text-body font-extrabold text-bad">🆘 SOS — तातडीची मदत</span>
        </button>
        <MenuRow label="लॉगआउट" danger />
      </div>
    </div>
  )
}

function MenuRow({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <button className="w-full flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3.5 tap-target">
      <span className={`text-body font-semibold ${danger ? 'text-bad' : ''}`}>{label}</span>
      <span className="text-ink-2">›</span>
    </button>
  )
}
