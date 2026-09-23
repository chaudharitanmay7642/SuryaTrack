import { useState, useEffect } from 'react'
import { statesData, calculateSubsidy } from '../data/solarData'

export function QuickCalculator({ translations, selectedState, setSelectedState }) {
  const [capacity, setCapacity] = useState('3')
  const [backendResult, setBackendResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const state = statesData.find(s => s.name === selectedState) || statesData[0]
  const localCalc = calculateSubsidy(capacity, state?.id || 'MH')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    fetch('/api/calculator/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capacityKw: parseFloat(capacity) || 3,
        stateId: state?.id,
        stateName: selectedState
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (isMounted) {
          if (data.success) {
            setBackendResult(data)
            setError(null)
          } else {
            setError(data.message || 'Calculation error')
          }
        }
      })
      .catch(err => {
        if (isMounted) {
          setError('Backend offline: using local estimate')
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [capacity, selectedState, state?.id])

  const totalSubsidy = backendResult?.governmentSubsidy?.totalSubsidy ?? localCalc.totalSubsidy
  const centralSubsidy = backendResult?.governmentSubsidy?.centralSubsidy ?? localCalc.centralSubsidy
  const stateSubsidy = backendResult?.governmentSubsidy?.stateSubsidy ?? localCalc.stateSubsidy
  const netPayableCost = backendResult?.netPayableCost ?? localCalc.estimatedCostAfterSubsidy
  const totalCost = backendResult?.totalEstimatedCost ?? localCalc.totalSystemCost

  const formatRupees = (val) => {
    return '₹' + Number(val).toLocaleString('en-IN')
  }

  return (
    <div className="dashboard-widget calc-widget" id="calculator">
      
      <div className="widget-header">
        <div className="widget-title-row">
          <span className="widget-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" x2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
          </span>
          <h3>{translations.quickCalcTitle}</h3>
        </div>
        {loading && <span style={{ fontSize: '11px', color: '#0284c7' }}>Calculating...</span>}
      </div>

      <div className="calc-inputs-row">
        
        {/* Select State */}
        <div className="calc-input-group">
          <label htmlFor="calc-state-select">{translations.selectState}</label>
          <div className="select-wrapper">
            <select
              id="calc-state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="calc-select"
            >
              {statesData.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        {/* System Capacity (kW) */}
        <div className="calc-input-group">
          <label htmlFor="calc-capacity-select">{translations.capacityLabel}</label>
          <div className="select-wrapper">
            <select
              id="calc-capacity-select"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="calc-select"
            >
              <option value="1">1 kW (Saves ~120 kWh/mo)</option>
              <option value="2">2 kW (Saves ~240 kWh/mo)</option>
              <option value="3">3 kW (Recommended for homes)</option>
              <option value="4">4 kW (Medium household)</option>
              <option value="5">5 kW (Large villa/bungalow)</option>
              <option value="10">10 kW (Commercial/Society)</option>
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

      </div>

      {/* Results Display Box */}
      <div className="calc-results-box" style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s ease' }}>
        
        <div className="calc-result-col subsidy-col">
          <span className="result-label">{translations.estSubsidy}</span>
          <span className="result-value green-text">
            {formatRupees(totalSubsidy)}
          </span>
          <span className="subsidy-subtext">
            Central: {formatRupees(centralSubsidy)}
            {stateSubsidy > 0 ? ` + State: ${formatRupees(stateSubsidy)}` : ''}
          </span>
        </div>

        <div className="calc-result-col cost-col">
          <span className="result-label">{translations.estCost}</span>
          <span className="result-value dark-text">
            {formatRupees(netPayableCost)}
          </span>
          <span className="subsidy-subtext">
            Total System Cost: ~{formatRupees(totalCost)}
          </span>
        </div>

      </div>

      {backendResult?.roiPaybackYears && (
        <div style={{ fontSize: '11px', color: '#16a34a', margin: '6px 0 0 0', display: 'flex', justifyContent: 'space-between' }}>
          <span>Estimated Payback: ~{backendResult.roiPaybackYears} years</span>
          {backendResult.energyGeneration?.annualSavingsInr && (
            <span>Annual Savings: {formatRupees(backendResult.energyGeneration.annualSavingsInr)}/yr</span>
          )}
        </div>
      )}

      {error && (
        <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>
          ℹ️ {error}
        </div>
      )}

      <p className="calc-footnote">
        {translations.calcNote}
      </p>

    </div>
  )
}

