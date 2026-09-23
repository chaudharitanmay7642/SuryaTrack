export function FeatureCards({ 
  translations, 
  onExploreTimeline, 
  onViewComparison, 
  onCalculateNow, 
  onSearchByState, 
  onChatNow 
}) {
  const features = [
    {
      id: "timeline",
      title: translations.featTimelineTitle,
      desc: translations.featTimelineDesc,
      action: translations.featTimelineAction,
      iconColor: "#0284c7",
      bgColor: "#e0f2fe",
      onClick: onExploreTimeline,
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/><circle cx="15" cy="15" r="3"/><line x1="17.2" y1="17.2" x2="19" y2="19"/></svg>
      )
    },
    {
      id: "compare",
      title: translations.featCompareTitle,
      desc: translations.featCompareDesc,
      action: translations.featCompareAction,
      iconColor: "#0d9488",
      bgColor: "#ccfbf1",
      onClick: onViewComparison,
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><rect width="8" height="14" x="2" y="5" rx="2"/><rect width="8" height="14" x="14" y="5" rx="2"/><path d="M6 9h0"/><path d="M18 9h0"/></svg>
      )
    },
    {
      id: "calc",
      title: translations.featCalcTitle,
      desc: translations.featCalcDesc,
      action: translations.featCalcAction,
      iconColor: "#8b5cf6",
      bgColor: "#ede9fe",
      onClick: onCalculateNow,
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" x2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
      )
    },
    {
      id: "state",
      title: translations.featStateTitle,
      desc: translations.featStateDesc,
      action: translations.featStateAction,
      iconColor: "#f59e0b",
      bgColor: "#fef3c7",
      onClick: onSearchByState,
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      )
    },
    {
      id: "ai",
      title: translations.featAITitle,
      desc: translations.featAIDesc,
      action: translations.featAIAction,
      iconColor: "#0284c7",
      bgColor: "#e0f2fe",
      onClick: onChatNow,
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      )
    }
  ]

  return (
    <section className="feature-cards-section" aria-label="Feature Quick Actions">
      <div className="feature-cards-grid">
        {features.map((f) => (
          <div 
            key={f.id} 
            className="feature-card" 
            onClick={f.onClick}
            role="button" 
            tabIndex={0}
          >
            <div className="feature-icon-box" style={{ backgroundColor: f.bgColor }}>
              {f.svg}
            </div>

            <h3 className="feature-card-title">{f.title}</h3>
            <p className="feature-card-desc">{f.desc}</p>

            <div className="feature-card-action">
              <span>{f.action}</span>
              <span className="action-arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
