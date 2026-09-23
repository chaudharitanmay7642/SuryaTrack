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
 * GET /api/states
 * Returns all supported states with DISCOM, schemes, and net-metering rules.
 */
router.get('/', (req, res) => {
  try {
    const { states } = getSolarData();
    res.json({
      success: true,
      totalStates: states.length,
      states
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states', details: err.message });
  }
});

/**
 * GET /api/states/:id
 * Returns detailed information for a specific state code (e.g., MH, GJ, DL) or state name.
 */
router.get('/:id', (req, res) => {
  try {
    const { states } = getSolarData();
    const query = req.params.id.toLowerCase();
    const state = states.find(s => s.id.toLowerCase() === query || s.name.toLowerCase() === query);

    if (!state) {
      return res.status(404).json({
        error: 'State not found',
        message: `No policy data found for state "${req.params.id}".`
      });
    }

    res.json({
      success: true,
      state
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch state details', details: err.message });
  }
});

export default router;
