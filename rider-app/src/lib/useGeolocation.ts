import { useEffect, useState } from 'react'
import { RIDER_START_POSITION } from './mock'

export type GeoStatus = 'locating' | 'ready' | 'denied' | 'unavailable'

interface GeoState {
  status: GeoStatus
  lat: number
  lng: number
  accuracy: number
}

/**
 * Wraps the browser Geolocation API. Falls back to a fixed demo position
 * (Pune) when permission is denied or the API is unavailable, so the rider
 * flow is always demonstrable — but the status is surfaced honestly so the
 * capture button can show its own condition per Law IV.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    status: 'locating',
    lat: RIDER_START_POSITION.lat,
    lng: RIDER_START_POSITION.lng,
    accuracy: 999,
  })
  const [forced, setForced] = useState(false)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, status: 'unavailable' }))
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: 'ready',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        })
      },
      (err) => {
        setState((s) => ({
          ...s,
          status: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable',
        }))
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 8000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const forceDemo = () => {
    setForced(true)
    setState((s) => ({ ...s, status: 'ready', accuracy: 8 }))
  }

  return { ...state, status: forced ? 'ready' : state.status, forceDemo }
}
