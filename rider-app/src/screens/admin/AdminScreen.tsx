import { useState } from 'react'
import { RoleTopBar } from '../../components/RoleTopBar'
import { RiderMap } from '../../components/RiderMap'
import { useAiecStore } from '../../lib/store'
import { RIDER_START_POSITION } from '../../lib/mock'
import { selectAdminAlerts, type AdminAlert, type AlertKind } from '../../lib/adminAlerts'

const KIND_META: Record<AlertKind, { label: string; pill: string }> = {
  blocked: { label: 'डुप्लिकेट लीड', pill: 'bg-bad-surface text-bad' },
  appeal: { label: 'तंत्रज्ञ अपील', pill: 'bg-warn-surface text-warn' },
  qc_rework: { label: 'QC रिवर्क', pill: 'bg-warn-surface text-warn' },
  low_quality: { label: 'कमी गुणवत्ता', pill: 'bg-surface-3 text-ink-2' },
}

function decisionsFor(
  alert: AdminAlert,
  store: { resolveBlockedLead: (leadId: string, isDuplicate: boolean) => void; resolveAppeal: (appealId: string, uphold: boolean) => void },
): { label: string; commit: () => void }[] {
  switch (alert.kind) {
    case 'blocked':
      return [
        { label: 'डुप्लिकेट नाही — अनब्लॉक करा', commit: () => store.resolveBlockedLead(alert.refId, false) },
        { label: 'डुप्लिकेट आहे — बंद करा', commit: () => store.resolveBlockedLead(alert.refId, true) },
      ]
    case 'appeal':
      return [
        { label: 'अपील मंजूर — पायरी मंजूर करा', commit: () => store.resolveAppeal(alert.refId, true) },
        { label: 'अपील नाकारा — पुन्हा प्रयत्न आवश्यक', commit: () => store.resolveAppeal(alert.refId, false) },
      ]
    case 'qc_rework':
      return [
        { label: 'मान्य — कारवाई नोंदवली', commit: () => {} },
        { label: 'झोन मॅनेजरकडे वाढवा', commit: () => {} },
      ]
    case 'low_quality':
      return [
        { label: 'लीड मान्य करा', commit: () => {} },
        { label: 'रायडरला प्रशिक्षण नोट पाठवा', commit: () => {} },
      ]
  }
}

/** UX doc §3.17 AlertCard: fixed four-block order — what happened, what
 * the system already did, the evidence, the decision — so the layout
 * never moves between alert types. Every decision requires a written
 * reason before it commits. */
export function AdminScreen() {
  const leads = useAiecStore((s) => s.leads)
  const appeals = useAiecStore((s) => s.appeals)
  const inspections = useAiecStore((s) => s.inspections)
  const adminDecisions = useAiecStore((s) => s.adminDecisions)
  const resolveBlockedLead = useAiecStore((s) => s.resolveBlockedLead)
  const resolveAppeal = useAiecStore((s) => s.resolveAppeal)
  const recordAdminDecision = useAiecStore((s) => s.recordAdminDecision)
  const [reasons, setReasons] = useState<Record<string, string>>({})

  const alerts = selectAdminAlerts(leads, appeals, inspections, adminDecisions)

  const scrollToAlert = (leadId: string) => {
    const alert = alerts.find((a) => a.leadId === leadId)
    if (!alert) return
    document.getElementById(`alert-${alert.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div>
      <RoleTopBar title="अॅडमिन कंट्रोल" />

      <div className="px-4 pt-3">
        <RiderMap
          center={RIDER_START_POSITION}
          myPosition={{ ...RIDER_START_POSITION, accuracy: 50 }}
          leads={leads}
          opportunities={[]}
          onOpportunityClick={() => {}}
          onLeadClick={scrollToAlert}
          heightPx={200}
        />
      </div>

      <div className="px-4 pt-4 flex items-center justify-between">
        <p className="text-title font-extrabold">अलर्ट रांग</p>
        <span className="text-caption font-bold px-2.5 py-1 rounded-full bg-surface-3 text-ink" data-testid="alert-count">
          {alerts.length} प्रतीक्षेत
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="px-4 mt-8">
          <div className="rounded-2xl border border-black/10 p-6 text-center">
            <span className="text-4xl">🎉</span>
            <p className="text-body font-bold mt-2">रांग रिकामी आहे</p>
            <p className="text-caption text-ink-2 mt-1">सर्व अपवाद सोडवले गेले आहेत.</p>
          </div>
        </div>
      ) : (
        <div className="px-4 mt-3 space-y-3">
          {alerts.map((alert, i) => {
            const meta = KIND_META[alert.kind]
            const reason = reasons[alert.id] ?? ''
            const decisions = decisionsFor(alert, { resolveBlockedLead, resolveAppeal })
            return (
              <div
                key={alert.id}
                id={`alert-${alert.id}`}
                data-testid={`alert-${alert.id}`}
                className="rounded-2xl border border-black/10 p-4 bg-surface-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-ink-2 tnum">#{i + 1}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${meta.pill}`}>{meta.label}</span>
                </div>
                <p className="text-title font-extrabold mt-1.5">{alert.buildingName}</p>

                <div className="mt-3 space-y-2.5">
                  <div>
                    <p className="text-[11px] font-bold text-ink-2">काय घडले</p>
                    <p className="text-body mt-0.5">{alert.whatHappened}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-ink-2">सिस्टमने आधीच काय केले</p>
                    <p className="text-body mt-0.5">{alert.whatSystemDid}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-ink-2">पुरावा</p>
                    <div className="flex gap-2 items-start mt-1">
                      {alert.evidencePhoto && (
                        <img src={alert.evidencePhoto} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      )}
                      <ul className="text-caption text-ink-2 space-y-0.5">
                        {alert.evidenceLines.map((line, li) => (
                          <li key={li}>· {line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <textarea
                  value={reason}
                  onChange={(e) => setReasons((r) => ({ ...r, [alert.id]: e.target.value }))}
                  placeholder="निर्णयाचे कारण लिहा (अनिवार्य)"
                  className="mt-3 w-full text-caption rounded-lg border border-black/15 bg-transparent p-2 min-h-14"
                  data-testid={`reason-${alert.id}`}
                />

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {decisions.map((d) => (
                    <button
                      key={d.label}
                      disabled={reason.trim().length === 0}
                      onClick={() => {
                        d.commit()
                        recordAdminDecision(alert.id, d.label, reason.trim())
                        setReasons((r) => ({ ...r, [alert.id]: '' }))
                      }}
                      className="tap-target w-full rounded-xl bg-accent text-accent-ink font-bold text-[14px] disabled:opacity-30"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
