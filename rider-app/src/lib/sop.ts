export interface SopStepTemplate {
  id: string
  title: string
  instructions: string[]
  evidenceLabels: string[]
  reward: number
  safetyCritical: boolean
  safetyLine: string | null
}

/** PRD §20: a real 24-step, evidence-gated sequence — the source itself
 * says the full 24-step catalogue "should not be invented by engineering
 * or by this PRD," only a representative subset is given as worked
 * examples (explicitly Steps 4/5/6 and Step 24's commissioning). This is
 * that representative subset, compressed to 7 steps for the MVP: Step 4
 * (guide rail alignment) is reproduced with the source's *exact* evidence
 * list, reward and safety line; the others follow the same shape. */
export const SOP_TEMPLATE: SopStepTemplate[] = [
  {
    id: 'safety-setup',
    title: 'सुरक्षा सेटअप',
    instructions: ['हार्नेस व हेल्मेट घाला', 'शाफ्टभोवती बॅरिकेड लावा', 'फ्लॅशलाईट व टूल्स तपासा'],
    evidenceLabels: ['हार्नेस/हेल्मेट घातलेला सेल्फी', 'शाफ्ट बॅरिकेड फोटो'],
    reward: 1200,
    safetyCritical: true,
    safetyLine: 'हार्नेसशिवाय शाफ्टमध्ये प्रवेश करू नका — हे अनिवार्य आहे.',
  },
  {
    id: 'bracket-layout',
    title: 'ब्रॅकेट लेआउट मार्किंग',
    instructions: ['लेझर लाईनने उभी रेषा मार्क करा', 'प्रत्येक 1.5मी वर ब्रॅकेट पॉईंट मार्क करा'],
    evidenceLabels: ['मार्किंग लाईन क्लोज-अप', 'पूर्ण शाफ्ट वाइड शॉट'],
    reward: 1400,
    safetyCritical: false,
    safetyLine: null,
  },
  {
    id: 'bracket-fixing',
    title: 'ब्रॅकेट फिक्सिंग',
    instructions: ['ब्रॅकेट भिंतीवर फिक्स करा', 'बोल्ट 45 Nm टॉर्कने घट्ट करा'],
    evidenceLabels: ['फिक्स केलेले ब्रॅकेट क्लोज-अप', 'टॉर्क रेंच रीडिंग'],
    reward: 1800,
    safetyCritical: false,
    safetyLine: null,
  },
  {
    id: 'guide-rail',
    title: 'गाईड रेल अलाइनमेंट',
    instructions: [
      'KIT-B स्कॅन करा',
      'लेझरने रेल प्लंब लाईन सेट करा',
      'ब्रॅकेटवर रेल बसवा — क्लिप टॉर्क 45 Nm',
      'प्रत्येक 1.5मी वर अलाइनमेंट तपासा (±0.5mm)',
      'फिशप्लेट जॉईंट घट्ट करा',
    ],
    evidenceLabels: ['लेझर लाईन (पूर्ण उंची)', 'टॉर्क रेंच रीडिंग (क्लिपवर)', 'फिशप्लेट जॉईंट क्लोज-अप', 'पूर्ण शाफ्ट वाइड शॉट'],
    reward: 2800,
    safetyCritical: true,
    safetyLine: 'हार्नेस अनिवार्य — रेल अलाइनमेंट उंचीवर काम आहे.',
  },
  {
    id: 'motor-panel',
    title: 'मोटर व कंट्रोल पॅनल',
    instructions: ['मोटर माउंट करा व लेव्हल तपासा', 'कंट्रोल पॅनल वायरिंग डायग्रॅमप्रमाणे जोडा'],
    evidenceLabels: ['मोटर माउंटिंग क्लोज-अप', 'कंट्रोल पॅनल वायरिंग फोटो'],
    reward: 3200,
    safetyCritical: false,
    safetyLine: null,
  },
  {
    id: 'wiring-safety',
    title: 'वायरिंग व सेफ्टी सर्किट टेस्ट',
    instructions: ['अर्थिंग कनेक्शन तपासा', 'ARD (स्वयंचलित बचाव यंत्रणा) टेस्ट करा', 'सेफ्टी सर्किट रीडिंग नोंदवा'],
    evidenceLabels: ['अर्थिंग कनेक्शन क्लोज-अप', 'सेफ्टी सर्किट टेस्ट रीडिंग'],
    reward: 2200,
    safetyCritical: true,
    safetyLine: 'वीज पुरवठा बंद असल्याची खात्री केल्याशिवाय वायरिंगला हात लावू नका.',
  },
  {
    id: 'commissioning',
    title: 'कमिशनिंग — 10 ट्रायल रन्स',
    instructions: ['ओव्हरलोड टेस्ट करा', 'ग्राहकासोबत 10 सुपरवाइज्ड ट्रायल रन्स घ्या', 'प्रत्येक रनचा मजला, दार वेळ, लेव्हलिंग नोंदवा'],
    evidenceLabels: ['ओव्हरलोड टेस्ट रीडिंग', 'अंतिम कमिशनिंग फोटो (कॅबिन + पॅनल)'],
    reward: 3500,
    safetyCritical: false,
    safetyLine: null,
  },
]

export const JOB_ON_TIME_BONUS = 5000
export const JOB_ZERO_WASTAGE_BONUS = 500
export const JOB_FIVE_STAR_BONUS = 2000

export function jobTotalValue() {
  return SOP_TEMPLATE.reduce((sum, s) => sum + s.reward, 0)
}

export function jobMaxPossible() {
  return jobTotalValue() + JOB_ON_TIME_BONUS + JOB_ZERO_WASTAGE_BONUS + JOB_FIVE_STAR_BONUS
}
