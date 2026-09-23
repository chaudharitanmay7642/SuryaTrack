import { useState } from 'react'
import { statesData, subsidyRejectionReasons } from '../data/solarData'

export function MissedSubsidyClaim({ translations, defaultState }) {
  const [activeTab, setActiveTab] = useState('diagnose') // 'diagnose', 'claim', 'track'
  
  // Diagnostic state
  const [selectedIssue, setSelectedIssue] = useState('npci')

  // Claim form state
  const [consumerNo, setConsumerNo] = useState('')
  const [appId, setAppId] = useState('')
  const [stateName, setStateName] = useState(defaultState || 'Maharashtra')
  const [capacityKw, setCapacityKw] = useState('3')
  const [installDate, setInstallDate] = useState('')
  const [issueType, setIssueType] = useState('dbtdelay')
  const [bankIfsc, setBankIfsc] = useState('')
  const [claimSubmitted, setClaimSubmitted] = useState(false)
  const [generatedTicket, setGeneratedTicket] = useState(null)

  // Tracker state
  const [trackQuery, setTrackQuery] = useState('')
  const [trackedResult, setTrackedResult] = useState(null)

  const handleClaimSubmit = (e) => {
    e.preventDefault()
    if (!consumerNo || !installDate) {
      alert('Please fill in your Consumer Number and Installation Date.')
      return
    }

    const randomTicketNo = 'ST-MNRE-' + Math.floor(100000 + Math.random() * 900000)
    const newClaim = {
      ticketNo: randomTicketNo,
      consumerNo,
      appId: appId || 'PMSGY-' + Math.floor(1000000 + Math.random() * 9000000),
      stateName,
      capacityKw,
      installDate,
      bankIfsc,
      issueType,
      submissionDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Escalated to DISCOM Nodal Officer',
      step: 2
    }

    setGeneratedTicket(newClaim)
    setClaimSubmitted(true)
    setTrackedResult(newClaim)
  }

  const handleTrackSearch = (e) => {
    e.preventDefault()
    if (!trackQuery) return

    // If matches generated ticket or mock search
    if (generatedTicket && (trackQuery.toLowerCase() === generatedTicket.ticketNo.toLowerCase() || trackQuery === generatedTicket.consumerNo)) {
      setTrackedResult(generatedTicket)
    } else {
      setTrackedResult({
        ticketNo: trackQuery.startsWith('ST-') ? trackQuery.toUpperCase() : 'ST-MNRE-592810',
        consumerNo: trackQuery.startsWith('ST-') ? '082910482910' : trackQuery,
        appId: 'PMSGY-4910294',
        stateName: stateName || 'Maharashtra',
        capacityKw: '3',
        installDate: '2026-03-12',
        submissionDate: '14 Sep 2026',
        status: 'Verification in Progress by DISCOM',
        step: 2
      })
    }
  }

  const currentRoadblock = subsidyRejectionReasons.find(r => r.id === selectedIssue) || subsidyRejectionReasons[0]

  return (
    <section className="missed-subsidy-section" id="unclaimed-subsidy">
      <div className="section-inner">
        
        {/* Section Header */}
        <div className="section-head-center">
          <div className="alert-badge">
            <span className="badge-icon">⚠️</span>
            <span>{translations.missedSubsidyTag}</span>
          </div>
          <h2 className="section-title">
            {translations.missedSubsidyTitle}
          </h2>
          <p className="section-desc">
            {translations.missedSubsidySub}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="claim-tabs-bar">
          <button 
            className={`tab-btn ${activeTab === 'diagnose' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnose')}
          >
            <span className="tab-num">1</span>
            <span>Diagnose Why Subsidy is Delayed</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'claim' ? 'active' : ''}`}
            onClick={() => setActiveTab('claim')}
          >
            <span className="tab-num">2</span>
            <span>Submit Subsidy Recovery Claim</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <span className="tab-num">3</span>
            <span>Track Claim & DBT Disbursal</span>
          </button>
        </div>

        {/* Tab 1: Diagnostic Resolver */}
        {activeTab === 'diagnose' && (
          <div className="diagnostic-view">
            <div className="diagnostic-grid">
              
              {/* Left Selector List */}
              <div className="issue-selector-col">
                <h4 className="col-title">Common Causes for Delayed Subsidies</h4>
                <div className="issue-items-list">
                  {subsidyRejectionReasons.map((item) => (
                    <div 
                      key={item.id}
                      className={`issue-item-card ${selectedIssue === item.id ? 'active' : ''}`}
                      onClick={() => setSelectedIssue(item.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="issue-item-top">
                        <span className="issue-badge" style={{ backgroundColor: item.badgeColor + '20', color: item.badgeColor }}>
                          {item.badge}
                        </span>
                        <span className="issue-indicator">
                          {selectedIssue === item.id ? '✓' : '→'}
                        </span>
                      </div>
                      <h5 className="issue-item-title">{item.title}</h5>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Diagnostic Breakdown & Resolution Guide */}
              <div className="issue-solution-col">
                <div className="solution-card">
                  <div className="solution-head">
                    <span className="severity-tag">{currentRoadblock.severity}</span>
                    <h3>{currentRoadblock.title}</h3>
                  </div>

                  <div className="solution-body">
                    <div className="info-block">
                      <strong>What is happening?</strong>
                      <p>{currentRoadblock.description}</p>
                    </div>

                    <div className="action-block">
                      <div className="action-icon">💡</div>
                      <div className="action-text">
                        <strong>Instant Fix / Recommended Action:</strong>
                        <p>{currentRoadblock.solution}</p>
                      </div>
                    </div>

                    <div className="tool-tip-box">
                      <strong>Verification Step:</strong>
                      <p>{currentRoadblock.checkAction}</p>
                    </div>
                  </div>

                  <div className="solution-footer">
                    <button 
                      className="btn-resolve-claim"
                      onClick={() => setActiveTab('claim')}
                    >
                      <span>File Subsidy Recovery Claim for this issue</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: File Claim / Grievance Form */}
        {activeTab === 'claim' && (
          <div className="claim-form-view">
            {!claimSubmitted ? (
              <form className="claim-form-card" onSubmit={handleClaimSubmit}>
                <div className="form-header">
                  <h3>Submit Official Subsidy Escalation Claim</h3>
                  <p>Our system compiles your claim into an expedited grievance package sent directly to your state DISCOM's Nodal Officer and the National Portal.</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="consumer-no">Electricity Consumer Number (CA/K No.) *</label>
                    <input 
                      id="consumer-no"
                      type="text" 
                      required 
                      placeholder="e.g. 028491028491" 
                      value={consumerNo}
                      onChange={(e) => setConsumerNo(e.target.value)}
                    />
                    <small>Found on your monthly electricity bill</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="app-id">PM-Surya Ghar Application Number</label>
                    <input 
                      id="app-id"
                      type="text" 
                      placeholder="e.g. PMSGY-2026-92841" 
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                    />
                    <small>Received during online registration (optional if not remembered)</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="claim-state">State & Distribution Company (DISCOM) *</label>
                    <select 
                      id="claim-state"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    >
                      {statesData.map(s => (
                        <option key={s.id} value={s.name}>
                          {s.name} - ({s.discom.split('/')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="claim-capacity">Installed Solar System Capacity (kW) *</label>
                    <select 
                      id="claim-capacity"
                      value={capacityKw}
                      onChange={(e) => setCapacityKw(e.target.value)}
                    >
                      <option value="1">1 kW (Eligible for ₹30,000 subsidy)</option>
                      <option value="2">2 kW (Eligible for ₹60,000 subsidy)</option>
                      <option value="3">3 kW (Eligible for ₹78,000 subsidy)</option>
                      <option value="5">5 kW (Eligible for ₹78,000 max central)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="install-date">Rooftop Solar Installation Date *</label>
                    <input 
                      id="install-date"
                      type="date" 
                      required 
                      value={installDate}
                      onChange={(e) => setInstallDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bank-ifsc">Bank IFSC Code for DBT Verification</label>
                    <input 
                      id="bank-ifsc"
                      type="text" 
                      placeholder="e.g. SBIN0001234" 
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    />
                    <small>Ensure this account has Aadhaar/NPCI enabled</small>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="issue-type">Primary Reason for Delayed Subsidy *</label>
                    <select 
                      id="issue-type"
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                    >
                      <option value="dbtdelay">Subsidy not credited after 30+ days of net-meter commissioning</option>
                      <option value="npci">NPCI / Aadhaar DBT payment failure notification received</option>
                      <option value="vendor">Vendor / Installer has not submitted PCR or Work Completion</option>
                      <option value="netmeter">DISCOM inspection or Net-Meter installation delayed</option>
                      <option value="other">Name mismatch or bank account rejection on portal</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit-claim">
                    <span>Generate & Submit Escalation Dossier</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="claim-success-card">
                <div className="success-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>

                <h3>Subsidy Escalation Claim Successfully Generated!</h3>
                <p className="success-sub">
                  Your grievance dossier has been logged under reference <strong>{generatedTicket.ticketNo}</strong>.
                </p>

                <div className="ticket-summary-box">
                  <div className="ticket-item">
                    <span>Claim Reference ID:</span>
                    <strong>{generatedTicket.ticketNo}</strong>
                  </div>
                  <div className="ticket-item">
                    <span>Consumer Number:</span>
                    <strong>{generatedTicket.consumerNo}</strong>
                  </div>
                  <div className="ticket-item">
                    <span>Expected Subsidy Amount:</span>
                    <strong className="green-text">
                      {generatedTicket.capacityKw === '1' ? '₹30,000' : generatedTicket.capacityKw === '2' ? '₹60,000' : '₹78,000'}
                    </strong>
                  </div>
                  <div className="ticket-item">
                    <span>Target DISCOM:</span>
                    <strong>{generatedTicket.stateName}</strong>
                  </div>
                  <div className="ticket-item">
                    <span>Escalation Status:</span>
                    <span className="status-pill in-progress">{generatedTicket.status}</span>
                  </div>
                </div>

                <div className="success-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setTrackQuery(generatedTicket.ticketNo)
                      setActiveTab('track')
                    }}
                  >
                    Track This Claim in Real-Time →
                  </button>

                  <button 
                    className="btn-secondary"
                    onClick={() => setClaimSubmitted(false)}
                  >
                    Submit Another Claim
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Track Claim Status */}
        {activeTab === 'track' && (
          <div className="track-view">
            
            <form className="track-search-bar" onSubmit={handleTrackSearch}>
              <div className="search-input-wrap">
                <input 
                  type="text"
                  placeholder="Enter Claim Reference ID (e.g. ST-MNRE-...) or Electricity Consumer No."
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                />
                <button type="submit" className="track-submit-btn">
                  <span>Track Status</span>
                  <span>→</span>
                </button>
              </div>
            </form>

            {trackedResult && (
              <div className="tracker-card">
                <div className="tracker-card-head">
                  <div>
                    <span className="claim-id-tag">Claim ID: {trackedResult.ticketNo}</span>
                    <h4>Consumer No: {trackedResult.consumerNo}</h4>
                  </div>
                  <span className="live-status-pill">
                    ● {trackedResult.status}
                  </span>
                </div>

                {/* Progress Stepper */}
                <div className="progress-steps-row">
                  
                  <div className={`step-item ${trackedResult.step >= 1 ? 'completed' : ''}`}>
                    <div className="step-circle">{trackedResult.step > 1 ? '✓' : '1'}</div>
                    <span className="step-label">Claim Lodged</span>
                    <span className="step-date">{trackedResult.submissionDate}</span>
                  </div>

                  <div className={`step-connector ${trackedResult.step >= 2 ? 'completed' : ''}`}></div>

                  <div className={`step-item ${trackedResult.step >= 2 ? 'active' : ''}`}>
                    <div className="step-circle">2</div>
                    <span className="step-label">DISCOM & Vendor Review</span>
                    <span className="step-date">In Progress</span>
                  </div>

                  <div className={`step-connector ${trackedResult.step >= 3 ? 'completed' : ''}`}></div>

                  <div className={`step-item ${trackedResult.step >= 3 ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <span className="step-label">NPCI / Bank Re-mapping</span>
                    <span className="step-date">Pending</span>
                  </div>

                  <div className={`step-connector ${trackedResult.step >= 4 ? 'completed' : ''}`}></div>

                  <div className={`step-item ${trackedResult.step >= 4 ? 'active' : ''}`}>
                    <div className="step-circle">4</div>
                    <span className="step-label">DBT Subsidy Disbursal</span>
                    <span className="step-date">Estimated ~7 Days</span>
                  </div>

                </div>

                {/* Resolution Advisory Box */}
                <div className="tracker-advice-box">
                  <div className="advice-header">
                    <strong>Current Resolution Action:</strong>
                  </div>
                  <p>
                    Your escalation has been routed to the <strong>{trackedResult.stateName} DISCOM Nodal Officer</strong>. 
                    If your bank account was unseeded, please ensure you submit the NPCI Aadhaar mandate at your home bank branch within 5 working days.
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Direct Helpline & Escalation Strip */}
        <div className="helpline-footer-strip">
          <div className="strip-item">
            <span className="strip-icon">📞</span>
            <div>
              <strong>PM Surya Ghar National Helpline</strong>
              <span>Toll Free: 15555 / 1800-180-3333</span>
            </div>
          </div>

          <div className="strip-item">
            <span className="strip-icon">🌐</span>
            <div>
              <strong>National Solar Portal</strong>
              <span>pmsuryaghar.gov.in</span>
            </div>
          </div>

          <div className="strip-item">
            <span className="strip-icon">⚡</span>
            <div>
              <strong>Average Resolution Time</strong>
              <span>7 - 14 Working Days</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
