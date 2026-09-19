import type { Lead, WalletEntry } from './types'

const DAY = 86400000

function startOfDay(ts: number) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function startOfWeek(ts: number) {
  const d = new Date(ts)
  const day = d.getDay() // 0 = Sunday
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function walletStats(wallet: WalletEntry[]) {
  const now = Date.now()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)

  const today = wallet.filter((w) => w.createdAt >= todayStart)
  const week = wallet.filter((w) => w.createdAt >= weekStart)

  const sum = (list: WalletEntry[]) => list.reduce((acc, w) => acc + w.amount, 0)
  const pending = wallet.filter((w) => w.state === 'pending')
  const cleared = wallet.filter((w) => w.state === 'cleared')

  return {
    todayTotal: sum(today),
    weekTotal: sum(week),
    pendingTotal: sum(pending),
    clearedTotal: sum(cleared),
  }
}

export const DAILY_TARGET_LEADS = 8
export const STREAK_TARGET_DAYS = 7
export const STREAK_BONUS = 500

export function leadsCapturedToday(leads: Lead[]) {
  const todayStart = startOfDay(Date.now())
  return leads.filter((l) => l.createdAt >= todayStart).length
}

export function nextFridayCountdown() {
  const now = new Date()
  const day = now.getDay() // 0 Sun ... 5 Fri
  let daysUntil = (5 - day + 7) % 7
  if (daysUntil === 0 && now.getHours() >= 20) daysUntil = 7
  const target = new Date(now)
  target.setDate(now.getDate() + daysUntil)
  target.setHours(20, 0, 0, 0)
  const ms = target.getTime() - now.getTime()
  const hours = Math.floor(ms / 3600000)
  const days = Math.floor(hours / 24)
  const remHours = hours % 24
  return { days, hours: remHours }
}

export function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)
}

export { DAY }
