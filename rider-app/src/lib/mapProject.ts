import { ZONES, RIDER_START_POSITION } from './mock'

const allPoints = [...Object.values(ZONES), RIDER_START_POSITION]
const PAD = 0.006

const bounds = allPoints.reduce(
  (acc, p) => ({
    minLat: Math.min(acc.minLat, p.lat),
    maxLat: Math.max(acc.maxLat, p.lat),
    minLng: Math.min(acc.minLng, p.lng),
    maxLng: Math.max(acc.maxLng, p.lng),
  }),
  { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 },
)

bounds.minLat -= PAD
bounds.maxLat += PAD
bounds.minLng -= PAD
bounds.maxLng += PAD

/** Projects a lat/lng into a 0-100 percentage box for the stylised (non-tile) map. */
export function project(lat: number, lng: number) {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
  const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100
  return { x: Math.min(97, Math.max(3, x)), y: Math.min(95, Math.max(5, y)) }
}
