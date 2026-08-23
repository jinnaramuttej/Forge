const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');
const { runFinanceAgent } = require('../src/agent/graph');
const { loadAllCsvData } = require('../src/services/csvImport.service');
const { db } = require('../src/database/supabase');
const { seedPoliciesAndMemory } = require('../scripts/seedMemory');
const { getLLMStatus } = require('../src/llm');

let serverInstance;
let baseUrl;

const COMPANY_ID = 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628';

describe('Autonomous LangGraph Finance Agent Tests', () => {
  before(async () => {
    // Load dataset and seed initial policies/memories
    const dataset = await loadAllCsvData();
    for (const [table, rows] of Object.entries(dataset)) {
      db.localStore[table] = rows;
    }
    await seedPoliciesAndMemory(COMPANY_ID);

    const status = await getLLMStatus();
    console.log('\n====================================================');
    console.log(`[TEST SUITE] ${status.message}`);
    console.log('Deterministic JS calculation tools query Supabase directly.');
    console.log('====================================================\n');

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

  it('SCENARIO 1 (PRIMARY): 60-Day Financial Safety & Routine Operations', async () => {
    console.log('\n--- EXECUTING SCENARIO 1: 60-Day Safety ---');
    const result = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Check whether our company is financially safe for the next 60 days and take whatever routine actions are necessary.'
    });

    assert.strictEqual(result.status, 'completed');
    assert.ok(result.taskId, 'Task ID must be generated');
    assert.ok(result.plan.length >= 5, 'Must generate multi-step plan with at least 5 tools');
    assert.ok(result.toolCalls.length >= 5, 'Must execute planned tools');
    assert.ok(result.findings.calculateRunway, 'Must contain runway calculation finding');
    assert.ok(result.decisions.length > 0, 'Must make financial decisions');
    assert.ok(result.actions.length > 0, 'Must execute routine actions');
    assert.ok(result.finalResponse.includes('Executive Financial Assessment Report') || result.finalResponse.includes('FINANCIALLY SAFE'));
  });

  it('SCENARIO 2: Financial Summary Request', async () => {
    console.log('\n--- EXECUTING SCENARIO 2: Financial Summary ---');
    const result = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Give me a financial summary.'
    });

    assert.strictEqual(result.status, 'completed');
    assert.ok(result.findings.getFinancialSummary);
    assert.ok(result.findings.getFinancialSummary.totalGrossRevenue > 0);
  });

  it('SCENARIO 3: Largest Expense Categories', async () => {
    console.log('\n--- EXECUTING SCENARIO 3: Expense Categories ---');
    const result = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Find our largest expense categories.'
    });

    assert.strictEqual(result.status, 'completed');
    assert.ok(result.findings.getExpenses);
  });

  it('SCENARIO 4: Financial Risks Assessment', async () => {
    console.log('\n--- EXECUTING SCENARIO 4: Financial Risks ---');
    const result = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Are there any financial risks I should know about?'
    });

    assert.strictEqual(result.status, 'completed');
    assert.ok(result.decisions.length > 0);
  });

  it('SCENARIO 5: Outstanding Invoices & Receivables Follow-up', async () => {
    console.log('\n--- EXECUTING SCENARIO 5: Outstanding Invoices ---');
    const result = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Find outstanding invoices and decide which ones need follow-up.'
    });

    assert.strictEqual(result.status, 'completed');
    assert.ok(result.findings.getOutstandingInvoices);
  });

  it('SCENARIO 6: Unusual Expenses & Anomaly Detection', async () => {
    console.log('\n--- EXECUTING SCENARIO 6: Anomaly Detection ---');
    const result = await runFinanceAgent({
      companyId: COMPANY_ID,
      message: 'Check for unusual expenses.'
    });

    assert.strictEqual(result.status, 'completed');
    assert.ok(result.findings.detectAnomalies);
  });

  it('HTTP POST /api/agent and GET /api/agent/tasks/:id', async () => {
    const postRes = await fetch(`${baseUrl}/api/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId: COMPANY_ID,
        message: 'Check whether we are financially safe for the next 60 days.'
      })
    });

    assert.strictEqual(postRes.status, 200);
    const agentData = await postRes.json();
    assert.ok(agentData.taskId);
    assert.strictEqual(agentData.status, 'completed');
    assert.ok(Array.isArray(agentData.plan));
    assert.ok(Array.isArray(agentData.actions));
    assert.ok(typeof agentData.finalResponse === 'string');

    // Retrieve task status
    const getRes = await fetch(`${baseUrl}/api/agent/tasks/${agentData.taskId}`);
    assert.strictEqual(getRes.status, 200);
    const taskData = await getRes.json();
    assert.strictEqual(taskData.taskId, agentData.taskId);
    assert.strictEqual(taskData.status, 'completed');
  });
});
