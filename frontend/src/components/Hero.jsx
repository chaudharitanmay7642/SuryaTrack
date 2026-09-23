import { useState, useEffect } from 'react'

export function Hero({ 
  translations, 
  onCheckSubsidy, 
  onCheckRulesByDate, 
  onViewLatestScheme, 
  onViewWhatChanged 
}) {
  const [latestUpdate, setLatestUpdate] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetch('/api/policies/updates')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch updates')
        return res.json()
      })
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.updates) && data.updates.length > 0) {
          setLatestUpdate(data.updates[0])
        }
      })
      .catch(() => {
        // Fallback to static translation data
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="hero-grid" id="home">
      
      {/* Left Large Hero Card */}
      <div className="hero-main-card">
        <div className="hero-content">
          
          <div className="policy-badge">
            <span className="badge-leaf">🍃</span>
            <span>{translations.heroBadge}</span>
          </div>

          <h1 className="hero-title">
            {translations.heroTitle}
          </h1>

          <p className="hero-subtitle">
            {translations.heroSub}
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onCheckSubsidy}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="btn-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>{translations.checkSubsidyBtn}</span>
              <span className="arrow">→</span>
            </button>

            <button className="btn-secondary" onClick={onCheckRulesByDate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span>{translations.checkRulesBtn}</span>
              <span className="chevron">&gt;</span>
            </button>

            <button className="btn-secondary" onClick={onViewLatestScheme}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="btn-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>{translations.viewLatestSchemeBtn}</span>
              <span className="chevron">&gt;</span>
            </button>
          </div>

        </div>

        {/* Decorative Solar Illustration on the right of Left Card */}
        <div className="hero-graphic">
          <div className="slogan-badge">
            <span>{translations.cleanEnergyBanner}</span>
            <span className="leaf-icon">🌿</span>
          </div>

          <div className="house-solar-art">
            <svg viewBox="0 0 320 220" className="solar-house-svg">
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sun */}
              <circle cx="270" cy="40" r="35" fill="url(#sunGlow)" />
              <circle cx="270" cy="40" r="18" fill="#f59e0b" />

              {/* Distant Trees & Greenery */}
              <path d="M10 180 Q40 160 80 180 T160 175 T240 180 T310 175 L310 220 L10 220 Z" fill="#bbf7d0" opacity="0.6"/>
              
              {/* House Base */}
              <rect x="70" y="115" width="180" height="95" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* Windows & Door */}
              <rect x="90" y="135" width="36" height="36" rx="3" fill="#e0f2fe" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="108" y1="135" x2="108" y2="171" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="90" y1="153" x2="126" y2="153" stroke="#94a3b8" strokeWidth="1.5" />

              <rect x="145" y="140" width="30" height="70" rx="3" fill="#334155" />
              <circle cx="152" cy="175" r="2.5" fill="#f8fafc" />

              <rect x="195" y="135" width="36" height="36" rx="3" fill="#e0f2fe" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="213" y1="135" x2="213" y2="171" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="195" y1="153" x2="231" y2="153" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Roof */}
              <polygon points="55,115 160,50 265,115" fill="url(#roofGrad)" />

              {/* Solar Panels on the Roof */}
              <g transform="translate(100, 65) skewX(-24)">
                {/* Main Panel Array */}
                <rect x="0" y="0" width="85" height="42" rx="2" fill="url(#panelGrad)" stroke="#60a5fa" strokeWidth="1.5" />
                {/* Solar Cells Grid */}
                <line x1="0" y1="14" x2="85" y2="14" stroke="#93c5fd" strokeWidth="1" opacity="0.8" />
                <line x1="0" y1="28" x2="85" y2="28" stroke="#93c5fd" strokeWidth="1" opacity="0.8" />
                <line x1="21" y1="0" x2="21" y2="42" stroke="#93c5fd" strokeWidth="1" opacity="0.8" />
                <line x1="42" y1="0" x2="42" y2="42" stroke="#93c5fd" strokeWidth="1" opacity="0.8" />
                <line x1="63" y1="0" x2="63" y2="42" stroke="#93c5fd" strokeWidth="1" opacity="0.8" />
              </g>

              {/* Sparkles / Sun reflections */}
              <path d="M125 75 L130 80 M130 75 L125 80" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M165 85 L170 90 M170 85 L165 90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* Right Card: Latest Policy Updates */}
      <div className="hero-update-card">
        <div className="update-card-header">
          <div className="update-title-wrap">
            <span className="bell-icon">🔔</span>
            <h3>{translations.latestUpdatesTitle}</h3>
          </div>
          <button className="view-all-link" onClick={onViewWhatChanged}>
            {translations.viewAll}
          </button>
        </div>

        <div className="update-card-body">
          <div className="new-tag-row">
            <span className="new-pill">
              {latestUpdate ? latestUpdate.badge : translations.newUpdateBadge}
            </span>
          </div>

          <h4 className="update-headline">
            {latestUpdate ? latestUpdate.title : translations.newUpdateTitle}
          </h4>

          <div className="update-meta">
            <p className="meta-row">
              <span className="meta-bullet">•</span>
              {latestUpdate ? `Published on: ${latestUpdate.publishedOn}` : translations.publishedOn}
            </p>
            <p className="meta-row">
              <span className="meta-bullet">•</span>
              {latestUpdate ? `Effective from: ${latestUpdate.effectiveFrom}` : translations.effectiveFrom}
            </p>
          </div>

          <button className="btn-action-view" onClick={onViewWhatChanged}>
            <span>{translations.viewWhatChanged}</span>
            <span className="arrow">→</span>
          </button>
        </div>
      </div>

    </section>
  )
}

