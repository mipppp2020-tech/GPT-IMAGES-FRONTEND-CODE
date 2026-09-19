import type { Lead, Inspection, AdminDecision } from './types'
import type { Appeal } from './store'

export type AlertKind = 'blocked' | 'appeal' | 'qc_rework' | 'low_quality'

export interface AdminAlert {
  id: string
  kind: AlertKind
  refId: string
  leadId: string
  buildingName: string
  lat: number
  lng: number
  createdAt: number
  whatHappened: string
  whatSystemDid: string
  evidencePhoto: string | null
  evidenceLines: string[]
}

/** UX doc §3.17: the Admin's alerts are sourced entirely from exceptions
 * already producible by existing state — a blocked/duplicate lead, a
 * pending appeal, a QC fail sent to rework, a low-quality capture — not a
 * separate incident-reporting system. */
export function selectAdminAlerts(
  leads: Lead[],
  appeals: Appeal[],
  inspections: Inspection[],
  decisions: AdminDecision[],
): AdminAlert[] {
  const decided = new Set(decisions.map((d) => d.alertId))
  const alerts: AdminAlert[] = []

  for (const lead of leads) {
    if (lead.status !== 'blocked') continue
    const id = `blocked:${lead.id}`
    if (decided.has(id)) continue
    alerts.push({
      id,
      kind: 'blocked',
      refId: lead.id,
      leadId: lead.id,
      buildingName: lead.buildingName,
      lat: lead.lat,
      lng: lead.lng,
      createdAt: lead.createdAt,
      whatHappened: `${lead.buildingName} — दुसऱ्या रायडरच्या लीडपासून 50 मीटरच्या आत सापडली, संभाव्य डुप्लिकेट सबमिशन.`,
      whatSystemDid: 'लीड आपोआप ब्लॉक केली, दोन्ही रायडर्सचे पेआउट थांबवले, सेल्स फनेलमधून बाहेर ठेवली.',
      evidencePhoto: lead.photos.building,
      evidenceLines: [`पत्ता: ${lead.address}`, lead.note || 'अतिरिक्त नोंद नाही'],
    })
  }

  for (const a of appeals) {
    if (a.resolved) continue
    const id = `appeal:${a.id}`
    if (decided.has(id)) continue
    const lead = leads.find((l) => l.id === a.leadId)
    alerts.push({
      id,
      kind: 'appeal',
      refId: a.id,
      leadId: a.leadId,
      buildingName: lead?.buildingName ?? a.leadId,
      lat: lead?.lat ?? 0,
      lng: lead?.lng ?? 0,
      createdAt: a.createdAt,
      whatHappened: `${lead?.buildingName ?? a.leadId} — एक SOP पायरी 2 चुकीच्या पडताळण्यांनंतर गोठवली, तंत्रज्ञाने अपील केले.`,
      whatSystemDid: 'पायरी व पुढील सर्व टप्पे लॉक केले, त्या पायरीचे पेमेंट रोखले — तंत्रज्ञाचे आधीचे कमावलेले पैसे सुरक्षित आहेत.',
      evidencePhoto: null,
      evidenceLines: [`तंत्रज्ञाचे म्हणणे: "${a.reason}"`],
    })
  }

  for (const insp of inspections) {
    if (insp.result !== 'rework') continue
    const id = `qc_rework:${insp.id}`
    if (decided.has(id)) continue
    const lead = leads.find((l) => l.id === insp.leadId)
    const failed = insp.items.filter((it) => it.verdict === 'fail')
    alerts.push({
      id,
      kind: 'qc_rework',
      refId: insp.id,
      leadId: insp.leadId,
      buildingName: lead?.buildingName ?? insp.leadId,
      lat: lead?.lat ?? 0,
      lng: lead?.lng ?? 0,
      createdAt: insp.signedAt ?? Date.now(),
      whatHappened: `${lead?.buildingName ?? insp.leadId} — ${insp.type === 'shaft' ? 'शाफ्ट' : 'अंतिम'} QC मध्ये ${failed.length} आयटम नापास झाले.`,
      whatSystemDid:
        insp.type === 'shaft'
          ? 'ग्राहकाची शाफ्ट-तयारी यादी आपोआप पुन्हा उघडली — पुन्हा पूर्ण करावी लागेल.'
          : 'रिवर्क यादी तंत्रज्ञाच्या टीमला कळवली गेली आहे.',
      evidencePhoto: failed[0]?.photo ?? null,
      evidenceLines: failed.map((it) => `${it.label}: ${it.note || 'टीप नाही'}`),
    })
  }

  for (const lead of leads) {
    if (lead.payout !== 10 || lead.status !== 'new') continue
    const id = `low_quality:${lead.id}`
    if (decided.has(id)) continue
    alerts.push({
      id,
      kind: 'low_quality',
      refId: lead.id,
      leadId: lead.id,
      buildingName: lead.buildingName,
      lat: lead.lat,
      lng: lead.lng,
      createdAt: lead.createdAt,
      whatHappened: `${lead.buildingName} — गुणवत्ता स्कोअर ${lead.qualityScore}/100, अस्पष्ट फोटोंसह सबमिट केली.`,
      whatSystemDid: 'पूर्ण ₹40 ऐवजी ₹10 पेआउट दिला; लीड सेल्स फनेलमध्ये पडताळणीविना पडून आहे.',
      evidencePhoto: lead.photos.building,
      evidenceLines: [`गुणवत्ता स्कोअर: ${lead.qualityScore}/100`],
    })
  }

  return alerts.sort((a, b) => a.createdAt - b.createdAt)
}
