import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data', 'solarData.json');

const router = Router();

function getSolarData() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

/**
 * POST /api/calculator/estimate
 * Body: { capacityKw: number, stateId?: string, stateName?: string }
 * Computes exact PM-Surya Ghar subsidies, benchmark costs, and payback period.
 */
router.post('/estimate', (req, res) => {
  try {
    const { capacityKw, stateId, stateName } = req.body;
    const kw = parseFloat(capacityKw);

    if (isNaN(kw) || kw <= 0) {
      return res.status(400).json({
        error: 'Invalid capacity',
        message: 'Please provide a valid solar system capacity in kW (greater than 0).'
      });
    }

    const { states, meta } = getSolarData();
    let state = states.find(s => 
      (stateId && s.id.toLowerCase() === stateId.toLowerCase()) ||
      (stateName && s.name.toLowerCase() === stateName.toLowerCase())
    );

    if (!state) {
      state = states.find(s => s.id === 'MH'); // Default to Maharashtra as seen in UI
    }

    // Benchmark solar system cost: Rs 65,000 / kW (standard PM Surya Ghar rate)
    const benchmarkRate = state.solarRatePerKw || meta.benchmarkCostPerKw || 65000;
    const totalEstimatedCost = Math.round(kw * benchmarkRate);

    // PM-Surya Ghar standard central subsidy calculation:
    // 1 kW -> Rs 30,000
    // 2 kW -> Rs 60,000
    // 3 kW+ -> Rs 78,000 max central subsidy
    let centralSubsidy = 0;
    if (kw <= 1) {
      centralSubsidy = 30000;
    } else if (kw <= 2) {
      centralSubsidy = 30000 + Math.round((kw - 1) * 30000);
    } else {
      centralSubsidy = 78000;
    }

    const stateSubsidy = state.stateSubsidyBonus || 0;
    const totalSubsidy = centralSubsidy + stateSubsidy;
    const netPayableCost = Math.max(totalEstimatedCost - totalSubsidy, 0);

    // Energy estimates (Average 4 units per kW per day in India)
    const estimatedDailyUnitsKwh = Number((kw * 4).toFixed(1));
    const estimatedAnnualUnitsKwh = Math.round(kw * 4 * 365);
    const averageGridTariff = 8.0; // Rs 8/unit average residential tariff
    const estimatedAnnualSavings = Math.round(estimatedAnnualUnitsKwh * averageGridTariff);

    // ROI payback years calculation
    const roiPaybackYears = Number((netPayableCost / (estimatedAnnualSavings || 1)).toFixed(1));

    return res.json({
      success: true,
      scheme: meta.nationalScheme,
      policyVersion: state.version,
      state: {
        id: state.id,
        name: state.name,
        primaryDiscom: state.discom,
        applicableScheme: state.scheme,
        netMeteringRule: state.netMeteringRule
      },
      capacityKw: kw,
      benchmarkRatePerKw: benchmarkRate,
      totalEstimatedCost,
      governmentSubsidy: {
        centralSubsidy,
        stateSubsidy,
        totalSubsidy
      },
      netPayableCost,
      roiPaybackYears,
      energyGeneration: {
        dailyUnitsKwh: estimatedDailyUnitsKwh,
        annualUnitsKwh: estimatedAnnualUnitsKwh,
        annualSavingsInr: estimatedAnnualSavings
      },
      disbursalNotice: "Subsidies are credited directly to your bank account via DBT within 15–30 days post net-meter commissioning by DISCOM."
    });
  } catch (error) {
    return res.status(500).json({ error: 'Calculation failed', details: error.message });
  }
});

export default router;
