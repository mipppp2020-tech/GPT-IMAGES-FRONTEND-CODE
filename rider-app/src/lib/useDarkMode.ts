import { useEffect, useState } from 'react'

const KEY = 'aiec-dark-mode'

/** One switch, every role. Every shared component already reads color
 * only through CSS custom properties (--color-surface, --color-ink, …),
 * so a single class on <html> can override just those four tokens across
 * all eight role themes without touching each theme's own accent colour —
 * the thing that actually carries role identity stays put. */
export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('aiec-dark', dark)
    try {
      localStorage.setItem(KEY, dark ? '1' : '0')
    } catch {
      // best-effort persistence only
    }
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}
