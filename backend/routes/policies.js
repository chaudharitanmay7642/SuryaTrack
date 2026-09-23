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
 * GET /api/policies/updates
 * Returns latest policy updates & announcements (e.g. Maharashtra update from Image 3).
 */
router.get('/updates', (req, res) => {
  try {
    const { policyUpdates } = getSolarData();
    res.json({
      success: true,
      count: policyUpdates.length,
      updates: policyUpdates
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policy updates', details: err.message });
  }
});

/**
 * GET /api/policies/timeline
 * Returns historical and active policy versions (V1, V2, V3, V2.4).
 */
router.get('/timeline', (req, res) => {
  try {
    const { policyVersions } = getSolarData();
    res.json({
      success: true,
      versions: policyVersions
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline', details: err.message });
  }
});

/**
 * GET /api/policies/compare
 * Side-by-side comparison of solar subsidy policy versions.
 */
router.get('/compare', (req, res) => {
  try {
    const comparison = [
      {
        feature: "Max Central Subsidy",
        v1: "₹78,000 (up to 5 kW)",
        v2: "₹78,000 (capped at 3 kW)",
        v3: "₹78,000 (capped at 3 kW with Time-of-Day bonus)"
      },
      {
        feature: "DBT Disbursal SLA",
        v1: "60 to 90 Days",
        v2: "30 Days post-commissioning",
        v3: "15 Days fast-track DBT"
      },
      {
        feature: "Aadhaar NPCI Seeding",
        v1: "Optional / Manual IFSC",
        v2: "Mandatory via APBS",
        v3: "Automated Pre-validation on Application"
      },
      {
        feature: "Net-Metering Standard",
        v1: "Conventional Bi-directional",
        v2: "Smart Bi-directional Meter",
        v3: "IoT Smart Meter + ToD Feed-in Tariff"
      }
    ];

    res.json({
      success: true,
      comparison
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comparison', details: err.message });
  }
});

/**
 * GET /api/policies/check-rules
 * Query parameters: state (e.g. MH) and applicationDate (e.g. 2026-09-18)
 * Determines which subsidy policy rules apply for a consumer.
 */
router.get('/check-rules', (req, res) => {
  try {
    const { state: stateQuery, applicationDate } = req.query;
    const { states, policyVersions } = getSolarData();

    const state = states.find(s => 
      s.id.toLowerCase() === (stateQuery || 'MH').toLowerCase() ||
      s.name.toLowerCase() === (stateQuery || '').toLowerCase()
    ) || states[0];

    const targetDate = applicationDate ? new Date(applicationDate) : new Date();
    let applicableVersion = policyVersions.find(v => v.status === 'Active Policy') || policyVersions[1];

    if (targetDate < new Date('2026-04-01')) {
      applicableVersion = policyVersions.find(v => v.version === 'V1');
    } else if (targetDate >= new Date('2026-08-01')) {
      applicableVersion = policyVersions.find(v => v.version === 'V3') || applicableVersion;
    }

    res.json({
      success: true,
      query: { state: state.name, applicationDate: targetDate.toISOString().split('T')[0] },
      applicablePolicy: {
        version: applicableVersion.version,
        name: applicableVersion.label,
        status: applicableVersion.status,
        maxSubsidy: applicableVersion.subsidy,
        rulesSummary: applicableVersion.keyChanges
      },
      stateGuidelines: {
        primaryDiscom: state.discom,
        scheme: state.scheme,
        netMeteringRule: state.netMeteringRule,
        slaDays: state.slaDays,
        portalUrl: state.portalUrl
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Check rules failed', details: err.message });
  }
});

export default router;
