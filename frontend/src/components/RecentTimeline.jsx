import { useState, useEffect } from 'react'
import { policyVersions } from '../data/solarData'

export function RecentTimeline({ translations, onOpenTimelineModal }) {
  const [versions, setVersions] = useState(policyVersions)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetch('/api/policies/timeline')
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok')
        return res.json()
      })
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.versions)) {
          setVersions(data.versions)
        }
      })
      .catch(() => {
        // Fallback to static policyVersions silently
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const activePolicy = versions.find(v => v.status === 'Active Policy') || versions[1] || versions[0]

  return (
    <div className="dashboard-widget timeline-widget" id="timeline">
      <div className="widget-header">
        <div className="widget-title-row">
          <span className="widget-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <h3>{translations.recentTimelineTitle}</h3>
        </div>
        <button className="widget-link-btn" onClick={onOpenTimelineModal}>
          {translations.viewFullTimeline} →
        </button>
      </div>

      <div className="timeline-stepper" style={{ opacity: loading ? 0.7 : 1 }}>
        
        {/* Connecting line */}
        <div className="stepper-track-line"></div>

        <div className="stepper-nodes">
          {versions.map((item) => (
            <div key={item.version} className={`stepper-node node-${item.version.toLowerCase().replace('.', '_')}`}>
              
              <span className="node-date-top">{item.date}</span>

              <div 
                className="node-circle"
                style={{ borderColor: item.color, backgroundColor: item.color }}
              >
                <span className="circle-text">{item.version}</span>
              </div>

              <div className="node-info-bottom">
                <span className="node-version-name">{item.label}</span>
                <span className="node-subsidy-val">Subsidy: <strong>{item.subsidy}</strong></span>
                <span className="node-capacity-val">Capacity: {item.capacity}</span>
              </div>

            </div>
          ))}
        </div>

      </div>

      <div className="timeline-caption">
        <span className="caption-dot active">●</span> Active Policy: <strong>{activePolicy ? `${activePolicy.label} (${activePolicy.date})` : 'Version 2 (Apr 2026)'}</strong> — PM-Surya Ghar Standardized Grid Rules.
      </div>
    </div>
  )
}

