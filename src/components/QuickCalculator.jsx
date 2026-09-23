import { useState } from 'react'
import { statesData, calculateSubsidy } from '../data/solarData'

export function QuickCalculator({ translations, selectedState, setSelectedState }) {
  const [capacity, setCapacity] = useState('3')

  const state = statesData.find(s => s.name === selectedState) || statesData[0]
  const calculation = calculateSubsidy(capacity, state.id)

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
      <div className="calc-results-box">
        
        <div className="calc-result-col subsidy-col">
          <span className="result-label">{translations.estSubsidy}</span>
          <span className="result-value green-text">
            {formatRupees(calculation.totalSubsidy)}
          </span>
          <span className="subsidy-subtext">
            Central: {formatRupees(calculation.centralSubsidy)}
            {calculation.stateSubsidy > 0 ? ` + State: ${formatRupees(calculation.stateSubsidy)}` : ''}
          </span>
        </div>

        <div className="calc-result-col cost-col">
          <span className="result-label">{translations.estCost}</span>
          <span className="result-value dark-text">
            {formatRupees(calculation.estimatedCostAfterSubsidy)}
          </span>
          <span className="subsidy-subtext">
            Total System Cost: ~{formatRupees(calculation.totalSystemCost)}
          </span>
        </div>

      </div>

      <p className="calc-footnote">
        {translations.calcNote}
      </p>

    </div>
  )
}
