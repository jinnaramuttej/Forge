const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');
const { loadAllCsvData } = require('../src/services/csvImport.service');
const { db } = require('../src/database/supabase');
const { seedPoliciesAndMemory } = require('../scripts/seedMemory');

let serverInstance;
let baseUrl;

describe('Finance REST API Endpoints', () => {
  before(async () => {
    // Load dataset and start server on random port
    const dataset = await loadAllCsvData();
    for (const [table, rows] of Object.entries(dataset)) {
      db.localStore[table] = rows;
    }
    await seedPoliciesAndMemory();

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

  it('GET /api/health should return 200 and system status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.ok(data.database);
    assert.ok(data.llmMode);
  });

  it('GET /api/finance/summary should return financial metrics', async () => {
    const res = await fetch(`${baseUrl}/api/finance/summary`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.companyName, 'Peak District Outdoor Supplies Ltd');
    assert.ok(data.totalGrossRevenue > 0);
  });

  it('GET /api/finance/revenue should return revenue breakdown', async () => {
    const res = await fetch(`${baseUrl}/api/finance/revenue`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.totalGrossRevenue > 0);
    assert.ok(Array.isArray(data.monthlyBreakdown));
  });

  it('GET /api/finance/expenses should return expense structure', async () => {
    const res = await fetch(`${baseUrl}/api/finance/expenses`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.annualPayroll > 0);
    assert.strictEqual(data.activeEmployeeCount, 10);
  });

  it('GET /api/finance/cashflow should return cashflow statement', async () => {
    const res = await fetch(`${baseUrl}/api/finance/cashflow`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.totalCashInflows > 0);
    assert.ok(typeof data.isCashFlowPositive === 'boolean');
  });

  it('GET /api/finance/runway should return runway metrics', async () => {
    const res = await fetch(`${baseUrl}/api/finance/runway`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.runwayMonths > 0);
    assert.ok(typeof data.isSafe60Days === 'boolean');
  });

  it('GET /api/finance/invoices should return outstanding invoices', async () => {
    const res = await fetch(`${baseUrl}/api/finance/invoices`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.totalOutstandingInvoices > 0);
    assert.ok(Array.isArray(data.invoices));
  });
});
