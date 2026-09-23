export function GreenBanner({ translations, onOpenAIChat }) {
  return (
    <div className="green-banner-wrapper">
      <div className="green-banner-strip">
        
        {/* Left Green Mission */}
        <div className="green-mission">
          <div className="leaf-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          <div className="mission-text">
            <h4>{translations.greenTitle}</h4>
            <p>{translations.greenSub}</p>
          </div>
        </div>

        {/* Feature Highlights Badges */}
        <div className="green-badges-list">
          <div className="green-pill-item">
            <span className="pill-icon">🍃</span>
            <span>{translations.cleanEnergy}</span>
          </div>

          <div className="green-pill-item">
            <span className="pill-icon">⚡</span>
            <span>{translations.lowerBills}</span>
          </div>

          <div className="green-pill-item">
            <span className="pill-icon">🌐</span>
            <span>{translations.reducedCarbon}</span>
          </div>

          <div className="green-pill-item">
            <span className="pill-icon">🏠</span>
            <span>{translations.sustainableFuture}</span>
          </div>
        </div>

      </div>

      {/* Floating Action Button for AI Assistant matching bottom right in screenshot */}
      <button 
        className="fab-ask-solartrack"
        onClick={onOpenAIChat}
        title="Ask SolarTrack AI Assistant"
      >
        <span className="fab-sprout">🌱</span>
        <span className="fab-label">{translations.askSolarTrack}</span>
        <span className="fab-dot">●</span>
      </button>
    </div>
  )
}
