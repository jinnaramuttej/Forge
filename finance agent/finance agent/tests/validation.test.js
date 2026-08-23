const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');
const {
  identifyDocumentType,
  extractFinancialClaims,
  validateFinancialDocument
} = require('../src/services/reportValidation.service');
const { validateFinancialReport } = require('../src/tools/validation.tool');
const { runFinanceAgent } = require('../src/agent/graph');
const { loadAllCsvData } = require('../src/services/csvImport.service');
const { db } = require('../src/database/supabase');
const { seedPoliciesAndMemory } = require('../scripts/seedMemory');

let serverInstance;
let baseUrl;

const COMPANY_ID = 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628';

describe('Demo 2: Autonomous Financial Report & Funding Validation Agent Tests', () => {
  before(async () => {
    // Load dataset and seed initial policies/memories
    const dataset = await loadAllCsvData();
    for (const [table, rows] of Object.entries(dataset)) {
      db.localStore[table] = rows;
    }
    await seedPoliciesAndMemory(COMPANY_ID);

    await new Promise((resolve) => {
      serverInstance = app.listen(0, () => {
        const port = serverInstance.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
    }
  });

  it('should identify document types accurately', () => {
    assert.strictEqual(identifyDocumentType('Our Series A pitch deck for outdoor gear').type, 'pitch_deck_financials');
    assert.strictEqual(identifyDocumentType('Innovate UK Smart Grant Application Section 4').type, 'grant_application');
    assert.strictEqual(identifyDocumentType('Term Loan and working capital facility proposal for Barclays').type, 'bank_loan_proposal');
    assert.strictEqual(identifyDocumentType('Monthly investor update for July 2024').type, 'investor_update');
  });

  it('should extract financial claims from structured JSON and raw text', () => {
    // Structured JSON
    const structured = {
      revenue: 500000,
      cashBalance: 175000,
      expenses: 60000,
      runwayMonths: 12,
      headcount: 15,
      customers: 150,
      profit: 100000
    };
    const res1 = extractFinancialClaims(structured);
    assert.strictEqual(res1.claims.revenue, 500000);
    assert.strictEqual(res1.claims.cashBalance, 175000);
    assert.strictEqual(res1.claims.runwayMonths, 12);
    assert.strictEqual(res1.claims.headcount, 15);
    assert.strictEqual(res1.claims.profit, 100000);

    // Raw text with regex extraction
    const rawText = 'Our company generated Gross Revenue of £450000 with a current cash balance of £175000 and 10 months runway with a team size of 12 employees.';
    const res2 = extractFinancialClaims(rawText);
    assert.strictEqual(res2.claims.revenue, 450000);
    assert.strictEqual(res2.claims.cashBalance, 175000);
    assert.strictEqual(res2.claims.runwayMonths, 10);
    assert.strictEqual(res2.claims.headcount, 12);
  });

  // TEST 1 (Rule 15): Pitch Deck (Revenue: £500,000, Runway: 12 months)
  it('TEST 1: Pitch Deck Validation (Revenue £500k vs Actual £496.9k, Runway 12mo vs Actual 5.76mo)', async () => {
    const pitchDeckClaims = {
      revenue: 500000,
      runwayMonths: 12
    };

    const validation = await validateFinancialDocument(COMPANY_ID, pitchDeckClaims, 'Series A Pitch Deck Financials');

    assert.strictEqual(validation.documentType, 'pitch_deck_financials');
    assert.strictEqual(validation.validationStatus, 'NEEDS_REVIEW');
    assert.ok(validation.discrepancies.length >= 2);
    
    // Check runway discrepancy was calculated deterministically
    const runwayDisc = validation.discrepancies.find(d => d.field === 'Cash Runway (Months)');
    assert.ok(runwayDisc);
    assert.strictEqual(runwayDisc.claimedValue, 12);
    assert.strictEqual(runwayDisc.actualValue, 5.76);
    assert.strictEqual(runwayDisc.severity, 'CRITICAL');

    assert.ok(validation.recommendedFixes.some(f => f.includes('Adjust runway claim')));
  });

  // TEST 2 (Rule 15): Grant Application with Intentionally Inconsistent Arithmetic
  it('TEST 2: Grant Application with Inconsistent Arithmetic (Rev £500k, Exp £200k, Profit £350k)', async () => {
    const grantClaims = {
      revenue: 500000,
      expenses: 200000,
      profit: 350000 // Inconsistent: 500,000 - 200,000 = 300,000 != 350,000
    };

    const validation = await validateFinancialDocument(COMPANY_ID, grantClaims, 'Innovate UK Grant Proposal');

    assert.strictEqual(validation.documentType, 'grant_application');
    assert.strictEqual(validation.validationStatus, 'CONTRADICTION');
    assert.ok(validation.arithmeticChecks.length > 0);
    
    const profitCheck = validation.arithmeticChecks.find(c => c.check.includes('Net Profit Arithmetic'));
    assert.ok(profitCheck);
    assert.strictEqual(profitCheck.isValid, false);
    assert.strictEqual(profitCheck.status, 'CONTRADICTION');
    assert.strictEqual(profitCheck.expectedResult, 300000);
    assert.strictEqual(profitCheck.claimedResult, 350000);
    assert.strictEqual(profitCheck.difference, 50000);

    assert.ok(validation.recommendedFixes.some(f => f.includes('arithmetic contradiction')));
  });

  // TEST 3 (Rule 15): Investor Update with Accurate Figures
  it('TEST 3: Investor Update with Accurate Figures (Full Match -> VERIFIED)', async () => {
    const accurateClaims = {
      revenue: 496919.13,
      cashBalance: 175000.00,
      runwayMonths: 5.76,
      headcount: 10
    };

    const validation = await validateFinancialDocument(COMPANY_ID, accurateClaims, 'July 2024 Investor Monthly Update');

    assert.strictEqual(validation.validationStatus, 'VERIFIED');
    assert.strictEqual(validation.overallScore, 100);
    assert.strictEqual(validation.discrepancies.filter(d => d.severity !== 'LOW').length, 0);
  });

  // TEST 4 (Rule 15): Bank Loan Proposal Claiming 15 Employees while Actual is 10
  it('TEST 4: Bank Loan Proposal Claiming 15 Employees vs 10 Actual', async () => {
    const loanClaims = {
      headcount: 15
    };

    const validation = await validateFinancialDocument(COMPANY_ID, loanClaims, 'Barclays Term Loan Proposal');

    assert.strictEqual(validation.documentType, 'bank_loan_proposal');
    assert.strictEqual(validation.validationStatus, 'NEEDS_REVIEW');
    
    const headDisc = validation.discrepancies.find(d => d.field === 'Employee Headcount');
    assert.ok(headDisc);
    assert.strictEqual(headDisc.claimedValue, 15);
    assert.strictEqual(headDisc.actualValue, 10);
    assert.strictEqual(headDisc.difference, 5);
    assert.strictEqual(headDisc.severity, 'HIGH');

    assert.ok(validation.recommendedFixes.some(f => f.includes('10 active staff members')));
  });

  it('should execute validateFinancialReport registered tool', async () => {
    const res = await validateFinancialReport(COMPANY_ID, {
      document: { revenue: 496919.13, cashBalance: 175000, runwayMonths: 5.76 },
      title: 'Board Summary Q2'
    });

    assert.ok(res.documentType);
    assert.ok(Array.isArray(res.discrepancies));
    assert.strictEqual(res.validationStatus, 'VERIFIED');
  });

  it('HTTP POST /api/agent/validate-report endpoint should return structured validation', async () => {
    const res = await fetch(`${baseUrl}/api/agent/validate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId: COMPANY_ID,
        title: 'Pitch Deck Slide 5',
        document: {
          revenue: 650000,
          cashBalance: 175000,
          runwayMonths: 12,
          headcount: 15
        }
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.documentTitle, 'Pitch Deck Slide 5');
    assert.strictEqual(data.validationStatus, 'NEEDS_REVIEW');
    assert.ok(data.discrepancies.length > 0);
    assert.ok(data.recommendedFixes.length > 0);
    assert.ok(typeof data.summary === 'string');
    assert.ok(typeof data.validationReportMarkdown === 'string');
  });

  it('LangGraph Agent should autonomously validate document via natural language prompt', async () => {
    const res = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Validate this report against our company actual financial data: Claimed Revenue £700,000, Cash £175,000, Runway 18 months, Team size 15.'
    });

    assert.strictEqual(res.status, 'completed');
    assert.ok(res.findings.validateFinancialReport, 'Agent must plan and execute validateFinancialReport tool');
    assert.ok(res.finalResponse.includes('Financial Document Validation Report') || res.finalResponse.includes('Claimed'));
  });
});
