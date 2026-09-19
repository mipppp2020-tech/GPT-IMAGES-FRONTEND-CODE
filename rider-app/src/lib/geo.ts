/** Haversine distance in metres between two lat/lng points. */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Small deterministic jitter so demo captures don't all land on one pixel. */
export function jitterCoord(base: { lat: number; lng: number }, metres = 120) {
  const dLat = ((Math.random() - 0.5) * metres) / 111000
  const dLng =
    ((Math.random() - 0.5) * metres) / (111000 * Math.cos((base.lat * Math.PI) / 180))
  return { lat: base.lat + dLat, lng: base.lng + dLng }
}
