import type { QcChecklistItem, QcInspectionType } from './types'

/** PRD §14.1: 18 items across 8 groups for shaft QC. Compressed to 6 for
 * this MVP, one representative item per group (all 8 group names are
 * real from source; item labels chosen as the most load-bearing check
 * within each). */
const SHAFT_GROUPS: { group: string; label: string }[] = [
  { group: 'परिमाणे (Dimensions)', label: 'रुंदी, खोली व प्लंब — 3 उंचीवर मोजमाप' },
  { group: 'पिट (Pit)', label: 'खोली, वॉटरप्रूफिंग व ड्रेनेज' },
  { group: 'हेडरूम (Headroom)', label: 'मोकळी उंची — कोणताही अडथळा नाही' },
  { group: 'इलेक्ट्रिकल (Electrical)', label: '3-फेज पुरवठा, अर्थिंग, DB रेटिंग' },
  { group: 'ओपनिंग्स (Openings)', label: 'प्रत्येक मजल्यावरील लँडिंग डोअर आकार' },
  { group: 'सुरक्षा (Safety)', label: 'बॅरिकेडिंग, प्रवेश, स्कॅफोल्ड' },
]

/** PRD §14.2: unannounced post-install audit scope. Compressed to 6. */
const FINAL_GROUPS: { group: string; label: string }[] = [
  { group: 'SOP अनुक्रम', label: 'सर्व 24 टप्पे योग्य क्रमाने पूर्ण' },
  { group: 'टॉर्क व फास्टनर', label: 'टॉर्क रेंच रीडिंग — सर्व क्लिप' },
  { group: 'गाईड रेल', label: 'लेझर अलाइनमेंट तपासणी' },
  { group: 'वायरिंग', label: 'राउटिंग व टर्मिनेशन गुणवत्ता' },
  { group: 'मटेरियल वापर', label: 'BOM विरुद्ध प्रत्यक्ष वापर व स्क्रॅप' },
  { group: 'हाऊसकीपिंग व PPE', label: 'साईट स्वच्छता व तंत्रज्ञाचे स्वतःचे PPE' },
]

export function buildChecklist(type: QcInspectionType): QcChecklistItem[] {
  const groups = type === 'shaft' ? SHAFT_GROUPS : FINAL_GROUPS
  return groups.map((g, i) => ({
    id: `${type}-${i}`,
    group: g.group,
    label: g.label,
    verdict: null,
    photo: null,
    note: '',
  }))
}

export const QC_FEES: Record<QcInspectionType, number> = {
  shaft: 450,
  final: 800,
}
