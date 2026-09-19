import L from 'leaflet'
import type { LifecycleMeta } from './lifecycle'

/** Raw SVG markup mirroring LifecycleMark.tsx's shape+colour language, for use
 * inside a Leaflet DivIcon (which needs an HTML string, not a React node). */
function shapeSvg(meta: LifecycleMeta, size: number): string {
  const c = meta.color
  switch (meta.shape) {
    case 'hollow-circle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="${c}" stroke-width="2.5"/></svg>`
    case 'half-circle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="url(#half)" stroke="${c}" stroke-width="2.5"/><defs><linearGradient id="half" x1="0" x2="1" y1="0" y2="0"><stop offset="50%" stop-color="${c}"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs></svg>`
    case 'dot-circle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="8" cy="8" r="2.4" fill="${c}"/></svg>`
    case 'chevron':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><path d="M4 2 L11 8 L4 14" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    case 'ring':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="28 10"/></svg>`
    case 'check':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="${c}" stroke-width="2"/><path d="M5 8.3 L7.2 10.5 L11 6" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    case 'square-bang':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2" fill="${c}"/><text x="8" y="11.5" text-anchor="middle" font-size="9" font-weight="800" fill="white">!</text></svg>`
    case 'slashed-square':
      return `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/><line x1="3" y1="13" x2="13" y2="3" stroke="${c}" stroke-width="2"/></svg>`
    default:
      return ''
  }
}

/** A map pin (teardrop) tinted per lifecycle colour, with the shape glyph
 * inset — same "colour AND shape" contract as the list/card views, so a
 * colour-blind rider or a glare-washed screen can still read the map. */
export function lifecyclePinIcon(meta: LifecycleMeta): L.DivIcon {
  const glyph = shapeSvg(meta, 13)
  const html = `
    <div style="position:relative;width:30px;height:38px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
      <svg width="30" height="38" viewBox="0 0 26 32" style="position:absolute;inset:0">
        <path d="M13 31C13 31 24 19.4 24 12A11 11 0 1 0 2 12C2 19.4 13 31 13 31Z" fill="${meta.color}" stroke="white" stroke-width="1.5"/>
      </svg>
      <div style="position:absolute;top:5px;left:8.5px;width:13px;height:13px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center">
        ${glyph}
      </div>
    </div>`
  return L.divIcon({
    html,
    className: 'aiec-map-pin',
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  })
}

/** The rider's own live position — a pulsing blue dot, distinct from the
 * lifecycle-coloured lead pins by design (blue is reserved outside the
 * lifecycle ramp for exactly this). */
export function liveLocationIcon(): L.DivIcon {
  const html = `
    <div style="width:20px;height:20px;position:relative">
      <div style="position:absolute;inset:0;border-radius:50%;background:#1F6FEB;opacity:.25;animation:aiecPulse 1.8s ease-out infinite"></div>
      <div style="position:absolute;inset:5px;border-radius:50%;background:#1F6FEB;border:2.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>
    </div>`
  return L.divIcon({ html, className: 'aiec-map-me', iconSize: [20, 20], iconAnchor: [10, 10] })
}
