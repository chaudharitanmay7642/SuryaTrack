# SuryaTrack Backend API

Production-ready Node.js & Express REST API for **SuryaTrack (SolarTrack)** — supporting India's National Rooftop Solar Mission, policy version tracking, instant subsidy calculations, and Direct Benefit Transfer (DBT) grievance resolution.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
From this directory:
```bash
npm install
```

### Start the Server
```bash
# Production start
npm start

# Development mode with auto-reload
npm run dev
```
The server runs by default on `http://localhost:5000`.

---

## API Endpoints Reference

### 1. Subsidy Calculator
- **`POST /api/calculator/estimate`**
  - **Body**: `{ "capacityKw": 3, "stateId": "MH" }`
  - Returns: Benchmark cost (@ ₹65,000/kW), central subsidy (₹78,000), state subsidy bonus, net payable cost (₹1,17,000), annual generation (kWh), annual savings, and estimated ROI payback period (~3.4 years).

### 2. State-wise Schemes & DISCOMs
- **`GET /api/states`**: Returns policy guidelines, primary DISCOMs, and net-metering rules for all 28 states & UTs.
- **`GET /api/states/:id`**: Details for a single state (e.g. `/api/states/MH`, `/api/states/GJ`).

### 3. Policy Tracking & Timelines
- **`GET /api/policies/updates`**: Latest detected policy updates (e.g., Maharashtra rooftop solar notification published 18 Sep 2026).
- **`GET /api/policies/timeline`**: Versions (V1, V2, V3, V2.4) with effective dates and subsidy structures.
- **`GET /api/policies/compare`**: Side-by-side comparison of rules between policy versions.
- **`GET /api/policies/check-rules?state=MH&applicationDate=2026-09-18`**: Evaluates which rules apply on a given date.

### 4. Grievance & Delayed Subsidy Portal
- **`GET /api/grievance/reasons`**: Diagnostic list of rejection causes (NPCI Aadhaar not mapped, vendor PCR pending, DISCOM inspection pending).
- **`POST /api/grievance/claim`**: Lodge an escalation claim for delayed DBT subsidy. Generates tracking ticket (e.g. `ST-MNRE-XXXXXX`) with statutory 15-day SLA.
- **`GET /api/grievance/track/:query`**: Track claim status by ticket number or consumer number.

### 5. AI Assistant
- **`POST /api/ai/chat`**
  - **Body**: `{ "message": "Why is my subsidy delayed?" }`
  - Returns intelligent guidance based on national and state guidelines.
