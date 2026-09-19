let leadCounter = 4000
let wletCounter = 9000

const ZONE_CODE: Record<string, string> = {
  Baner: 'BNR',
  Aundh: 'AND',
  Kothrud: 'KTH',
  Wakad: 'WKD',
  Hinjewadi: 'HJW',
  Katraj: 'KTJ',
  Pashan: 'PSH',
  Karvenagar: 'KVN',
}

export function nextLeadId(zone: string) {
  leadCounter += 1
  const code = ZONE_CODE[zone] ?? zone.slice(0, 3).toUpperCase()
  const suffix = String.fromCharCode(97 + (leadCounter % 5))
  return `MH-PUN-${code}-LEAD-${leadCounter}-${suffix}`
}

export function nextWalletId() {
  wletCounter += 1
  return `WLET-${wletCounter}`
}

export function nextOpId() {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
