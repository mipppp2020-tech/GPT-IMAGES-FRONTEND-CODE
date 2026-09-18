import type {
  AiecNotification,
  DocumentRequirement,
  ProgressStage,
  SiteRecord,
} from '@/domain/types';
import type { StatusGrammar } from '@/domain/lifecycle';

import e1 from '@/assets/evidence-1.jpg';
import e2 from '@/assets/evidence-2.jpg';
import e3 from '@/assets/evidence-3.jpg';

/**
 * Record-flow fixtures, transcribed from the canonical references.
 * Every status still carries all five slots.
 */
const st = {
  done: (): StatusGrammar => ({
    state: 'done',
    chipLabel: 'पुर्ण',
    reason: 'साइट तपासणी पूर्ण झाली, सर्व दस्तऐवज स्वीकारले गेले.',
    custody: { holder: 'aiec', name: 'पडताळणी टीम' },
    clock: { kind: 'held', since: '2025-08-16', elapsedLabel: '16 ऑग पासून' },
    consequence: 'अंतिम पुनरावलोकनानंतर प्रमाणपत्र उपलब्ध होईल.',
  }),
  active: (): StatusGrammar => ({
    state: 'selling',
    chipLabel: 'सक्रिय',
    reason: 'बांधकाम सुरू आहे, टप्प्यांची नोंद घेतली जात आहे.',
    custody: { holder: 'rider' },
    clock: { kind: 'due', at: '2025-09-30', remainingLabel: '12 दिवस बाकी' },
    consequence: 'पुढील टप्प्याचे फोटो वेळेत न दिल्यास पडताळणी थांबेल.',
  }),
  review: (): StatusGrammar => ({
    state: 'installing',
    chipLabel: 'तपासणी',
    reason: 'सादर केलेले दस्तऐवज पडताळणीसाठी महापालिकेकडे आहेत.',
    custody: { holder: 'system', name: 'महापालिका' },
    clock: { kind: 'due', at: '2025-08-20', remainingLabel: '3 दिवस बाकी' },
    consequence: 'पडताळणी पूर्ण झाल्यावर पुढील टप्पा उघडेल.',
  }),
  cancelled: (): StatusGrammar => ({
    state: 'closed',
    chipLabel: 'रद्द',
    reason: 'मालकाने प्रकल्प थांबवला — नोंद बंद करण्यात आली.',
    custody: { holder: 'customer', name: 'मालक' },
    clock: { kind: 'held', since: '2025-08-10', elapsedLabel: '10 ऑग रोजी बंद' },
    consequence: 'नवीन अर्जासाठी नोंद पुन्हा उघडावी लागेल.',
  }),
};

export const SITE_RECORDS: SiteRecord[] = [
  {
    id: 'r1',
    reference: '#AIEC2508160427',
    siteName: 'साई रेसिडेन्सी',
    locality: 'बाणेर, पुणे',
    pincode: '411045',
    status: st.done(),
    recordedAt: '16 ऑग, 2025, 10:24 AM',
    floors: 'G + 4',
    floorsFull: 'G + 4 (एकूण 5)',
    flats: 5,
    ownerName: 'श्री. अमोल देशमुख',
    thumbnailId: 'finished-tower',
    feePaidPaise: 3800,
    flatNo: '101',
    buildingType: 'residential',
  },
  {
    id: 'r2',
    reference: '#AIEC2508140318',
    siteName: 'श्री गणेश हाईट्स',
    locality: 'वाकड, पुणे',
    pincode: '411057',
    status: st.active(),
    recordedAt: '14 ऑग, 2025, 04:15 PM',
    floors: 'G + 7',
    floorsFull: 'G + 7 (एकूण 8)',
    flats: 12,
    ownerName: 'श्रीम. सुनीता कुलकर्णी',
    thumbnailId: 'shell-core',
    feePaidPaise: 3800,
    buildingType: 'residential',
  },
  {
    id: 'r3',
    reference: '#AIEC2508120205',
    siteName: 'ओम साई अपार्टमेंट',
    locality: 'हिंजवडी, पुणे',
    pincode: '411057',
    status: st.review(),
    recordedAt: '12 ऑग, 2025, 11:30 AM',
    floors: 'G + 6',
    floorsFull: 'G + 6 (एकूण 7)',
    flats: 8,
    ownerName: 'श्री. राजेश शिंदे',
    thumbnailId: 'low-rise',
    feePaidPaise: 3800,
    buildingType: 'residential',
  },
  {
    id: 'r4',
    reference: '#AIEC2508100151',
    siteName: 'प्रगती कन्स्ट्रक्शन',
    locality: 'कात्रज, पुणे',
    pincode: '411046',
    status: st.cancelled(),
    recordedAt: '10 ऑग, 2025, 02:20 PM',
    floors: 'G + 3',
    floorsFull: 'G + 3 (एकूण 4)',
    flats: 4,
    ownerName: 'श्री. विकास जाधव',
    thumbnailId: 'slab',
    feePaidPaise: 0,
    buildingType: 'residential',
  },
  {
    id: 'r5',
    reference: '#AIEC2508080094',
    siteName: 'सुखवाणी रेसिडेन्सी',
    locality: 'कोथरूड, पुणे',
    pincode: '411038',
    status: st.done(),
    recordedAt: '08 ऑग, 2025, 09:10 AM',
    floors: 'G + 5',
    floorsFull: 'G + 5 (एकूण 6)',
    flats: 10,
    ownerName: 'श्रीम. मीना पवार',
    thumbnailId: 'rcc-frame',
    feePaidPaise: 3800,
    buildingType: 'residential',
  },
];

export const RECORD_COUNTS = { all: 8, active: 3, done: 3, cancelled: 1 };

/**
 * Statutory documents. Two of six are incomplete, exactly as the reference
 * shows — which is why the continue action on S-R-11 is gated.
 */
export const DOCUMENTS: DocumentRequirement[] = [
  {
    id: 'd1',
    titleKey: 'docs.d1',
    subtitleKey: 'docs.d1s',
    icon: 'building',
    tone: 'done',
    required: true,
    state: { kind: 'uploaded', at: '12 ऑग, 2025, 10:20 AM' },
  },
  {
    id: 'd2',
    titleKey: 'docs.d2',
    subtitleKey: 'docs.d2s',
    icon: 'pin',
    tone: 'done',
    required: true,
    state: { kind: 'uploaded', at: '12 ऑग, 2025, 10:22 AM' },
  },
  {
    id: 'd3',
    titleKey: 'docs.d3',
    subtitleKey: 'docs.d3s',
    icon: 'image',
    tone: 'done',
    required: true,
    state: { kind: 'uploaded', at: '12 ऑग, 2025, 10:25 AM' },
  },
  {
    id: 'd4',
    titleKey: 'docs.d4',
    subtitleKey: 'docs.d4s',
    icon: 'list',
    tone: 'done',
    required: true,
    state: { kind: 'uploaded', at: '12 ऑग, 2025, 10:28 AM' },
  },
  {
    id: 'd5',
    titleKey: 'docs.d5',
    subtitleKey: 'docs.d5s',
    icon: 'helmet',
    tone: 'installing',
    required: true,
    state: { kind: 'uploading', pct: 68 },
  },
  {
    id: 'd6',
    titleKey: 'docs.d6',
    subtitleKey: 'docs.d6s',
    icon: 'shield',
    tone: 'new',
    required: true,
    state: { kind: 'missing' },
  },
];

export const PROGRESS_STAGES: ProgressStage[] = [
  { id: 'p1', titleKey: 'progress.s1', state: 'done', dateKey: 'progress.doneOn', dateValue: '10 मे, 2025' },
  { id: 'p2', titleKey: 'progress.s2', state: 'done', dateKey: 'progress.doneOn', dateValue: '28 मे, 2025' },
  { id: 'p3', titleKey: 'progress.s3', state: 'done', dateKey: 'progress.doneOn', dateValue: '20 जून, 2025' },
  {
    id: 'p4',
    titleKey: 'progress.s4',
    state: 'running',
    dateKey: 'progress.startedExpected',
    dateValue: '30 सप्टेंबर, 2025',
    detail: {
      bodyKey: 'progress.currentBody',
      pct: 60,
      photos: [
        { src: e1, captionKey: 'progress.capFront' },
        { src: e2, captionKey: 'progress.capInside' },
        { src: e3, captionKey: 'progress.capSlab' },
      ],
    },
  },
  { id: 'p5', titleKey: 'progress.s5', state: 'pending', dateKey: 'progress.expected', dateValue: 'नोव्हेंबर, 2025' },
  { id: 'p6', titleKey: 'progress.s6', state: 'pending', dateKey: 'progress.expected', dateValue: 'डिसेंबर, 2025' },
];

export const NOTIFICATIONS: AiecNotification[] = [
  {
    id: 'n1',
    titleKey: 'notif.n1',
    bodyKey: 'notif.n1b',
    at: '16 ऑग, 2025, 10:32 AM',
    tone: 'done',
    icon: 'check-circle',
    actionKey: 'notif.n1a',
    category: 'other',
  },
  {
    id: 'n2',
    titleKey: 'notif.n2',
    bodyKey: 'notif.n2b',
    at: '16 ऑग, 2025, 10:30 AM',
    tone: 'selling',
    icon: 'image',
    category: 'other',
  },
  {
    id: 'n3',
    titleKey: 'notif.n3',
    bodyKey: 'notif.n3b',
    at: '16 ऑग, 2025, 10:25 AM',
    tone: 'material',
    icon: 'clock',
    unread: true,
    category: 'unread',
  },
  {
    id: 'n4',
    titleKey: 'notif.n4',
    bodyKey: 'notif.n4b',
    at: '15 ऑग, 2025, 05:18 PM',
    tone: 'selling',
    icon: 'info',
    category: 'system',
  },
  {
    id: 'n5',
    titleKey: 'notif.n5',
    bodyKey: 'notif.n5b',
    at: '14 ऑग, 2025, 11:00 AM',
    tone: 'installing',
    icon: 'bell',
    actionKey: 'notif.n5a',
    category: 'important',
  },
];

export const FEE_BREAKDOWN = { registrationPaise: 2500, processingPaise: 1000, gstPaise: 300 };
export const FEE_TOTAL_PAISE =
  FEE_BREAKDOWN.registrationPaise + FEE_BREAKDOWN.processingPaise + FEE_BREAKDOWN.gstPaise;
