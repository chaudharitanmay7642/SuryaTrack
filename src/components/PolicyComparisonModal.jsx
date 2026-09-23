export function PolicyComparisonModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <span className="modal-tag">POLICY COMPARISON</span>
            <h2 className="modal-title">Old Policy vs New Policy (2026 Changes)</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Rooftop solar regulations have been updated under the National PM-Surya Ghar framework. Here is a direct side-by-side comparison of what changed for residential consumers:
          </p>

          <div className="comparison-modal-grid">
            
            {/* Old Policy Card */}
            <div className="modal-policy-card old">
              <div className="card-badge-row">
                <span className="badge-old">PREVIOUS POLICY</span>
              </div>
              <h3>Policy Version 2026.1 (Jan 2026)</h3>

              <div className="compare-point">
                <strong>💰 Subsidy Structure</strong>
                <p>Flat 20% to 40% CAPEX benchmark subsidy up to 10 kW. Disbursement through state DISCOM with 60–90 days processing delay.</p>
              </div>

              <div className="compare-point">
                <strong>⚡ Net Metering</strong>
                <p>Traditional bidirectional net-metering permitted up to 100% of sanctioned connected load. Banking allowed on quarterly basis.</p>
              </div>

              <div className="compare-point">
                <strong>📋 Eligibility & Inspection</strong>
                <p>Manual paper inspection by DISCOM junior engineers. Physical paper claims submitted at regional division offices.</p>
              </div>

              <div className="compare-point">
                <strong>🏦 Bank Verification</strong>
                <p>Manual bank passbook verification with high rejection rate due to branch code changes.</p>
              </div>
            </div>

            <div className="comparison-divider">
              <span className="divider-arrow">→</span>
            </div>

            {/* New Policy Card */}
            <div className="modal-policy-card new">
              <div className="card-badge-row">
                <span className="badge-new">CURRENT & UPCOMING (2026.2+)</span>
              </div>
              <h3>Policy Version 2026.2 (Apr - Aug 2026)</h3>

              <div className="compare-point">
                <strong>💰 Subsidy Structure</strong>
                <p>Standardized PM Surya Ghar: ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and above, plus state top-ups.</p>
              </div>

              <div className="compare-point">
                <strong>⚡ Net Metering</strong>
                <p>Mandatory Smart Meter integration with Time-of-Day (ToD) solar feed-in tariffs. Faster 15-day synchronization SLA.</p>
              </div>

              <div className="compare-point">
                <strong>📋 Eligibility & Inspection</strong>
                <p>100% digital app-based inspection with geotagged plant photographs and online Project Commissioning Report (PCR).</p>
              </div>

              <div className="compare-point">
                <strong>🏦 Bank Verification</strong>
                <p>Automated Aadhaar-enabled NPCI DBT payout directly from central treasury into consumer's bank account within 15 days.</p>
              </div>
            </div>

          </div>

          <div className="modal-note-box">
            <strong>Key Takeaway:</strong> If you registered before April 2026, you may be eligible under grandfathered rules. However, all subsidies now require <strong>NPCI Aadhaar seeding</strong> for direct central bank credit.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Got it, Close
          </button>
        </div>

      </div>
    </div>
  )
}
