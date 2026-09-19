export interface KitTemplate {
  id: string
  name: string
  contents: string
  unlocksAt: string
}

/** PRD §15.3: the phase-sealed barcoded kit table, verbatim — the
 * micro-theft firewall. Real content, not compressed, since it's only 8
 * items and each one IS the point (a pouch openable only at the correct
 * verified SOP step). */
export const KIT_TEMPLATE: KitTemplate[] = [
  { id: 'KIT-A', name: 'गाईड रेल ब्रॅकेट किट', contents: 'ब्रॅकेट, फास्टनर, शिम्स', unlocksAt: 'Step 4' },
  { id: 'KIT-B', name: 'गाईड रेल किट', contents: 'गाईड रेल्स, फिशप्लेट्स', unlocksAt: 'Step 6' },
  { id: 'KIT-C', name: 'मशीन माउंटिंग किट', contents: 'मशीन माउंटिंग हार्डवेअर', unlocksAt: 'Step 9' },
  { id: 'KIT-D', name: 'कंट्रोल पॅनल किट', contents: 'कंट्रोल पॅनल, वायरिंग हार्नेस', unlocksAt: 'Step 12' },
  { id: 'KIT-E', name: 'कॅबिन किट', contents: 'कार फ्रेम, कॅबिन पॅनल्स', unlocksAt: 'Step 15' },
  { id: 'KIT-F', name: 'लँडिंग डोअर किट', contents: 'प्रत्येक मजल्याचे डोअर (वेगळे सील)', unlocksAt: 'Step 18' },
  { id: 'KIT-G', name: 'सेफ्टी किट', contents: 'सेफ्टी गियर, गव्हर्नर, ARD', unlocksAt: 'Step 21' },
  { id: 'KIT-H', name: 'फिनिशिंग किट', contents: 'ट्रिम्स, कमिशनिंग कन्झ्युमेबल्स', unlocksAt: 'Step 23' },
]
