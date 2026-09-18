import type { Lead, RiderProfile, WalletEntry } from './types'

export const ZONES: Record<string, { lat: number; lng: number }> = {
  Baner: { lat: 18.559, lng: 73.7868 },
  Aundh: { lat: 18.5636, lng: 73.8077 },
  Kothrud: { lat: 18.5074, lng: 73.8077 },
  Wakad: { lat: 18.5978, lng: 73.761 },
  Hinjewadi: { lat: 18.5912, lng: 73.7389 },
  Katraj: { lat: 18.4575, lng: 73.8677 },
  Pashan: { lat: 18.5361, lng: 73.7897 },
  Karvenagar: { lat: 18.4919, lng: 73.8143 },
}

export const RIDER_START_POSITION = { lat: 18.548, lng: 73.795 }

export const DEMO_RIDER: RiderProfile = {
  name: 'संदीप पाटील',
  phone: '+91 98765 43210',
  level: 1,
  city: 'पुणे',
  zone: 'बाणेर',
  verified: true,
  streakDays: 4,
  upiId: 'sandeep.patil@okaxis',
}

/** Leads captured by *other* riders — used purely for the 50m duplicate-block demo. */
export const OTHER_RIDER_LEADS: { buildingName: string; lat: number; lng: number; by: string; on: string }[] =
  [
    {
      buildingName: 'गोकुळे हाईट्स',
      lat: ZONES.Aundh.lat + 0.0009,
      lng: ZONES.Aundh.lng + 0.0006,
      by: 'विजय शिंदे',
      on: '20 ऑग',
    },
  ]

/** Uncaptured sites the AI heatmap is pointing the rider toward — not yet in the LEAD table. */
export const OPPORTUNITY_SITES: {
  id: string
  buildingName: string
  address: string
  lat: number
  lng: number
  floors: number
}[] = [
  {
    id: 'opp-1',
    buildingName: 'साई रेसिडेन्सी',
    address: 'बाणेर, पुणे - 411045',
    lat: ZONES.Baner.lat + 0.0003,
    lng: ZONES.Baner.lng + 0.0009,
    floors: 5,
  },
  {
    id: 'opp-2',
    buildingName: 'सुखवाणी रेसिडेन्सी',
    address: 'कोथरूड, पुणे - 411038',
    lat: ZONES.Kothrud.lat - 0.0011,
    lng: ZONES.Kothrud.lng - 0.0006,
    floors: 5,
  },
  {
    id: 'opp-3',
    buildingName: 'प्रगती टॉवर्स',
    address: 'पाषाण, पुणे - 411008',
    lat: ZONES.Pashan.lat + 0.0006,
    lng: ZONES.Pashan.lng - 0.0004,
    floors: 6,
  },
  {
    id: 'opp-4',
    buildingName: 'गोकुळे हाईट्स',
    address: 'औंध, पुणे - 411007',
    lat: ZONES.Aundh.lat + 0.0009,
    lng: ZONES.Aundh.lng + 0.0006,
    floors: 6,
  },
]

const now = Date.now()
const day = 86400000

export const SEED_LEADS: Lead[] = [
  {
    id: 'MH-PUN-BNR-LEAD-3801-a',
    buildingName: 'साई रेसिडेन्सी',
    address: 'बाणेर, पुणे - 411045',
    zone: 'Baner',
    lat: ZONES.Baner.lat + 0.0012,
    lng: ZONES.Baner.lng - 0.0008,
    floors: 5,
    shaftReady: true,
    passengers: 8,
    ownerName: 'श्री. अमोल देशमुख',
    ownerPhone: '+91 90210 11223',
    photos: { shaft: null, building: null, contact: null },
    note: '',
    qualityScore: 96,
    payout: 40,
    status: 'complete',
    createdAt: now - 21 * day,
    synced: true,
    newGroundBonus: false,
  },
  {
    id: 'MH-PUN-WKD-LEAD-3812-b',
    buildingName: 'श्री गणेश हाईट्स',
    address: 'वाकड, पुणे - 411057',
    zone: 'Wakad',
    lat: ZONES.Wakad.lat - 0.001,
    lng: ZONES.Wakad.lng + 0.0011,
    floors: 7,
    shaftReady: false,
    passengers: 10,
    ownerName: 'श्री. राहुल कुलकर्णी',
    ownerPhone: '+91 90211 44556',
    photos: { shaft: null, building: null, contact: null },
    note: '',
    qualityScore: 91,
    payout: 40,
    status: 'in_sales',
    createdAt: now - 4 * day,
    synced: true,
    newGroundBonus: false,
    aiTip: 'ही लीड सक्षम दिसते. परिसरात 3 समान प्रकल्प आहेत. 2 दिवसात फॉलो-अप करा.',
  },
  {
    id: 'MH-PUN-KTH-LEAD-3820-c',
    buildingName: 'ओम साई अपार्टमेंट',
    address: 'कोथरूड, पुणे - 411038',
    zone: 'Kothrud',
    lat: ZONES.Kothrud.lat + 0.0007,
    lng: ZONES.Kothrud.lng + 0.0004,
    floors: 6,
    shaftReady: true,
    passengers: 8,
    ownerName: 'श्रीमती. नीता जोशी',
    ownerPhone: '+91 90212 77889',
    photos: { shaft: null, building: null, contact: null },
    note: '',
    qualityScore: 88,
    payout: 40,
    status: 'won_awaiting_shaft',
    createdAt: now - 8 * day,
    synced: true,
    newGroundBonus: false,
  },
  {
    id: 'MH-PUN-KTJ-LEAD-3790-d',
    buildingName: 'प्रगती कन्स्ट्रक्शन',
    address: 'कात्रज, पुणे - 411046',
    zone: 'Katraj',
    lat: ZONES.Katraj.lat + 0.0006,
    lng: ZONES.Katraj.lng - 0.0009,
    floors: 4,
    shaftReady: false,
    passengers: 6,
    ownerName: 'श्री. संजय पवार',
    ownerPhone: '+91 90213 99001',
    photos: { shaft: null, building: null, contact: null },
    note: '',
    qualityScore: 42,
    payout: 10,
    status: 'lost',
    createdAt: now - 30 * day,
    synced: true,
    newGroundBonus: false,
  },
  {
    id: 'MH-PUN-HJW-LEAD-3825-e',
    buildingName: 'कुलकर्णी रेसिडेन्सी',
    address: 'हिंजवडी, पुणे - 411057',
    zone: 'Hinjewadi',
    lat: ZONES.Hinjewadi.lat - 0.0008,
    lng: ZONES.Hinjewadi.lng + 0.0007,
    floors: 8,
    shaftReady: true,
    passengers: 10,
    ownerName: 'श्री. अनिल भोसले',
    ownerPhone: '+91 90214 22334',
    photos: { shaft: null, building: null, contact: null },
    note: '',
    qualityScore: 94,
    payout: 40,
    status: 'installing',
    createdAt: now - 16 * day,
    synced: true,
    newGroundBonus: true,
  },
]

export function seedWalletEntries(leads: Lead[]): WalletEntry[] {
  const entries: WalletEntry[] = []
  let w = 8900
  const push = (e: Omit<WalletEntry, 'id'>) => {
    w += 1
    entries.push({ id: `WLET-${w}`, ...e })
  }

  for (const lead of leads) {
    push({
      amount: lead.payout,
      label: lead.payout === 40 ? 'वैध लीड कॅप्चर' : 'कमी गुणवत्ता लीड',
      cause: lead.buildingName,
      consequence: 'तपासणीनंतर 24 तासांत क्लिअर होते',
      state: 'cleared',
      leadId: lead.id,
      createdAt: lead.createdAt,
    })
    if (lead.status === 'won_awaiting_shaft' || lead.status === 'installing' || lead.status === 'complete') {
      push({
        amount: 1500,
        label: 'लीड विक्रीत रूपांतरित',
        cause: `${lead.buildingName} — टोकन पेमेंट मिळाले`,
        consequence: 'तुमच्या खात्यात जमा',
        state: 'cleared',
        leadId: lead.id,
        createdAt: lead.createdAt + 2 * day,
      })
    }
    if (lead.status === 'complete') {
      push({
        amount: 1000,
        label: 'इंस्टॉलेशन पूर्ण बोनस',
        cause: `${lead.buildingName} — NOC जारी`,
        consequence: 'तुमच्या खात्यात जमा',
        state: 'cleared',
        leadId: lead.id,
        createdAt: lead.createdAt + 18 * day,
      })
    }
    if (lead.newGroundBonus) {
      push({
        amount: 15,
        label: 'नवीन परिसर बोनस',
        cause: `${lead.buildingName} — अनविझिटेड ग्रिड`,
        consequence: 'त्वरित जमा',
        state: 'cleared',
        leadId: lead.id,
        createdAt: lead.createdAt,
      })
    }
  }

  push({
    amount: 500,
    label: '7-दिवसांची स्ट्रीक',
    cause: 'सलग 7 दिवस राईड पूर्ण',
    consequence: 'रविवारी जमा',
    state: 'cleared',
    createdAt: now - 2 * day,
  })

  return entries.sort((a, b) => b.createdAt - a.createdAt)
}
