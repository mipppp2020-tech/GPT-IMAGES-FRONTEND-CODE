import type { Lead, WalletEntry, Inspection, AdminDecision, TechJob } from './types'

const TOKEN_AMOUNT = 10000 // matches CustomerDashboardScreen's fixed token amount

function materialAmount(lead: Lead) {
  return lead.quote ? Math.round(lead.quote.currentOffer * 0.9) : 0
}
function finalAmount(lead: Lead) {
  return lead.quote ? Math.round(lead.quote.currentOffer * 0.1 - TOKEN_AMOUNT) : 0
}

export interface CashPanel {
  tokensAmount: number
  tokensCount: number
  materialAmount: number
  materialCount: number
  finalAmount: number
  finalCount: number
  grossInflow: number
  supplierOut: number
  workerPayouts: number
  netMargin: number
  netMarginPct: number
}

/** PRD §32.1, same shape as the worked example — computed from the exact
 * payment amounts every Customer screen already shows, not invented
 * figures. */
export function computeCashPanel(leads: Lead[], wallet: WalletEntry[], techWallet: WalletEntry[], qcWallet: WalletEntry[], supplierWallet: WalletEntry[]): CashPanel {
  const tokenLeads = leads.filter((l) => l.payments?.token)
  const materialLeads = leads.filter((l) => l.payments?.material90)
  const finalLeads = leads.filter((l) => l.payments?.final)

  const tokensAmount = tokenLeads.length * TOKEN_AMOUNT
  const materialTotal = materialLeads.reduce((sum, l) => sum + materialAmount(l), 0)
  const finalTotal = finalLeads.reduce((sum, l) => sum + finalAmount(l), 0)
  const grossInflow = tokensAmount + materialTotal + finalTotal

  const supplierOut = supplierWallet.filter((w) => w.state === 'cleared').reduce((s, w) => s + w.amount, 0)
  const workerPayouts = [...wallet, ...techWallet, ...qcWallet]
    .filter((w) => w.state === 'cleared')
    .reduce((s, w) => s + w.amount, 0)

  const netMargin = grossInflow - supplierOut - workerPayouts
  return {
    tokensAmount,
    tokensCount: tokenLeads.length,
    materialAmount: materialTotal,
    materialCount: materialLeads.length,
    finalAmount: finalTotal,
    finalCount: finalLeads.length,
    grossInflow,
    supplierOut,
    workerPayouts,
    netMargin,
    netMarginPct: grossInflow > 0 ? Math.round((netMargin / grossInflow) * 1000) / 10 : 0,
  }
}

export interface ZoneRow {
  zone: string
  leadCount: number
  wonCount: number
  conversionPct: number
  avgDealValue: number
}

/** PRD §32.2, compressed to a zone table per the phase plan's MVP cut —
 * "simple zone table, not a full heatmap." Drillable state→city→ward is
 * out of scope; this is the one level that exists in our seed geography. */
export function computeGrowthPanel(leads: Lead[]): ZoneRow[] {
  const byZone = new Map<string, Lead[]>()
  for (const l of leads) {
    const arr = byZone.get(l.zone) ?? []
    arr.push(l)
    byZone.set(l.zone, arr)
  }
  const rows: ZoneRow[] = []
  for (const [zone, zoneLeads] of byZone) {
    const won = zoneLeads.filter((l) => l.status !== 'new' && l.status !== 'in_sales' && l.status !== 'lost' && l.status !== 'blocked')
    const withQuote = zoneLeads.filter((l) => l.quote)
    const avg = withQuote.length > 0 ? Math.round(withQuote.reduce((s, l) => s + (l.quote?.currentOffer ?? 0), 0) / withQuote.length) : 0
    rows.push({
      zone,
      leadCount: zoneLeads.length,
      wonCount: won.length,
      conversionPct: zoneLeads.length > 0 ? Math.round((won.length / zoneLeads.length) * 100) : 0,
      avgDealValue: avg,
    })
  }
  return rows.sort((a, b) => b.leadCount - a.leadCount)
}

export interface SeiPanel {
  automatedPct: number
  humanInterventions: number
  aiEvidenceAccuracyPct: number | null
  reworkRatePct: number | null
  biggestDrag: string
}

/** PRD §32.3 — "the single most important number." Automated % is the
 * share of every real, wallet-recorded transition that happened without
 * an Admin decision: every wallet entry across all four role ledgers is
 * a system-driven state change; every entry in adminDecisions (Admin
 * screen logs one per alert resolved, of every kind) required a human's
 * written reason. Admin-hours/SLA-adherence are declared MVP cuts — this
 * demo has no reliable wall-clock work-time signal to compute them
 * honestly, so they're left out rather than invented. */
export function computeSEI(
  wallet: WalletEntry[],
  techWallet: WalletEntry[],
  qcWallet: WalletEntry[],
  supplierWallet: WalletEntry[],
  adminDecisions: AdminDecision[],
  inspections: Inspection[],
): SeiPanel {
  const automatedEvents = wallet.length + techWallet.length + qcWallet.length + supplierWallet.length
  const humanInterventions = adminDecisions.length
  const totalEvents = automatedEvents + humanInterventions
  const automatedPct = totalEvents > 0 ? Math.round((automatedEvents / totalEvents) * 1000) / 10 : 100

  const allQcItems = inspections.flatMap((i) => i.items).filter((it) => it.verdict !== null)
  const aiEvidenceAccuracyPct =
    allQcItems.length > 0 ? Math.round((allQcItems.filter((it) => it.verdict === 'pass').length / allQcItems.length) * 1000) / 10 : null

  const signedInspections = inspections.filter((i) => i.result !== null)
  const reworkRatePct =
    signedInspections.length > 0
      ? Math.round((signedInspections.filter((i) => i.result === 'rework').length / signedInspections.length) * 1000) / 10
      : null

  const kindCounts = new Map<string, number>()
  for (const d of adminDecisions) {
    const kind = d.alertId.split(':')[0]
    kindCounts.set(kind, (kindCounts.get(kind) ?? 0) + 1)
  }
  let biggestDrag = 'सध्या कोणताही मोठा अडथळा नाही — सिस्टम स्वतःहून चालत आहे.'
  let topKind: string | null = null
  let topCount = 0
  for (const [kind, count] of kindCounts) {
    if (count > topCount) {
      topKind = kind
      topCount = count
    }
  }
  const DRAG_COPY: Record<string, string> = {
    blocked: 'सर्वात मोठा अडथळा: डुप्लिकेट-लीड ब्लॉक्स → रायडर कॅप्चर झोनमध्ये GPS अचूकतेचे प्रशिक्षण द्या.',
    appeal: 'सर्वात मोठा अडथळा: तंत्रज्ञ अपील्स → SOP पायरी पडताळणीचा GPS अचूकता उंबरठा सैल करण्याचा विचार करा.',
    qc_rework: 'सर्वात मोठा अडथळा: QC रिवर्क → शाफ्ट-तयारी पूर्ण होण्याआधी घाईने तपासणी बोलावली जात आहे.',
    low_quality: 'सर्वात मोठा अडथळा: कमी-गुणवत्तेचे कॅप्चर → नवीन रायडर्ससाठी फोटो-गुणवत्ता प्रशिक्षण गरजेचे.',
  }
  if (topKind && DRAG_COPY[topKind]) biggestDrag = DRAG_COPY[topKind]

  return { automatedPct, humanInterventions, aiEvidenceAccuracyPct, reworkRatePct, biggestDrag }
}

export interface StrategicAlert {
  icon: string
  label: string
  detail: string
}

/** PRD §32.4 — "weekly, not daily: things that change decisions." Every
 * line here is derived from real state (no external market/competitor
 * data exists in this MVP, so those source-example alert types are a
 * declared cut rather than fabricated numbers). */
export function computeStrategicAlerts(leads: Lead[], techJobs: TechJob[], zones: ZoneRow[], sei: SeiPanel): StrategicAlert[] {
  const alerts: StrategicAlert[] = []

  const installingLeads = leads.filter((l) => l.status === 'installing')
  const activeJobLeadIds = new Set(techJobs.filter((j) => j.stage !== 'done').map((j) => j.leadId))
  const unstaffed = installingLeads.filter((l) => !activeJobLeadIds.has(l.id))
  if (unstaffed.length > 0) {
    alerts.push({
      icon: '👷',
      label: 'तंत्रज्ञ क्षमता तणावाखाली',
      detail: `${unstaffed.length} साईट मटेरियल पोहोचून तंत्रज्ञाच्या प्रतीक्षेत — पुढील भरतीपूर्वीचा इशारा.`,
    })
  }

  const blockedLeads = leads.filter((l) => l.status === 'blocked')
  if (blockedLeads.length > 0) {
    alerts.push({
      icon: '🚧',
      label: 'न सोडवलेल्या डुप्लिकेट लीड्स',
      detail: `${blockedLeads.length} लीड अजूनही ब्लॉक — दोन्ही रायडर्सचे कमिशन थांबलेले आहे.`,
    })
  }

  if (sei.reworkRatePct !== null && sei.reworkRatePct > 0) {
    alerts.push({
      icon: '🔁',
      label: 'QC रिवर्क दर',
      detail: `${sei.reworkRatePct}% तपासण्या रिवर्कमध्ये गेल्या — पहिल्याच फेरीत पास होण्याचे प्रशिक्षण तपासा.`,
    })
  }

  const topZone = zones[0]
  if (topZone && topZone.leadCount >= 2) {
    alerts.push({
      icon: '📈',
      label: 'विस्तारासाठी सर्वोत्तम झोन',
      detail: `${topZone.zone} — ${topZone.leadCount} लीड्स, ${topZone.conversionPct}% कन्व्हर्जन. पुढील रायडर भरती इथे केंद्रित करा.`,
    })
  }

  return alerts.slice(0, 4)
}
