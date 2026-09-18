export type RoleId =
  | 'rider'
  | 'sales'
  | 'customer'
  | 'technician'
  | 'qc'
  | 'supplier'
  | 'admin'
  | 'owner'
  | 'join'

export interface RoleMeta {
  id: RoleId
  label: string
  subtitle: string
  path: string
  theme: string | null // null = default Sunlight, no data-theme override needed
  emoji: string
  live: boolean // false until that phase lands — shown as "लवकरच" on the grid
}

export const ROLES: RoleMeta[] = [
  { id: 'rider', label: 'रायडर', subtitle: 'लीड कॅप्चर करा, कमवा', path: '/', theme: null, emoji: '🏍️', live: true },
  { id: 'sales', label: 'सेल्स डेस्क', subtitle: 'सौदा बंद करा', path: '/sales', theme: 'sales', emoji: '📞', live: true },
  { id: 'customer', label: 'ग्राहक', subtitle: 'तुमची लिफ्ट ट्रॅक करा', path: '/customer', theme: 'customer', emoji: '🏢', live: true },
  { id: 'technician', label: 'तंत्रज्ञ', subtitle: 'इंस्टॉल करा, कमवा', path: '/technician', theme: 'technician', emoji: '🔧', live: true },
  { id: 'qc', label: 'QC इन्स्पेक्टर', subtitle: 'तपासा, प्रमाणित करा', path: '/qc', theme: 'qc', emoji: '🔍', live: false },
  { id: 'supplier', label: 'सप्लायर', subtitle: 'पॅक करा, पाठवा', path: '/supplier', theme: 'supplier', emoji: '📦', live: false },
  { id: 'admin', label: 'अॅडमिन', subtitle: 'शहर नियंत्रण', path: '/admin', theme: 'admin', emoji: '🖥️', live: false },
  { id: 'owner', label: 'ओनर', subtitle: 'व्यवसाय विहंगावलोकन', path: '/owner', theme: 'owner', emoji: '📊', live: false },
  { id: 'join', label: 'AIEC मध्ये सामील व्हा', subtitle: 'तंत्रज्ञ म्हणून कमवायला सुरुवात करा', path: '/join', theme: null, emoji: '🚀', live: false },
]

export function roleById(id: RoleId): RoleMeta {
  const r = ROLES.find((x) => x.id === id)
  if (!r) throw new Error(`unknown role ${id}`)
  return r
}
