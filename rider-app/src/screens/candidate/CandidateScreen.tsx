import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAiecStore } from '../../lib/store'
import { nextWalletId } from '../../lib/ids'
import { jobTotalValue } from '../../lib/sop'
import { formatINR } from '../../lib/selectors'

type Step = 'calculator' | 'eligibility' | 'skills' | 'safety' | 'safety-fail' | 'kyc' | 'training' | 'first-job'

const SPINE: { key: Step | 'calculator'; label: string }[] = [
  { key: 'eligibility', label: 'पात्रता' },
  { key: 'skills', label: 'कौशल्य' },
  { key: 'safety', label: 'सुरक्षा' },
  { key: 'kyc', label: 'KYC' },
  { key: 'training', label: 'प्रशिक्षण' },
  { key: 'first-job', label: 'पहिला जॉब' },
]

const TRAINING_MODULES = [
  { id: 'mod-safety', title: 'साईट सुरक्षा मूलतत्त्वे', minutes: 12 },
  { id: 'mod-tools', title: 'साधने व उपकरणे ओळख', minutes: 15 },
  { id: 'mod-evidence', title: 'पुरावा-फोटो कसा घ्यावा', minutes: 8 },
]
const MODULE_CREDIT = 50

/** UX doc §2.7: "a calculator, not a form." The earnings number is shown
 * before any signup step, and the source is explicit about the one thing
 * that breaks this screen — showing a top-performer number instead of an
 * honest median — so the calculator below is built off the same real
 * per-job value SOP_TEMPLATE pays a technician (sop.ts), not an invented
 * headline figure. */
export function CandidateScreen() {
  const navigate = useNavigate()
  const addTechWalletEntry = useAiecStore((s) => s.addTechWalletEntry)
  const techWallet = useAiecStore((s) => s.techWallet)

  const [step, setStep] = useState<Step>('calculator')
  const [jobsPerMonth, setJobsPerMonth] = useState(2)
  const [eligible, setEligible] = useState({ age: false, id: false, tools: false })
  const [skillAnswers, setSkillAnswers] = useState<Record<number, boolean>>({})
  const [completedModules, setCompletedModules] = useState<string[]>([])

  const perJob = jobTotalValue()
  const monthlyEstimate = perJob * jobsPerMonth

  const earnedSoFar = completedModules.length * MODULE_CREDIT

  const completeModule = (id: string) => {
    if (completedModules.includes(id)) return
    setCompletedModules((m) => [...m, id])
    addTechWalletEntry({
      id: nextWalletId(),
      amount: MODULE_CREDIT,
      label: 'प्रशिक्षण मॉड्यूल पूर्ण',
      cause: TRAINING_MODULES.find((m) => m.id === id)?.title ?? id,
      consequence: 'तुमच्या तंत्रज्ञ वॉलेटमध्ये जमा — पहिल्या जॉबआधीच',
      state: 'cleared',
      createdAt: Date.now(),
    })
  }

  if (step === 'safety-fail') {
    return (
      <div className="px-4 pt-10 text-center">
        <span className="text-5xl">🛑</span>
        <p className="text-title-l font-extrabold mt-4">नोंदणी इथेच थांबते</p>
        <p className="text-body text-ink-2 mt-3 max-w-xs mx-auto">
          हार्नेसशिवाय उंचीवर काम करणे कधीही मान्य नाही — हा नियम तडजोड करण्यायोग्य नाही आणि प्रत्येक तंत्रज्ञासाठी सारखाच लागू होतो.
        </p>
        <button
          onClick={() => navigate('/demo')}
          className="mt-8 tap-target w-full rounded-2xl bg-ink text-white font-extrabold text-body-l"
        >
          मुख्य पानावर परत जा
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 pt-4">
        <h1 className="text-title-l font-extrabold leading-tight">AIEC मध्ये सामील व्हा</h1>
        <p className="text-caption text-ink-2 mt-0.5">तंत्रज्ञ म्हणून कमवायला सुरुवात करा — फॉर्म नाही, आधी कॅल्क्युलेटर.</p>
      </div>

      <Spine current={step} />

      {step === 'calculator' && (
        <div className="px-4 pt-2">
          <div className="rounded-2xl border border-black/10 p-5 text-center">
            <p className="text-caption font-bold text-ink-2">सरासरी अंदाज (टॉप कमावणारा नाही)</p>
            <p className="text-display font-extrabold tnum mt-1" style={{ color: 'var(--color-accent)' }}>
              ₹{formatINR(monthlyEstimate)}
            </p>
            <p className="text-caption text-ink-2 mt-1">दरमहा, {jobsPerMonth} जॉब्सवर आधारित</p>

            <div className="mt-5" role="group" aria-label="दर महिन्याला जॉब्स">
              <div className="flex items-center gap-3 justify-center">
                <button
                  type="button"
                  aria-label="जॉब्स कमी करा"
                  onClick={() => setJobsPerMonth((n) => Math.max(1, n - 1))}
                  className="tap-target w-12 rounded-xl bg-surface-2 text-title font-extrabold"
                >
                  −
                </button>
                <span className="text-title font-extrabold tnum w-16 text-center">{jobsPerMonth} जॉब्स</span>
                <button
                  type="button"
                  aria-label="जॉब्स वाढवा"
                  onClick={() => setJobsPerMonth((n) => Math.min(4, n + 1))}
                  className="tap-target w-12 rounded-xl bg-surface-2 text-title font-extrabold"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-ink-2 mt-2">प्रति जॉब ₹{formatINR(perJob)} — प्रत्येक पडताळलेल्या टप्प्यासाठी वेगळे पेमेंट.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <AspirationalCard emoji="🏗️" text="राज्यभर 40+ साईट्स" />
            <AspirationalCard emoji="⏱️" text="दर पायरीला 3 सेकंदात पैसे" />
            <AspirationalCard emoji="📈" text="L1 ते L5 पर्यंत वाढ" />
          </div>

          <button
            onClick={() => setStep('eligibility')}
            className="mt-5 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            पुढे चला
          </button>
        </div>
      )}

      {step === 'eligibility' && (
        <div className="px-4 pt-2">
          <p className="text-body font-bold mb-3">पात्रता तपासा</p>
          <div className="space-y-2.5">
            <EligibilityRow
              label="मी 18 वर्षे किंवा त्याहून मोठा आहे"
              checked={eligible.age}
              onToggle={() => setEligible((e) => ({ ...e, age: !e.age }))}
            />
            <EligibilityRow
              label="माझ्याकडे वैध ओळखपत्र आहे"
              checked={eligible.id}
              onToggle={() => setEligible((e) => ({ ...e, id: !e.id }))}
            />
            <EligibilityRow
              label="माझ्याकडे मूलभूत साधने आहेत (किंवा घेण्यास तयार आहे)"
              checked={eligible.tools}
              onToggle={() => setEligible((e) => ({ ...e, tools: !e.tools }))}
            />
          </div>
          <button
            disabled={!eligible.age || !eligible.id || !eligible.tools}
            onClick={() => setStep('skills')}
            className="mt-5 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l disabled:opacity-30"
          >
            पुढे चला
          </button>
        </div>
      )}

      {step === 'skills' && (
        <SkillsTest
          answers={skillAnswers}
          onAnswer={(i, correct) => setSkillAnswers((a) => ({ ...a, [i]: correct }))}
          onDone={() => setStep('safety')}
        />
      )}

      {step === 'safety' && (
        <div className="px-4 pt-4">
          <p className="text-body font-bold mb-1">सुरक्षा तपासणी</p>
          <p className="text-caption text-ink-2 mb-4">हा नियम तडजोड करण्यायोग्य नाही — प्रत्येक तंत्रज्ञासाठी सारखाच लागू होतो.</p>
          <div className="rounded-2xl border border-black/10 p-4 text-center">
            <span className="text-3xl">🪢</span>
            <p className="text-body-l font-bold mt-2">हार्नेसशिवाय उंचीवर काम करणे योग्य आहे का?</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep('safety-fail')}
                className="flex-1 tap-target rounded-xl border-2 border-black/15 font-bold text-body-l"
              >
                होय
              </button>
              <button
                onClick={() => setStep('kyc')}
                className="flex-1 tap-target rounded-xl bg-good text-white font-bold text-body-l"
              >
                नाही
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'kyc' && (
        <div className="px-4 pt-6 text-center">
          <span className="text-4xl">🪪</span>
          <p className="text-title font-extrabold mt-3">ओळख पडताळणी</p>
          <p className="text-body text-ink-2 mt-2">डेमोसाठी एका टॅपमध्ये सत्यापित होते.</p>
          <button
            onClick={() => setStep('training')}
            className="mt-6 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            आधार सत्यापित करा (डेमो)
          </button>
        </div>
      )}

      {step === 'training' && (
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-body font-bold">प्रशिक्षण मॉड्यूल्स</p>
            <span className="text-caption font-bold tnum" style={{ color: 'var(--color-accent)' }}>
              ₹{formatINR(earnedSoFar)} जमा
            </span>
          </div>
          <p className="text-caption text-ink-2 mb-3">प्रत्येक मॉड्यूल पूर्ण केल्यावर लगेच ₹{MODULE_CREDIT} तुमच्या वॉलेटमध्ये — पहिल्या जॉबआधीच खरे पैसे.</p>
          <div className="space-y-2.5">
            {TRAINING_MODULES.map((m) => {
              const done = completedModules.includes(m.id)
              return (
                <div key={m.id} className={`rounded-2xl border p-3.5 flex items-center gap-3 ${done ? 'border-good/40 bg-good-surface' : 'border-black/10'}`}>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-extrabold ${done ? 'bg-good text-white' : 'bg-surface-2 text-ink-2'}`}>
                    {done ? '✓' : '▶'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-bold">{m.title}</p>
                    <p className="text-caption text-ink-2">{m.minutes} मिनिटे</p>
                  </div>
                  {!done && (
                    <button
                      onClick={() => completeModule(m.id)}
                      className="tap-target rounded-xl bg-accent text-accent-ink font-bold text-[13px] px-3 shrink-0"
                    >
                      पूर्ण करा — ₹{MODULE_CREDIT}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {completedModules.length === TRAINING_MODULES.length && (
            <button
              onClick={() => setStep('first-job')}
              className="mt-5 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
            >
              पुढे चला
            </button>
          )}
        </div>
      )}

      {step === 'first-job' && (
        <div className="px-4 pt-8 text-center">
          <span className="text-5xl">🎉</span>
          <p className="text-title-l font-extrabold mt-3">तयार आहात!</p>
          <p className="text-body text-ink-2 mt-2 max-w-xs mx-auto">
            तुमच्या तंत्रज्ञ वॉलेटमध्ये पहिल्या जॉबआधीच ₹{formatINR(techWallet.filter((w) => w.state === 'cleared').reduce((s, w) => s + w.amount, 0))} जमा आहेत.
          </p>
          <button
            onClick={() => navigate('/technician')}
            className="mt-6 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l"
          >
            पहिला जॉब पाहा
          </button>
        </div>
      )}
    </div>
  )
}

function Spine({ current }: { current: Step }) {
  if (current === 'safety-fail') return null
  const activeIndex = current === 'calculator' ? -1 : SPINE.findIndex((s) => s.key === current)
  return (
    <div className="px-4 pt-3 flex items-center gap-1" data-testid="candidate-spine">
      {SPINE.map((s, i) => (
        <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`h-1.5 w-full rounded-full ${i <= activeIndex ? 'bg-accent' : 'bg-surface-2'}`}
            data-testid={`spine-bar-${s.key}`}
            data-active={i === activeIndex ? 'true' : i < activeIndex ? 'done' : 'false'}
          />
          <span className={`text-[9px] font-bold text-center leading-tight ${i === activeIndex ? 'text-ink' : 'text-ink-2'}`}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function AspirationalCard({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3 text-center">
      <span className="text-xl">{emoji}</span>
      <p className="text-[11px] font-semibold text-ink-2 mt-1 leading-tight">{text}</p>
    </div>
  )
}

function EligibilityRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-2xl border p-3.5 flex items-center gap-3 ${checked ? 'border-good/40 bg-good-surface' : 'border-black/10'}`}
    >
      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[13px] ${checked ? 'bg-good text-white' : 'bg-surface-2 text-ink-2'}`}>
        {checked ? '✓' : ''}
      </span>
      <span className="text-body flex-1">{label}</span>
    </button>
  )
}

const SKILL_QUESTIONS = [
  { prompt: 'साईटवर प्रवेश करताना कोणते उपकरण आधी घालावे?', options: [{ emoji: '🪖', label: 'हेल्मेट', correct: true }, { emoji: '🩴', label: 'चप्पल', correct: false }] },
  { prompt: 'शाफ्टमध्ये काम करण्याआधी काय आवश्यक आहे?', options: [{ emoji: '📱', label: 'फोन', correct: false }, { emoji: '🚧', label: 'बॅरिकेड', correct: true }] },
]

function SkillsTest({ answers, onAnswer, onDone }: { answers: Record<number, boolean>; onAnswer: (i: number, correct: boolean) => void; onDone: () => void }) {
  const allAnswered = SKILL_QUESTIONS.every((_, i) => i in answers)
  return (
    <div className="px-4 pt-2">
      <p className="text-body font-bold mb-1">कौशल्य चाचणी — फक्त चित्रे, वाचन नाही</p>
      <p className="text-caption text-ink-2 mb-3">योग्य पर्यायावर टॅप करा.</p>
      <div className="space-y-4">
        {SKILL_QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-2xl border border-black/10 p-3.5">
            <p className="text-body font-semibold mb-3">{q.prompt}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {q.options.map((opt) => {
                const isAnswered = i in answers
                const selected = isAnswered && opt.correct === answers[i]
                return (
                  <button
                    key={opt.label}
                    disabled={isAnswered}
                    onClick={() => onAnswer(i, opt.correct)}
                    className={`rounded-xl p-4 flex flex-col items-center gap-1.5 border-2 ${selected && opt.correct ? 'border-good bg-good-surface' : 'border-black/10'}`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-caption font-semibold">{opt.label}</span>
                    {selected && <span className="text-[11px] font-bold text-good">✓ योग्य!</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {allAnswered && (
        <button onClick={onDone} className="mt-5 w-full tap-target rounded-2xl bg-accent text-accent-ink font-extrabold text-body-l">
          पुढे चला
        </button>
      )}
    </div>
  )
}
