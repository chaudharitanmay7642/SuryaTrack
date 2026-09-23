import { useState, useRef, useEffect } from 'react'
import logoImg from '../assets/suryatrack_logo.jpg'

export function Header({ 
  currentLang, 
  setCurrentLang, 
  translations, 
  onNavigate,
  onOpenGrievance
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const langRef = useRef(null)
  const notifRef = useRef(null)

  const languages = [
    { code: 'English', label: 'English', flag: '🇬🇧' },
    { code: 'हिंदी', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'मराठी', label: 'मराठी', flag: '🇮🇳' },
    { code: 'ગુજરાતી', label: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'தமிழ்', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ಕನ್ನಡ', label: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ]

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="site-header">
      <div className="header-container">
        
        {/* Left Corner: Actions & Brand Logo */}
        <div className="header-left-section">
          
          {/* Action Buttons (Notification, Language, Profile) in Left Corner */}
          <div className="header-actions">
            
            {/* Notification Button & Popover */}
            <div className="notif-wrapper" ref={notifRef}>
              <button 
                className="action-btn notif-btn" 
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="View notifications"
                title="Notifications"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span className="notif-badge"></span>
              </button>

              {notifOpen && (
                <div className="notif-popover">
                  <div className="popover-header">
                    <h4>Notifications</h4>
                    <span className="popover-badge">1 New</span>
                  </div>
                  <div className="popover-item unread">
                    <div className="popover-dot"></div>
                    <div className="popover-text">
                      <strong>Maharashtra Rooftop Subsidy</strong>
                      <p>New subsidy version V2.0 detected with revised net-metering norms.</p>
                      <span className="popover-time">10 mins ago</span>
                    </div>
                  </div>
                  <div className="popover-item">
                    <div className="popover-text">
                      <strong>PM-Surya Ghar Notice</strong>
                      <p>Mandatory NPCI bank seeding required for pending subsidies.</p>
                      <span className="popover-time">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="lang-wrapper" ref={langRef}>
              <button 
                className="lang-btn" 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-expanded={langMenuOpen}
                title="Change Language"
              >
                <span className="lang-flag">🌐</span>
                <span className="lang-current">{currentLang}</span>
                <svg className={`chevron ${langMenuOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {langMenuOpen && (
                <div className="lang-dropdown">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-option ${currentLang === lang.code ? 'selected' : ''}`}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setLangMenuOpen(false)
                      }}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span className="lang-text">{lang.label}</span>
                      {currentLang === lang.code && (
                        <svg className="check-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="profile-btn" title="User Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>

          </div>

          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => onNavigate('home')} role="button" tabIndex={0}>
            <img src={logoImg} alt="SuryaTrack Logo" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-title">SuryaTrack</span>
              <span className="brand-subtitle">{translations.tagline}</span>
            </div>
          </div>

        </div>

        {/* Navigation Links */}
        <nav className="main-nav" aria-label="Main Navigation">
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="nav-item active">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </a>
          <a href="#check" onClick={(e) => { e.preventDefault(); onNavigate('check'); }} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Check My Subsidy</span>
          </a>
          <a href="#timeline" onClick={(e) => { e.preventDefault(); onNavigate('timeline'); }} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Policy Timeline</span>
          </a>
          <a href="#schemes" onClick={(e) => { e.preventDefault(); onNavigate('schemes'); }} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Schemes</span>
          </a>
          <a href="#calculator" onClick={(e) => { e.preventDefault(); onNavigate('calculator'); }} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
            <span>Calculator</span>
          </a>
          <a href="#unclaimed-subsidy" onClick={(e) => { e.preventDefault(); onOpenGrievance(); }} className="nav-item highlight-nav">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Claim Pending Subsidy</span>
          </a>
          <a href="#documents" onClick={(e) => { e.preventDefault(); onNavigate('documents'); }} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
            <span>Documents</span>
          </a>
          <a href="#help" onClick={(e) => { e.preventDefault(); onNavigate('help'); }} className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Help</span>
          </a>
        </nav>

      </div>
    </header>
  )
}
