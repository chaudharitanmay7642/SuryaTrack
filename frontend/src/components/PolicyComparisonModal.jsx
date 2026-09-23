import { useState, useEffect } from 'react'
import { statesData } from '../data/solarData'

export function PolicyComparisonModal({ isOpen, onClose, initialTab = 'compare', defaultState = 'Maharashtra' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  
  // Comparison API state
  const [comparisonData, setComparisonData] = useState(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareError, setCompareError] = useState(null)

  // Check Rules API state
  const [checkState, setCheckState] = useState(defaultState)
  const [checkDate, setCheckDate] = useState('2026-09-22')
  const [rulesResult, setRulesResult] = useState(null)
  const [rulesLoading, setRulesLoading] = useState(false)
  const [rulesError, setRulesError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      if (defaultState) {
        setCheckState(defaultState)
      }
    }
  }, [isOpen, initialTab, defaultState])

  // Fetch comparison data when modal opens
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setCompareLoading(true)

    fetch('/api/policies/compare')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.comparison)) {
          setComparisonData(data.comparison)
          setCompareError(null)
        }
      })
      .catch(err => {
        if (isMounted) {
          setCompareError('Could not load live comparison from backend; showing baseline.')
        }
      })
      .finally(() => {
        if (isMounted) setCompareLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Fetch applicable rules by date and state
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setRulesLoading(true)
    setRulesError(null)

    const selectedStateObj = statesData.find(s => s.name === checkState || s.id === checkState)
    const stateQuery = selectedStateObj ? selectedStateObj.id : checkState

    fetch(`/api/policies/check-rules?state=${encodeURIComponent(stateQuery)}&applicationDate=${encodeURIComponent(checkDate)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (isMounted && data.success) {
          setRulesResult(data)
        }
      })
      .catch(err => {
        if (isMounted) {
          setRulesError('Failed to fetch rules by date from backend.')
        }
      })
      .finally(() => {
        if (isMounted) setRulesLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, checkState, checkDate])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <span className="modal-tag">POLICY INTELLIGENCE</span>
            <h2 className="modal-title">
              {activeTab === 'compare' ? 'Old Policy vs New Policy (2026 Changes)' : 'Check Subsidy Rules by Application Date'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', padding: '12px 24px 0', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('compare')}
            style={{
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'compare' ? '2px solid #0284c7' : '2px solid transparent',
              color: activeTab === 'compare' ? '#0284c7' : '#64748b'
            }}
          >
            Policy Comparison
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            style={{
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'rules' ? '2px solid #0284c7' : '2px solid transparent',
              color: activeTab === 'rules' ? '#0284c7' : '#64748b'
            }}
          >
            Check Rules by Date
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'compare' ? (
            <>
              <p className="modal-intro">
                Rooftop solar regulations have been updated under the National PM-Surya Ghar framework. Here is a direct side-by-side comparison of what changed for residential consumers:
              </p>

              {compareLoading && (
                <div style={{ textAlign: 'center', padding: '16px', color: '#0284c7', fontSize: '13px' }}>
                  Loading comparison from backend...
                </div>
              )}

              {compareError && (
                <div style={{ padding: '8px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                  ℹ️ {compareError}
                </div>
              )}

              <div className="comparison-modal-grid">
                
                {/* Old Policy Card */}
                <div className="modal-policy-card old">
                  <div className="card-badge-row">
                    <span className="badge-old">PREVIOUS POLICY</span>
                  </div>
                  <h3>Policy Version 2026.1 (Jan 2026)</h3>

                  {comparisonData ? (
                    comparisonData.map((pt, idx) => (
                      <div key={idx} className="compare-point">
                        <strong>⚡ {pt.feature}</strong>
                        <p>{pt.v1}</p>
                      </div>
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
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

                  {comparisonData ? (
                    comparisonData.map((pt, idx) => (
                      <div key={idx} className="compare-point">
                        <strong>⚡ {pt.feature}</strong>
                        <p>{pt.v2}{pt.v3 ? ` • Upcoming: ${pt.v3}` : ''}</p>
                      </div>
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

              </div>

              <div className="modal-note-box">
                <strong>Key Takeaway:</strong> If you registered before April 2026, you may be eligible under grandfathered rules. However, all subsidies now require <strong>NPCI Aadhaar seeding</strong> for direct central bank credit.
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p className="modal-intro">
                Determine exactly which central and state solar regulations apply to your installation based on your DISCOM and application date:
              </p>

              {/* Filters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Select State:
                  </label>
                  <select
                    value={checkState}
                    onChange={(e) => setCheckState(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    {statesData.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Application / Registration Date:
                  </label>
                  <input
                    type="date"
                    value={checkDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {rulesLoading && (
                <div style={{ textAlign: 'center', padding: '16px', color: '#0284c7', fontSize: '13px' }}>
                  Checking applicable policy rules...
                </div>
              )}

              {rulesError && (
                <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '12px' }}>
                  {rulesError}
                </div>
              )}

              {rulesResult?.applicablePolicy && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  {/* Applicable Central Policy */}
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                        {rulesResult.applicablePolicy.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Version: <strong>{rulesResult.applicablePolicy.version}</strong>
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 8px', color: '#14532d', fontSize: '16px' }}>
                      {rulesResult.applicablePolicy.name}
                    </h4>

                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Max Central Subsidy:</span>
                      <strong style={{ display: 'block', fontSize: '18px', color: '#16a34a' }}>
                        {rulesResult.applicablePolicy.maxSubsidy}
                      </strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Policy Rules Summary:</span>
                      <p style={{ fontSize: '13px', color: '#334155', margin: '4px 0 0', lineHeight: 1.4 }}>
                        {rulesResult.applicablePolicy.rulesSummary}
                      </p>
                    </div>
                  </div>

                  {/* State DISCOM Guidelines */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: '15px' }}>
                      🏛️ State DISCOM Guidelines ({rulesResult.query?.state})
                    </h4>

                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Primary DISCOM(s)</span>
                        <strong style={{ color: '#1e293b' }}>{rulesResult.stateGuidelines?.primaryDiscom}</strong>
                      </div>

                      <div>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Applicable Scheme</span>
                        <span style={{ color: '#0369a1' }}>{rulesResult.stateGuidelines?.scheme}</span>
                      </div>

                      <div>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Net-Metering Standard</span>
                        <span style={{ color: '#334155' }}>{rulesResult.stateGuidelines?.netMeteringRule}</span>
                      </div>

                      <div>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Statutory Commissioning SLA</span>
                        <strong style={{ color: '#15803d' }}>{rulesResult.stateGuidelines?.slaDays} Days</strong>
                      </div>

                      {rulesResult.stateGuidelines?.portalUrl && (
                        <div style={{ marginTop: '4px' }}>
                          <a
                            href={rulesResult.stateGuidelines.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}
                          >
                            Visit State DISCOM Portal ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
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

