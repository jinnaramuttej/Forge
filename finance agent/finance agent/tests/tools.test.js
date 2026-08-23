const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const { loadAllCsvData } = require('../src/services/csvImport.service');
const { db } = require('../src/database/supabase');
const { seedPoliciesAndMemory } = require('../scripts/seedMemory');
const tools = require('../src/tools');

const COMPANY_ID = 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628';

describe('Financial Tools Integration Tests', () => {
  before(async () => {
    // Ensure dataset is loaded
    const dataset = await loadAllCsvData();
    for (const [table, rows] of Object.entries(dataset)) {
      db.localStore[table] = rows;
    }
    await seedPoliciesAndMemory(COMPANY_ID);
  });

  it('should execute getFinancialSummary tool with real dataset numbers', async () => {
    const res = await tools.getFinancialSummary(COMPANY_ID);
    assert.strictEqual(res.companyName, 'Peak District Outdoor Supplies Ltd');
    assert.ok(res.totalGrossRevenue > 0, 'Gross revenue must be positive');
    assert.ok(res.totalSalesOrders === 200, 'Must have 200 sales orders');
    assert.ok(res.activeEmployees === 10, 'Must have 10 employees');
    assert.ok(res.runwayMonths > 0, 'Runway months must be calculated');
  });

  it('should execute getRevenue tool and return monthly breakdown', async () => {
    const res = await tools.getRevenue(COMPANY_ID);
    assert.ok(res.totalGrossRevenue > 0);
    assert.ok(Array.isArray(res.monthlyBreakdown));
    assert.ok(res.monthlyBreakdown.length > 0);
  });

  it('should execute getExpenses tool and return payroll and opex', async () => {
    const res = await tools.getExpenses(COMPANY_ID);
    assert.ok(res.annualPayroll > 0);
    assert.ok(res.monthlyPayroll > 0);
    assert.strictEqual(res.activeEmployeeCount, 10);
  });

  it('should execute getTransactions tool from journal entries', async () => {
    const res = await tools.getTransactions(COMPANY_ID, { limit: 10 });
    assert.strictEqual(res.returnedCount, 10);
    assert.ok(res.totalTransactions >= 200);
  });

  it('should execute getSales and getOutstandingInvoices tools', async () => {
    const sales = await tools.getSales(COMPANY_ID, { limit: 5 });
    assert.strictEqual(sales.returnedCount, 5);

    const invoices = await tools.getOutstandingInvoices(COMPANY_ID);
    assert.ok(invoices.totalOutstandingInvoices > 0);
    assert.ok(invoices.totalOutstandingAmountGbp > 0);
  });

  it('should execute calculateCashFlow tool', async () => {
    const res = await tools.calculateCashFlow(COMPANY_ID);
    assert.ok(res.totalCashInflows > 0);
    assert.ok(res.totalCashOutflows > 0);
  });

  it('should execute calculateBurnRate tool', async () => {
    const res = await tools.calculateBurnRate(COMPANY_ID);
    assert.ok(res.grossMonthlyBurnRate > 0);
  });

  it('should execute calculateRunway tool and assess 60-day safety', async () => {
    const res = await tools.calculateRunway(COMPANY_ID, { currentCashBalance: 175000 });
    assert.ok(res.runwayMonths > 0);
    assert.ok(typeof res.isSafe60Days === 'boolean');
    assert.ok(typeof res.safetyAssessment === 'string');
  });

  it('should execute compareBudget tool across departments', async () => {
    const res = await tools.compareBudget(COMPANY_ID);
    assert.strictEqual(res.departmentsAnalyzed, 4);
    assert.ok(res.departments.some(d => d.code === 'DIR'));
  });

  it('should execute detectAnomalies tool', async () => {
    const res = await tools.detectAnomalies(COMPANY_ID);
    assert.ok(typeof res.anomalyCount === 'number');
    assert.ok(Array.isArray(res.anomalies));
  });

  it('should execute getCompanyPolicy, saveMemory, retrieveMemory, and recordAgentAction', async () => {
    const policies = await tools.getCompanyPolicy(COMPANY_ID, { policyType: 'payment_threshold' });
    assert.ok(policies.length > 0);

    // Save memory
    const saved = await tools.saveMemoryTool(COMPANY_ID, {
      category: 'test_memory',
      key: 'test_key',
      value: { note: 'test value' }
    });
    assert.strictEqual(saved.key, 'test_key');

    // Retrieve memory
    const retrieved = await tools.retrieveMemoryTool(COMPANY_ID, { query: 'test' });
    assert.ok(retrieved.memories.some(m => m.key === 'test_key'));

    // Record action
    const action = await tools.recordAgentAction(COMPANY_ID, {
      actionType: 'payment_reminder',
      description: 'Send payment reminder for invoice #123',
      amount: 50.00,
      reason: 'Overdue by 10 days'
    });
    assert.strictEqual(action.requires_approval, false, 'Action <= £100 should execute autonomously');
    assert.strictEqual(action.status, 'executed');
  });

  it('should dispatch tools via executeTool registry', async () => {
    const res = await tools.executeTool('getFinancialSummary', COMPANY_ID, {});
    assert.strictEqual(res.success, true);
    assert.ok(res.result.totalGrossRevenue > 0);
  });
});
