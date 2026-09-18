import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Lead } from '../lib/types'
import { LIFECYCLE } from '../lib/lifecycle'
import { lifecyclePinIcon, liveLocationIcon } from '../lib/leafletIcons'

export interface MapOpportunity {
  id: string
  buildingName: string
  address: string
  lat: number
  lng: number
  distance: number
}

interface RiderMapProps {
  center: { lat: number; lng: number }
  myPosition: { lat: number; lng: number; accuracy: number }
  leads: Lead[]
  opportunities: MapOpportunity[]
  onOpportunityClick: (id: string) => void
  onLeadClick: (id: string) => void
  heightPx?: number
}

/** A real, full-featured Leaflet map: OSM-family tiles, pan/zoom, a
 * recenter-to-me control, and lifecycle-coloured+shaped pins that mirror the
 * same legend used in the list/card views elsewhere in the app. Replaces the
 * earlier stylised placeholder now that live map tiles are in scope. */
export function RiderMap({
  center,
  myPosition,
  leads,
  opportunities,
  onOpportunityClick,
  onLeadClick,
  heightPx = 320,
}: RiderMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const meMarkerRef = useRef<L.Marker | null>(null)
  const accuracyCircleRef = useRef<L.Circle | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const didInitialFitRef = useRef(false)
  // latest callbacks/data in refs so the marker-rebuild effect doesn't need
  // them as deps (avoids tearing the map down on every parent re-render)
  const cbRef = useRef({ onOpportunityClick, onLeadClick })
  cbRef.current = { onOpportunityClick, onLeadClick }
  const myPositionRef = useRef(myPosition)
  myPositionRef.current = myPosition

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    markerLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    // custom recenter-to-me control, styled to match the app rather than
    // Leaflet's default control chrome
    const RecenterControl = L.Control.extend({
      onAdd: () => {
        const btn = L.DomUtil.create('button', 'aiec-recenter-btn')
        btn.setAttribute('aria-label', 'माझ्या स्थानावर परत या')
        btn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        Object.assign(btn.style, {
          width: '34px',
          height: '34px',
          background: 'white',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,.18)',
          border: 'none',
          cursor: 'pointer',
          color: '#14181C',
        })
        L.DomEvent.disableClickPropagation(btn)
        btn.onclick = () => {
          const m = meMarkerRef.current
          if (m) map.flyTo(m.getLatLng(), 15, { duration: 0.6 })
        }
        return btn
      },
      onRemove: () => {},
    })
    new RecenterControl({ position: 'bottomright' }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      // React StrictMode (and Fast Refresh) mount/cleanup/remount this effect
      // once in dev; without resetting these too, the position/marker
      // effects below see a "already created" ref pointing at a marker that
      // belonged to the just-destroyed map, skip re-creating it on the real
      // map, and the rider's own position/pins silently never appear.
      meMarkerRef.current = null
      accuracyCircleRef.current = null
      markerLayerRef.current = null
      didInitialFitRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // live position marker + accuracy circle — updated in place, not recreated
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const latlng: L.LatLngExpression = [myPosition.lat, myPosition.lng]

    if (!meMarkerRef.current) {
      // No forced z-index: when the rider's own dot and the nearest pin end
      // up close together at a zoomed-out view (fitBounds compresses a wide
      // spread), the natural latitude-based stacking still leaves both
      // reachable by zooming in — permanently pinning "me" on top would
      // instead permanently block whatever pin happens to sit under it.
      meMarkerRef.current = L.marker(latlng, { icon: liveLocationIcon() })
        .addTo(map)
        .bindTooltip('आपले स्थान', { direction: 'top', offset: [0, -8] })
      // Initial framing is handled once by fitBounds below (in the pins
      // effect), which accounts for how far-flung the nearby opportunities
      // actually are — a fixed zoom here would either clip distant pins or
      // sit needlessly wide once real data is loaded.
    } else {
      meMarkerRef.current.setLatLng(latlng)
    }

    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle(latlng, {
        radius: myPosition.accuracy,
        color: '#1F6FEB',
        weight: 1,
        fillColor: '#1F6FEB',
        fillOpacity: 0.08,
      }).addTo(map)
    } else {
      accuracyCircleRef.current.setLatLng(latlng)
      accuracyCircleRef.current.setRadius(myPosition.accuracy)
    }
  }, [myPosition.lat, myPosition.lng, myPosition.accuracy])

  // opportunity + own-lead pins — cheap enough to clear/rebuild on change
  useEffect(() => {
    const map = mapRef.current
    const layer = markerLayerRef.current
    if (!map || !layer) return
    layer.clearLayers()

    for (const o of opportunities) {
      const marker = L.marker([o.lat, o.lng], { icon: lifecyclePinIcon(LIFECYCLE.new) })
      marker.bindTooltip(`${o.buildingName} · ${o.distance}मी`, { direction: 'top', offset: [0, -34] })
      marker.on('click', () => cbRef.current.onOpportunityClick(o.id))
      marker.addTo(layer)
    }

    for (const l of leads) {
      const meta = LIFECYCLE[l.status]
      const marker = L.marker([l.lat, l.lng], { icon: lifecyclePinIcon(meta) })
      marker.bindTooltip(`${l.buildingName} · ${meta.label}`, { direction: 'top', offset: [0, -34] })
      marker.on('click', () => cbRef.current.onLeadClick(l.id))
      marker.addTo(layer)
    }

    // Frame the rider's position plus every pin exactly once on first load —
    // "nearby opportunities" seeded several km away were otherwise clipped
    // or entirely off-screen at a fixed close-in zoom. After this one fit,
    // leave the user's own pan/zoom alone (Law: silent when on track).
    if (!didInitialFitRef.current) {
      const points: L.LatLngExpression[] = [
        [myPositionRef.current.lat, myPositionRef.current.lng],
        ...opportunities.map((o): L.LatLngExpression => [o.lat, o.lng]),
        ...leads.map((l): L.LatLngExpression => [l.lat, l.lng]),
      ]
      if (points.length > 0) {
        map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 15 })
        didInitialFitRef.current = true
      }
    }
  }, [opportunities, leads])

  return (
    <div
      ref={containerRef}
      style={{ height: heightPx }}
      className="w-full rounded-2xl overflow-hidden border border-black/10"
      role="application"
      aria-label="रायडर नकाशा"
    />
  )
}
