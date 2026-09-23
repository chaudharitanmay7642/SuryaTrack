export function Footer({ translations, onNavigate, onOpenGrievance }) {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-top-grid">
          
          <div className="footer-col brand-col">
            <div className="brand-logo-footer">
              <svg viewBox="0 0 40 40" className="sun-panel-svg-footer">
                <circle cx="20" cy="20" r="14" fill="#f59e0b" opacity="0.2" />
                <circle cx="20" cy="20" r="10" fill="#f59e0b" />
                <path d="M12 16 L28 16 M12 24 L28 24 M16 12 L16 28 M24 12 L24 28" stroke="#ffffff" strokeWidth="1.6" />
              </svg>
              <span className="footer-brand-name">SolarTrack</span>
            </div>
            <p className="footer-desc">
              India's dedicated Rooftop Solar Policy & Subsidy Intelligence Platform. Helping homeowners verify subsidy eligibility, understand net-metering regulations, and recover delayed claims.
            </p>
          </div>

          <div className="footer-col">
            <h5>Quick Tools</h5>
            <ul>
              <li><a href="#calculator" onClick={(e) => { e.preventDefault(); onNavigate('calculator'); }}>Subsidy Calculator</a></li>
              <li><a href="#schemes" onClick={(e) => { e.preventDefault(); onNavigate('schemes'); }}>State DISCOM Rules</a></li>
              <li><a href="#timeline" onClick={(e) => { e.preventDefault(); onNavigate('timeline'); }}>Policy Timeline (V1, V2, V3)</a></li>
              <li><a href="#unclaimed-subsidy" onClick={(e) => { e.preventDefault(); onOpenGrievance(); }}>Missed Subsidy Recovery</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Official Portals</h5>
            <ul>
              <li><a href="https://pmsuryaghar.gov.in" target="_blank" rel="noopener noreferrer">National PM Surya Ghar Portal ↗</a></li>
              <li><a href="https://mnre.gov.in" target="_blank" rel="noopener noreferrer">Ministry of New & Renewable Energy (MNRE) ↗</a></li>
              <li><a href="https://myaadhaar.uidai.gov.in" target="_blank" rel="noopener noreferrer">UIDAI Bank Aadhaar Link Status ↗</a></li>
              <li><a href="https://npci.org.in" target="_blank" rel="noopener noreferrer">NPCI Aadhaar Payment Bridge (APB) ↗</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Emergency Helplines</h5>
            <div className="help-box">
              <p>National Solar Toll-Free:</p>
              <strong className="help-phone">15555 / 1800-180-3333</strong>
              <p>DISCOM Electricity Helpline:</p>
              <strong className="help-phone">1912 (All India)</strong>
            </div>
          </div>

        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 SolarTrack | SuryaTrack. Built for clean energy awareness and citizen rights.</p>
          <div className="footer-meta-links">
            <span>Data updated daily against central MNRE gazettes</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
