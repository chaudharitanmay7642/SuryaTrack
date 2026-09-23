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

// In-memory claims database with default seed records
const claimsStore = [
  {
    ticketNo: "ST-MNRE-592810",
    consumerNo: "082910482910",
    appId: "PMSGY-4910294",
    stateName: "Maharashtra",
    capacityKw: "3",
    installDate: "2026-03-12",
    issueType: "npci",
    submissionDate: "14 Sep 2026",
    status: "Verification in Progress by DISCOM",
    currentStep: 2,
    steps: [
      { step: 1, title: "Claim Registered", date: "14 Sep 2026", completed: true },
      { step: 2, title: "Escalated to DISCOM Nodal Officer", date: "16 Sep 2026", completed: true },
      { step: 3, title: "NPCI / Meter Inspection Fix", date: "In Progress", completed: false },
      { step: 4, title: "DBT Subsidy Disbursed", date: "Pending", completed: false }
    ],
    nodalOfficerRemarks: "Notice sent to MSEDCL sub-division for urgent net-meter inspection verification."
  }
];

/**
 * GET /api/grievance/reasons
 * Returns common subsidy rejection reasons & solutions (From Image 1).
 */
router.get('/reasons', (req, res) => {
  try {
    const { rejectionReasons } = getSolarData();
    res.json({
      success: true,
      totalReasons: rejectionReasons.length,
      reasons: rejectionReasons
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reasons', details: err.message });
  }
});

/**
 * POST /api/grievance/claim
 * Submits an escalation claim for unreceived / delayed solar subsidy.
 */
router.post('/claim', (req, res) => {
  try {
    const { consumerNo, appId, stateName, capacityKw, installDate, bankIfsc, issueType, remarks } = req.body;

    if (!consumerNo || !installDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'consumerNo and installDate are required to submit an escalation claim.'
      });
    }

    const ticketNo = 'ST-MNRE-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // SLA resolution target: 15 business days
    const slaTarget = new Date();
    slaTarget.setDate(slaTarget.getDate() + 15);
    const slaDateStr = slaTarget.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newClaim = {
      ticketNo,
      consumerNo,
      appId: appId || 'PMSGY-' + Math.floor(1000000 + Math.random() * 9000000),
      stateName: stateName || 'Maharashtra',
      capacityKw: capacityKw || '3',
      installDate,
      bankIfsc: bankIfsc || 'N/A',
      issueType: issueType || 'npci',
      remarks: remarks || '',
      submissionDate: dateStr,
      slaTargetDate: slaDateStr,
      status: 'Escalated to DISCOM Nodal Officer',
      currentStep: 2,
      steps: [
        { step: 1, title: 'Claim Registered', date: dateStr, completed: true },
        { step: 2, title: 'Escalated to DISCOM Nodal Officer', date: dateStr, completed: true },
        { step: 3, title: 'NPCI / Meter Inspection Fix', date: 'In Progress', completed: false },
        { step: 4, title: 'DBT Subsidy Disbursed', date: 'Expected by ' + slaDateStr, completed: false }
      ],
      nodalOfficerRemarks: 'Escalation assigned to District Solar Officer. Net-metering & Aadhaar bridge review initiated under 15-day statutory SLA.'
    };

    claimsStore.unshift(newClaim);

    return res.status(201).json({
      success: true,
      message: 'Escalation claim successfully registered.',
      claim: newClaim
    });
  } catch (err) {
    return res.status(500).json({ error: 'Claim submission failed', details: err.message });
  }
});

/**
 * GET /api/grievance/track/:query
 * Tracks claim status by ticket number (e.g. ST-MNRE-592810) or electricity consumer number.
 */
router.get('/track/:query', (req, res) => {
  try {
    const q = req.params.query.trim().toLowerCase();
    const found = claimsStore.find(c => 
      c.ticketNo.toLowerCase() === q || 
      c.consumerNo.toLowerCase() === q ||
      c.appId.toLowerCase() === q
    );

    if (found) {
      return res.json({
        success: true,
        source: 'database',
        claim: found
      });
    }

    // Dynamic mock response if tracking an unregistered number
    const isTicket = q.startsWith('st-');
    const dynamicClaim = {
      ticketNo: isTicket ? q.toUpperCase() : 'ST-MNRE-' + Math.floor(100000 + Math.random() * 900000),
      consumerNo: isTicket ? '082910' + Math.floor(100000 + Math.random() * 900000) : q,
      appId: 'PMSGY-' + Math.floor(1000000 + Math.random() * 9000000),
      stateName: 'Maharashtra',
      capacityKw: '3',
      installDate: '2026-04-10',
      submissionDate: '15 Sep 2026',
      status: 'Verification in Progress by DISCOM',
      currentStep: 2,
      steps: [
        { step: 1, title: 'Claim Registered', date: '15 Sep 2026', completed: true },
        { step: 2, title: 'Escalated to DISCOM Nodal Officer', date: '17 Sep 2026', completed: true },
        { step: 3, title: 'NPCI / Meter Inspection Fix', date: 'In Progress', completed: false },
        { step: 4, title: 'DBT Subsidy Disbursed', date: 'Pending', completed: false }
      ],
      nodalOfficerRemarks: 'DISCOM inspection report awaiting junior engineer digital sign-off on National Portal.'
    };

    return res.json({
      success: true,
      source: 'simulated',
      claim: dynamicClaim
    });
  } catch (err) {
    return res.status(500).json({ error: 'Tracking failed', details: err.message });
  }
});

export default router;
