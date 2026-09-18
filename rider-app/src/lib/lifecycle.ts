import type { LeadStatus } from './types'

export interface LifecycleMeta {
  label: string
  color: string
  shape: 'hollow-circle' | 'half-circle' | 'dot-circle' | 'chevron' | 'ring' | 'check' | 'square-bang' | 'slashed-square'
  description: string
}

export const LIFECYCLE: Record<LeadStatus, LifecycleMeta> = {
  new: {
    label: 'नवीन लीड',
    color: 'var(--color-life-new)',
    shape: 'hollow-circle',
    description: 'AI पडताळणीसाठी पाठवले',
  },
  in_sales: {
    label: 'विक्री प्रक्रियेत',
    color: 'var(--color-life-sales)',
    shape: 'half-circle',
    description: 'सेल्स टीम ग्राहकाशी बोलत आहे',
  },
  won_awaiting_shaft: {
    label: 'जिंकले (शाफ्ट प्रतीक्षेत)',
    color: 'var(--color-life-won)',
    shape: 'dot-circle',
    description: 'टोकन मिळाले, शाफ्ट तयार होण्याची वाट पाहत आहे',
  },
  in_transit: {
    label: 'मटेरियल मार्गावर',
    color: 'var(--color-life-transit)',
    shape: 'chevron',
    description: 'कंटेनर साईटकडे निघाला आहे',
  },
  installing: {
    label: 'इंस्टॉलेशन सुरू',
    color: 'var(--color-life-installing)',
    shape: 'ring',
    description: 'तंत्रज्ञ साईटवर काम करत आहेत',
  },
  complete: {
    label: 'पूर्ण झाले',
    color: 'var(--color-life-complete)',
    shape: 'check',
    description: 'हँडओव्हर व NOC पूर्ण',
  },
  blocked: {
    label: 'अडचणीत',
    color: 'var(--color-life-blocked)',
    shape: 'square-bang',
    description: 'तुमच्याकडून कारवाईची गरज आहे',
  },
  lost: {
    label: 'रद्द / बंद',
    color: 'var(--color-life-lost)',
    shape: 'slashed-square',
    description: 'हा सौदा पुढे गेला नाही',
  },
}

export const STATUS_ORDER: LeadStatus[] = [
  'new',
  'in_sales',
  'won_awaiting_shaft',
  'in_transit',
  'installing',
  'complete',
]
