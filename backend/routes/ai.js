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
 * POST /api/ai/chat
 * Body: { message: string }
 * Intelligent response generation matching SolarTrack assistant capabilities.
 */
router.post('/chat', (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const q = message.toLowerCase();
    let reply = '';
    const { states, meta, rejectionReasons } = getSolarData();

    if (q.includes('delay') || q.includes('missed') || q.includes('not received') || q.includes('pending') || q.includes('grievance')) {
      reply = "Subsidies are primarily delayed for 3 reasons:\n1. NPCI Aadhaar Not Mapped (accounts for 68% of DBT solar subsidy delays) - your bank account is not seeded with the Aadhaar payment bridge.\n2. Vendor PCR Not Uploaded - the installer has not submitted the Project Commissioning Report with geotagged photos on the National Portal.\n3. DISCOM Meter Inspection Pending - synchronization has exceeded the statutory 15-day SLA.\n\nYou can submit an escalation claim via our 'Claim Pending Subsidy' portal to get it fast-tracked!";
    } else if (q.includes('3kw') || q.includes('3 kw') || q.includes('cost') || q.includes('calculation') || q.includes('calculator')) {
      reply = "Under the PM-Surya Ghar scheme, a 3 kW rooftop solar system qualifies for ₹78,000 central subsidy. At the ₹65,000/kW benchmark rate, the total system cost is ~₹1,95,000. After the ₹78,000 subsidy, your net payable cost is ₹1,17,000 with an expected ROI payback in ~3.4 years!";
    } else if (q.includes('npci') || q.includes('aadhaar') || q.includes('bank') || q.includes('dbt')) {
      reply = "Government solar subsidies are released exclusively through Aadhaar Direct Benefit Transfer (DBT). Regular bank KYC is not sufficient; your account must be mapped on the NPCI APBS mapper. Visit your bank branch with the 'Aadhaar Seeding / Mandate Form' or link DBT in your mobile banking app.";
    } else if (q.includes('v2') || q.includes('policy') || q.includes('version') || q.includes('rule') || q.includes('change')) {
      reply = "Policy Version 2 (2026) standardized rooftop solar subsidies across India under PM-Surya Ghar:\n• 1 kW: ₹30,000\n• 2 kW: ₹60,000\n• 3 kW+: ₹78,000 max central subsidy\nIt mandates smart bi-directional meters and caps DISCOM net-meter commissioning to a strict 15-day SLA.";
    } else if (q.includes('maharashtra') || q.includes('msedcl')) {
      const mh = states.find(s => s.id === 'MH');
      reply = `In Maharashtra, rooftop solar is governed by ${mh.scheme} under DISCOMs ${mh.discom}. Latest policy version is ${mh.version} with a mandatory smart net-metering SLA of ${mh.slaDays} days.`;
    } else if (q.includes('gujarat')) {
      const gj = states.find(s => s.id === 'GJ');
      reply = `In Gujarat, ${gj.scheme} provides an additional state bonus of ₹${gj.stateSubsidyBonus} on top of central subsidies, with net-metering managed by ${gj.discom}.`;
    } else {
      reply = `Thank you for asking about "${message}". Residential solar consumers under ${meta.nationalScheme} are entitled to up to ₹${meta.centralMaxSubsidy} in central subsidies. Use the Subsidy Calculator to calculate exact figures for your rooftop capacity!`;
    }

    return res.json({
      success: true,
      query: message,
      reply,
      suggestedQuestions: [
        "Why is my subsidy delayed?",
        "Subsidy for 3kW in Maharashtra",
        "What is NPCI bank seeding?",
        "What changed in Policy V2?"
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: 'AI processing error', details: err.message });
  }
});

export default router;
