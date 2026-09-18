import type { MapEntityPoint, QueuedAction, RiderEarnings, RiderLead } from '@/domain/types';
import type { StatusGrammar } from '@/domain/lifecycle';

/**
 * Demo fixtures for the Rider role.
 *
 * Content is transcribed from the canonical references so a rendered screen
 * can be compared against them directly. Every status carries all five slots
 * — there is no way to write a bare one.
 *
 * ROLE BOUNDARY: none of these records carry project value, quoted price,
 * margin or customer phone numbers. The rider client never receives them.
 */

const s = {
  newLead: (elapsed: string): StatusGrammar => ({
    state: 'new',
    chipLabel: 'नवीन लीड',
    reason: 'साइट नोंदवली आहे, अजून पहिली भेट झालेली नाही.',
    custody: { holder: 'rider' },
    clock: { kind: 'held', since: '2025-08-16', elapsedLabel: elapsed },
    consequence: 'फोटो सबमिट केल्यावर AIEC टीम पडताळणी सुरू करेल.',
  }),
  selling: (remaining: string, breached = false, chipLabel = 'फॉलो-अप आवश्यक'): StatusGrammar => ({
    state: 'selling',
    chipLabel,
    reason: 'साइट प्रतिनिधीशी चर्चा सुरू आहे, कोटेशन प्रलंबित.',
    custody: { holder: 'aiec', name: 'विक्री टीम' },
    clock: { kind: 'due', at: '2025-08-22', remainingLabel: remaining, breached },
    consequence: 'वेळेत फॉलो-अप न झाल्यास लीड दुसऱ्या रायडरकडे जाईल.',
  }),
  won: (): StatusGrammar => ({
    state: 'won',
    chipLabel: 'जिंकले (शाफ्ट प्रतीक्षित)',
    reason: 'ऑर्डर मिळाली. शाफ्ट तयार होण्याची प्रतीक्षा आहे.',
    custody: { holder: 'customer', name: 'साइट टीम' },
    clock: { kind: 'held', since: '2025-08-18', elapsedLabel: '6 दिवस' },
    consequence: 'शाफ्ट तयार झाल्यावर मटेरियल पाठवले जाईल.',
  }),
  installing: (): StatusGrammar => ({
    state: 'installing',
    chipLabel: 'इंस्टॉलेशन सुरू',
    reason: 'इंस्टॉलेशन टीम साइटवर काम करत आहे.',
    custody: { holder: 'vendor', name: 'इंस्टॉलेशन टीम' },
    clock: { kind: 'due', at: '2025-09-30', remainingLabel: '12 दिवस बाकी' },
    consequence: 'काम पूर्ण झाल्यावर तुमची कमाई खात्यात जमा होईल.',
  }),
  blocked: (): StatusGrammar => ({
    state: 'blocked',
    chipLabel: 'अडचणीत',
    reason: 'साइटवर प्रवेश मिळाला नाही — गेट बंद होते.',
    custody: { holder: 'rider' },
    clock: { kind: 'due', at: '2025-08-15', remainingLabel: '2 दिवस उशीर', breached: true },
    consequence: 'पुन्हा भेट न दिल्यास ही लीड रद्द होईल.',
  }),
};

export const RIDER_LEADS: RiderLead[] = [
  {
    id: 'l1',
    reference: '#AIEC2508160427',
    siteName: 'साई रेसिडेन्सी',
    locality: 'बाणेर, पुणे',
    pincode: '411045',
    status: s.newLead('आज कॅप्चर'),
    distanceM: 320,
    riderEarningPaise: 4000,
    capturedAt: 'कॅप्चर: आज, 10:24 AM',
    photoCount: 4,
    thumbnailId: 'rcc-frame',
    floors: 'G + 4 (एकूण 5)',
    liftRequirement: '1 (प्रवासी)',
    contact: { name: 'श्री. अमोल देशमुख', role: 'साईट प्रतिनिधी' },
  },
  {
    id: 'l2',
    reference: '#AIEC2508150391',
    siteName: 'ओम साई अपार्टमेंट',
    locality: 'कोथरूड, पुणे',
    pincode: '411038',
    status: s.selling('2 दिवस बाकी'),
    distanceM: 1200,
    riderEarningPaise: 4000,
    capturedAt: 'कॅप्चर: काल, 4:17 PM',
    photoCount: 6,
    thumbnailId: 'finished-tower',
    contact: { name: 'श्रीम. प्रिया जोशी', role: 'साईट प्रतिनिधी' },
  },
  {
    id: 'l3',
    reference: '#AIEC2508200118',
    siteName: 'गोकुळे हाईट्स',
    locality: 'औंध, पुणे',
    pincode: '411007',
    status: s.selling('आज मुदत', false, 'चर्चा सुरू'),
    distanceM: 2400,
    riderEarningPaise: 4000,
    capturedAt: 'कॅप्चर: 20 ऑग, 11:03 AM',
    photoCount: 4,
    thumbnailId: 'shell-core',
  },
  {
    id: 'l4',
    reference: '#AIEC2508180254',
    siteName: 'प्रगती टॉवर्स',
    locality: 'वाकड, पुणे',
    pincode: '411057',
    status: s.won(),
    distanceM: 3100,
    riderEarningPaise: 4000,
    capturedAt: 'कॅप्चर: 18 ऑग, 9:45 AM',
    photoCount: 7,
    thumbnailId: 'low-rise',
  },
  {
    id: 'l5',
    reference: '#AIEC2508160077',
    siteName: 'कुलकर्णी रेसिडेन्सी',
    locality: 'हिंजवडी, पुणे',
    pincode: '411057',
    status: s.installing(),
    distanceM: 4800,
    riderEarningPaise: 4000,
    capturedAt: 'कॅप्चर: 16 ऑग, 2:20 PM',
    photoCount: 9,
    thumbnailId: 'slab',
  },
  {
    id: 'l6',
    reference: '#AIEC2508140042',
    siteName: 'देशमुख कॉम्प्लेक्स',
    locality: 'कात्रज, पुणे',
    pincode: '411046',
    status: s.blocked(),
    distanceM: 5600,
    riderEarningPaise: 1000,
    capturedAt: 'कॅप्चर: 14 ऑग, 5:10 PM',
    photoCount: 2,
    thumbnailId: 'rcc-frame',
  },
];

export const NEARBY_LEADS: RiderLead[] = [RIDER_LEADS[0], RIDER_LEADS[1], RIDER_LEADS[2]];

export const EARNINGS: RiderEarnings = {
  todayPaise: 24000,
  weekPaise: 160000,
  appointmentsToday: 5,
  nearbyLeads: 12,
};

export const LEAD_STATS = { total: 24, fresh: 12, followUp: 7, won: 5 };

export const MAP_POINTS: MapEntityPoint[] = [
  { id: 'm1', state: 'new', x: 0.17, y: 0.30, label: 'साई रेसिडेन्सी' },
  { id: 'm2', state: 'selling', x: 0.30, y: 0.52 },
  { id: 'm3', state: 'won', x: 0.44, y: 0.22 },
  { id: 'm4', state: 'material', x: 0.60, y: 0.40 },
  { id: 'm5', state: 'installing', x: 0.73, y: 0.26 },
  { id: 'm6', state: 'done', x: 0.86, y: 0.58 },
  { id: 'm7', state: 'blocked', x: 0.55, y: 0.15 },
  { id: 'm8', state: 'new', x: 0.24, y: 0.72 },
  { id: 'm9', state: 'selling', x: 0.66, y: 0.74 },
  { id: 'm10', state: 'done', x: 0.90, y: 0.33 },
];

export const SELF_POSITION = { x: 0.42, y: 0.63 };

export const OFFLINE_ITEMS: QueuedAction[] = [
  { id: 'q1', kind: 'lead-capture', label: 'साई रेसिडेन्सी — नवीन लीड', createdAt: '10:24', sizeLabel: '1.2 MB' },
  { id: 'q2', kind: 'photo-upload', label: 'गोकुळे हाईट्स — 4 फोटो', createdAt: '09:58', sizeLabel: '4.8 MB' },
];
