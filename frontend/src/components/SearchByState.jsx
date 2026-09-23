import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { statesData } from '../data/solarData'

export function SearchByState({ 
  translations, 
  selectedState, 
  setSelectedState, 
  onViewStateDetails 
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const circleLayerRef = useRef(null)
  const markerLayerRef = useRef(null)
  const isFirstLoadRef = useRef(true)

  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [states, setStates] = useState(statesData)
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Fetch all states from backend on mount
  useEffect(() => {
    let isMounted = true
    fetch('/api/states')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.states)) {
          const merged = data.states.map(s => {
            const local = statesData.find(loc => loc.id === s.id || loc.name.toLowerCase() === s.name.toLowerCase())
            return {
              ...s,
              lat: local?.lat ?? 20.5937,
              lng: local?.lng ?? 78.9629,
              radius: local?.radius ?? 270000
            }
          })
          setStates(merged)
        }
      })
      .catch(() => {
        // Graceful fallback to static statesData
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Find current selected state from list
  const currentState = states.find(s => s.name === selectedState) || states[0]

  // Fetch specific state details when selectedState changes
  useEffect(() => {
    let isMounted = true
    if (!currentState?.id) return

    setLoadingDetails(true)
    fetch(`/api/states/${encodeURIComponent(currentState.id)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.state) {
          setSelectedDetails(data.state)
        }
      })
      .catch(() => {
        if (isMounted) setSelectedDetails(null)
      })
      .finally(() => {
        if (isMounted) setLoadingDetails(false)
      })

    return () => {
      isMounted = false
    }
  }, [currentState?.id])

  const activeState = selectedDetails || currentState

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Prevent double initialization in React StrictMode
    if (!mapInstanceRef.current) {
      // Center of India, zoomed out to show the full country
      const map = L.map(mapContainerRef.current, {
        center: [22.5, 82.0],
        zoom: 4,
        minZoom: 3.5,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      })

      // Standard OSM Tile Layer with fast CDN
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      // Add compact zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map)

      mapInstanceRef.current = map

      // Invalidate size after initial render to avoid gray tiles
      setTimeout(() => {
        map.invalidateSize()
      }, 250)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Handle zoom and dotted circle when state is entered/changed by user
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // "At first the map shouldnt be zoomed in at all"
    // On the very first mount, keep the map completely zoomed out showing all of India!
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false
      map.setView([22.5, 82.0], 4)
      return
    }

    // When the state is selected/entered:
    if (currentState && currentState.lat && currentState.lng) {
      setIsZoomedIn(true)

      // 1. Remove previous circle & marker
      if (circleLayerRef.current) {
        map.removeLayer(circleLayerRef.current)
      }
      if (markerLayerRef.current) {
        map.removeLayer(markerLayerRef.current)
      }

      // 2. Draw dotted circle encircling the state
      const dottedCircle = L.circle([currentState.lat, currentState.lng], {
        radius: currentState.radius || 270000,
        color: '#0284c7',        // Solid outline color
        weight: 2.5,
        opacity: 0.95,
        dashArray: '6, 8',       // DOTTED CIRCLE
        fillColor: '#38bdf8',
        fillOpacity: 0.14,
      }).addTo(map)

      // 3. Center dot marker with popup
      const centerMarker = L.circleMarker([currentState.lat, currentState.lng], {
        radius: 5,
        color: '#ffffff',
        fillColor: '#0284c7',
        fillOpacity: 1,
        weight: 2
      }).addTo(map)

      centerMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 2px;">
          <strong style="color: #0c4a6e; font-size: 13px;">${currentState.name}</strong><br/>
          <span style="color: #64748b;">DISCOM: ${currentState.discom.split('/')[0]}</span><br/>
          <span style="color: #16a34a; font-weight: 600;">Scheme: ${currentState.scheme.split('+')[0]}</span>
        </div>
      `)

      circleLayerRef.current = dottedCircle
      markerLayerRef.current = centerMarker

      // 4. Smoothly zoom only as much as needed so the ENTIRE state and its boundaries are visible
      const circleBounds = dottedCircle.getBounds()
      map.flyToBounds(circleBounds, {
        padding: [25, 25],
        maxZoom: currentState.id === 'DL' ? 8 : 5.8,
        duration: 1.4,
        easeLinearity: 0.25
      })
    }
  }, [selectedState, currentState])

  // Reset to zoomed-out All-India view
  const handleResetZoom = () => {
    const map = mapInstanceRef.current
    if (!map) return

    map.flyTo([22.5, 82.0], 4, { duration: 1.2 })

    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current)
      circleLayerRef.current = null
    }
    if (markerLayerRef.current) {
      map.removeLayer(markerLayerRef.current)
      markerLayerRef.current = null
    }

    setIsZoomedIn(false)
  }

  // Explicitly zoom into the currently selected state if not already zoomed
  const handleZoomToState = (stateName) => {
    setSelectedState(stateName)
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false
    }
  }

  return (
    <div className="dashboard-widget state-widget" id="schemes">
      
      <div className="widget-header">
        <div className="widget-title-row">
          <span className="widget-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
          </span>
          <h3>{translations.searchStateTitle}</h3>
        </div>

        {isZoomedIn && (
          <button 
            className="reset-map-btn" 
            onClick={handleResetZoom}
            title="Reset to All India Overview"
          >
            ↺ Zoom Out (All India)
          </button>
        )}
      </div>

      {/* State Dropdown Selector */}
      <div className="state-selector-bar">
        <select
          value={selectedState}
          onChange={(e) => {
            const newState = e.target.value
            handleZoomToState(newState)
          }}
          className="state-dropdown-input"
          aria-label="Select state for scheme lookup"
        >
          {states.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="state-dropdown-arrow">›</span>
      </div>

      <div className="state-display-split">
        
        {/* Leaflet Map Container */}
        <div className="leaflet-map-wrapper">
          <div 
            ref={mapContainerRef} 
            className="leaflet-map-element"
            role="region"
            aria-label="Interactive State Map"
          />

          {/* Map Overlay Status Hint */}
          <div className="map-zoom-hint">
            {isZoomedIn ? (
              <span className="hint-pill zoomed">
                <span className="dot pulse">●</span> Focused on {activeState.name}
              </span>
            ) : (
              <button 
                className="hint-pill default-click" 
                onClick={() => handleZoomToState(activeState.name)}
              >
                🔍 Click to zoom into {activeState.name}
              </button>
            )}
          </div>
        </div>

        {/* State Details Card */}
        <div className="state-info-card">
          <div className="state-name-header" onClick={onViewStateDetails} role="button" tabIndex={0}>
            <h4>{activeState.name}</h4>
            <span className="state-arrow">&gt;</span>
          </div>

          <div className="state-specs-list" style={{ opacity: loadingDetails ? 0.7 : 1 }}>
            <div className="spec-item">
              <span className="spec-icon">⚙️</span>
              <div className="spec-text">
                <span className="spec-label">{translations.discomLabel}:</span>
                <span className="spec-val">{activeState.discom}</span>
              </div>
            </div>

            <div className="spec-item">
              <span className="spec-icon">📜</span>
              <div className="spec-text">
                <span className="spec-label">{translations.schemeLabel}:</span>
                <span className="spec-val">{activeState.scheme}</span>
              </div>
            </div>

            <div className="spec-item">
              <span className="spec-icon">📋</span>
              <div className="spec-text">
                <span className="spec-label">{translations.latestVersionLabel}:</span>
                <span className="spec-val highlight-version">{activeState.version}</span>
              </div>
            </div>

            <div className="spec-item">
              <span className="spec-icon">🕒</span>
              <div className="spec-text">
                <span className="spec-label">Effective From:</span>
                <span className="spec-val">{activeState.effectiveDate}</span>
              </div>
            </div>
          </div>

          <button className="view-details-action" onClick={onViewStateDetails}>
            <span>{translations.viewDetails}</span>
            <span>→</span>
          </button>
        </div>

      </div>

    </div>
  )
}
