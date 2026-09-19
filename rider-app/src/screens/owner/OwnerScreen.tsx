import { useState } from 'react'
import { RoleTopBar } from '../../components/RoleTopBar'
import { useAiecStore } from '../../lib/store'
import { computeCashPanel, computeGrowthPanel, computeSEI, computeStrategicAlerts } from '../../lib/ownerMetrics'
import { formatINR } from '../../lib/selectors'

/** UX doc §2.9: "Four numbers, ten seconds, standing up. If it can be
 * acted on today, it does not belong here." Fixed panel order — Cash,
 * Growth, SEI, Strategic Alerts — is itself the argument (§32), so it is
 * not configurable. Read-only, no counting animation on load (a moving
 * cash figure "makes it feel like a game" — the one surface where
 * numbers must feel like facts). */
export function OwnerScreen() {
  const leads = useAiecStore((s) => s.leads)
  const wallet = useAiecStore((s) => s.wallet)
  const salesWallet = useAiecStore((s) => s.salesWallet)
  const techWallet = useAiecStore((s) => s.techWallet)
  const qcWallet = useAiecStore((s) => s.qcWallet)
  const supplierWallet = useAiecStore((s) => s.supplierWallet)
  const techJobs = useAiecStore((s) => s.techJobs)
  const inspections = useAiecStore((s) => s.inspections)
  const adminDecisions = useAiecStore((s) => s.adminDecisions)
  const [showCashWhy, setShowCashWhy] = useState(false)
  const [showSeiWhy, setShowSeiWhy] = useState(false)

  const cash = computeCashPanel(leads, wallet, salesWallet, techWallet, qcWallet, supplierWallet)
  const zones = computeGrowthPanel(leads)
  const sei = computeSEI(wallet, salesWallet, techWallet, qcWallet, supplierWallet, adminDecisions, inspections)
  const alerts = computeStrategicAlerts(leads, techJobs, zones, sei)

  return (
    <div>
      <RoleTopBar title="ओनर डॅशबोर्ड" />

      {/* Panel 1 — Cash, Live */}
      <section className="px-4 pt-4" data-testid="panel-cash">
        <div className="flex items-center justify-between">
          <p className="text-caption font-bold text-ink-2 uppercase tracking-wide">आज — कॅश लाईव्ह</p>
          <button
            onClick={() => setShowCashWhy((v) => !v)}
            className="text-[11px] font-bold text-ink-2 underline underline-offset-2"
            data-testid="cash-why-toggle"
          >
            हे कसे मोजले जाते?
          </button>
        </div>
        {showCashWhy && (
          <div className="mt-2 rounded-xl border border-white/10 p-3 text-caption text-ink-2" data-testid="cash-why-panel">
            <p>एकूण इनफ्लो = टोकन (प्रत्येकी ₹10,000) + मटेरियल पेमेंट (ऑफरच्या 90%) + अंतिम पेमेंट — प्रत्येक ग्राहकाच्या पेमेंट टप्प्यांवरून थेट.</p>
            <p className="mt-1.5">सप्लायर पेआउट व वर्कर पेआउट = प्रत्येक भूमिकेच्या वॉलेटमधील "क्लिअर" नोंदींची बेरीज — कोणतीही अंदाजित संख्या नाही.</p>
            <p className="mt-1.5">NET MARGIN = एकूण इनफ्लो − सप्लायर पेआउट − वर्कर पेआउट.</p>
          </div>
        )}
        <div className="mt-2 space-y-1.5">
          <CashLine label={`टोकन जमा (${cash.tokensCount} सौदे)`} amount={cash.tokensAmount} />
          <CashLine label={`मटेरियल क्लिअर (${cash.materialCount} साईट्स)`} amount={cash.materialAmount} />
          <CashLine label={`अंतिम पेमेंट (${cash.finalCount} NOC)`} amount={cash.finalAmount} />
          <div className="border-t border-white/10 my-1.5" />
          <CashLine label="एकूण इनफ्लो" amount={cash.grossInflow} bold />
          <CashLine label="सप्लायर पेआउट" amount={-cash.supplierOut} />
          <CashLine label="वर्कर पेआउट" amount={-cash.workerPayouts} />
          <div className="border-t-2 border-white/20 my-1.5" />
          <div className="flex items-baseline justify-between">
            <span className="text-body-l font-extrabold">NET MARGIN</span>
            <span
              className={`text-title-l font-extrabold tnum ${cash.netMargin >= 0 ? 'text-good' : 'text-bad'}`}
              data-testid="net-margin-amount"
            >
              ₹{formatINR(cash.netMargin)}
            </span>
          </div>
          <p className="text-caption text-ink-2 text-right">({cash.netMarginPct}% निव्वळ मार्जिन)</p>
        </div>
      </section>

      {/* Panel 2 — Growth (zone table, MVP cut of the full heatmap) */}
      <section className="px-4 pt-6" data-testid="panel-growth">
        <p className="text-caption font-bold text-ink-2 uppercase tracking-wide">वाढ — झोननुसार</p>
        <div className="mt-2 rounded-xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-surface-2 text-[11px] font-bold text-ink-2">
            <span>झोन</span>
            <span className="text-right">लीड्स</span>
            <span className="text-right">कन्व्हर्जन</span>
            <span className="text-right">सरासरी डील</span>
          </div>
          {zones.slice(0, 6).map((z) => (
            <div key={z.zone} data-testid={`zone-${z.zone}`} className="grid grid-cols-4 gap-2 px-3 py-2 border-t border-white/5 text-body">
              <span className="font-semibold truncate">{z.zone}</span>
              <span className="text-right tnum">{z.leadCount}</span>
              <span className="text-right tnum">{z.conversionPct}%</span>
              <span className="text-right tnum">{z.avgDealValue > 0 ? `₹${formatINR(z.avgDealValue)}` : '—'}</span>
            </div>
          ))}
        </div>
        <p className="text-caption text-ink-2 mt-1.5">हे पॅनल पुढील शहर/झोन डेटावरून ठरवते, अंदाजाने नाही.</p>
      </section>

      {/* Panel 3 — System Efficiency Index, deliberately the largest number on screen */}
      <section className="px-4 pt-7" data-testid="panel-sei">
        <div className="flex items-center justify-between">
          <p className="text-caption font-bold text-ink-2 uppercase tracking-wide">System Efficiency Index</p>
          <button
            onClick={() => setShowSeiWhy((v) => !v)}
            className="text-[11px] font-bold text-ink-2 underline underline-offset-2"
            data-testid="sei-why-toggle"
          >
            हे कसे मोजले जाते?
          </button>
        </div>
        <p className="text-7xl font-extrabold tnum mt-1 leading-none" data-testid="sei-number">
          {sei.automatedPct}%
        </p>
        <p className="text-caption text-ink-2 mt-2">लक्ष्य: ≥95% स्वयंचलित स्टेट ट्रान्झिशन्स</p>

        {showSeiWhy && (
          <div className="mt-3 rounded-xl border border-white/10 p-3 text-caption text-ink-2" data-testid="sei-why-panel">
            <p>
              महसूल खर्च करून मिळवता येतो. कार्यक्षमता मिळवता येत नाही — हा आकडा आधी बघा, महसूल नंतर.
            </p>
            <p className="mt-1.5">
              प्रत्येक वॉलेट नोंद (रायडर + तंत्रज्ञ + QC + सप्लायर) एक स्वयंचलित ट्रान्झिशन आहे; प्रत्येक अॅडमिन निर्णय (लिखित
              कारणासह) एक मानवी हस्तक्षेप आहे. % = स्वयंचलित ÷ (स्वयंचलित + मानवी).
            </p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <SeiRow label="मानवी हस्तक्षेप (आजपर्यंत)" value={String(sei.humanInterventions)} ok={sei.humanInterventions < 20} />
          <SeiRow
            label="AI/पुरावा अचूकता"
            value={sei.aiEvidenceAccuracyPct !== null ? `${sei.aiEvidenceAccuracyPct}%` : '— अजून डेटा नाही'}
            ok={sei.aiEvidenceAccuracyPct === null || sei.aiEvidenceAccuracyPct >= 95}
          />
          <SeiRow
            label="रिवर्क दर"
            value={sei.reworkRatePct !== null ? `${sei.reworkRatePct}%` : '— अजून डेटा नाही'}
            ok={sei.reworkRatePct === null || sei.reworkRatePct <= 5}
          />
        </div>

        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <p className="text-caption text-ink">{sei.biggestDrag}</p>
        </div>
      </section>

      {/* Panel 4 — Strategic Alerts, weekly, never daily */}
      <section className="px-4 pt-7 pb-8" data-testid="panel-alerts">
        <p className="text-caption font-bold text-ink-2 uppercase tracking-wide">धोरणात्मक इशारे — साप्ताहिक</p>
        {alerts.length === 0 ? (
          <p className="text-body text-ink-2 mt-2">या आठवड्यात कोणतेही मोठे धोरणात्मक इशारे नाहीत.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {alerts.map((a) => (
              <div key={a.label} className="rounded-xl border border-white/10 p-3 flex gap-2.5">
                <span className="text-xl shrink-0">{a.icon}</span>
                <div className="min-w-0">
                  <p className="text-body font-bold">{a.label}</p>
                  <p className="text-caption text-ink-2 mt-0.5">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function CashLine({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) {
  const negative = amount < 0
  return (
    <div className="flex items-baseline justify-between">
      <span className={`text-body ${bold ? 'font-extrabold' : 'text-ink-2'}`}>{label}</span>
      <span className={`text-body tnum ${bold ? 'font-extrabold' : 'font-semibold'} ${negative ? 'text-bad' : ''}`}>
        {negative ? '−' : ''}₹{formatINR(Math.abs(amount))}
      </span>
    </div>
  )
}

function SeiRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-body text-ink-2">{label}</span>
      <span className={`text-body font-bold tnum ${ok ? 'text-good' : 'text-bad'}`}>
        {value} {ok ? '✅' : '⚠️'}
      </span>
    </div>
  )
}
